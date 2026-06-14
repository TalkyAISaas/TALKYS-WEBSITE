export interface CaptionCue {
  startTime: number;
  endTime: number;
  speaker?: string;
  text: string;
}

function parseTimestamp(t: string): number | null {
  const m = t.match(/^(\d+):(\d+)\.(\d+)$/);
  if (!m) return null;
  const [, mm, ss, ms] = m;
  return +mm * 60 + +ss + +ms / 1000;
}

export function parseVtt(input: string): CaptionCue[] {
  if (!input.trim()) return [];
  const lines = input.split(/\r?\n/);
  const cues: CaptionCue[] = [];
  let i = 0;
  if (lines[i]?.trim().startsWith('WEBVTT')) i++;

  while (i < lines.length) {
    const raw = lines[i]?.trim() ?? '';
    if (!raw) { i++; continue; }

    let timingLine = raw;
    if (!raw.includes('-->')) {
      i++;
      if (i >= lines.length) break;
      timingLine = lines[i]?.trim() ?? '';
      if (!timingLine.includes('-->')) { i++; continue; }
    }

    const [startStr, endStr] = timingLine.split('-->').map(s => s.trim());
    const startTime = parseTimestamp(startStr);
    const endTime = parseTimestamp(endStr);
    i++;
    if (startTime == null || endTime == null) {
      while (i < lines.length && lines[i].trim()) i++;
      continue;
    }

    const textLines: string[] = [];
    while (i < lines.length && lines[i].trim()) {
      textLines.push(lines[i]);
      i++;
    }
    let text = textLines.join(' ').trim();
    let speaker: string | undefined;
    const m = text.match(/^([^:]+):\s*(.+)$/);
    if (m) { speaker = m[1].trim(); text = m[2].trim(); }
    cues.push({ startTime, endTime, speaker, text });
  }
  return cues;
}
