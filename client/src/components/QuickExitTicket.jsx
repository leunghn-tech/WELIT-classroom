import { ArrowLeft, BarChart3, Check, ChevronRight, Dice5, RotateCcw, Sparkles, Trophy } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import FormalMathText from './FormalMathText';

const SUBJECTS = ['中文', '英文', '數學'];
const GRADES = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'];
const shuffle = (items) => { const next = [...items]; for (let index = next.length - 1; index > 0; index -= 1) { const target = Math.floor(Math.random() * (index + 1)); [next[index], next[target]] = [next[target], next[index]]; } return next; };
const isChoiceUnit = (unit) => unit.questions.some((question) => Array.isArray(question.choices) && question.choices.length >= 2 && question.answer !== undefined);
const getDrawn = (key) => { try { return JSON.parse(window.sessionStorage.getItem(key) || '[]'); } catch { return []; } };

function QuestionContext({ question, isMath }) {
  if (typeof question?.before === 'string') return <p className="exit-sentence-prompt" aria-label="待填標點的句子"><span>{question.before}</span><b>（　）</b>{question.after ? <span>{question.after}</span> : null}</p>;
  const context = question?.sentence || question?.scene || question?.clueChinese || question?.clue || '';
  return context ? <p className="exit-question-context">{isMath ? <FormalMathText text={context} /> : context}</p> : null;
}

