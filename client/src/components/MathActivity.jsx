/* 彩色課程工作檯：數學用草綠連續紙軌、硬幣、分組與分數圖材，配合教師計時及結算。 */
// WELIT classroom「彩色課程工作檯」：數學活動以草綠工作紙呈現，頂部只保留年級、單元與目前題號。
import { ArrowLeft, Check, ChevronRight, RotateCcw, Sparkles, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { pauseExamTimer } from '../lib/examTimerStore';
import ExamTimer from './ExamTimer';
import HighMathWorkedSteps from './HighMathWorkedSteps';
import HintSatchel from './HintSatchel';
import UnitResultSummary from './UnitResultSummary';
import { playModelSound } from '../lib/feedbackAudio';
import FormalMathText from './FormalMathText';
import '../mathLearning.css';
import '../mathChoiceModels.css';
import '../shapeIllustrations.css';

const objectLabels = { apple: '蘋果', pencil: '筆', book: '書本', biscuit: '餅乾', orange: '橙', flower: '花朵', chair: '椅子', sticker: '貼紙', pupil: '學生', ball: '球', sweet: '糖果', bead: '珠', flag: '旗', dot: '物件' };
const shuffle = (items) => { const shuffled = [...items]; for (let index = shuffled.length - 1; index > 0; index -= 1) { const swapIndex = Math.floor(Math.random() * (index + 1)); [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]]; } return shuffled; };
const gradeLabel = (grade) => ({ P1: '小一', P2: '小二', P3: '小三', P4: '小四', P5: '小五', P6: '小六' }[grade] || grade);
const tips = { 'math-number-line': '先看每一格代表多少，再由起點向右數到目標數字。', 'math-ten-frame': '先逐格數清楚；湊十時，空格數量就是還需要的數量。', 'math-choice': '先看圖中的數量或分組，再用算式或心算檢查答案。', 'math-measurement': '先看清楚刻度和指針，再決定要量度的數值或時間。' };
const readMathWorkedHints = () => {
  try {
    const settings = JSON.parse(window.localStorage.getItem('eduquest-feedback-settings') || '{}');
    return settings.mathHintsConfigured === true && settings.showMathWorkedHints === true;
  } catch { return false; }
};
function useMathWorkedHints() {
  const [showMathWorkedHints, setShowMathWorkedHints] = useState(readMathWorkedHints);
  useEffect(() => {
    const sync = (event) => setShowMathWorkedHints(event.detail?.showMathWorkedHints === true);
    window.addEventListener('eduquest-feedback-settings', sync);
    return () => window.removeEventListener('eduquest-feedback-settings', sync);
  }, []);
  return showMathWorkedHints;
}
function MathFrame({ unit, questionLabel, showMathWorkedHints = false }) {
  const grade = unit.id.split('-')[0];
  return <><header className="activity-workbench-frame math-activity-frame"><span className="activity-file-tab">{grade}<br />MATH</span><div className="activity-brand-lockup"><span className="activity-brand-mark"><i></i><i></i><i></i><Sparkles size={18} /></span><div><b>WELIT <span>classroom</span></b><small>數學課堂檔案</small></div></div><div className="activity-course-file"><span>{gradeLabel(grade)}數學 · 操作工作紙</span><b>{unit.title}</b>{questionLabel ? <small className="math-file-status">{questionLabel}　·　看模型 → 作答</small> : null}<i className="math-file-stamp">✦ WELIT classroom · MATH FILE</i></div>{questionLabel && <ExamTimer />}</header>{questionLabel && showMathWorkedHints ? <HintSatchel title={unit.hintTitle || '數學解題錦囊'} hint={unit.hint || tips[unit.interaction]} steps={unit.hintSteps || []} /> : null}</>;
}

function NumberLine({ line, selected, onSelect, disabled }) {
  const values = []; for (let value = line.start; value <= line.end; value += line.step) values.push(value);
  const compact = values.length > 11; const mobileInterval = Math.max(1, Math.ceil((values.length - 1) / 4));
  return <section className="math-visual-card number-line-card"><div className="math-visual-head"><span>數線</span><small>每格代表 {line.step}</small></div><div className="number-line-track" aria-label={`${line.start} 至 ${line.end} 的數線`}>{values.map((value, index) => { const mobileLabel = index === 0 || index === values.length - 1 || index % mobileInterval === 0; return <button type="button" key={value} disabled={disabled} className={`${selected === value ? 'selected' : ''} ${mobileLabel ? 'mobile-label' : ''} ${index % (compact ? 2 : 1) === 0 ? 'labelled' : ''}`} onClick={() => onSelect(value)}><i></i><b>{index % (compact ? 2 : 1) === 0 ? value.toLocaleString() : ''}</b></button>; })}</div><p>點選你認為正確的數線刻度。</p></section>;
}

