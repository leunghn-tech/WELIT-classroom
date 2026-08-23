/* P1 字詞配對活動：拖曳或點擊字詞卡，配對具體圖意；適合投影與觸控螢幕。 */
import { Check, ChevronRight, GripVertical, MousePointer2, RotateCcw, Sparkles, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import UnitResultSummary from './UnitResultSummary';
import { pauseExamTimer } from '../lib/examTimerStore';

const shuffle = (items) => {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) { const swapIndex = Math.floor(Math.random() * (index + 1)); [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]]; }
  return shuffled;
};

function WorkbenchFrame({ unit, taskLabel }) {
  const grade = unit.id.split('-')[0]; const gradeLabel = { P1: '小一', P5: '小五' }[grade] || grade;
  return <header className="activity-workbench-frame"><span className="activity-file-tab">{grade}<br />中文</span><div className="activity-brand-lockup"><span className="activity-brand-mark"><i></i><i></i><i></i><Sparkles size={18} /></span><div><b>Edu<span>Quest</span></b><small>小學課堂展示版</small></div></div><div className="activity-course-file"><span>{gradeLabel}・中國語文</span><b>{unit.area}・{unit.title}</b></div><div className="activity-task-stamp"><span>課堂工作紙</span><b>{taskLabel}</b></div></header>;
}

export default function WordMatchActivity({ unit, onBack, onComplete }) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [matches, setMatches] = useState({});
  const [selectedWordId, setSelectedWordId] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [shuffleRound, setShuffleRound] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [hadWrong, setHadWrong] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const question = unit.questions[questionIndex];
  const expositoryMode = unit.matchMode === 'expository-method';
  const taskLabel = expositoryMode ? '說明方法配對' : '字詞配對任務';
  const instruction = expositoryMode ? '先選擇左邊的說明方法，再配對右邊最合適的例子或作用；亦可拖曳配對。' : '老師提示：先看圖意，再把字詞卡拖到最合適的位置；平板上可先點選字詞卡，再點選圖意卡。';
  const sourceLabel = expositoryMode ? '說明方法卡' : '字詞卡';
  const targetLabel = expositoryMode ? '例子／作用卡' : '圖意卡';
  const completed = Object.keys(matches).length === question.matches.length;
  const wordCards = useMemo(() => shuffle(question.matches), [question, shuffleRound]);
  const meaningCards = useMemo(() => shuffle(question.matches), [question, shuffleRound]);
  const unmatchedWords = useMemo(() => wordCards.filter((item) => !Object.values(matches).includes(item.id)), [wordCards, matches]);

  const resetQuestion = () => {
    setMatches({});
    setSelectedWordId(null);
    setFeedback(null);
    setHadWrong(false);
    setShuffleRound((round) => round + 1);
  };

  const placeWord = (wordId, targetId) => {
    if (completed || matches[targetId]) return;
    const isCorrect = wordId === targetId;
    if (!isCorrect) {
      setHadWrong(true);
      setFeedback({ correct: false, targetId, wordId });
      window.setTimeout(() => setFeedback(null), 760);
      return;
    }
    setMatches((current) => ({ ...current, [targetId]: wordId }));
    setSelectedWordId(null);
    setFeedback({ correct: true, targetId, wordId });
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

  const replay = () => { setQuestionIndex(0); setCorrectCount(0); setShowSummary(false); resetQuestion(); };

  if (showSummary) return <main className="site-shell word-match-page"><WorkbenchFrame unit={unit} taskLabel="結算" /><UnitResultSummary unit={unit} total={unit.questions.length} correct={correctCount} attempts={unit.questions.length} onBack={onBack} onReplay={replay} title={expositoryMode ? '說明方法配對完成' : '字詞配對完成'} description={expositoryMode ? '你已練習辨認舉例、數字、分類、比較和定義等說明方法。' : '你已完成認讀基礎字詞的圖意配對練習。'} /></main>;

  return <main className="site-shell word-match-page"><WorkbenchFrame unit={unit} taskLabel={`任務 ${questionIndex + 1} / ${unit.questions.length}`} /><header className="match-topbar"><button onClick={onBack} className="match-back">返回中文目錄</button><div><span>{unit.area}・{unit.title}</span><b>第 {questionIndex + 1} / {unit.questions.length} 題</b></div><div className="match-progress" aria-label={`進度 ${questionIndex + 1} / ${unit.questions.length}`}><i style={{ width: `${((questionIndex + 1) / unit.questions.length) * 100}%` }} /></div></header><section className="match-stage"><div className="match-heading"><span><Sparkles size={16} /> {taskLabel}</span><h1>{question.prompt}</h1><p>{instruction}</p></div><section className="match-board"><div className="word-bank"><div className="bank-title"><span>{sourceLabel}</span><small><GripVertical size={14} /> 拖曳或點選</small></div><div className="word-card-grid">{unmatchedWords.map((item) => <button key={item.id} draggable onDragStart={(event) => { event.dataTransfer.setData('wordId', item.id); setSelectedWordId(item.id); }} onDragEnd={() => setSelectedWordId(null)} onClick={() => setSelectedWordId((current) => current === item.id ? null : item.id)} className={`word-match-card ${selectedWordId === item.id ? 'selected' : ''}`}><span className="word-symbol">{item.symbol}</span><b>{item.word}</b><GripVertical size={16} /></button>)}{unmatchedWords.length === 0 && <div className="all-placed"><Check size={20} /> 全部已配對</div>}</div></div><div className="match-arrow" aria-hidden="true">→</div><div className="meaning-bank"><div className="bank-title"><span>{targetLabel}</span><small><MousePointer2 size={14} /> 選擇正確配對</small></div><div className="meaning-card-grid">{meaningCards.map((item) => { const placed = matches[item.id]; const isWrong = feedback?.correct === false && feedback.targetId === item.id; const isRight = placed || feedback?.correct === true && feedback.targetId === item.id; const matchedItem = question.matches.find((word) => word.id === placed); return <button key={item.id} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); placeWord(event.dataTransfer.getData('wordId'), item.id); }} onClick={() => selectedWordId && placeWord(selectedWordId, item.id)} className={`meaning-match-card ${isRight ? 'right' : ''} ${isWrong ? 'wrong' : ''}`}><span className="meaning-symbol">{item.symbol}</span><span className="meaning-copy">{placed ? <><small>已配對</small><b>{matchedItem.word}</b></> : <>{item.meaning}</>}</span>{isRight && <Check size={20} />}{isWrong && <X size={20} />}</button>; })}</div></div></section>{feedback && !completed && <div className={`match-feedback ${feedback.correct ? 'correct' : 'incorrect'}`}>{feedback.correct ? <><Check size={19} /> {expositoryMode ? '配對正確，繼續完成其餘說明方法。' : '配對正確，繼續完成其餘字詞。'}</> : <><X size={19} /> {expositoryMode ? '這個例子或作用不屬於所選說明方法，請再想一想。' : '這張字詞卡不符合圖意，請再想一想。'}</>}</div>}{completed && <div className="match-complete"><div><span><Check size={20} /> 全部配對正確</span><b>做得好！</b><p>{question.explanation}</p></div><div className="complete-actions"><button onClick={resetQuestion}><RotateCcw size={16} /> 再試一次</button><button onClick={nextQuestion}>{questionIndex === unit.questions.length - 1 ? '查看結算' : '下一題'} <ChevronRight size={17} /></button></div></div>}</section></main>;
}
