import { describe, it, expect } from 'vitest';
import { parseVtt } from './captions';

const SAMPLE = `WEBVTT

00:00.000 --> 00:03.000
Customer: I'd like to order a pizza

00:03.500 --> 00:06.000
Agent: Sure, what kind would you like?

00:06.500 --> 00:08.000
Customer: Pepperoni please
`;

describe('parseVtt', () => {
  it('parses 3 cues from sample', () => {
    const cues = parseVtt(SAMPLE);
    expect(cues).toHaveLength(3);
  });

  it('extracts start and end times in seconds', () => {
    const cues = parseVtt(SAMPLE);
    expect(cues[0].startTime).toBe(0);
    expect(cues[0].endTime).toBe(3);
    expect(cues[1].startTime).toBe(3.5);
  });

  it('extracts speaker prefix when present', () => {
    const cues = parseVtt(SAMPLE);
    expect(cues[0].speaker).toBe('Customer');
    expect(cues[0].text).toBe("I'd like to order a pizza");
    expect(cues[1].speaker).toBe('Agent');
  });

  it('returns empty array for empty input', () => {
    expect(parseVtt('')).toEqual([]);
  });

  it('handles input without WEBVTT header', () => {
    const out = parseVtt('00:00.000 --> 00:01.000\nhello');
    expect(out).toHaveLength(1);
    expect(out[0].text).toBe('hello');
  });

  it('ignores cues with malformed timing', () => {
    const out = parseVtt('WEBVTT\n\nbogus --> line\nhello\n');
    expect(out).toEqual([]);
  });
});
