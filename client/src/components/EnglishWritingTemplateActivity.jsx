import { Check, ChevronRight, RotateCcw, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import { pauseExamTimer } from '../lib/examTimerStore';
import UnitResultSummary from './UnitResultSummary';

const shuffle = (items) => {
  const copied = [...items];
  for (let index = copied.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copied[index], copied[swapIndex]] = [copied[swapIndex], copied[index]];
  }
  return copied;
};

const copy = {
  'english-text-template': { task: 'Text Type Template', source: 'Writing brief', instruction: 'Choose the most suitable line for each part. Then read the completed writing plan from top to bottom.', summary: 'Text template complete', description: 'You have built a clear text with the right purpose and structure.' },
  'english-picture-story-template': { task: 'Picture-story Paragraph', source: 'Picture story brief', instruction: 'Read the three picture clues in order. Choose one clear sentence for the beginning, middle and ending.', summary: 'Picture-story paragraph complete', description: 'You have built a short story with a clear order, action and ending.' },
  'english-practical-template': { task: 'Practical Writing Template', source: 'Writing brief', instruction: 'State the purpose, give clear details and finish with a suitable request or action.', summary: 'Practical writing template complete', description: 'You have organised a clear and polite piece of practical writing.' },
  'english-debate-template': { task: 'Debate Speech Template', source: 'Motion', instruction: 'State your position, support it with a clear reason and finish with a persuasive call to action.', summary: 'Debate speech template complete', description: 'You have organised a clear position, reason and conclusion for a debate speech.' },
  'english-advanced-writing-template': { task: 'Advanced Sentence Writing', source: 'Writing brief', instruction: 'Read the source carefully, choose the accurate form and finish with a complete sentence for the context.', summary: 'Advanced writing complete', description: 'You have selected accurate grammar and organised it for a real writing context.' },
  'english-reported-practical-template': { task: 'Reported Practical Writing', source: 'Source message', instruction: 'Turn the key words in a spoken message into a clear report, notice or email sentence.', summary: 'Reported practical writing complete', description: 'You have selected accurate changes to person, time and tense for a useful written message.' },
  'english-evidence-edit-template': { task: 'Evidence-based Practical Revision', source: 'Writing context', instruction: 'Read the evidence card first. Use the exact fact to make the revised sentence clear, accurate and suitable for its reader.', summary: 'Evidence-based revision complete', description: 'You have used a specific fact to improve a practical-writing sentence and request.' },
};

function Frame({ unit, label }) {
  const grade = unit.grade || unit.id.split('-')[0];
  const gradeLabel = { P1: '小一', P2: '小二', P3: '小三', P4: '小四', P5: '小五', P6: '小六' }[grade] || grade;
  return <header className="activity-workbench-frame english-activity-frame"><span className="activity-file-tab">{grade}<br />ENGLISH</span><div className="activity-brand-lockup"><span className="activity-brand-mark"><i></i><i></i><i></i><Sparkles size={18} /></span><div><b>Edu<span>Quest</span></b><small>小學課堂展示版</small></div></div><div className="activity-course-file"><span>{gradeLabel}・英文</span><b>{unit.area}・{unit.title}</b></div><div className="activity-task-stamp"><span>Writing planner</span><b>{label}</b></div></header>;
}

export default function EnglishWritingTemplateActivity({ unit, onBack, onComplete }) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [wrongStep, setWrongStep] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const question = unit.questions[questionIndex];
  const mode = copy[unit.templateMode] || copy['english-text-template'];
  const options = useMemo(() => question.steps.map((step) => shuffle(step.options)), [question]);
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
    if (questionIndex >= unit.questions.length - 1) { setCorrectCount(nextCorrect); pauseExamTimer(); onComplete?.(unit); setShowSummary(true); return; }
    setCorrectCount(nextCorrect); setQuestionIndex((index) => index + 1); reset();
  };
  const replay = () => { setQuestionIndex(0); setCorrectCount(0); setShowSummary(false); reset(); };

  if (showSummary) return <main className="site-shell english-choice-page english-writing-template-page"><Frame unit={unit} label="Summary" /><UnitResultSummary unit={unit} total={unit.questions.length} correct={correctCount} attempts={unit.questions.length} onBack={onBack} onReplay={replay} title={mode.summary} description={mode.description} noun="tasks" /></main>;

  return <main className="site-shell english-choice-page english-writing-template-page"><Frame unit={unit} label={`Task ${questionIndex + 1} / ${unit.questions.length}`} /><header className="match-topbar english-match-topbar"><button onClick={onBack} className="match-back">返回英文目錄</button><div><span>{unit.area}・{unit.title}</span><b>第 {questionIndex + 1} / {unit.questions.length} 題</b></div><div className="match-progress"><i style={{ width: `${((questionIndex + 1) / unit.questions.length) * 100}%` }} /></div></header><section className="english-activity-stage english-template-stage"><div className="match-heading"><span><Sparkles size={16} /> {mode.task}</span><h1>{question.prompt}</h1><p>Teacher tip: {mode.instruction}</p></div><section className="english-template-brief"><span>{mode.source}</span><h2>{question.title}</h2><p>{question.brief}</p></section>{question.pictureStrip?.length ? <section className="english-picture-strip" aria-label="Picture story clues">{question.pictureStrip.map((picture, index) => <article key={`${picture.emoji}-${picture.label}`}><span>{index + 1}</span><b>{picture.emoji}</b><small>{picture.label}</small></article>)}</section> : null}{question.evidence ? <section className="english-evidence-card"><span>Evidence card</span><p>{question.evidence}</p><b>Draft to improve</b><p>{question.draft}</p></section> : null}<section className="english-template-plan"><div className="bank-title"><span>Writing steps</span><small>Choose one suitable line at a time</small></div>{question.steps.map((step, index) => <article key={step.id} className={`english-template-step ${answers[step.id] ? 'complete' : ''} ${wrongStep === step.id ? 'wrong' : ''}`}><header><span>{index + 1}</span><div><b>{step.label}</b><small>{step.focus}</small></div>{answers[step.id] && <Check size={18} />}</header>{answers[step.id] ? <p className="chosen-template-line">{answers[step.id]}</p> : <div className="english-template-options">{options[index].map((option) => <button key={option} onClick={() => choose(step, option)}>{option}</button>)}</div>}</article>)}</section>{complete && <section className="english-template-feedback correct correct-pop"><Check size={22} /><div><b>Well organised!</b><p>{question.explanation}</p></div><div className="complete-actions"><button onClick={reset}><RotateCcw size={16} /> Try again</button><button onClick={next}>{questionIndex === unit.questions.length - 1 ? 'See summary' : 'Next task'} <ChevronRight size={17} /></button></div></section>}</section></main>;
}
