import { Maximize2, Minimize2 } from 'lucide-react';
import { useState } from 'react';

export default function SentenceWithBlank({ text, className = '', highlightCharIndex = null, showZoom = true }) {
  const [isZoomed, setIsZoomed] = useState(false);
  if (!text) return null;
  const sentence = String(text);
  const parts = sentence.split(/(_{2,}|（\s*）|\[\s*\]|\s+)/g).filter((part) => part !== '');
  const hasBlank = /(?:_{2,}|（\s*）|\[\s*\])/.test(sentence);
  let offset = 0;
  const rendered = parts.map((part, index) => {
    const start = offset;
    offset += part.length;
    const blank = /^(?:_{2,}|（\s*）|\[\s*\])$/.test(part);
    const active = highlightCharIndex !== null && highlightCharIndex >= start && highlightCharIndex < offset;
    if (blank) return <span key={`${part}-${index}`} className={`sentence-answer-blank ${active ? 'is-spoken' : ''}`} aria-label="作答空格">　</span>;
    return <span key={`${part}-${index}`} className={active && !/^\s+$/.test(part) ? 'sentence-spoken-word' : ''}>{part}</span>;
  });
  return <span className={`sentence-with-blank ${className}`}>{rendered}{showZoom && hasBlank ? <button type="button" className="sentence-zoom-toggle" aria-pressed={isZoomed} onClick={() => setIsZoomed((value) => !value)}>{isZoomed ? <Minimize2 size={14} /> : <Maximize2 size={14} />}{isZoomed ? '收合作答列' : '放大作答列'}</button> : null}{isZoomed ? <span className="sentence-zoom-rail" aria-live="polite"><small>放大作答位置</small><span className="sentence-answer-blank">　</span></span> : null}</span>;
}
