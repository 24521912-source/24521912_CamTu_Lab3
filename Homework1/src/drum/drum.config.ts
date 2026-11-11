
import type {
  DrumKeyCode,
  DrumPadConfig,
  DrumPadId,
} from './drum.types'

export const DRUM_PADS = [
  {
    id: 'kick',
    name: 'Kick Drum',
    key: 'W',
    code: 'KeyW',
    description: 'Deep bass drum sound',
  },
  {
    id: 'snare',
    name: 'Snare Drum',
    key: 'A',
    code: 'KeyA',
    description: 'Sharp snare drum sound',
  },
  {
    id: 'closed-hihat',
    name: 'Closed Hi-Hat',
    key: 'S',
    code: 'KeyS',
    description: 'Short closed hi-hat sound',
  },
  {
    id: 'open-hihat',
    name: 'Open Hi-Hat',
    key: 'D',
    code: 'KeyD',
    description: 'Long open hi-hat sound',
  },
  {
    id: 'clap',
    name: 'Hand Clap',
    key: 'J',
    code: 'KeyJ',
    description: 'Hand clap percussion sound',
  },
  {
    id: 'tom',
    name: 'Tom Drum',
    key: 'K',
    code: 'KeyK',
    description: 'Resonant tom drum sound',
  },
  {
    id: 'crash',
    name: 'Crash Cymbal',
    key: 'L',
    code: 'KeyL',
    description: 'Bright crash cymbal sound',
  },
] as const satisfies readonly DrumPadConfig[]

export const DRUM_PAD_BY_CODE: ReadonlyMap<
  DrumKeyCode,
  DrumPadConfig
> = new Map(
  DRUM_PADS.map((pad) => [pad.code, pad] as const),
)

export const DRUM_PAD_BY_ID: ReadonlyMap<
  DrumPadId,
  DrumPadConfig
> = new Map(
  DRUM_PADS.map((pad) => [pad.id, pad] as const),
)

export function isDrumKeyCode(
  code: string,
): code is DrumKeyCode {
  return DRUM_PAD_BY_CODE.has(code as DrumKeyCode)
}

export function getDrumPadByCode(
  code: string,
): DrumPadConfig | undefined {
  if (!isDrumKeyCode(code)) {
    return undefined
  }

  return DRUM_PAD_BY_CODE.get(code)
}
