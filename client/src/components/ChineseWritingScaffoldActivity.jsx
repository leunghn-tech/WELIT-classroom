import { Check, ChevronRight, RotateCcw, Sparkles, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import UnitResultSummary from './UnitResultSummary';
import { pauseExamTimer } from '../lib/examTimerStore';

const shuffle = (items) => {
  const copied = [...items];
  for (let index = copied.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copied[index], copied[swapIndex]] = [copied[swapIndex], copied[index]];
  }
  return copied;
};

function Frame({ unit, label }) {
  return <header className="activity-workbench-frame"><span className="activity-file-tab">{unit.grade}<br />中文</span><div className="activity-brand-lockup"><span className="activity-brand-mark"><i></i><i></i><i></i><Sparkles size={18} /></span><div><b>Edu<span>Quest</span></b><small>小學課堂展示版</small></div></div><div className="activity-course-file"><span>{unit.grade}・中國語文</span><b>{unit.area}・{unit.title}</b></div><div className="activity-task-stamp"><span>寫作工作紙</span><b>{label}</b></div></header>;
}

const modeCopy = {
  'summary-fill': { task: '段意摘要填空', source: '閱讀材料', instruction: '先找出每段的主要行動和結果，再選出最合適的句子完成摘要。', summary: '段意摘要填空完成', description: '你已把段落重點整理成連貫摘要。' },
  'expository-framework': { task: '說明段落框架', source: '寫作資料', instruction: '按照開頭、說明和結尾三步，選出最能組成說明段落的句子。', summary: '說明段落框架完成', description: '你已練習以清楚結構寫成說明段落。' },
  'argument-rewrite': { task: '議論短文改寫', source: '原有短文', instruction: '先保留合理立場，再加入理由和周全回應，完成較有說服力的短文。', summary: '議論短文改寫完成', description: '你已練習把單薄主張改寫成有理有據的短論證。' },
};

export default function ChineseWritingScaffoldActivity({ unit, onBack, onComplete }) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [wrongStep, setWrongStep] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const question = unit.questions[questionIndex];
  const mode = modeCopy[unit.scaffoldMode] || modeCopy['summary-fill'];
  const shuffledOptions = useMemo(() => question.steps.map((step) => shuffle(step.options)), [question]);
  const complete = question.steps.every((step) => answers[step.id] === step.answer);

  const choose = (step, choice) => {
    if (answers[step.id] || complete) return;
    if (choice !== step.answer) {
      setWrongStep(step.id);
      window.setTimeout(() => setWrongStep(null), 620);
      return;
    }
    setAnswers((current) => ({ ...current, [step.id]: choice }));
  };

  const reset = () => { setAnswers({}); setWrongStep(null); };
  const next = () => {
    const nextCorrect = correctCount + 1;
    if (questionIndex >= unit.questions.length - 1) {
      setCorrectCount(nextCorrect);
      pauseExamTimer();
      onComplete?.(unit);
      setShowSummary(true);
      return;
    }
    setCorrectCount(nextCorrect);
    setQuestionIndex((index) => index + 1);
    reset();
  };
  const replay = () => { setQuestionIndex(0); setCorrectCount(0); setShowSummary(false); reset(); };

  if (showSummary) return <main className="site-shell p3-study-page chinese-writing-scaffold-page"><Frame unit={unit} label="結算" /><UnitResultSummary unit={unit} total={unit.questions.length} correct={correctCount} attempts={unit.questions.length} onBack={onBack} onReplay={replay} title={mode.summary} description={mode.description} noun="組" /></main>;

  return <main className="site-shell p3-study-page chinese-writing-scaffold-page"><Frame unit={unit} label={`任務 ${questionIndex + 1} / ${unit.questions.length}`} /><header className="match-topbar"><button onClick={onBack} className="match-back">返回中文目錄</button><div><span>{unit.area}・{unit.title}</span><b>第 {questionIndex + 1} / {unit.questions.length} 題</b></div><div className="match-progress"><i style={{ width: `${((questionIndex + 1) / unit.questions.length) * 100}%` }} /></div></header><section className="p3-study-stage chinese-scaffold-stage"><div className="match-heading"><span><Sparkles size={16} /> {mode.task}</span><h1>{question.prompt}</h1><p>{mode.instruction}</p></div><section className="chinese-scaffold-source"><span>{mode.source}</span><h2>{question.title}</h2><p>{question.source}</p></section><section className="chinese-scaffold-plan" aria-label="寫作步驟"><div className="bank-title"><span>寫作步驟</span><small>逐步選出最合適的句子</small></div>{question.steps.map((step, index) => <article key={step.id} className={`chinese-scaffold-step ${answers[step.id] ? 'complete' : ''} ${wrongStep === step.id ? 'wrong' : ''}`}><header><span>{index + 1}</span><div><b>{step.label}</b><small>{step.focus}</small></div>{answers[step.id] && <Check size={18} />}</header>{answers[step.id] ? <p className="chosen-writing-sentence">{answers[step.id]}</p> : <div className="scaffold-options">{shuffledOptions[index].map((option) => <button key={option} onClick={() => choose(step, option)}>{option}</button>)}</div>}</article>)}</section>{complete && <section className="chinese-scaffold-feedback correct correct-pop"><Check size={22} /><div><b>{mode.task}正確！</b><p>{question.explanation}</p></div><div className="complete-actions"><button onClick={reset}><RotateCcw size={16} /> 再試一次</button><button onClick={next}>{questionIndex === unit.questions.length - 1 ? '查看結算' : '下一題'} <ChevronRight size={17} /></button></div></section>}</section></main>;
}
