import { describe, it, expect } from 'vitest';
import { getVisibleCues } from './typewriter';
import type { CaptionCue } from './captions';

const CUES: CaptionCue[] = [
  { startTime: 0, endTime: 2, speaker: 'A', text: 'Hello there' },     // 11 chars
  { startTime: 2.5, endTime: 4, speaker: 'B', text: 'Hi'  },           //  2 chars
  { startTime: 5, endTime: 7, speaker: 'A', text: 'How are you?' },    // 12 chars
];

describe('getVisibleCues', () => {
  it('returns empty before any cue starts', () => {
    expect(getVisibleCues(CUES, -1)).toEqual([]);
  });

  it('partially reveals the active cue at chars-per-second rate', () => {
    // At t=0.5s with cps=28: floor(0.5 * 28) = 14 chars → but text is only 11, so full
    const out = getVisibleCues(CUES, 0.5, 28);
    expect(out).toHaveLength(1);
    expect(out[0].visibleText).toBe('Hello there');
  });

  it('reveals slowly when cps is low', () => {
    // At t=0.1s with cps=10: floor(0.1 * 10) = 1 char
    const out = getVisibleCues(CUES, 0.1, 10);
    expect(out[0].visibleText).toBe('H');
  });

  it('shows all started cues, last one partial', () => {
    const out = getVisibleCues(CUES, 5.2, 10);
    expect(out).toHaveLength(3);
    expect(out[0].visibleText).toBe('Hello there');
    expect(out[1].visibleText).toBe('Hi');
    expect(out[2].visibleText).toBe('Ho'); // 0.2 * 10 = 2 chars
  });

  it('stops at the first not-yet-started cue', () => {
    const out = getVisibleCues(CUES, 3, 100);
    expect(out).toHaveLength(2); // cue 3 hasn't started yet (5s)
  });
});
