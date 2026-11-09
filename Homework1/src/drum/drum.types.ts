
export const DRUM_KEYS = [
  'KeyW',
  'KeyA',
  'KeyS',
  'KeyD',
  'KeyJ',
  'KeyK',
  'KeyL',
] as const

export type DrumKeyCode = (typeof DRUM_KEYS)[number]

export type DrumPadId =
  | 'kick'
  | 'snare'
  | 'closed-hihat'
  | 'open-hihat'
  | 'clap'
  | 'tom'
  | 'crash'

export interface DrumPadConfig {
  readonly id: DrumPadId
  readonly name: string
  readonly key: string
  readonly code: DrumKeyCode
  readonly description: string
}