function TenFrame({ frame, selectedFill, onToggle, disabled }) {
  const emptyCount = Math.max(0, 10 - frame.initial);
  return <section className="math-visual-card ten-frame-card"><div className="math-visual-head"><span>十格框</span><small>{frame.removed ? `已劃走 ${frame.removed} 個` : `可加入 ${emptyCount} 個`}</small></div><div className="ten-frame-grid" aria-label="十格框">{Array.from({ length: 10 }, (_, index) => { const isFilled = index < frame.initial; const isRemoved = frame.removed && index < frame.removed; const isAdded = !frame.removed && selectedFill.has(index); const selectable = !isFilled && !frame.removed; return <button type="button" key={index} disabled={disabled || !selectable} onClick={() => selectable && onToggle(index)} className={`${isFilled ? 'filled' : ''} ${isRemoved ? 'removed' : ''} ${isAdded ? 'added' : ''}`} aria-label={`第 ${index + 1} 格${isFilled ? '已有點' : isAdded ? '已加入點' : '空格'}`}>{(isFilled && !isRemoved) || isAdded ? <i>●</i> : isRemoved ? <i>×</i> : null}</button>; })}</div>{!frame.removed ? <p>點選空格加入點，再按「以十格框作答」。</p> : <p>紅色格表示已劃走，數一數餘下的綠色點。</p>}</section>;
}

