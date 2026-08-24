import { Volume1, Volume2 } from 'lucide-react';
import { useState } from 'react';

export default function EnglishSentenceListenButton({ sentence, label = '朗讀句子' }) {
  const [played, setPlayed] = useState(false);
  const speak = (rate) => {
    if (!sentence || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(sentence);
    utterance.lang = 'en-US';
    utterance.rate = rate;
    window.speechSynthesis.speak(utterance);
    setPlayed(true);
  };
  if (!sentence) return null;
  return <div className="english-sentence-listen" role="group" aria-label={`${label}控制`}><span><Volume2 size={16} /> {played ? '已播放・可再聽一次' : label}</span><div><button onClick={() => speak(0.62)}><Volume1 size={15} /> 慢速</button><button onClick={() => speak(0.9)}><Volume2 size={15} /> 正常</button></div></div>;
}
