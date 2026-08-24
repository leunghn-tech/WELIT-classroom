export default function SentenceWithBlank({ text, className = '' }) {
  if (!text) return null;
  const parts = String(text).split(/(_{2,}|（\s*）|\[\s*\])/g);
  return <span className={`sentence-with-blank ${className}`}>{parts.map((part, index) => /^(?:_{2,}|（\s*）|\[\s*\])$/.test(part) ? <span key={`${part}-${index}`} className="sentence-answer-blank" aria-label="作答空格">　</span> : <span key={`${part}-${index}`}>{part}</span>)}</span>;
}