export default function QuickExitTicket({ questionBanks, onBack }) {
  const [subject, setSubject] = useState('中文');
  const [grade, setGrade] = useState('P1');
  const units = useMemo(() => (questionBanks[subject]?.[grade]?.units || []).filter(isChoiceUnit), [questionBanks, subject, grade]);
  const [unitId, setUnitId] = useState('');
  const selectedUnit = units.find((unit) => unit.id === unitId) || units[0];
  const [count, setCount] = useState(1);
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [votes, setVotes] = useState({});
  const [revealed, setRevealed] = useState(false);
  const [showDistribution, setShowDistribution] = useState(false);
  const subjectClass = subject === '中文' ? 'exit-chinese' : subject === '英文' ? 'exit-english' : 'exit-math';
  useEffect(() => { const resetExitTicket = () => { setQuestions([]); setIndex(0); setVotes({}); setRevealed(false); setShowDistribution(false); }; window.addEventListener('welitquest-exit-records-cleared', resetExitTicket); return () => window.removeEventListener('welitquest-exit-records-cleared', resetExitTicket); }, []);
  const draw = (amount = count) => {
    if (!selectedUnit) return;
    const eligible = selectedUnit.questions.filter((question) => Array.isArray(question.choices) && question.choices.length >= 2 && question.answer !== undefined);
    const key = `welitquest-exit-drawn:${subject}:${grade}:${selectedUnit.id}`;
    let drawn = getDrawn(key);
    let pool = eligible.filter((question) => !drawn.includes(question.id));
    if (pool.length < amount) { drawn = []; pool = eligible; }
    const picked = shuffle(pool).slice(0, Math.min(amount, pool.length));
    window.sessionStorage.setItem(key, JSON.stringify([...drawn, ...picked.map((question) => question.id)]));
    setQuestions(picked); setIndex(0); setVotes({}); setRevealed(false); setShowDistribution(false);
  };
  const question = questions[index];
  const questionVotes = votes[question?.id] || {};
  const incrementVote = (choice) => { if (revealed) return; setVotes((current) => ({ ...current, [question.id]: { ...questionVotes, [choice]: (questionVotes[choice] || 0) + 1 } })); };
  const clearVotes = () => setVotes((current) => ({ ...current, [question.id]: {} }));
  const next = () => { if (index >= questions.length - 1) { setShowDistribution(true); return; } setIndex((value) => value + 1); setRevealed(false); };
  const totalVotes = Object.values(votes).reduce((total, choices) => total + Object.values(choices).reduce((sum, value) => sum + value, 0), 0);

  if (showDistribution) return <main className={`site-shell exit-ticket-page ${subjectClass}`}><header className="exit-ticket-header"><span><BarChart3 size={18} /> 快速出口題・答案分布</span><button onClick={onBack}><ArrowLeft size={16} /> 返回課程</button></header><section className="exit-ticket-summary"><span><Trophy size={24} /> 課末診斷完成</span><h1>{selectedUnit?.title}</h1><p>共抽取 {questions.length} 題，老師共記錄 {totalVotes} 張舉手票。學科色柱為正確答案，其他柱可協助找出需重教的概念。</p><div className="exit-distribution-list">{questions.map((item, itemIndex) => <article key={item.id}><header><span>第 {itemIndex + 1} 題</span><b>{subject === '數學' ? <FormalMathText text={item.prompt} /> : item.prompt}</b></header><QuestionContext question={item} isMath={subject === '數學'} />{item.choices.map((choice) => { const votesForChoice = votes[item.id]?.[choice] || 0; const percent = totalVotes ? Math.round((votesForChoice / Math.max(1, Object.values(votes[item.id] || {}).reduce((sum, value) => sum + value, 0))) * 100) : 0; return <div className={choice === item.answer ? 'correct-answer' : ''} key={String(choice)}><span>{subject === '數學' ? <FormalMathText text={choice} /> : choice}</span><i><b style={{ width: `${percent}%` }} /></i><small>{votesForChoice} 票 {choice === item.answer ? '・正確答案' : ''}</small></div>; })}</article>)}</div><div className="exit-summary-actions"><button onClick={() => draw(count)}><RotateCcw size={16} /> 再抽一組</button><button onClick={onBack}><ArrowLeft size={16} /> 返回課程</button></div></section></main>;
  if (!questions.length) return <main className={`site-shell exit-ticket-page ${subjectClass}`}><header className="exit-ticket-header"><span><Dice5 size={18} /> 快速出口題</span><button onClick={onBack}><ArrowLeft size={16} /> 返回課程</button></header><section className="exit-ticket-setup"><div><span><Sparkles size={17} /> 課末一分鐘診斷</span><h1>抽一題，<em>看清全班。</em></h1><p>選擇學科、年級與單元後，抽取 1 或 3 題不重複的選擇題；可記錄舉手票數並查看答案分布。</p></div><section><label>學科<select value={subject} onChange={(event) => { setSubject(event.target.value); setUnitId(''); }}>{SUBJECTS.map((item) => <option key={item}>{item}</option>)}</select></label><label>年級<select value={grade} onChange={(event) => { setGrade(event.target.value); setUnitId(''); }}>{GRADES.map((item) => <option key={item}>{item}</option>)}</select></label><label>單元<select value={unitId || selectedUnit?.id || ''} onChange={(event) => setUnitId(event.target.value)}>{units.map((unit) => <option key={unit.id} value={unit.id}>{unit.area}・{unit.title}</option>)}</select></label><div className="exit-count-choice"><span>抽題數</span>{[1, 3].map((amount) => <button key={amount} className={count === amount ? 'active' : ''} onClick={() => setCount(amount)}>抽 {amount} 題</button>)}</div><button className="exit-start" disabled={!selectedUnit} onClick={() => draw(count)}><Dice5 size={18} /> 開始抽題</button></section></section></main>;
  return <main className={`site-shell exit-ticket-page ${subjectClass}`}><header className="exit-ticket-header"><span><Dice5 size={18} /> 快速出口題</span><b>{subject}・{grade}・{selectedUnit?.title}</b><button onClick={onBack}><ArrowLeft size={16} /> 返回課程</button></header><section className="exit-ticket-run"><aside><span>課末診斷</span><b>第 {index + 1} / {questions.length} 題</b><small>每題會保留舉手票數，結算時顯示分布。</small><button onClick={() => setShowDistribution(true)}><BarChart3 size={16} /> 查看分布</button></aside><section><span><Sparkles size={16} /> 請先讓全班思考，再記錄舉手票。</span><h1>{subject === '數學' ? <FormalMathText text={question.prompt} /> : question.prompt}</h1><QuestionContext question={question} isMath={subject === '數學'} /><div className="exit-vote-grid">{question.choices.map((choice, choiceIndex) => <article key={String(choice)} className={revealed && choice === question.answer ? 'correct' : ''}><button onClick={() => incrementVote(choice)} disabled={revealed}><span>{String.fromCharCode(65 + choiceIndex)}</span><b>{subject === '數學' ? <FormalMathText text={choice} /> : choice}</b><small>＋1 票</small></button><strong>{questionVotes[choice] || 0}</strong></article>)}</div>{revealed ? <div className="exit-reveal correct"><Check size={20} /><div><b>正確答案：{subject === '數學' ? <FormalMathText text={question.answer} /> : question.answer}</b><p>{subject === '數學' ? <FormalMathText text={question.explanation} /> : question.explanation}</p></div></div> : <div className="exit-run-actions"><button onClick={clearVotes}>清除本題票數</button><button className="exit-reveal-button" onClick={() => setRevealed(true)}>公布答案</button></div>}{revealed ? <button className="exit-next" onClick={next}>{index === questions.length - 1 ? '查看答案分布' : '下一題'} <ChevronRight size={17} /></button> : null}</section></section></main>;
}
