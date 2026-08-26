export default function SentenceWithBlank({ text, className = '', highlightCharIndex = null }) {
  if (!text) return null;
  const sentence = String(text);
  const parts = sentence.split(/(_{2,}|（\s*）|\[\s*\]|\s+)/g).filter((part) => part !== '');
  let offset = 0;
  const rendered = parts.map((part, index) => {
    const start = offset;
    offset += part.length;
    const blank = /^(?:_{2,}|（\s*）|\[\s*\])$/.test(part);
    const active = highlightCharIndex !== null && highlightCharIndex >= start && highlightCharIndex < offset;
    if (blank) return <span key={`${part}-${index}`} className={`sentence-answer-blank ${active ? 'is-spoken' : ''}`} aria-label="作答空格">　</span>;
    return <span key={`${part}-${index}`} className={active && !/^\s+$/.test(part) ? 'sentence-spoken-word' : ''}>{part}</span>;
  });
  return <span className={`sentence-with-blank ${className}`}>{rendered}</span>;
}
