/* 小二日記與書信格式工作紙：拖曳或點選格式卡至正確次序，逐步建立完整的實用文結構。 */
import { Check, ChevronRight, GripVertical, RotateCcw, Sparkles, Trophy, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import UnitResultSummary from './UnitResultSummary';
import { pauseExamTimer } from '../lib/examTimerStore';

const shuffle = (items) => { const copied = [...items]; for (let index = copied.length - 1; index > 0; index -= 1) { const swap = Math.floor(Math.random() * (index + 1)); [copied[index], copied[swap]] = [copied[swap], copied[index]]; } return copied; };
function Frame({ unit, label }) { const grade = unit.id.split('-')[0]; const gradeLabel = { P2: '小二', P6: '小六' }[grade] || grade; return <header className="activity-workbench-frame writing-workbench"><span className="activity-file-tab">{grade}<br />寫作</span><div className="activity-brand-lockup"><span className="activity-brand-mark"><i></i><i></i><i></i><Sparkles size={18} /></span><div><b>Edu<span>Quest</span></b><small>小學課堂展示版</small></div></div><div className="activity-course-file"><span>{gradeLabel}・中國語文</span><b>{unit.area}・{unit.title}</b></div><div className="activity-task-stamp"><span>課堂工作紙</span><b>{label}</b></div></header>; }
function Celebration() { return <div className="celebration-burst" aria-hidden="true"><i>★</i><i>✦</i><i>●</i><i>✦</i><i>★</i></div>; }

export default function FormatSortActivity({ unit, onBack, onComplete }) {
  const [questions, setQuestions] = useState(() => shuffle(unit.questions));
  const [questionIndex, setQuestionIndex] = useState(0);
  const [placed, setPlaced] = useState({});
  const [selectedId, setSelectedId] = useState(null);
  const [wrongId, setWrongId] = useState(null);
  const [round, setRound] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [wrongCount, setWrongCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const question = questions[questionIndex];
  const argumentMode = unit.sortMode === 'argument-evidence';
  const paragraphMode = unit.sortMode === 'paragraph-main-idea';
  const taskLabel = argumentMode ? '論證排序任務' : paragraphMode ? '段落大意排序' : '格式排序任務';
  const instruction = argumentMode ? '先找出立場，再把支持理由、解說和結論放到正確位置；也可以先點選論證卡，再點選右邊的空格。' : paragraphMode ? '先閱讀短文，再把各段大意按文章順序放好；也可以先點選段意卡，再點選右邊的空格。' : '把下方格式卡拖到正確位置；也可以先點選格式卡，再點選右邊的空格。';
  const slotLabels = argumentMode ? ['論點', '論據', '解說', '結論'] : paragraphMode ? question.blocks.map((_, index) => `第 ${index + 1} 段大意`) : question.blocks.map((_, index) => `第 ${index + 1} 部分`);
  const orderedBlocks = useMemo(() => shuffle(question.blocks), [question, round]);
  const completeCurrent = Object.keys(placed).length === question.blocks.length;
  const resetCurrent = () => { setPlaced({}); setSelectedId(null); setWrongId(null); setWrongCount(0); setRound((value) => value + 1); };
  const replay = () => { setQuestions(shuffle(unit.questions)); setQuestionIndex(0); setShowSummary(false); setCorrectCount(0); resetCurrent(); };
  const place = (blockId, slot) => {
    const block = question.blocks.find((item) => item.id === blockId);
    if (!block || placed[slot] || completeCurrent) return;
    if (block.order !== slot) { setWrongCount((value) => value + 1); setWrongId(blockId); window.setTimeout(() => setWrongId(null), 620); return; }
    const next = { ...placed, [slot]: block }; setPlaced(next); setSelectedId(null);
  };
  const next = () => { const nextCorrect = correctCount + (wrongCount === 0 ? 1 : 0); if (questionIndex >= questions.length - 1) { setCorrectCount(nextCorrect); pauseExamTimer(); onComplete?.(unit); setShowSummary(true); return; } setCorrectCount(nextCorrect); setQuestionIndex((value) => value + 1); resetCurrent(); };
  if (showSummary) return <main className="site-shell format-sort-page"><Frame unit={unit} label="結算" /><Celebration /><UnitResultSummary unit={unit} total={questions.length} correct={correctCount} attempts={questions.length} onBack={onBack} onReplay={replay} title={argumentMode ? '論證排序完成' : paragraphMode ? '段落大意排序完成' : '實用文格式完成'} description={argumentMode ? '你已練習把立場、支持理由、解說和結論組成完整的短論證。' : paragraphMode ? '你已練習從段落資料歸納重點，並按文章發展重組段意。' : '你已練習日記的日期、事情、感受，以及書信的稱呼、正文、祝福語和署名。'} noun="組" /></main>;
  return <main className="site-shell format-sort-page"><Frame unit={unit} label={`排序 ${questionIndex + 1} / ${questions.length}`} /><header className="match-topbar"><button onClick={onBack} className="match-back">返回中文目錄</button><div><span>{unit.area}・{unit.title}</span><b>第 {questionIndex + 1} / {questions.length} 題</b></div><div className="match-progress"><i style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }} /></div></header><section className={`format-sort-stage ${argumentMode ? 'argument-evidence-stage' : ''} ${paragraphMode ? 'paragraph-main-idea-stage' : ''}`}><div className="match-heading"><span><GripVertical size={16} /> {taskLabel}</span><h1>{question.title}</h1><p>{instruction}</p>{paragraphMode && <p className="sorting-source"><b>閱讀材料：</b>{question.source}</p>}</div><div className="format-sort-board"><section className="format-card-bank"><div className="bank-title"><span>{argumentMode ? '論證卡' : paragraphMode ? '段意卡' : '格式卡'}</span><small>拖曳或點選</small></div>{orderedBlocks.filter((block) => !Object.values(placed).some((item) => item.id === block.id)).map((block) => <button key={block.id} draggable onDragStart={(event) => event.dataTransfer.setData('text/plain', block.id)} onClick={() => setSelectedId(block.id)} className={`${selectedId === block.id ? 'selected' : ''} ${wrongId === block.id ? 'wrong' : ''}`}><GripVertical size={17} /><b>{block.text}</b></button>)}</section><section className="format-slots"><div className="bank-title"><span>{argumentMode ? '論證結構' : paragraphMode ? '文章段落順序' : '正確結構'}</span><small>{argumentMode ? '論點 → 論據 → 解說 → 結論' : paragraphMode ? '由第 1 段至最後一段' : `${question.type}・由上至下`}</small></div>{question.blocks.map((_, slot) => <button key={slot} onDragOver={(event) => event.preventDefault()} onDrop={(event) => place(event.dataTransfer.getData('text/plain'), slot)} onClick={() => selectedId && place(selectedId, slot)} className={`format-slot ${placed[slot] ? 'filled correct-pop' : ''}`}><span>{slot + 1}</span>{placed[slot] ? <b>{placed[slot].text}</b> : <em>放置「{slotLabels[slot]}」</em>}</button>)}</section></div>{wrongId && <div className="format-feedback incorrect"><X size={19} /><span>{argumentMode ? '這張卡未放在正確的論證位置，先分辨它是立場、理由、解說還是結論。' : paragraphMode ? '這張段意卡不屬於這一段，請再找出文章發展的線索。' : '這張格式卡不在這個位置，請再想想文章的次序。'}</span></div>}{completeCurrent && <div className="format-feedback correct"><Celebration /><Check size={20} /><div><b>{argumentMode ? '論證結構正確！' : paragraphMode ? '段落大意順序正確！' : '格式排序正確！'}</b><p>{question.explanation}</p></div><div className="complete-actions"><button onClick={resetCurrent}><RotateCcw size={16} /> 再排一次</button><button onClick={next}>{questionIndex === questions.length - 1 ? '查看結算' : '下一組'} <ChevronRight size={17} /></button><button onClick={onBack} className="back-to-catalog">返回題目板</button></div></div>}</section></main>;
}
