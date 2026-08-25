import { Volume1, Volume2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function EnglishSentenceListenButton({ sentence, label = '朗讀句子', onBoundary, onStart, onEnd }) {
  const [played, setPlayed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const activeUtterance = useRef(null);
  useEffect(() => () => { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); }, []);
  const speak = (rate) => {
    if (!sentence || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(sentence);
    activeUtterance.current = utterance;
    utterance.lang = 'en-US';
    utterance.rate = rate;
    utterance.onstart = () => { setIsPlaying(true); onStart?.(); };
    utterance.onboundary = (event) => { if (event.name === 'word') onBoundary?.(event.charIndex); };
    const finish = () => { if (activeUtterance.current !== utterance) return; activeUtterance.current = null; setIsPlaying(false); onEnd?.(); };
    utterance.onend = finish;
    utterance.onerror = finish;
    window.speechSynthesis.speak(utterance);
    setPlayed(true);
  };
  if (!sentence) return null;
  return <div className="english-sentence-listen" role="group" aria-label={`${label}控制`}><span><Volume2 size={16} /> {isPlaying ? '朗讀中・詞語會依序高亮' : played ? '已播放・可再聽一次' : label}</span><div><button onClick={() => speak(0.62)}><Volume1 size={15} /> 慢速</button><button onClick={() => speak(0.9)}><Volume2 size={15} /> 正常</button></div></div>;
}
