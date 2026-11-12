
import type { DrumPadId } from '../drum.types'

export interface DrumAudioEngine {
  play: (padId: DrumPadId) => Promise<boolean>
  dispose: () => Promise<void>
}

export function createDrumAudioEngine(): DrumAudioEngine {
  let context: AudioContext | null = null
  let master: GainNode | null = null
  let noiseBuffer: AudioBuffer | null = null
  let disposed = false

  const activeSources = new Set<AudioScheduledSourceNode>()

  function initialize(): AudioContext {
    if (disposed) {
      throw new Error('Audio engine has been disposed')
    }

    if (!context) {
      context = new AudioContext()

      master = context.createGain()
      master.gain.value = 0.45
      master.connect(context.destination)
    }

    return context
  }

  function getNoiseBuffer(ctx: AudioContext): AudioBuffer {
    if (!noiseBuffer) {
      const sampleCount = Math.ceil(ctx.sampleRate * 2)

      noiseBuffer = ctx.createBuffer(
        1,
        sampleCount,
        ctx.sampleRate,
      )

      const samples = noiseBuffer.getChannelData(0)

      for (let i = 0; i < sampleCount; i++) {
        samples[i] = Math.random() * 2 - 1
      }
    }

    return noiseBuffer
  }

  function trackSource(
    source: AudioScheduledSourceNode,
    nodes: AudioNode[],
  ): void {
    activeSources.add(source)

    source.onended = () => {
      activeSources.delete(source)
      source.disconnect()

      for (const node of nodes) {
        node.disconnect()
      }
    }
  }

  function playTone(
    ctx: AudioContext,
    start: number,
    frequency: number,
    endFrequency: number,
    duration: number,
    volume: number,
    wave: OscillatorType = 'sine',
  ): void {
    if (!master) return

    const oscillator = ctx.createOscillator()
    const envelope = ctx.createGain()
    const end = start + duration

    oscillator.type = wave

    oscillator.frequency.setValueAtTime(frequency, start)
    oscillator.frequency.exponentialRampToValueAtTime(
      Math.max(endFrequency, 1),
      end,
    )

    envelope.gain.setValueAtTime(volume, start)
    envelope.gain.exponentialRampToValueAtTime(0.001, end)

    oscillator.connect(envelope)
    envelope.connect(master)

    trackSource(oscillator, [envelope])

    oscillator.start(start)
    oscillator.stop(end + 0.01)
  }

  function playNoise(
    ctx: AudioContext,
    start: number,
    duration: number,
    volume: number,
    cutoff: number,
    filterType: BiquadFilterType = 'highpass',
    pulses = false,
  ): void {
    if (!master) return

    const source = ctx.createBufferSource()
    const filter = ctx.createBiquadFilter()
    const envelope = ctx.createGain()
    const end = start + duration

    source.buffer = getNoiseBuffer(ctx)

    filter.type = filterType
    filter.frequency.setValueAtTime(cutoff, start)

    if (pulses) {
      envelope.gain.setValueAtTime(0.001, start)

      for (let i = 0; i < 3; i++) {
        const t = start + i * 0.035

        envelope.gain.setValueAtTime(0.001, t)
        envelope.gain.linearRampToValueAtTime(
          volume * (1 - i * 0.2),
          t + 0.003,
        )
        envelope.gain.exponentialRampToValueAtTime(
          0.001,
          t + 0.025,
        )
      }

      envelope.gain.setValueAtTime(0.001, end)
    } else {
      envelope.gain.setValueAtTime(volume, start)
      envelope.gain.exponentialRampToValueAtTime(
        0.001,
        end,
      )
    }

    source.connect(filter)
    filter.connect(envelope)
    envelope.connect(master)

    trackSource(source, [filter, envelope])

    source.start(start)
    source.stop(end + 0.01)
  }

  function trigger(
    ctx: AudioContext,
    padId: DrumPadId,
  ): void {
    const now = ctx.currentTime + 0.005

    switch (padId) {
      case 'kick':
        playTone(ctx, now, 155, 48, 0.42, 0.95)
        break

      case 'snare':
        playNoise(ctx, now, 0.18, 0.65, 1400)
        playTone(ctx, now, 185, 110, 0.11, 0.35)
        break

      case 'closed-hihat':
        playNoise(ctx, now, 0.075, 0.38, 6500)
        break

      case 'open-hihat':
        playNoise(ctx, now, 0.55, 0.38, 5200)
        break

      case 'clap':
        playNoise(ctx, now, 0.16, 0.75, 900, 'bandpass', true)
        break

      case 'tom':
        playTone(ctx, now, 260, 95, 0.48, 0.7)
        break

      case 'crash':
        playNoise(ctx, now, 1.4, 0.48, 3200)
        playTone(ctx, now, 790, 540, 0.65, 0.08, 'sawtooth')
        break

      default: {
        const unreachable: never = padId
        throw new Error(`Unknown pad: ${unreachable}`)
      }
    }
  }

  async function play(padId: DrumPadId): Promise<boolean> {
    if (disposed) return false

    try {
      const ctx = initialize()

      if (ctx.state !== 'running') {
        await ctx.resume()
      }

      if (disposed || ctx.state !== 'running') {
        return false
      }

      trigger(ctx, padId)
      return true
    } catch (error) {
      console.error('Drum audio playback failed:', error)
      return false
    }
  }

  async function dispose(): Promise<void> {
    if (disposed) return
    disposed = true

    for (const source of activeSources) {
      source.onended = null

      try {
        source.stop()
      } catch {
        // Nguồn có thể đã kết thúc.
      }

      source.disconnect()
    }

    activeSources.clear()

    if (master) {
      master.disconnect()
      master = null
    }

    noiseBuffer = null

    const ctx = context
    context = null

    if (ctx && ctx.state !== 'closed') {
      try {
        await ctx.close()
      } catch (error) {
        console.error('Audio context cleanup failed:', error)
      }
    }
  }

  return { play, dispose }
}
