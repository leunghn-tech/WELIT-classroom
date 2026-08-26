/* P1 標點活動：拖曳或點選句號、問號、感嘆號至正確句末。 */
import { Check, ChevronRight, GripVertical, RotateCcw, Sparkles, Trophy, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import UnitResultSummary from './UnitResultSummary';
import { pauseExamTimer } from '../lib/examTimerStore';

const shuffle = (items) => { const shuffled = [...items]; for (let index = shuffled.length - 1; index > 0; index -= 1) { const swapIndex = Math.floor(Math.random() * (index + 1)); [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]]; } return shuffled; };

function WorkbenchFrame({ unit, taskLabel }) {
  return <header className="activity-workbench-frame"><span className="activity-file-tab">P1<br />中文</span><div className="activity-brand-lockup"><span className="activity-brand-mark"><i></i><i></i><i></i><Sparkles size={18} /></span><div><b>Edu<span>Quest</span></b><small>小學課堂展示版</small></div></div><div className="activity-course-file"><span>小一・中國語文</span><b>{unit.area}・{unit.title}</b></div><div className="activity-task-stamp"><span>課堂工作紙</span><b>{taskLabel}</b></div></header>;
}

export default function PunctuationDropActivity({ unit, onBack, onComplete }) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedMark, setSelectedMark] = useState(null);
  const [placedMark, setPlacedMark] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [shuffleRound, setShuffleRound] = useState(0);
  const [hadWrong, setHadWrong] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const question = unit.questions[questionIndex];
  const completed = placedMark === question.answer;
  const choices = useMemo(() => shuffle(question.choices), [question, shuffleRound]);

  const resetQuestion = () => { setSelectedMark(null); setPlacedMark(null); setFeedback(null); setHadWrong(false); setShuffleRound((round) => round + 1); };
  const replay = () => { setQuestionIndex(Math.floor(Math.random() * unit.questions.length)); setShowSummary(false); setCorrectCount(0); resetQuestion(); };
  const placeMark = (mark) => {
    if (completed || !mark) return;
    if (mark !== question.answer) {
      setHadWrong(true);
      setFeedback({ correct: false, mark });
      window.setTimeout(() => setFeedback(null), 720);
      setSelectedMark(null);
      return;
    }
    setPlacedMark(mark);
    setSelectedMark(null);
    setFeedback({ correct: true, mark });
  };
  const nextQuestion = () => {
    const nextCorrect = correctCount + (hadWrong ? 0 : 1);
    if (questionIndex >= unit.questions.length - 1) { setCorrectCount(nextCorrect); pauseExamTimer(); onComplete?.(unit); setShowSummary(true); return; }
    setCorrectCount(nextCorrect);
    setQuestionIndex((index) => index + 1);
    resetQuestion();
  };
  if (showSummary) return <main className="site-shell punctuation-page"><WorkbenchFrame unit={unit} taskLabel="結算" /><UnitResultSummary unit={unit} total={unit.questions.length} correct={correctCount} attempts={unit.questions.length} onBack={onBack} onReplay={replay} title="基本標點完成" description="你已練習為句子選出合適的句號、問號和感嘆號。" /></main>;
  return <main className="site-shell punctuation-page"><WorkbenchFrame unit={unit} taskLabel={`任務 ${questionIndex + 1} / ${unit.questions.length}`} /><header className="match-topbar"><button onClick={onBack} className="match-back">返回中文目錄</button><div><span>{unit.area}・{unit.title}</span><b>第 {questionIndex + 1} / {unit.questions.length} 題</b></div><div className="match-progress" aria-label={`進度 ${questionIndex + 1} / ${unit.questions.length}`}><i style={{ width: `${((questionIndex + 1) / unit.questions.length) * 100}%` }} /></div></header><section className="punctuation-stage"><div className="match-heading"><span><Sparkles size={16} /> 標點填空任務</span><h1>{question.prompt}</h1><p>把標點卡拖到句子空格；在平板上，先點選標點卡，再點選句末空格即可。</p></div><section className="punctuation-hints" aria-label="標點用途提示卡"><article><b>。</b><div><strong>句號</strong><span>說完一件事</span><small>例：今天放假。</small></div></article><article><b>？</b><div><strong>問號</strong><span>提出問題</span><small>例：你快樂嗎？</small></div></article><article><b>！</b><div><strong>感嘆號</strong><span>強烈感受或提醒</span><small>例：小心車輛！</small></div></article></section><section className="punctuation-sentence"><span className="sentence-label">句子</span><p>{question.before}<button className={`punctuation-target ${completed ? 'right' : ''} ${feedback?.correct === false ? 'wrong' : ''}`} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); placeMark(event.dataTransfer.getData('punctuation')); }} onClick={() => selectedMark && placeMark(selectedMark)}>{placedMark || '＿'}</button>{question.after}</p><small>{completed ? '標點正確！' : '把標點放到空格內'}</small></section><section className="punctuation-bank"><div className="bank-title"><span>標點卡</span><small><GripVertical size={14} /> 拖曳或點選</small></div><div className="punctuation-choice-grid" data-option-safety-grid="true" data-question-id={question.id} data-answer-value={String(question.answer)}>{choices.map((mark) => <button key={mark} data-choice-value={mark} draggable disabled={completed} onDragStart={(event) => { event.dataTransfer.setData('punctuation', mark); setSelectedMark(mark); }} onDragEnd={() => setSelectedMark(null)} onClick={() => setSelectedMark((current) => current === mark ? null : mark)} className={`punctuation-choice ${selectedMark === mark ? 'selected' : ''} ${feedback?.correct === false && feedback.mark === mark ? 'wrong' : ''}`}>{mark}</button>)}</div></section>{feedback && !completed && <div className="match-feedback incorrect"><X size={19} /> 這個標點不適合這句話，請再看句子的語氣。</div>}{completed && <div className="match-complete"><div><span><Check size={20} /> 標點填對了</span><b>做得好！</b><p>{question.explanation}</p></div><div className="complete-actions"><button onClick={resetQuestion}><RotateCcw size={16} /> 再試一次</button><button onClick={nextQuestion}>{questionIndex === unit.questions.length - 1 ? '查看結算' : '下一題'} <ChevronRight size={17} /></button></div></div>}</section></main>;
}
