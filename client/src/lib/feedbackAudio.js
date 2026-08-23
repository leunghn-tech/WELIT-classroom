/* 課堂鼓勵音效：只在學生點選或拖放互動後啟動，避免自動播放及外部音檔載入。 */
const getTeacherVolume = () => {
  try {
    const raw = Number(JSON.parse(window.localStorage.getItem('eduquest-feedback-settings') || '{}').soundVolume);
    return Number.isFinite(raw) ? Math.min(1, Math.max(.1, raw / 100)) : .8;
  } catch { return .8; }
};

const playSequence = (notes, startDelay = 0) => {
  if (typeof window === 'undefined') return;
  try { if (JSON.parse(window.localStorage.getItem('eduquest-feedback-settings') || '{}').sound === false) return; } catch { /* 使用預設音效設定。 */ }
  const Context = window.AudioContext || window.webkitAudioContext;
  if (!Context) return;
  try {
    const context = new Context();
    const start = context.currentTime + startDelay;
    notes.forEach(({ frequency, offset, duration = 0.11, gain = 0.045 }) => {
      const oscillator = context.createOscillator();
      const volume = context.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, start + offset);
      volume.gain.setValueAtTime(0.0001, start + offset);
      volume.gain.exponentialRampToValueAtTime(gain * getTeacherVolume(), start + offset + 0.018);
      volume.gain.exponentialRampToValueAtTime(0.0001, start + offset + duration);
      oscillator.connect(volume).connect(context.destination);
      oscillator.start(start + offset);
      oscillator.stop(start + offset + duration + 0.02);
    });
    window.setTimeout(() => context.close(), 1200);
  } catch { /* 沒有音效支援時保留視覺回饋。 */ }
};

export const playCorrectSound = () => playSequence([{ frequency: 659, offset: 0 }, { frequency: 784, offset: 0.1 }]);
export const playWrongSound = () => playSequence([{ frequency: 392, offset: 0, duration: 0.1, gain: 0.035 }, { frequency: 294, offset: 0.09, duration: 0.16, gain: 0.032 }]);
export const playDragSound = () => playSequence([{ frequency: 587, offset: 0, duration: 0.08, gain: 0.028 }, { frequency: 659, offset: 0.055, duration: 0.09, gain: 0.032 }]);
export const playCompletionSound = () => playSequence([{ frequency: 523, offset: 0 }, { frequency: 659, offset: 0.09 }, { frequency: 784, offset: 0.18 }, { frequency: 1047, offset: 0.29, duration: 0.18, gain: 0.06 }]);
export const playSoundPreview = () => playSequence([{ frequency: 523.25, offset: 0, duration: .14, gain: .07 }, { frequency: 659.25, offset: .11, duration: .14, gain: .075 }, { frequency: 783.99, offset: .22, duration: .18, gain: .08 }]);
export const playModelSound = (type) => {
  if (type === 'complete') return playSequence([{ frequency: 523.25, offset: 0, duration: .15, gain: .11 }, { frequency: 659.25, offset: .095, duration: .15, gain: .11 }, { frequency: 783.99, offset: .19, duration: .18, gain: .11 }]);
  if (type === 'pair') return playSequence([{ frequency: 440, offset: 0, duration: .13, gain: .075 }, { frequency: 554.37, offset: .095, duration: .13, gain: .075 }]);
  if (type === 'place' || type === 'needs-more') return playSequence([{ frequency: type === 'place' ? 466.16 : 330, offset: 0, duration: .12, gain: .065 }]);
  return playSequence([{ frequency: 294, offset: 0, duration: .13, gain: .075 }, { frequency: 247, offset: .095, duration: .13, gain: .075 }]);
};
