import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const source = readFileSync(
  fileURLToPath(
    new URL("../recording/NoteRecorder.ts", import.meta.url)
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
  (d) => d.category === ts.DiagnosticCategory.Error
);

assert.equal(errors.length, 0);

const moduleUrl =
  "data:text/javascript;base64," +
  Buffer.from(compiled.outputText).toString("base64");

const { NoteRecorder } = await import(moduleUrl);

test("01 - Recording starts empty", () => {
  const recorder = new NoteRecorder();

  recorder.start();

  assert.equal(recorder.isRecording, true);
  assert.deepEqual(recorder.getEvents(), []);
});

test("02 - Records MIDI, frequency, duration and delta", () => {
  const recorder = new NoteRecorder();

  recorder.start();
  recorder.noteOn(1, 69, 440, 1000);
  recorder.noteOff(1, 1500);

  assert.deepEqual(recorder.stop(1600), [
    {
      midi: 69,
      freqHz: 440,
      durationMs: 500,
      deltaMs: 0,
    },
  ]);
});

test("03 - Delta is measured between note-on times", () => {
  const recorder = new NoteRecorder();

  recorder.start();

  recorder.noteOn(1, 60, 261.63, 1000);
  recorder.noteOff(1, 1200);

  recorder.noteOn(2, 64, 329.63, 1350);
  recorder.noteOff(2, 1600);

  const events = recorder.stop(1700);

  assert.equal(events[0].deltaMs, 0);
  assert.equal(events[1].deltaMs, 350);
  assert.equal(events[1].durationMs, 250);
});

test("04 - Overlapping notes retain note-on order", () => {
  const recorder = new NoteRecorder();

  recorder.start();

  recorder.noteOn(1, 60, 261.63, 1000);
  recorder.noteOn(2, 64, 329.63, 1100);

  recorder.noteOff(2, 1250);
  recorder.noteOff(1, 1500);

  const events = recorder.stop(1600);

  assert.deepEqual(
    events.map((event) => event.midi),
    [60, 64]
  );

  assert.deepEqual(
    events.map((event) => event.durationMs),
    [500, 150]
  );
});

test("05 - Repeated MIDI notes remain separate events", () => {
  const recorder = new NoteRecorder();

  recorder.start();

  recorder.noteOn(1, 69, 440, 1000);
  recorder.noteOff(1, 1100);

  recorder.noteOn(2, 69, 440, 1200);
  recorder.noteOff(2, 1400);

  const events = recorder.stop(1500);

  assert.equal(events.length, 2);
  assert.equal(events[0].durationMs, 100);
  assert.equal(events[1].durationMs, 200);
  assert.equal(events[1].deltaMs, 200);
});

test("06 - Voice stealing finalizes the stolen note", () => {
  const recorder = new NoteRecorder();

  recorder.start();

  recorder.noteOn(1, 60, 261.63, 1000);
  recorder.noteOn(2, 62, 293.66, 1100);

  // The synth stole voice #1.
  recorder.noteOff(1, 1200);
  recorder.noteOff(2, 1400);

  const events = recorder.stop(1500);

  assert.equal(events[0].durationMs, 200);
  assert.equal(events[1].durationMs, 300);
});

test("07 - Stop finalizes notes still being held", () => {
  const recorder = new NoteRecorder();

  recorder.start();
  recorder.noteOn(1, 60, 261.63, 1000);

  const events = recorder.stop(1800);

  assert.equal(recorder.isRecording, false);
  assert.equal(events[0].durationMs, 800);

  recorder.noteOff(1, 2000);

  assert.equal(recorder.getEvents()[0].durationMs, 800);
});

test("08 - Note events outside recording are ignored", () => {
  const recorder = new NoteRecorder();

  recorder.noteOn(1, 60, 261.63, 1000);
  recorder.noteOff(1, 1200);

  assert.deepEqual(recorder.getEvents(), []);

  recorder.start();
  recorder.noteOn(2, 69, 440, 1300);
  recorder.noteOff(2, 1500);
  recorder.stop(1600);

  recorder.noteOn(3, 72, 523.25, 1700);

  assert.equal(recorder.getEvents().length, 1);
});

test("09 - Starting again clears the previous recording", () => {
  const recorder = new NoteRecorder();

  recorder.start();
  recorder.noteOn(1, 60, 261.63, 1000);
  recorder.noteOff(1, 1200);
  recorder.stop(1300);

  recorder.start();

  assert.deepEqual(recorder.getEvents(), []);
  assert.equal(recorder.isRecording, true);
});

test("10 - Invalid note data is rejected", () => {
  const recorder = new NoteRecorder();

  recorder.start();

  assert.throws(
    () => recorder.noteOn(1, 20, 440, 1000),
    RangeError
  );

  assert.throws(
    () => recorder.noteOn(1, 69, -440, 1000),
    RangeError
  );

  assert.throws(
    () => recorder.noteOn(0, 69, 440, 1000),
    RangeError
  );

  assert.throws(
    () => recorder.noteOn(1, 69, 440, NaN),
    RangeError
  );
});

test("11 - Events are immutable snapshots", () => {
  const recorder = new NoteRecorder();

  recorder.start();
  recorder.noteOn(1, 69, 440, 1000);
  recorder.noteOff(1, 1500);

  const events = recorder.getEvents();

  assert.ok(Object.isFrozen(events));
  assert.ok(Object.isFrozen(events[0]));
});

test("12 - Duplicate active voice IDs are rejected", () => {
  const recorder = new NoteRecorder();

  recorder.start();
  recorder.noteOn(1, 60, 261.63, 1000);

  assert.throws(
    () => recorder.noteOn(1, 64, 329.63, 1100),
    /already being recorded/
  );
});

test("13 - Out-of-order timestamps are rejected", () => {
  const recorder = new NoteRecorder();

  recorder.start();
  recorder.noteOn(1, 60, 261.63, 1000);

  assert.throws(
    () => recorder.noteOn(2, 64, 329.63, 900),
    RangeError
  );

  assert.throws(
    () => recorder.noteOff(1, 900),
    RangeError
  );
});

test("14 - Simultaneous note-on events have zero delta", () => {
  const recorder = new NoteRecorder();

  recorder.start();

  recorder.noteOn(1, 60, 261.63, 1000);
  recorder.noteOn(2, 64, 329.63, 1000);

  recorder.noteOff(1, 1200);
  recorder.noteOff(2, 1300);

  const events = recorder.stop(1400);

  assert.equal(events[0].deltaMs, 0);
  assert.equal(events[1].deltaMs, 0);
});

test("15 - Unknown or previously ended voices are ignored", () => {
  const recorder = new NoteRecorder();

  recorder.start();
  recorder.noteOn(1, 69, 440, 1000);

  recorder.noteOff(999, 1100);
  recorder.noteOff(1, 1200);
  recorder.noteOff(1, 1300);

  const events = recorder.stop(1400);

  assert.equal(events.length, 1);
  assert.equal(events[0].durationMs, 200);
});