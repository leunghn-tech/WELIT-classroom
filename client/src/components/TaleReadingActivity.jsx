/* 小二寓言與童話閱讀：同一篇故事連接主角、事情及大意三題，支援隨機故事、專注閱讀與重點標記。 */
import { BookOpen, Check, ChevronRight, Highlighter, Maximize2, Minimize2, RotateCcw, Sparkles, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import HintSatchel from './HintSatchel';
import UnitResultSummary from './UnitResultSummary';
import { pauseExamTimer } from '../lib/examTimerStore';

const shuffle = (items) => { const shuffled = [...items]; for (let index = shuffled.length - 1; index > 0; index -= 1) { const swapIndex = Math.floor(Math.random() * (index + 1)); [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]]; } return shuffled; };
const createSession = (stories) => { const story = stories[Math.floor(Math.random() * stories.length)] || stories[0]; return { story, questions: shuffle(story.questions) }; };
const splitParagraphs = (text) => (text.match(/[^。！？]+[。！？]?/g) || [text]).map((item) => item.trim()).filter(Boolean);
function WorkbenchFrame({ unit, taskLabel }) { return <header className="activity-workbench-frame"><span className="activity-file-tab">P2<br />中文</span><div className="activity-brand-lockup"><span className="activity-brand-mark"><i></i><i></i><i></i><Sparkles size={18} /></span><div><b>Edu<span>Quest</span></b><small>小學課堂展示版</small></div></div><div className="activity-course-file"><span>P2・中國語文</span><b>{unit.area}・{unit.title}</b></div><div className="activity-task-stamp"><span>課堂工作紙</span><b>{taskLabel}</b></div></header>; }

export default function TaleReadingActivity({ unit, onBack, onComplete }) {
  const [session, setSession] = useState(() => createSession(unit.stories));
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [shuffleRound, setShuffleRound] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [focusReading, setFocusReading] = useState(false);
  const [markedSegments, setMarkedSegments] = useState(() => new Set());
  const { story, questions } = session;
  const question = questions[questionIndex];
  const choices = useMemo(() => shuffle(question.choices), [question, shuffleRound]);
  const storySegments = useMemo(() => splitParagraphs(story.text), [story.text]);
  const resetQuestion = () => { setSelected(null); setFeedback(null); setShuffleRound((round) => round + 1); };
  const replay = () => { setSession(createSession(unit.stories)); setQuestionIndex(0); setShowSummary(false); setAttempts(0); setCorrectCount(0); setFocusReading(false); setMarkedSegments(new Set()); resetQuestion(); };
  const answer = (choice) => { if (feedback) return; const correct = choice === question.answer; setSelected(choice); setAttempts((value) => value + 1); if (correct) setCorrectCount((value) => value + 1); setFeedback({ correct }); };
  const nextQuestion = () => { if (questionIndex >= questions.length - 1) { pauseExamTimer(); onComplete?.(unit, questions.map((item) => item.id)); setShowSummary(true); return; } setQuestionIndex((index) => index + 1); resetQuestion(); };
  const toggleMarkedSegment = (index) => setMarkedSegments((current) => { const next = new Set(current); if (next.has(index)) next.delete(index); else next.add(index); return next; });
  const taleHint = '先看題目問的是誰、發生甚麼事，還是故事想告訴我們的道理；答案一定可從故事的角色、轉折或結尾找到。';
  if (showSummary) return <main className="site-shell tale-reading-page"><WorkbenchFrame unit={unit} taskLabel="結算" /><UnitResultSummary unit={unit} total={questions.length} correct={correctCount} attempts={attempts} onBack={onBack} onReplay={replay} title="故事閱讀完成" description={`《${story.title}》的故事閱讀任務完成；你已找出主角、重要事情和大意。`} /></main>;
  return <main className={`site-shell tale-reading-page ${focusReading ? 'reading-focus-mode' : ''}`}><WorkbenchFrame unit={unit} taskLabel={`故事題 ${questionIndex + 1} / ${questions.length}`} /><header className="match-topbar"><button onClick={onBack} className="match-back">返回中文目錄</button><div><span>{unit.area}・{unit.title}</span><b>第 {questionIndex + 1} / {questions.length} 題</b></div><div className="match-progress"><i style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }} /></div></header><section className="tale-reading-stage"><div className="reading-focus-toolbar"><button onClick={() => setFocusReading((value) => !value)} aria-pressed={focusReading}>{focusReading ? <><Minimize2 size={17} /> 離開專注閱讀</> : <><Maximize2 size={17} /> 專注閱讀</>}</button></div>{!focusReading && <div className="match-heading"><h1>{question.prompt}</h1></div>}<section className="tale-paper"><div><span><BookOpen size={17} /> {story.type}</span><b>{story.title}</b><small>{story.intro}</small></div>{focusReading ? <div className="focus-story-segments">{storySegments.map((segment, index) => <button key={`${index}-${segment}`} type="button" onClick={() => toggleMarkedSegment(index)} className={markedSegments.has(index) ? 'marked' : ''} aria-pressed={markedSegments.has(index)}><span><Highlighter size={15} /> 段落 {index + 1}</span><p>{segment}</p></button>)}</div> : <div className="answer-story-segments">{storySegments.map((segment, index) => <p key={`${index}-${segment}`} className={markedSegments.has(index) ? 'marked' : ''}>{segment}</p>)}</div>}</section>{focusReading ? <><section className="focus-marker-panel"><div><span><Highlighter size={17} /> 重點標記</span><b>{markedSegments.size ? `已標記 ${markedSegments.size} 段` : '點選句子標記重點'}</b><small>再點一次可取消；標記會在回答問題時保留。</small></div>{markedSegments.size > 0 && <button onClick={() => setMarkedSegments(new Set())}>清除標記</button>}</section><button className="focus-answer-button" onClick={() => setFocusReading(false)}>我已讀完，開始回答第 {questionIndex + 1} 題 <ChevronRight size={18} /></button></> : <><HintSatchel hint={taleHint} title="故事找線索" /><section className="worksheet-options"><div className="bank-title"><span>選擇答案</span></div><div>{choices.map((choice, index) => <button key={choice} disabled={Boolean(feedback)} onClick={() => answer(choice)} className={selected === choice ? feedback?.correct ? 'selected-correct' : 'selected-wrong' : ''}><span>{String.fromCharCode(65 + index)}</span><b>{choice}</b></button>)}</div></section>{feedback && <div className={`worksheet-feedback ${feedback.correct ? 'correct' : 'incorrect'}`}>{feedback.correct ? <><Check size={20} /><div><b>答對了！</b><p>{question.explanation}</p></div></> : <><X size={20} /><div><b>這個答案未能從故事找到。</b><p>請再看人物、事情和結尾的線索。</p></div></>}<div className="complete-actions">{feedback.correct ? <button onClick={nextQuestion}>{questionIndex === questions.length - 1 ? '查看結算' : '下一題'} <ChevronRight size={17} /></button> : <button onClick={resetQuestion}><RotateCcw size={16} /> 重新作答</button>}<button onClick={onBack}>返回題目板</button></div></div>}</>}</section></main>;
}
