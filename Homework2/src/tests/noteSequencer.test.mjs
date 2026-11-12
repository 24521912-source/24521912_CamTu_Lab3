import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const source = readFileSync(
  fileURLToPath(
    new URL("../sequencer/NoteSequencer.ts", import.meta.url)
  ),
  "utf8"
);

const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
  reportDiagnostics: true,
});

const errors = (compiled.diagnostics ?? []).filter(
  (diagnostic) =>
    diagnostic.category === ts.DiagnosticCategory.Error
);

assert.equal(errors.length, 0);

const moduleUrl =
  "data:text/javascript;base64," +
  Buffer.from(compiled.outputText).toString("base64");

const { NoteSequencer } = await import(moduleUrl);

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function makeNote(midi, durationMs, deltaMs) {
  return {
    midi,
    freqHz: 440 * 2 ** ((midi - 69) / 12),
    durationMs,
    deltaMs,
  };
}

function makeSink() {
  let nextId = 1;

  const started = [];
  const ended = [];

  return {
    started,
    ended,

    noteOn(midi) {
      const id = nextId++;

      started.push({
        id,
        midi,
        at: performance.now(),
      });

      return id;
    },

    noteOff(id) {
      ended.push({
        id,
        at: performance.now(),
      });
    },
  };
}

test("01 - Empty recording plays no notes", async () => {
  const sequencer = new NoteSequencer();
  const sink = makeSink();

  await sequencer.play([], 1, sink);

  assert.equal(sink.started.length, 0);
  assert.equal(sequencer.isPlaying, false);
});

test("02 - Notes play in FIFO note-on order", async () => {
  const sequencer = new NoteSequencer();
  const sink = makeSink();

  const notes = [
    makeNote(60, 20, 0),
    makeNote(64, 20, 15),
    makeNote(67, 20, 15),
  ];

  await sequencer.play(notes, 1, sink);

  assert.deepEqual(
    sink.started.map((entry) => entry.midi),
    [60, 64, 67]
  );

  assert.equal(sink.ended.length, 3);
  assert.equal(sequencer.isPlaying, false);
});

test("03 - Overlapping notes remain independent", async () => {
  const sequencer = new NoteSequencer();
  const sink = makeSink();

  await sequencer.play(
    [
      makeNote(60, 90, 0),
      makeNote(64, 20, 15),
    ],
    1,
    sink
  );

  assert.equal(sink.started.length, 2);
  assert.equal(sink.ended.length, 2);

  // The shorter second note ends before the first.
  assert.equal(sink.ended[0].id, 2);
  assert.equal(sink.ended[1].id, 1);
});

test("04 - All three speeds are supported", async () => {
  const durations = [];

  for (const speed of [0.5, 1, 2]) {
    const sequencer = new NoteSequencer();
    const sink = makeSink();

    await sequencer.play(
      [makeNote(69, 100, 0)],
      speed,
      sink
    );

    durations.push(
      sink.ended[0].at - sink.started[0].at
    );

    assert.equal(sink.started.length, 1);
    assert.equal(sink.ended.length, 1);
  }

  // Allow scheduling jitter in the test environment.
  assert.ok(durations[0] > durations[1]);
  assert.ok(durations[1] > durations[2]);
});

test("05 - Stop cancels future note-on events", async () => {
  const sequencer = new NoteSequencer();
  const sink = makeSink();

  const playback = sequencer.play(
    [
      makeNote(60, 300, 0),
      makeNote(64, 100, 250),
    ],
    1,
    sink
  );

  await delay(40);
  sequencer.stop();
  sequencer.stop();

  await playback;

  assert.deepEqual(
    sink.started.map((entry) => entry.midi),
    [60]
  );

  assert.equal(sink.ended.length, 1);
  assert.equal(sequencer.isPlaying, false);
});

test("06 - Stop during a pending first note is safe", async () => {
  const sequencer = new NoteSequencer();
  const sink = makeSink();

  const playback = sequencer.play(
    [makeNote(69, 100, 250)],
    1,
    sink
  );

  await delay(20);
  sequencer.stop();

  await playback;

  assert.equal(sink.started.length, 0);
  assert.equal(sink.ended.length, 0);
});

test("07 - Stop releases only replay-owned voices", async () => {
  const sequencer = new NoteSequencer();
  const sink = makeSink();

  // Simulate an unrelated live voice with ID 999.
  const playback = sequencer.play(
    [makeNote(69, 300, 0)],
    1,
    sink
  );

  await delay(40);
  sequencer.stop();
  await playback;

  assert.equal(sink.started.length, 1);
  assert.equal(sink.ended.length, 1);
  assert.ok(!sink.ended.some((entry) => entry.id === 999));
});

test("08 - A new replay can start after Stop", async () => {
  const sequencer = new NoteSequencer();
  const sink = makeSink();

  const first = sequencer.play(
    [makeNote(60, 300, 0)],
    1,
    sink
  );

  await delay(30);
  sequencer.stop();
  await first;

  await sequencer.play(
    [makeNote(69, 20, 0)],
    1,
    sink
  );

  assert.equal(sink.started.length, 2);
  assert.equal(sink.ended.length, 2);
  assert.equal(sequencer.isPlaying, false);
});

test("09 - Invalid event data is rejected", async () => {
  const sequencer = new NoteSequencer();
  const sink = makeSink();

  await assert.rejects(
    sequencer.play(
      [makeNote(200, 100, 0)],
      1,
      sink
    ),
    RangeError
  );

  await assert.rejects(
    sequencer.play(
      [makeNote(60, -10, 0)],
      1,
      sink
    ),
    RangeError
  );

  assert.equal(sequencer.isPlaying, false);
});