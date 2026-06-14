import type { CaptionCue } from './captions';

export interface VisibleCue {
  cue: CaptionCue;
  visibleText: string;
}

export function getVisibleCues(
  cues: CaptionCue[],
  currentTime: number,
  charsPerSecond = 28
): VisibleCue[] {
  const out: VisibleCue[] = [];
  for (const cue of cues) {
    if (currentTime < cue.startTime) break;
    const elapsed = currentTime - cue.startTime;
    const revealed = Math.min(cue.text.length, Math.floor(elapsed * charsPerSecond));
    out.push({ cue, visibleText: cue.text.slice(0, revealed) });
  }
  return out;
}
