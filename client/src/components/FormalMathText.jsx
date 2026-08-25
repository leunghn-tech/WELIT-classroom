import './formalMathText.css';

export function FormalFraction({ numerator, denominator }) {
  return <span className="formal-fraction" role="math" aria-label={`${denominator}分之${numerator}`}><sup>{numerator}</sup><span aria-hidden="true"></span><sub>{denominator}</sub></span>;
}

export default function FormalMathText({ text, className = '' }) {
  const source = String(text ?? '');
  const parts = source.split(/(\d+)\s*\/\s*(\d+)/g);
  if (parts.length === 1) return <>{source}</>;
  return <span className={`formal-math-text ${className}`}>{parts.map((part, index) => index % 3 === 1 ? <FormalFraction key={`${part}-${index}`} numerator={part} denominator={parts[index + 1]} /> : index % 3 === 2 ? null : <span key={`${part}-${index}`}>{part}</span>)}</span>;
}
