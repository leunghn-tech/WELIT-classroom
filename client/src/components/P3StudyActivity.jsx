/* 彩色課程工作檯：P3–P6 試卷以「問題 → 完整材料 → 答案」呈現；題組閱讀保持同篇材料連續作答。 */
import { Check, ChevronRight, RotateCcw, Sparkles, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import ExamTimer from './ExamTimer';
import HintSatchel from './HintSatchel';
import UnitResultSummary from './UnitResultSummary';
import { pauseExamTimer } from '../lib/examTimerStore';

const shuffle = (items) => { const copied = [...items]; for (let index = copied.length - 1; index > 0; index -= 1) { const swapIndex = Math.floor(Math.random() * (index + 1)); [copied[index], copied[swapIndex]] = [copied[swapIndex], copied[index]]; } return copied; };
const createSession = (unit) => unit.passageSets?.length ? shuffle(unit.passageSets).flatMap((set) => shuffle(set.questions)) : shuffle(unit.questions);

function Frame({ unit, label }) {
  return <header className="activity-workbench-frame"><span className="activity-file-tab">{unit.grade}<br />中文</span><div className="activity-brand-lockup"><span className="activity-brand-mark"><i></i><i></i><i></i><Sparkles size={18} /></span><div><b>Edu<span>Quest</span></b><small>小學課堂展示版</small></div></div><div className="activity-course-file"><span>{unit.grade}・中國語文</span><b>{unit.area}・{unit.title}</b></div><ExamTimer /><div className="activity-task-stamp"><span>課堂工作紙</span><b>{label}</b></div></header>;
}

function Celebration() { return <div className="celebration-burst" aria-hidden="true"><i>★</i><i>✦</i><i>●</i><i>✦</i><i>★</i></div>; }

export default function P3StudyActivity({ unit, onBack, onComplete }) {
  const [questions, setQuestions] = useState(() => createSession(unit));
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [round, setRound] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const question = questions[questionIndex];
  const isInfo = unit.interaction === 'p3-reading';
  const isFigure = unit.interaction === 'p3-figure' && ['比喻', '擬人', '排比'].includes(unit.figureType);
  const isWriting = unit.area === '寫作';
  const isExam = ['P4', 'P5', 'P6'].includes(unit.grade);
  const passageSet = unit.passageSets?.find((set) => set.id === question.passageId);
  const passageIndex = passageSet ? unit.passageSets.findIndex((set) => set.id === passageSet.id) : -1;
  const passageQuestionIndex = passageSet ? questions.slice(0, questionIndex + 1).filter((item) => item.passageId === passageSet.id).length : 0;
  const choices = useMemo(() => shuffle(question.choices), [question, round]);
  const sourceText = passageSet ? passageSet.text : isInfo ? question.text : question.hint || question.context;
  const sourceLabel = passageSet ? passageSet.type : isInfo ? '閱讀材料' : question.hint?.startsWith('句子：') ? '句子' : isWriting ? '寫作材料' : isFigure ? `${unit.figureType}小提示` : '題目材料';
  const satchelHint = question.hintSatchel || (passageSet ? '先完整閱讀材料，再圈出題目中的關鍵詞；回答深層題時，必須綜合人物行動、關鍵句與事件結果。' : isInfo ? '先讀題目中的關鍵詞，再回到短文找出直接回答問題的句子；不要只憑生活常識猜答案。' : isWriting ? '先圈出題目要求的文體、段落角色或寫作技巧；再檢查選項是否同時符合內容和表達目的。' : isExam ? '先找題目問的是字詞、句式、主旨還是寫法；再把材料換成自己的話，排除只寫表面字眼的選項。' : '先看題目要找的語文線索，再用材料中的關鍵詞逐一核對選項。');

  const reset = () => { setSelected(null); setFeedback(null); setRound((value) => value + 1); };
  const replay = () => { setQuestions(createSession(unit)); setQuestionIndex(0); setShowSummary(false); setAttempts(0); setCorrectCount(0); reset(); };
  const answer = (choice) => { if (feedback) return; const correct = choice === question.answer; setSelected(choice); setAttempts((value) => value + 1); if (correct) setCorrectCount((value) => value + 1); setFeedback({ correct }); };
  const next = () => { if (questionIndex >= questions.length - 1) { pauseExamTimer(); onComplete?.(unit); setShowSummary(true); return; } setQuestionIndex((value) => value + 1); reset(); };

  if (showSummary) return <main className="site-shell p3-study-page"><Frame unit={unit} label="結算" /><Celebration /><UnitResultSummary unit={unit} total={questions.length} correct={correctCount} attempts={attempts} onBack={onBack} onReplay={replay} title={`${unit.grade}${isWriting ? '寫作' : '閱讀'}任務完成`} description={isWriting ? `你已完成「${unit.title}」的呈分試線索練習。` : `你已完成「${unit.title}」的閱讀線索操練。`} /></main>;

  return <main className="site-shell p3-study-page"><Frame unit={unit} label={`任務 ${questionIndex + 1} / ${questions.length}`} /><header className="match-topbar"><button onClick={onBack} className="match-back">返回中文目錄</button><div><span>{unit.area}・{unit.title}</span><b>第 {questionIndex + 1} / {questions.length} 題</b></div><div className="match-progress"><i style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }} /></div></header><section className="p3-study-stage"><div className="match-heading"><h1>{question.prompt}</h1></div>{passageSet && <div className="passage-set-meta"><span>題組 {passageIndex + 1} / {unit.passageSets.length}</span><b>{passageSet.title}</b><small>本篇第 {passageQuestionIndex} / {passageSet.questions.length} 題</small></div>}<section className={`p3-source-card ${passageSet || isInfo ? 'info-source' : 'idiom-source'} ${passageSet ? 'passage-source' : ''}`}><div><span>{sourceLabel}</span>{(passageSet || isInfo) && <b>{passageSet?.title || question.title}</b>}</div><p>{sourceText}</p></section><HintSatchel hint={satchelHint} title={unit.id === 'P6-CN-R01' ? '文言拆句三步法' : passageSet ? '題組找線索' : '拆題提示'} /><section className="p3-choice-bank"><div className="bank-title"><span>選擇答案</span></div><div data-option-safety-grid="true" data-question-id={question.id} data-answer-value={String(question.answer)}>{choices.map((choice, index) => <button key={choice} data-choice-value={String(choice)} disabled={Boolean(feedback)} onClick={() => answer(choice)} className={selected === choice ? feedback?.correct ? 'selected-correct' : 'selected-wrong' : ''}><span>{String.fromCharCode(65 + index)}</span><b>{choice}</b></button>)}</div></section>{feedback && <div className={`p3-feedback ${feedback.correct ? 'correct' : 'incorrect'}`}>{feedback.correct ? <><Check size={20} /><div><b>答對了！</b><p>{question.explanation}</p></div></> : <><X size={20} /><div><b>再看看題目中的線索。</b><p>{passageSet ? '請回到全文，找出人物行動、轉折和結尾所提示的意思。' : isExam ? '請回到材料，圈出與題目要求直接相關的關鍵詞。' : isWriting ? '留意題目要求的段落角色、感官或記敘要素。' : isInfo ? '答案可以從短文中找到。' : isFigure ? '留意提示中的手法特點，再找出最符合的句子。' : '重讀材料中的關鍵詞，再作答。'}</p></div></>}<div className="complete-actions">{feedback.correct ? <button onClick={next}>{questionIndex === questions.length - 1 ? '查看結算' : '下一題'} <ChevronRight size={17} /></button> : <button onClick={reset}><RotateCcw size={16} /> 重新作答</button>}<button onClick={onBack} className="back-to-catalog">返回題目板</button></div></div>}</section></main>;
}
