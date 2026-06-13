import { useEffect, useRef, useState } from 'react';
import { Play, Pause, Phone } from 'lucide-react';
import type { IndustryConfig } from '@/data/industries';
import { parseVtt, type CaptionCue } from '@/utils/captions';
import { getVisibleCues } from '@/utils/typewriter';

interface ActiveCallProps {
  industry: IndustryConfig;
}

export function ActiveCall({ industry }: ActiveCallProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const rafRef = useRef<number | null>(null);
  const [cues, setCues] = useState<CaptionCue[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Fetch and parse VTT for current industry
  useEffect(() => {
    let cancelled = false;
    fetch(industry.demoCall.captions.en)
      .then((r) => r.text())
      .then((txt) => {
        if (!cancelled) setCues(parseVtt(txt));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [industry.id, industry.demoCall.captions.en]);

  // Drive typewriter via rAF while playing
  useEffect(() => {
    if (!isPlaying) return;
    const tick = () => {
      const t = audioRef.current?.currentTime ?? 0;
      setCurrentTime(t);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  };

  const visible = getVisibleCues(cues, currentTime);
  const progress = industry.demoCall.duration > 0
    ? Math.min(100, (currentTime / industry.demoCall.duration) * 100)
    : 0;

  return (
    <div className="space-y-3">
      {/* Caller line */}
      <div className="flex items-center gap-2 text-xs text-foreground/60">
        <Phone className="w-3.5 h-3.5" />
        <span className="font-medium text-foreground/80">
          {isPlaying ? '● LIVE' : 'Sample Call'}
        </span>
        <span>·</span>
        <span>{industry.demoCall.caller}</span>
      </div>

      {/* Transcript */}
      <div className="min-h-[120px] max-h-[160px] overflow-y-auto rounded-lg border border-foreground/10 bg-foreground/[0.02] p-3 space-y-2">
        {visible.length === 0 ? (
          <p className="text-sm text-foreground/40 italic">
            Press play to hear a real Talkys agent take this call.
          </p>
        ) : (
          <>
            {/* Completed cues — announced to screen readers */}
            <div aria-live="polite" className="space-y-2">
              {visible
                .filter(({ cue, visibleText }) => visibleText.length === cue.text.length)
                .map(({ cue, visibleText }, idx) => (
                  <p key={`${cue.startTime}-${idx}`} className="text-sm text-foreground/85">
                    {cue.speaker && (
                      <span className="font-semibold text-[#1A8FA8]">{cue.speaker}: </span>
                    )}
                    {visibleText}
                  </p>
                ))}
            </div>
            {/* In-progress cue — visually shown with caret, hidden from SR until complete */}
            {visible.length > 0 && (() => {
              const last = visible[visible.length - 1];
              if (last.visibleText.length === last.cue.text.length) return null;
              return (
                <p aria-hidden="true" className="text-sm text-foreground/85">
                  {last.cue.speaker && (
                    <span className="font-semibold text-[#1A8FA8]">{last.cue.speaker}: </span>
                  )}
                  {last.visibleText}
                  <span className="inline-block w-1.5 h-3.5 ml-0.5 align-text-bottom bg-foreground/70 animate-pulse" />
                </p>
              );
            })()}
          </>
        )}
      </div>

      {/* Audio controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-[#0F4C5C] hover:bg-[#1A8FA8] text-white flex items-center justify-center transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A8FA8] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label={isPlaying ? 'Pause sample call' : 'Play sample call'}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
        </button>
        <div className="flex-1">
          <div className="h-1.5 rounded-full bg-foreground/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#0F4C5C] to-[#1A8FA8] transition-[width] duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <span className="text-xs text-foreground/50 font-mono tabular-nums">
          {formatTime(currentTime)} / {formatTime(industry.demoCall.duration)}
        </span>
      </div>

      <audio
        ref={audioRef}
        src={industry.demoCall.audio.en}
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onError={() => setIsPlaying(false)}
      />
    </div>
  );
}

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const ss = Math.floor(s % 60);
  return `${m}:${ss.toString().padStart(2, '0')}`;
}
