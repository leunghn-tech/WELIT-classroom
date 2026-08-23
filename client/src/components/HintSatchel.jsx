import { Lightbulb } from 'lucide-react';
import { useEffect, useState } from 'react';

const readTeacherSettings = () => {
  try { return JSON.parse(window.localStorage.getItem('eduquest-feedback-settings') || '{}'); } catch { return {}; }
};

export default function HintSatchel({ hint, title = '拆題提示', steps = [] }) {
  const [enabled, setEnabled] = useState(() => readTeacherSettings().hintSatchel === true);
  const [open, setOpen] = useState(false);
  const [revealedSteps, setRevealedSteps] = useState(1);

  useEffect(() => {
    const sync = (event) => setEnabled(event.detail?.hintSatchel === true);
    window.addEventListener('eduquest-feedback-settings', sync);
    return () => window.removeEventListener('eduquest-feedback-settings', sync);
  }, []);
  useEffect(() => { setOpen(false); setRevealedSteps(1); }, [hint, steps, enabled]);

  if (!enabled || (!hint && !steps.length)) return null;
  const visibleSteps = steps.slice(0, revealedSteps);
  const hasMoreSteps = revealedSteps < steps.length;
  return <aside className={`hint-satchel ${open ? 'open' : ''}`}><button type="button" className="hint-satchel-trigger" onClick={() => setOpen((value) => !value)} aria-expanded={open}><span><Lightbulb size={18} /> 提示錦囊 <small>老師已啟用</small></span><b>{open ? '收起' : '打開'}</b></button>{open && <div className="hint-satchel-content"><span>{title}</span>{steps.length ? <><p className="hint-satchel-intro">先自行想一想；需要時才逐步打開下一個線索。</p><ol className="hint-satchel-steps">{visibleSteps.map((step, index) => <li key={`${step.label}-${index}`}><b>{step.label || `步驟 ${index + 1}`}</b><span>{step.text}</span></li>)}</ol>{hasMoreSteps ? <button type="button" className="hint-satchel-next" onClick={() => setRevealedSteps((value) => Math.min(value + 1, steps.length))}>揭示下一個提示（{revealedSteps + 1}／{steps.length}）</button> : <small className="hint-satchel-complete">已看完解題路徑，現在可自行列式並核對單位。</small>}</> : <p>{hint}</p>}</div>}</aside>;
}
