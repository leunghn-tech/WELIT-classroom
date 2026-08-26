/* P1 部首認識活動：拖曳或點選部首卡到目標漢字的部首格，十題完成後提供結算與重玩。 */
import { Check, ChevronRight, GripVertical, RotateCcw, Sparkles, Trophy, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import UnitResultSummary from './UnitResultSummary';
import { pauseExamTimer } from '../lib/examTimerStore';

const shuffle = (items) => { const shuffled = [...items]; for (let index = shuffled.length - 1; index > 0; index -= 1) { const swapIndex = Math.floor(Math.random() * (index + 1)); [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]]; } return shuffled; };

function WorkbenchFrame({ unit, taskLabel }) {
  return <header className="activity-workbench-frame"><span className="activity-file-tab">P1<br />中文</span><div className="activity-brand-lockup"><span className="activity-brand-mark"><i></i><i></i><i></i><Sparkles size={18} /></span><div><b>Edu<span>Quest</span></b><small>小學課堂展示版</small></div></div><div className="activity-course-file"><span>小一・中國語文</span><b>{unit.area}・{unit.title}</b></div><div className="activity-task-stamp"><span>課堂工作紙</span><b>{taskLabel}</b></div></header>;
}

export default function RadicalSortActivity({ unit, onBack, onComplete }) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedRadical, setSelectedRadical] = useState(null);
  const [placedRadical, setPlacedRadical] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [shuffleRound, setShuffleRound] = useState(0);
  const [hadWrong, setHadWrong] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const question = unit.questions[questionIndex];
  const completed = placedRadical === question.radical;
  const choices = useMemo(() => shuffle(question.choices), [question, shuffleRound]);

  const resetQuestion = () => {
    setSelectedRadical(null);
    setPlacedRadical(null);
    setFeedback(null);
    setHadWrong(false);
    setShuffleRound((round) => round + 1);
  };
  const replay = () => {
    setQuestionIndex(Math.floor(Math.random() * unit.questions.length));
    setShowSummary(false);
    setCorrectCount(0);
    resetQuestion();
  };
  const placeRadical = (radical) => {
    if (completed || !radical) return;
    if (radical !== question.radical) {
      setHadWrong(true);
      setFeedback({ correct: false, radical });
      window.setTimeout(() => setFeedback(null), 720);
      setSelectedRadical(null);
      return;
    }
    setPlacedRadical(radical);
    setSelectedRadical(null);
    setFeedback({ correct: true, radical });
  };
  const nextQuestion = () => {
    const nextCorrect = correctCount + (hadWrong ? 0 : 1);
    if (questionIndex >= unit.questions.length - 1) {
      setCorrectCount(nextCorrect);
      pauseExamTimer();
      onComplete?.(unit);
      setShowSummary(true);
      return;
    }
    setCorrectCount(nextCorrect);
    setQuestionIndex((index) => index + 1);
    resetQuestion();
  };

  if (showSummary) return <main className="site-shell radical-page"><WorkbenchFrame unit={unit} taskLabel="結算" /><UnitResultSummary unit={unit} total={unit.questions.length} correct={correctCount} attempts={unit.questions.length} onBack={onBack} onReplay={replay} title="常用部首完成" description="你已練習從字形找出常用部首。可以重玩一次，或返回中文目錄選擇下一個單元。" /></main>;

  return <main className="site-shell radical-page"><WorkbenchFrame unit={unit} taskLabel={`任務 ${questionIndex + 1} / ${unit.questions.length}`} /><header className="match-topbar"><button onClick={onBack} className="match-back">返回中文目錄</button><div><span>{unit.area}・{unit.title}</span><b>第 {questionIndex + 1} / {unit.questions.length} 題</b></div><div className="match-progress" aria-label={`進度 ${questionIndex + 1} / ${unit.questions.length}`}><i style={{ width: `${((questionIndex + 1) / unit.questions.length) * 100}%` }} /></div></header><section className="radical-stage"><div className="match-heading"><span><Sparkles size={16} /> 部首偵查任務</span><h1>{question.prompt}</h1><p>老師提示：先看清目標漢字，再把正確部首卡拖到部首格；平板上可先點選部首卡，再點選部首格。</p></div><section className="radical-board"><section className="radical-word-sheet"><span>目標漢字</span><div className="radical-character">{question.character}</div><p>找出這個字的部首。</p></section><div className="radical-arrow" aria-hidden="true">→</div><button className={`radical-target ${completed ? 'right' : ''} ${feedback?.correct === false ? 'wrong' : ''}`} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); placeRadical(event.dataTransfer.getData('radical')); }} onClick={() => selectedRadical && placeRadical(selectedRadical)}><span>部首格</span><b>{placedRadical || '？'}</b><small>{completed ? `${question.radicalName}・配對正確` : '拖曳或點選部首放到這裡'}</small>{completed && <Check size={22} />}</button></section><section className="radical-choice-bank"><div className="bank-title"><span>部首卡</span><small><GripVertical size={14} /> 拖曳或點選</small></div><div className="radical-choice-grid" data-correct-choice={question.radical}>{choices.map((radical) => <button key={radical} data-choice-value={radical} draggable disabled={completed} onDragStart={(event) => { event.dataTransfer.setData('radical', radical); setSelectedRadical(radical); }} onDragEnd={() => setSelectedRadical(null)} onClick={() => setSelectedRadical((current) => current === radical ? null : radical)} className={`radical-choice ${selectedRadical === radical ? 'selected' : ''} ${feedback?.correct === false && feedback.radical === radical ? 'wrong' : ''}`}><b>{radical}</b><span>部首卡</span></button>)}</div></section>{feedback && !completed && <div className="match-feedback incorrect"><X size={19} /> 這個部首不符合「{question.character}」，請從字形再找一找。</div>}{completed && <div className="match-complete"><div><span><Check size={20} /> 部首配對正確</span><b>找對了！</b><p>{question.explanation}</p></div><div className="complete-actions"><button onClick={resetQuestion}><RotateCcw size={16} /> 再試一次</button><button onClick={nextQuestion}>{questionIndex === unit.questions.length - 1 ? '查看結算' : '下一題'} <ChevronRight size={17} /></button></div></div>}</section></main>;
}