function CoinPicture({ coins }) { return <section className="math-picture-card coin-picture" aria-label="香港硬幣組合圖解"><div className="math-visual-head"><span>香港硬幣組合</span><small>看面值，再合計</small></div><div className="coin-combination">{coins.map((coin, index) => <span key={`${coin}-${index}`} className={`hk-coin coin-${coin}`}>${coin}</span>)}</div><p>圖中硬幣合起來共有多少元？</p></section>; }
function GroupPicture({ visual, share = false }) { const total = visual.groups * visual.each + (visual.remainder || 0); return <section className="math-picture-card group-picture" aria-label={`${visual.groups} 組，每組 ${visual.each} 個 ${objectLabels[visual.kind] || '物件'}`}><div className="math-visual-head"><span>{share ? '平均分配圖' : '相同分組圖'}</span><small>{visual.groups} 組 × {visual.each} 個</small></div><div className="picture-groups">{Array.from({ length: visual.groups }, (_, group) => <div className="picture-group" key={group}>{Array.from({ length: visual.each }, (_, item) => <i key={item} className={`picture-token token-${visual.kind}`}></i>)}</div>)}</div>{visual.remainder ? <div className="picture-remainder"><i className={`picture-token token-${visual.kind}`}></i><span>餘下 {visual.remainder} 個</span></div> : null}<p>{share ? `共有 ${total} 個，已平均分成 ${visual.groups} 組。` : `每組都有 ${visual.each} 個相同物件。`}</p></section>; }
function FractionPicture({ visual, stripOnly = false }) { return <section className="math-picture-card fraction-picture" aria-label="分數條圖解"><div className="math-visual-head"><span>分數條圖解</span>{!stripOnly ? <small>已塗 {visual.filled} 份／共 {visual.total} 份</small> : null}</div><div className="fraction-strip" style={{ gridTemplateColumns: `repeat(${visual.total}, minmax(0, 1fr))` }}>{Array.from({ length: visual.total }, (_, index) => <i key={index} className={index < visual.filled ? 'filled' : ''}></i>)}</div>{!stripOnly ? <p>彩色部分表示 <b><FormalMathText text={visual.label} /></b>。</p> : null}</section>; }
function ShapeIllustration({ visual }) {
  const { shape, object, label } = visual;
  const art = shape === 'sphere' ? <svg viewBox="0 0 220 150" role="img" aria-label="圓滾滾的足球插畫"><defs><radialGradient id="sphere-shade" cx="34%" cy="28%"><stop stopColor="#fffdf0" offset="0" /><stop stopColor="#f8c857" offset=".16" /><stop stopColor="#e78d3e" offset=".64" /><stop stopColor="#b95a38" offset="1" /></radialGradient></defs><circle cx="110" cy="76" r="53" fill="url(#sphere-shade)" stroke="#8f5f38" strokeWidth="5" /><path d="M110 43l18 13-7 21h-22l-7-21zM85 61L71 74l10 19 18-5M135 61l14 13-10 19-18-5M94 98l8 18m16-18-8 18" fill="none" stroke="#fff9e5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="7" /></svg> : shape === 'cone' ? <svg viewBox="0 0 220 150" role="img" aria-label="尖頂的雪糕筒插畫"><ellipse cx="111" cy="117" rx="61" ry="17" fill="#d58a4c" stroke="#905635" strokeWidth="5" /><path d="M62 113L110 27l48 86z" fill="#f6b257" stroke="#905635" strokeLinejoin="round" strokeWidth="5" /><path d="M84 92l49-33M91 109l50-33" stroke="#fff0bb" strokeWidth="5" /></svg> : shape === 'cylinder' ? <svg viewBox="0 0 220 150" role="img" aria-label="圓柱形汽水罐插畫"><path d="M64 37h92v79c0 17-92 17-92 0z" fill="#69c4e8" stroke="#3b7395" strokeWidth="5" /><ellipse cx="110" cy="37" rx="46" ry="16" fill="#d8f4ff" stroke="#3b7395" strokeWidth="5" /><ellipse cx="110" cy="116" rx="46" ry="16" fill="#4e9fc5" stroke="#3b7395" strokeWidth="5" /><rect x="91" y="52" width="38" height="48" rx="7" fill="#f7f1d7" /><path d="M102 63h16M102 73h16M102 83h16" stroke="#4e9fc5" strokeWidth="4" strokeLinecap="round" /></svg> : shape === 'triangle' ? <svg viewBox="0 0 220 150" role="img" aria-label="三角形插畫"><path d="M110 22l77 106H33z" fill="#f6bd58" stroke="#a96d2e" strokeLinejoin="round" strokeWidth="6" /><circle cx="110" cy="22" r="5" fill="#fff8df" /><circle cx="33" cy="128" r="5" fill="#fff8df" /><circle cx="187" cy="128" r="5" fill="#fff8df" /></svg> : shape === 'rectangle' ? <svg viewBox="0 0 220 150" role="img" aria-label="長方形插畫"><rect x="30" y="35" width="160" height="80" rx="5" fill="#77c99a" stroke="#33785a" strokeWidth="6" /><path d="M48 51h124v48H48z" fill="#e9fff1" stroke="#b3e3c6" strokeWidth="4" /><path d="M43 45h14v14M177 45h-14v14M43 105h14v-14M177 105h-14v-14" fill="none" stroke="#33785a" strokeWidth="4" /></svg> : shape === 'square' ? <svg viewBox="0 0 220 150" role="img" aria-label="正方形便條紙插畫"><rect x="62" y="25" width="96" height="96" rx="5" fill="#ffda6b" stroke="#b77a2d" strokeWidth="6" /><path d="M78 49h64M78 69h48M78 89h58" stroke="#fff7d4" strokeLinecap="round" strokeWidth="7" /></svg> : <svg viewBox="0 0 220 150" role="img" aria-label="圓形插畫"><circle cx="110" cy="75" r="53" fill="#74c6ef" stroke="#397b9e" strokeWidth="6" /><circle cx="91" cy="56" r="13" fill="#dff7ff" /></svg>;
  return <section className="math-picture-card shape-illustration-card" aria-label={`圖形插畫：${label || object || shape}`}><div className="math-visual-head"><span>看圖辨認</span><small>先觀察外形</small></div><div className={`shape-illustration shape-${shape}`}>{art}</div><p>{object ? `圖中是一件「${object}」。它最像哪一種圖形？` : '觀察圖中的邊和角，再選擇圖形名稱。'}</p></section>;
}
function MeasurementPicture({ visual }) { if (visual.type === 'ruler') { const start = visual.startValue || 0; return <section className="math-picture-card measure-picture"><div className="math-visual-head"><span>刻度尺圖解</span><small>1 格 = 1 cm</small></div><div className="ruler-graphic"><i style={{ left: `${(start / visual.max) * 100}%`, width: `${((visual.value - start) / visual.max) * 100}%` }}></i>{Array.from({ length: visual.max / 5 + 1 }, (_, index) => <b key={index} style={{ left: `${(index * 5 / visual.max) * 100}%` }}>{index * 5}</b>)}</div><p>{visual.startValue ? `由 ${visual.startValue} cm 量至 ${visual.value} cm。` : `物件由 0 cm 量至 ${visual.value} cm。`}</p></section>; } if (visual.type === 'cup') return <section className="math-picture-card measure-picture"><div className="math-visual-head"><span>量杯圖解</span><small>容量刻度</small></div><div className="cup-graphic"><i style={{ height: `${(visual.value / visual.max) * 100}%` }}></i><b>{visual.value} mL</b>{visual.startValue && <small>原有 {visual.startValue} mL</small>}</div><p>液面顯示 {visual.value} mL。</p></section>; if (visual.type === 'clock') { const minuteAngle = visual.minute * 6; const hourAngle = ((visual.hour % 12) * 30) + (visual.minute * .5); return <section className="math-picture-card measure-picture"><div className="math-visual-head"><span>時鐘圖解</span><small>{visual.endHour !== undefined ? '比較開始與結束時間' : '讀出指針位置'}</small></div><div className="clock-set"><div className="clock-graphic"><i className="hour-hand" style={{ transform: `rotate(${hourAngle}deg)` }}></i><i className="minute-hand" style={{ transform: `rotate(${minuteAngle}deg)` }}></i><b>12</b><b>3</b><b>6</b><b>9</b></div>{visual.endHour !== undefined && <span className="clock-end">→ {String(visual.endHour).padStart(2, '0')}:{String(visual.endMinute).padStart(2, '0')}</span>}</div><p>開始時間：{String(visual.hour).padStart(2, '0')}:{String(visual.minute).padStart(2, '0')}。</p></section>; } return null; }
function MathPicture({ visual, stripOnlyFraction = false }) { if (!visual) return null; if (visual.type === 'coins') return <CoinPicture coins={visual.coins} />; if (visual.type === 'groups') return <GroupPicture visual={visual} />; if (visual.type === 'share') return <GroupPicture visual={visual} share />; if (visual.type === 'fraction') return <FractionPicture visual={visual} stripOnly={stripOnlyFraction} />; if (visual.type === 'shape-illustration') return <ShapeIllustration visual={visual} />; if (['ruler', 'cup', 'clock'].includes(visual.type)) return <MeasurementPicture visual={visual} />; return null; }
const getPairGroupingCount = (question) => {
  const countMatch = question.prompt.match(/有\s*(\d+)\s*(?:個|粒|張|支|本|隻|枝|塊|顆)/u);
  return countMatch && /兩(?:個|粒)一組/u.test(question.prompt) ? Number(countMatch[1]) : null;
};
const emptyPairGroups = (count) => Array.from({ length: Math.ceil(count / 2) }, () => []);
const getP1AdditionParts = (unit, question) => {
  if (unit.id === 'P1-MATH-A03') {
    const match = question.prompt.match(/^(\d+)\s*\+\s*(\d+)\s*=/u);
    if (!match) return null;
    const left = Number(match[1]); const right = Number(match[2]);
    return left + right <= 18 ? { mode: 'combine', left, right, total: left + right } : null;
  }
  if (unit.id === 'P1-MATH-A04') {
    const match = question.prompt.match(/^(\d+)\s*[−-]\s*(\d+)\s*=/u) || question.prompt.match(/有\s*(\d+)\s*個[^，。]*，(?:吃了|借出了|剪掉|走了)\s*(\d+)\s*個/u);
    if (!match) return null;
    const initial = Number(match[1]); const remove = Number(match[2]);
    return initial <= 18 && remove > 0 && initial > remove ? { mode: 'take-away', initial, remove, result: initial - remove } : null;
  }
  return null;
};
const getP1CoinValues = (unit, question) => unit.id === 'P1-MATH-A05' && question.visual?.type === 'coins' ? question.visual.coins : null;

