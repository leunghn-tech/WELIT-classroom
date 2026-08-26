/* 小二寫作工作紙：以人物資料卡及實用文格式卡，選出最合適的描寫或句子；支援隨機題序及選項。 */
import { Check, ChevronRight, Mail, PenLine, RotateCcw, Sparkles, Trophy, UserRound, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import UnitResultSummary from './UnitResultSummary';
import { pauseExamTimer } from '../lib/examTimerStore';

const shuffle = (items) => { const shuffled = [...items]; for (let index = shuffled.length - 1; index > 0; index -= 1) { const swapIndex = Math.floor(Math.random() * (index + 1)); [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]]; } return shuffled; };
function WorkbenchFrame({ unit, taskLabel }) { return <header className="activity-workbench-frame writing-workbench"><span className="activity-file-tab">P2<br />寫作</span><div className="activity-brand-lockup"><span className="activity-brand-mark"><i></i><i></i><i></i><Sparkles size={18} /></span><div><b>Edu<span>Quest</span></b><small>小學課堂展示版</small></div></div><div className="activity-course-file"><span>P2・中國語文</span><b>{unit.area}・{unit.title}</b></div><div className="activity-task-stamp"><span>課堂工作紙</span><b>{taskLabel}</b></div></header>; }

export default function P2WritingActivity({ unit, onBack, onComplete }) {
  const [questions, setQuestions] = useState(() => shuffle(unit.questions));
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [shuffleRound, setShuffleRound] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const question = questions[questionIndex];
  const isPortrait = unit.writingType === 'portrait';
  const choices = useMemo(() => shuffle(question.choices), [question, shuffleRound]);
  const resetQuestion = () => { setSelected(null); setFeedback(null); setShuffleRound((round) => round + 1); };
  const replay = () => { setQuestions(shuffle(unit.questions)); setQuestionIndex(0); setShowSummary(false); setAttempts(0); setCorrectCount(0); resetQuestion(); };
  const answer = (choice) => { if (feedback) return; setSelected(choice); const correct = choice === question.answer; setAttempts((value) => value + 1); if (correct) setCorrectCount((value) => value + 1); setFeedback({ correct }); };
  const nextQuestion = () => { if (questionIndex >= questions.length - 1) { pauseExamTimer(); onComplete?.(unit); setShowSummary(true); return; } setQuestionIndex((index) => index + 1); resetQuestion(); };
  if (showSummary) return <main className="site-shell p2-writing-page"><WorkbenchFrame unit={unit} taskLabel="結算" /><UnitResultSummary unit={unit} total={questions.length} correct={correctCount} attempts={attempts} onBack={onBack} onReplay={replay} title="寫作任務完成" description={isPortrait ? '你已完成從臉形、髮型、衣著和表情寫出人物外貌的練習。' : '你已完成日記與書信的格式、內容和祝福語練習。'} /></main>;
  return <main className="site-shell p2-writing-page"><WorkbenchFrame unit={unit} taskLabel={`寫作 ${questionIndex + 1} / ${questions.length}`} /><header className="match-topbar"><button onClick={onBack} className="match-back">返回中文目錄</button><div><span>{unit.area}・{unit.title}</span><b>第 {questionIndex + 1} / {questions.length} 題</b></div><div className="match-progress"><i style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }} /></div></header><section className="p2-writing-stage"><div className="match-heading"><span>{isPortrait ? <UserRound size={16} /> : <Mail size={16} />} {isPortrait ? '人物外貌描寫' : '日記與書信工作紙'}</span><h1>{question.prompt}</h1><p>{isPortrait ? '先閱讀人物資料卡，再選出最能讓讀者看見人物外貌的句子。' : '先閱讀格式任務卡，再選出最合適的日記或書信內容。'}</p></div><section className={`writing-source-card ${isPortrait ? 'portrait-source' : 'practical-source'}`}><div><span>{isPortrait ? '人物資料卡' : '實用文任務卡'}</span><small>{isPortrait ? '外貌特徵・可看見的線索' : '清楚格式・合適內容'}</small></div><p>{isPortrait ? question.profile : question.document}</p></section><section className="writing-choice-bank"><div className="bank-title"><span>選擇最合適的一句</span><small>每次重玩會重新排列</small></div><div data-option-safety-grid="true" data-question-id={question.id} data-answer-value={String(question.answer)}>{choices.map((choice, index) => <button key={choice} data-choice-value={String(choice)} disabled={Boolean(feedback)} onClick={() => answer(choice)} className={selected === choice ? feedback?.correct ? 'selected-correct' : 'selected-wrong' : ''}><span>{String.fromCharCode(65 + index)}</span><b>{choice}</b></button>)}</div></section>{feedback && <div className={`writing-feedback ${feedback.correct ? 'correct' : 'incorrect'}`}>{feedback.correct ? <><Check size={20} /><div><b>答對了！</b><p>{question.explanation}</p></div></> : <><X size={20} /><div><b>這一句未最符合任務。</b><p>再讀一次資料卡，找出最清楚、最合適的寫法。</p></div></>}<div className="complete-actions">{feedback.correct ? <button onClick={nextQuestion}>{questionIndex === questions.length - 1 ? '查看結算' : '下一題'} <ChevronRight size={17} /></button> : <button onClick={resetQuestion}><RotateCcw size={16} /> 重新作答</button>}<button onClick={onBack} className="back-to-catalog">返回題目板</button></div></div>}</section></main>;
}
