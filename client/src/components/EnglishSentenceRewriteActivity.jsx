import { ArrowLeft, Check, ChevronRight, Lightbulb, RotateCcw, Sparkles, Trophy, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { pauseExamTimer } from '../lib/examTimerStore';
import HintSatchel from './HintSatchel';
import EnglishSentenceListenButton from './EnglishSentenceListenButton';
import SentenceWithBlank from './SentenceWithBlank';

const shuffle = (items) => {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
};

const normalise = (value) => value.trim().toLowerCase().replace(/[.,!?“”"']/g, '').replace(/\s+/g, ' ');
const acceptedAnswer = (question, value) => {
  const attempt = normalise(value);
  const answers = [question.target, ...(question.accepted || [])].map(normalise);
  const optionalThat = normalise(question.target).replace(' said that ', ' said ');
  return answers.includes(attempt) || attempt === optionalThat;
};

function Frame({ unit, taskLabel }) {
  return <header className="activity-workbench-frame english-activity-frame"><span className="activity-file-tab">P6<br />ENGLISH</span><div className="activity-brand-lockup"><span className="activity-brand-mark"><i></i><i></i><i></i><Sparkles size={18} /></span><div><b>Edu<span>Quest</span></b><small>小學課堂展示版</small></div></div><div className="activity-course-file"><span>小六・英文</span><b>{unit.area}・{unit.title}</b></div><div className="activity-task-stamp"><span>句子改寫</span><b>{taskLabel}</b></div></header>;
}

export default function EnglishSentenceRewriteActivity({ unit, onBack, onComplete }) {
  const [questions, setQuestions] = useState(() => shuffle(unit.questions));
  const [questionIndex, setQuestionIndex] = useState(0);
  const [draft, setDraft] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [spokenIndex, setSpokenIndex] = useState(null);
  const question = questions[questionIndex];
  const isConditional = unit.interaction === 'english-sentence-rewrite-conditional';
  const satchelHint = isConditional
    ? '先判斷題目要表達真理、未來可能還是假設情況；再選出 If 子句和主句應有的時態。'
    : '先圈出說話者、代名詞、時間詞和動詞；轉述時把語氣、時間和人稱逐一改寫。';
  const answer = () => {
    if (feedback || !draft.trim()) return;
    const correct = acceptedAnswer(question, draft);
    setAttempts((value) => value + 1);
    if (correct) setCorrectCount((value) => value + 1);
    setFeedback({ correct });
  };
  const retry = () => { setDraft(''); setFeedback(null); setSpokenIndex(null); };
  const next = () => {
    if (questionIndex >= questions.length - 1) {
      pauseExamTimer();
      onComplete?.(unit, questions.map((item) => item.id));
      setShowSummary(true);
      return;
    }
    setQuestionIndex((value) => value + 1);
    retry();
  };
  const replay = () => {
    setQuestions(shuffle(unit.questions));
    setQuestionIndex(0);
    setDraft('');
    setFeedback(null);
    setAttempts(0);
    setCorrectCount(0);
    setShowSummary(false);
  };
  const accuracy = useMemo(() => attempts ? Math.round((correctCount / attempts) * 100) : 0, [attempts, correctCount]);

  if (showSummary) return <main className="site-shell english-choice-page"><Frame unit={unit} taskLabel="結算" /><section className="english-summary activity-summary"><span><Trophy size={22} /> 完成改寫</span><h1>{unit.title}完成了！</h1><p>你完成了 {questions.length} 題句子改寫。答對 {correctCount} 題，作答準確度為 {accuracy}%。</p><div><button onClick={onBack} className="english-back-button"><ArrowLeft size={17} /> 返回英文目錄</button><button onClick={replay} className="english-primary-button"><RotateCcw size={17} /> 隨機再試一次</button></div></section></main>;

  return <main className="site-shell english-choice-page english-rewrite-page"><Frame unit={unit} taskLabel={`改寫 ${questionIndex + 1} / ${questions.length}`} /><HintSatchel hint={satchelHint} title={isConditional ? '條件句改寫錦囊' : '間接引語改寫錦囊'} /><header className="match-topbar english-match-topbar"><button onClick={onBack} className="match-back">返回英文目錄</button><div><span>{unit.area}・{unit.title}</span><b>第 {questionIndex + 1} / {questions.length} 題</b></div><div className="match-progress" aria-label={`進度 ${questionIndex + 1} / ${questions.length}`}><i style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }} /></div></header><section className="english-activity-stage english-rewrite-stage"><div className="match-heading"><span><Sparkles size={16} /> {isConditional ? '條件句改寫任務' : '間接引語改寫任務'}</span><h1>{question.prompt}</h1><p>{question.instruction}</p></div><section className="english-rewrite-paper"><div className="english-rewrite-source"><span>原句 / SOURCE</span><blockquote><SentenceWithBlank text={question.source} highlightCharIndex={spokenIndex} showZoom={false} /></blockquote><EnglishSentenceListenButton sentence={question.source} label="朗讀原句" onStart={() => setSpokenIndex(0)} onBoundary={setSpokenIndex} onEnd={() => setSpokenIndex(null)} /><small><Lightbulb size={14} /> 改寫重點：{question.focus}</small></div><div className="english-rewrite-answer"><label htmlFor="rewrite-answer">你的改寫句子</label><textarea id="rewrite-answer" value={draft} disabled={Boolean(feedback)} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') answer(); }} placeholder={question.placeholder} spellCheck="false" autoCapitalize="sentences" /><small>可按 Ctrl／⌘ + Enter 檢查；大小寫與標點不影響判定。</small><div><button className="english-rewrite-reset" onClick={retry} disabled={Boolean(feedback) || !draft}><RotateCcw size={16} /> 清除重寫</button><button className="english-primary-button" onClick={answer} disabled={Boolean(feedback) || !draft.trim()}>檢查改寫 <Check size={17} /></button></div></div></section>{feedback && <section className={`english-feedback ${feedback.correct ? 'correct correct-pop' : 'incorrect'}`} role="status"><div className="english-feedback-icon">{feedback.correct ? <Check size={22} /> : <X size={22} />}</div><div><b>{feedback.correct ? '改寫正確！' : '句子還未符合改寫要求。'}</b><p>{feedback.correct ? question.explanation : `請再核對：${question.hint}`}</p>{feedback.correct && <p className="english-rewrite-model">標準寫法：<strong>{question.target}</strong></p>}<div className="complete-actions">{feedback.correct ? <button onClick={next}>{questionIndex === questions.length - 1 ? '查看結算' : '下一題'} <ChevronRight size={17} /></button> : <button onClick={retry}><RotateCcw size={16} /> 重新改寫</button>}<button onClick={onBack}>返回英文目錄</button></div></div></section>}</section></main>;
}