function DragCollectionModel({ title, instruction, sourceLabel, targetLabel, tokens, kind, disabled, onCompletionChange }) {
  const [placed, setPlaced] = useState([]);
  const complete = placed.length === tokens.length;
  const place = (index) => {
    if (disabled || placed.includes(index)) return;
    const next = [...placed, index];
    setPlaced(next);
    onCompletionChange(next.length === tokens.length);
    playModelSound(next.length === tokens.length ? 'complete' : 'place');
  };
  const remove = (index) => {
    if (disabled) return;
    setPlaced((current) => current.filter((item) => item !== index));
    onCompletionChange(false);
    playModelSound('reset');
  };
  const reset = () => { if (!disabled && placed.length) { setPlaced([]); onCompletionChange(false); playModelSound('reset'); } };
  const available = tokens.map((token, index) => ({ token, index })).filter(({ index }) => !placed.includes(index));
  return <section className={`math-choice-model drag-collection-model ${complete ? 'complete' : ''}`} aria-label={title}><header><span>✦ WELIT classroom 數學模型</span><small>{complete ? '操作完成・可以選答案' : instruction}</small></header><div className="collection-drag-interaction"><section className="collection-token-pool" aria-label={sourceLabel}><span>{sourceLabel}</span><div>{available.map(({ token, index }) => <button type="button" key={index} draggable={!disabled} disabled={disabled} onDragStart={(event) => event.dataTransfer.setData('collection-token', String(index))} onClick={() => place(index)} className={`collection-token ${kind}`} aria-label={`${token}，點選加入${targetLabel}`}>{kind === 'counter' ? <i>●</i> : <b>{token}</b>}</button>) || <small>全部材料已放入托盤</small>}</div></section><section className={`collection-drop-zone ${complete ? 'full' : ''}`} aria-label={targetLabel} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); const index = Number(event.dataTransfer.getData('collection-token')); if (Number.isInteger(index)) place(index); }}><span>{targetLabel}</span><div>{placed.map((index) => <button type="button" key={index} disabled={disabled} onClick={() => remove(index)} className={`collection-token ${kind}`} aria-label={`${tokens[index]}，點選移回${sourceLabel}`}>{kind === 'counter' ? <i>●</i> : <b>{tokens[index]}</b>}</button>)}{Array.from({ length: Math.max(0, tokens.length - placed.length) }, (_, index) => <em key={`slot-${index}`}>＋</em>)}</div><small>{complete ? '已放齊所有材料' : `已放入 ${placed.length}／${tokens.length} 個材料`}</small></section></div><div className="math-model-note"><b>操作提示：</b><span>{complete ? `已把材料放入${targetLabel}，現在可核對答案。` : `把${sourceLabel}拖曳到${targetLabel}；平板可直接點選材料。`}</span><button type="button" className="reset-grouping" disabled={disabled || !placed.length} onClick={reset}>重設操作</button></div></section>;
}

function AdditionCollectionModel({ parts, disabled, onCompletionChange }) {
  if (parts.mode === 'take-away') return <SubtractionRemovalModel parts={parts} disabled={disabled} onCompletionChange={onCompletionChange} />;
  return <DragCollectionModel title="加法合併操作模型" instruction={`${parts.left} 個和 ${parts.right} 個合起來`} sourceLabel={`${parts.left} ＋ ${parts.right} 個數量點`} targetLabel="合起來的數量托盤" tokens={Array.from({ length: parts.total }, () => '數量點')} kind="counter" disabled={disabled} onCompletionChange={onCompletionChange} />;
}

function SubtractionRemovalModel({ parts, disabled, onCompletionChange }) {
  const [removed, setRemoved] = useState([]);
  const complete = removed.length === parts.remove;
  const move = (index) => {
    if (disabled || removed.includes(index) || removed.length >= parts.remove) return;
    const next = [...removed, index]; setRemoved(next); onCompletionChange(next.length === parts.remove); playModelSound(next.length === parts.remove ? 'complete' : 'place');
  };
  const restore = (index) => { if (disabled) return; setRemoved((current) => current.filter((item) => item !== index)); onCompletionChange(false); playModelSound('reset'); };
  const reset = () => { if (!disabled && removed.length) { setRemoved([]); onCompletionChange(false); playModelSound('reset'); } };
  const remaining = Array.from({ length: parts.initial }, (_, index) => index).filter((index) => !removed.includes(index));
  return <section className={`math-choice-model subtraction-removal-model ${complete ? 'complete' : ''}`} aria-label="移走物件減法操作模型"><header><span>✦ WELIT classroom 數學模型</span><small>{complete ? '已移走指定數量・可以選答案' : `由 ${parts.initial} 個物件移走 ${parts.remove} 個`}</small></header><div className="collection-drag-interaction"><section className="collection-token-pool" aria-label="原有物件"><span>原有 {parts.initial} 個物件</span><div>{remaining.map((index) => <button type="button" key={index} draggable={!disabled} disabled={disabled || complete} onDragStart={(event) => event.dataTransfer.setData('removal-token', String(index))} onClick={() => move(index)} className="collection-token counter" aria-label={`第 ${index + 1} 個物件，點選移走`}><i>●</i></button>)}</div><small>留在原處：{remaining.length} 個</small></section><section className={`collection-drop-zone removal-drop-zone ${complete ? 'full' : ''}`} aria-label="移走托盤" onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); const index = Number(event.dataTransfer.getData('removal-token')); if (Number.isInteger(index)) move(index); }}><span>移走托盤</span><div>{removed.map((index) => <button type="button" key={index} disabled={disabled} onClick={() => restore(index)} className="collection-token counter removed-token" aria-label={`第 ${index + 1} 個物件，點選放回原處`}><i>●</i></button>)}{Array.from({ length: Math.max(0, parts.remove - removed.length) }, (_, index) => <em key={`slot-${index}`}>－</em>)}</div><small>{complete ? `已移走 ${parts.remove} 個，剩下 ${parts.result} 個` : `已移走 ${removed.length}／${parts.remove} 個`}</small></section></div><div className="math-model-note"><b>操作提示：</b><span>{complete ? `由 ${parts.initial} 個移走 ${parts.remove} 個，現在剩下 ${parts.result} 個。` : `把 ${parts.remove} 個物件拖入移走托盤；平板可直接點選物件。`}</span><button type="button" className="reset-grouping" disabled={disabled || !removed.length} onClick={reset}>重設操作</button></div></section>;
}

function CoinCollectionModel({ coins, disabled, onCompletionChange }) {
  return <DragCollectionModel title="港幣硬幣合計操作模型" instruction="把硬幣放進付款托盤，再合計面值" sourceLabel="桌上的港幣硬幣" targetLabel="付款托盤" tokens={coins.map((value) => `$${value}`)} kind="coin" disabled={disabled} onCompletionChange={onCompletionChange} />;
}

function ChoiceMathModel({ question, groups, onGroupsChange, onGroupingFeedback, disabled }) {
  const count = getPairGroupingCount(question);
  const isPairing = Boolean(count);
  const isParity = /單數|雙數/u.test(question.prompt);
  if (isPairing) {
    const safeGroups = groups.length === Math.ceil(count / 2) ? groups : emptyPairGroups(count);
    const placed = new Set(safeGroups.flat());
    const pool = Array.from({ length: count }, (_, index) => index).filter((token) => !placed.has(token));
    const complete = pool.length === 0;
    const moveToken = (token, targetGroup) => {
      const next = safeGroups.map((group) => group.filter((item) => item !== token));
      if (targetGroup !== null) {
        if (next[targetGroup].length >= 2) { onGroupingFeedback?.('retry'); return; }
        next[targetGroup] = [...next[targetGroup], token];
      }
      onGroupsChange(next);
      if (targetGroup !== null) {
        const placedCount = next.flat().length;
        onGroupingFeedback?.(next[targetGroup].length === 2 ? (placedCount === count ? 'complete' : 'pair') : 'needs-more');
      }
    };
    const placeByClick = (token) => {
      const targetGroup = safeGroups.findIndex((group) => group.length < 2);
      if (targetGroup >= 0) moveToken(token, targetGroup);
    };
    return <section className={`math-choice-model grouping-model ${complete ? 'complete' : ''}`} aria-label={`${count} 個物件的兩個一組模型`}><header><span>✦ WELIT classroom 數學模型</span><small>{complete ? '已完成分組・可以選答案' : '拖曳物件到方格；也可點一下物件'}</small></header><div className="grouping-interaction"><section className="group-token-pool" aria-label="待分組物件"><span>待分組物件</span><div>{pool.map((token) => <button type="button" key={token} draggable={!disabled} disabled={disabled} onDragStart={(event) => event.dataTransfer.setData('group-token', String(token))} onClick={() => placeByClick(token)} aria-label={`第 ${token + 1} 個物件，點選加入下一組`}><i>●</i></button>) || <small>全部物件已放入方格</small>}</div></section><section className="group-drop-zones" aria-label="兩個一組的分組方格">{safeGroups.map((group, index) => <div key={index} className={`pair-drop-zone ${group.length === 2 ? 'full' : ''} ${group.length === 1 ? 'one-left' : ''}`} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); const token = Number(event.dataTransfer.getData('group-token')); if (Number.isInteger(token)) moveToken(token, index); }}><span>第 {index + 1} 組</span><div>{group.map((token) => <button type="button" key={token} disabled={disabled} onClick={() => moveToken(token, null)} aria-label={`第 ${token + 1} 個物件，點選移回待分組區`}><i>●</i></button>)}{Array.from({ length: Math.max(0, 2 - group.length) }, (_, slot) => <em key={`slot-${slot}`}>＋</em>)}</div><small>{group.length === 2 ? '已成一組' : group.length === 1 ? '還差 1 個' : '放入 2 個物件'}</small></div>)}</section></div><div className="math-model-note"><b>{complete ? '分組完成：' : '分組任務：'}</b><span>{complete ? '每個物件已放入方格，現在可比較「剛好分完」或「餘下 1 個」。' : `先把 ${count} 個物件分成每組 2 個；每一格最多放 2 個。`}</span><button type="button" className="reset-grouping" disabled={disabled || pool.length === count} onClick={() => { onGroupsChange(emptyPairGroups(count)); onGroupingFeedback?.('reset'); }}>重設分組</button></div></section>;
  }
  if (isParity) return <section className="math-choice-model parity-model" aria-label="單數與雙數配對模型"><header><span>✦ WELIT classroom 數學模型</span><small>兩個一組的配對規則</small></header><div className="parity-pairs"><div>{[1, 2, 3, 4].map((item) => <i key={item}>●</i>)}</div><b>✓ 剛好配對</b><div>{[1, 2, 3, 4, 5].map((item) => <i key={item}>●</i>)}</div><b>● 最後剩 1 個</b></div><div className="math-model-note"><b>配對提示：</b><span>沒有剩下是雙數；最後剩 1 個是單數。</span></div></section>;
  const calculation = question.prompt.match(/(\d+)\s*([＋+−-])\s*(\d+)/u);
  if (!calculation) return null;
  return <section className="math-choice-model calculation-model" aria-label="數學計算提示"><header><span>✦ WELIT classroom 算式提示</span><small>先讀算式，再選答案</small></header><div className="visible-calculation-frame" aria-label="可見算式"><span>{calculation[1]}</span><b>{calculation[2]}</b><span>{calculation[3]}</span><i>=</i><em>？</em></div><div className="math-model-note"><b>看題目：</b><span>先說出運算關係，再用心算或草稿核對選項。</span></div></section>;
}

function MathKnownData({ question }) {
  const explicitKnown = Array.isArray(question.lifeModel?.known) ? question.lifeModel.known : [];
  const fractions = [...new Set([...question.prompt.matchAll(/\d+\s*\/\s*\d+/g)].map((match) => match[0].replace(/\s+/g, '')))];
  const values = [...new Set((question.prompt.replace(/\d+\s*\/\s*\d+/g, ' ').match(/\d+(?:\.\d+)?/g) || []))];
  const visual = question.visual;
  const visualKnown = visual?.type === 'coins' ? [`圖中硬幣面值：${visual.coins.map((value) => `$${value}`).join('、')}`] : visual?.type === 'groups' || visual?.type === 'share' ? [`${visual.groups} 組，每組 ${visual.each} 個${visual.kind ? objectLabels[visual.kind] || '物件' : ''}`] : visual?.type === 'fraction' ? [`整體分成 ${visual.total} 份，其中 ${visual.filled} 份已塗色`] : visual?.type === 'shape-illustration' ? [`圖中物件：${visual.object || visual.label || '圖形插畫'}`, '觀察物件的外形。'] : visual?.type === 'ruler' ? [`刻度由 ${visual.startValue || 0} cm 至 ${visual.value} cm`] : visual?.type === 'cup' ? [`量杯液面：${visual.value} mL`] : visual?.type === 'clock' ? [`開始時間：${String(visual.hour).padStart(2, '0')}:${String(visual.minute).padStart(2, '0')}`] : question.frame ? [`十格框已有 ${question.frame.initial} 個點${question.frame.removed ? `，已劃走 ${question.frame.removed} 個` : ''}`] : question.line ? [`數線範圍：${question.line.start} 至 ${question.line.end}，每格 ${question.line.step}`] : [];
  const known = explicitKnown.length ? explicitKnown : [...visualKnown, ...(fractions.length ? [`題目中的分數：${fractions.join('、')}`] : []), ...(values.length ? [`題目中的數字：${values.join('、')}`] : []), ...(visualKnown.length || fractions.length || values.length ? ['先分辨題目要你求甚麼。'] : ['先找出題目提供的資料。', '再圈出要回答的量與單位。'])];
  return <aside className="math-known-data" aria-label="題目已知資料"><header><span>已知資料</span><small>先圈重點，再作答</small></header><ul>{known.map((item) => <li key={item}><FormalMathText text={item} /></li>)}</ul></aside>;
}

function LifeApplicationModel({ question }) {
  const model = question.lifeModel || { known: ['圈出題目中的數字', '確認答案所需單位'], steps: ['先求中間量', '再代入下一步算式', '最後核對答案'], check: '把答案代回生活情境，檢查數值大小與單位。' };
  return <section className="life-application-model" aria-label="生活應用解題模型"><header><span><Sparkles size={17} /> WELIT classroom 解題模型</span><small>看見關係，再選答案</small></header><div className="life-model-known"><b>已知量</b><div>{model.known.map((item) => <span key={item}><FormalMathText text={item} /></span>)}</div></div><div className="life-model-route" aria-label="解題算式路徑">{model.steps.map((step, index) => <div key={step}><b>{index + 1}</b><span><FormalMathText text={step} /></span>{index < model.steps.length - 1 ? <i>→</i> : null}</div>)}</div><footer><b>✦ 核對</b><span><FormalMathText text={model.check} /></span></footer></section>;
}

export default function MathActivity({ unit: incomingUnit, onBack, onComplete }) {
  const unit = { ...incomingUnit, examMode: incomingUnit.examMode || ['P4', 'P5', 'P6'].includes(incomingUnit.id?.split('-')[0]) };
  const showMathWorkedHints = useMathWorkedHints();
  const [questions, setQuestions] = useState(() => shuffle(unit.questions)); const [questionIndex, setQuestionIndex] = useState(0); const [selected, setSelected] = useState(null); const [feedback, setFeedback] = useState(null); const [shuffleRound, setShuffleRound] = useState(0); const [frameFill, setFrameFill] = useState(new Set()); const [modelGroups, setModelGroups] = useState([]); const [modelComplete, setModelComplete] = useState(false); const [showSummary, setShowSummary] = useState(false); const [attempts, setAttempts] = useState(0); const [correctCount, setCorrectCount] = useState(0);
  const question = questions[questionIndex]; const choices = useMemo(() => question.choices ? shuffle(question.choices) : [], [question, shuffleRound]);
  const retry = () => { setSelected(null); setFeedback(null); setShuffleRound((round) => round + 1); setFrameFill(new Set()); setModelGroups([]); setModelComplete(false); };
  const answer = (choice) => { if (feedback) return; const correct = choice === question.answer; setSelected(choice); setAttempts((count) => count + 1); if (correct) setCorrectCount((count) => count + 1); setFeedback({ correct }); };
  const toggleFrame = (index) => setFrameFill((current) => { const next = new Set(current); if (next.has(index)) next.delete(index); else next.add(index); return next; });
  const next = () => { if (questionIndex >= questions.length - 1) { pauseExamTimer(); onComplete?.(unit, questions.map((item) => item.id)); setShowSummary(true); return; } setQuestionIndex((index) => index + 1); retry(); };
  const replay = () => { setQuestions(shuffle(unit.questions)); setQuestionIndex(0); setSelected(null); setFeedback(null); setShuffleRound(0); setFrameFill(new Set()); setModelGroups([]); setModelComplete(false); setShowSummary(false); setAttempts(0); setCorrectCount(0); };
  if (showSummary) return <main className="site-shell math-activity-page"><MathFrame unit={unit} showMathWorkedHints={showMathWorkedHints} /><UnitResultSummary unit={unit} total={questions.length} correct={correctCount} attempts={attempts} onBack={onBack} onReplay={replay} title="數學任務完成" description="本單元已完成。教師可利用答對題數、正確率和已計時間，安排重溫或下一個數與代數任務。" noun="題" backLabel="返回數學目錄" /></main>;
  const isFrameAdd = unit.interaction === 'math-ten-frame' && !question.frame.removed;
  const groupingCount = getPairGroupingCount(question);
  const activeGroups = groupingCount && modelGroups.length === Math.ceil(groupingCount / 2) ? modelGroups : groupingCount ? emptyPairGroups(groupingCount) : [];
  const groupingComplete = !groupingCount || activeGroups.flat().length === groupingCount;
  const additionParts = getP1AdditionParts(unit, question);
  const coinValues = getP1CoinValues(unit, question);
  const requiresManipulative = Boolean(additionParts || coinValues);
  const answerLocked = (groupingCount && !groupingComplete) || (requiresManipulative && !modelComplete);
  const visualType = additionParts?.mode === 'take-away' ? '移走減法' : additionParts ? '拖曳加法' : coinValues ? '硬幣合計操作' : unit.interaction === 'math-number-line' ? '數線互動' : unit.interaction === 'math-ten-frame' ? '十格框互動' : question.visual ? '看圖解題' : '數學練習';
  const hasChoiceModel = Boolean(groupingCount) || /單數|雙數/u.test(question.prompt) || /(\d+)\s*([＋+−-])\s*(\d+)/u.test(question.prompt);
  const activityMaterial = unit.interaction === 'math-life-application' ? <LifeApplicationModel question={question} /> : unit.interaction === 'math-number-line' ? <NumberLine line={question.line} selected={selected} disabled={Boolean(feedback)} onSelect={answer} /> : unit.interaction === 'math-ten-frame' ? <TenFrame frame={question.frame} selectedFill={frameFill} onToggle={toggleFrame} disabled={Boolean(feedback)} /> : additionParts ? <AdditionCollectionModel key={`${question.id}-${shuffleRound}`} parts={additionParts} disabled={Boolean(feedback)} onCompletionChange={setModelComplete} /> : coinValues ? <CoinCollectionModel key={`${question.id}-${shuffleRound}`} coins={coinValues} disabled={Boolean(feedback)} onCompletionChange={setModelComplete} /> : question.visual ? <MathPicture visual={question.visual} stripOnlyFraction={unit.id === 'P3-MATH-A05'} /> : unit.interaction === 'math-choice' && hasChoiceModel ? <ChoiceMathModel question={question} groups={activeGroups} onGroupsChange={setModelGroups} onGroupingFeedback={playModelSound} disabled={Boolean(feedback)} /> : null;
  const isOptionalHintMaterial = unit.interaction === 'math-life-application' || (unit.interaction === 'math-choice' && hasChoiceModel && !groupingCount && !additionParts && !coinValues && !question.visual);
  const visibleActivityMaterial = !isOptionalHintMaterial || showMathWorkedHints ? activityMaterial : null;
  const isP3FractionIntro = unit.id === 'P3-MATH-A05';
  return <main className="site-shell math-activity-page"><MathFrame unit={unit} questionLabel={`第 ${questionIndex + 1}／${questions.length}`} showMathWorkedHints={showMathWorkedHints} /><nav className="math-activity-controls"><button onClick={onBack} className="match-back">返回數學目錄</button><div className="math-progress-readout"><b>第 {questionIndex + 1} 題</b><small>共 {questions.length} 題</small></div><div className="match-progress" aria-label={`進度 ${questionIndex + 1} / ${questions.length}`}><i style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }} /></div></nav><section className="math-activity-stage"><div className="math-heading"><span><Sparkles size={16} /> {visualType}</span><h1><FormalMathText text={question.prompt} /></h1>{showMathWorkedHints && !isP3FractionIntro ? <p>老師提示：{tips[unit.interaction]}</p> : null}</div>{showMathWorkedHints && !isP3FractionIntro ? <MathKnownData question={question} /> : null}{visibleActivityMaterial ? <section className={`math-worksheet ${question.visual || isFrameAdd || unit.interaction === 'math-number-line' || unit.interaction === 'math-choice' ? 'has-material' : 'answer-only'}`}>{visibleActivityMaterial}{isFrameAdd && !feedback ? <button className="math-frame-submit" onClick={() => answer(frameFill.size)}>以十格框作答 <ChevronRight size={17} /></button> : null}{answerLocked && !feedback ? <div className="math-answer-locked"><span>✦</span> {groupingCount ? '先完成兩個一組的分組，再開啟答案紙條。' : '先完成操作模型，再開啟答案紙條。'}</div> : null}</section> : null}{(!isFrameAdd || feedback) && unit.interaction !== 'math-number-line' && choices.length && !answerLocked ? <section className="math-answer-zone"><div className="bank-title"><span>選擇答案</span><small>每次開始會重新排列</small></div><div className="math-option-grid">{choices.map((choice, index) => <button key={String(choice)} data-choice-value={String(choice)} disabled={Boolean(feedback)} onClick={() => answer(choice)} className={selected === choice ? feedback?.correct ? 'selected-correct' : 'selected-wrong' : ''}><span>{String.fromCharCode(65 + index)}</span><b><FormalMathText text={choice} /></b></button>)}</div></section> : null}{feedback && <section className={`math-feedback ${feedback.correct ? 'correct' : 'incorrect'}`} role="status"><div>{feedback.correct ? <Check size={22} /> : <X size={22} />}</div><section><b>{feedback.correct ? '答對了！' : '這次還未選中正確答案。'}</b><p>{feedback.correct ? <FormalMathText text={question.explanation} /> : <>正確答案是 <strong><FormalMathText text={question.answer} /></strong>。<FormalMathText text={question.explanation} /></>}</p>{unit.examMode && showMathWorkedHints ? <HighMathWorkedSteps unit={unit} question={question} /> : null}<div className="complete-actions">{feedback.correct ? <button onClick={next}>{questionIndex === questions.length - 1 ? '查看結算' : '下一題'} <ChevronRight size={17} /></button> : <button onClick={retry}><RotateCcw size={16} /> 依提示再試</button>}<button onClick={onBack}><ArrowLeft size={16} /> 返回數學目錄</button></div></section></section>}</section></main>;
}
