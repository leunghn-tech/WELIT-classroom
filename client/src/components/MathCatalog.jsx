// EduQuest「彩色課程工作檯」：數學目錄採草綠學習線；小一至小三可由教師選擇一般互動或全班合作打怪獸模式。
import { ArrowLeft, Calculator, ChevronRight, LayoutDashboard, Sparkles, Swords } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getMathQuestionBank } from '../data/questionBanks/math';
import ExamTimer from './ExamTimer';
import '../mathLearning.css';

const GRADES = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'];
const LOW_GRADES = ['P1', 'P2', 'P3'];
const LABELS = { P1: '小一', P2: '小二', P3: '小三', P4: '小四', P5: '小五', P6: '小六' };

function Brand() { return <div className="brand" aria-label="WelitQuest"><span className="brand-mark"><i></i><i></i><i></i><Sparkles size={24} /></span><span><b>Welit<span>Quest</span></b><small>小學課堂展示版</small></span></div>; }

function DifficultyMeter({ difficulty }) {
  if (!difficulty) return null;
  return <span className={`unit-difficulty unit-difficulty-level-${difficulty.level}`} aria-label={`難度：${difficulty.label}，${difficulty.level} 級（共三級）`} title={difficulty.note}><i aria-hidden="true">{[1, 2, 3].map((step) => <u className={step <= difficulty.level ? 'filled' : ''} key={step} />)}</i><em>難度 {difficulty.label}</em></span>;
}

function UnitCard({ unit, completedUnits, classroomMode, examMode, onStart, featured = false }) {
  const progress = completedUnits[unit.id];
  const completed = Math.min(Array.isArray(progress) ? progress.length : progress || 0, unit.questions.length);
  const percent = Math.round((completed / unit.questions.length) * 100);
  const interactionLabel = unit.interaction === 'math-number-line' ? '數線互動' : unit.interaction === 'math-ten-frame' ? '十格框互動' : unit.interaction === 'math-equal-groups' ? '等量分組' : unit.interaction === 'math-sharing' ? '平均分配' : unit.interaction === 'math-sharing-remainder' ? '有餘數分配' : unit.interaction === 'math-life-application' ? '生活情境・分步提示' : '應用練習';
  return <button className={`math-unit-card ${featured ? 'life-application-card' : ''}`} onClick={() => onStart(unit)}><div><span>{featured ? '小六整合題組' : classroomMode === 'team-battle' ? '全班合力題組' : examMode ? '呈分試題組' : interactionLabel}</span><DifficultyMeter difficulty={unit.difficulty} /><b>{unit.questions.length} 題</b></div><h3>{unit.title}</h3><p>{unit.objective}</p><footer><small>{completed ? `${completed} 題已完成` : featured ? '開啟分步解題' : classroomMode === 'team-battle' ? '全班合力開戰' : '開始練習'} </small><i><b style={{ width: `${percent}%` }} /></i><ChevronRight size={17} /></footer></button>;
}

export default function MathCatalog({ initialGrade = 'P1', onBack, onHome, completedUnits, onStartUnit }) {
  const [grade, setGrade] = useState(GRADES.includes(initialGrade) ? initialGrade : 'P1');
  const [classroomMode, setClassroomMode] = useState('worksheet');
  useEffect(() => setGrade(GRADES.includes(initialGrade) ? initialGrade : 'P1'), [initialGrade]);
  useEffect(() => { if (!LOW_GRADES.includes(grade)) setClassroomMode('worksheet'); }, [grade]);
  const bank = getMathQuestionBank(grade);
  const total = bank.units.reduce((sum, unit) => sum + unit.questions.length, 0);
  const examMode = Boolean(bank.examMode);
  const teamModeAvailable = LOW_GRADES.includes(grade);
  const featuredUnits = grade === 'P6' ? bank.units.filter((unit) => unit.featured) : [];
  const standardUnits = bank.units.filter((unit) => !unit.featured);
  const start = (unit) => onStartUnit(unit, classroomMode);
  return <main className="site-shell math-catalog-page"><header className="topbar"><Brand /><div className="topbar-right"><span className="demo-pill">數學・P1–P6</span><ExamTimer /><button className="text-button" onClick={onBack}><ArrowLeft size={17} /> 返回選科</button><button className="icon-button" onClick={onHome} aria-label="返回首頁"><LayoutDashboard size={20} /></button></div></header><section className="math-catalog-hero"><div><span className="kicker"><Calculator size={15} /> 數學課程目錄</span><h1>{LABELS[grade]} 數學・<em>{examMode ? '呈分試操練' : '課程基礎'}</em></h1><p>{examMode ? '以數與代數、度量、圖形與空間、數據處理的四選一試卷題，建立解題速度、檢查習慣與升中銜接能力。教師可開啟正向計時，再直接選擇單元開始。' : '以數線、圖解、鐘面、生活情境與算式練習，建立數感、度量、圖形方向及數據處理基礎；小一至小三另可切換全班合作打怪獸。'}</p></div><strong>{total} 題</strong></section><section className="math-operation-path" aria-label="數學練習操作路徑"><span className="current"><b>01</b> 已選 {LABELS[grade]}</span><i></i><span><b>02</b> {classroomMode === 'team-battle' ? '全班合作模式' : examMode ? '呈分試學習線' : '數學學習線'}</span><i></i><span><b>03</b> 單元任務卡</span><i></i><span><b>04</b> 開始練習</span></section><section className="math-catalog-workbench"><aside className="math-grade-rail"><span>年級</span>{GRADES.map((item) => <button className={grade === item ? 'active' : ''} onClick={() => setGrade(item)} key={item}><b>{item}</b><small>{LABELS[item]}</small></button>)}</aside><section className="math-catalog-content"><div className="math-directory-heading"><span>{grade}・{examMode ? '呈分試' : '數學基礎'}</span><h2>選擇一個單元，開始{classroomMode === 'team-battle' ? '全班合力' : examMode ? '試卷式' : '互動'}練習。</h2><p>每個單元均有十題，完成後會顯示答對題數、正確率及教師已計時間。</p></div>{teamModeAvailable ? <section className="classroom-mode-switcher" aria-label="低小課堂模式"><div><span><Swords size={17} /> 低小課堂模式</span><p>一般互動可個別操作；打怪獸模式適合全班投影合力作答。</p></div><div role="group" aria-label="選擇課堂模式"><button className={classroomMode === 'worksheet' ? 'active' : ''} onClick={() => setClassroomMode('worksheet')}>一般互動</button><button className={classroomMode === 'team-battle' ? 'active battle' : 'battle'} onClick={() => setClassroomMode('team-battle')}><Swords size={15} /> 全班打怪獸</button></div></section> : null}{featuredUnits.length ? <section className="life-application-section" aria-label="小六綜合生活應用題組"><header><span>小六・綜合生活應用</span><b>先拆題，再列式</b><p>把百分比、圓面積、速率、平均數、方程及分數容量放入真實情境；提示錦囊會按步驟逐一揭示。</p></header><div>{featuredUnits.map((unit) => <UnitCard key={unit.id} unit={unit} completedUnits={completedUnits} classroomMode={classroomMode} examMode={examMode} onStart={start} featured />)}</div></section> : null}<div className="math-unit-grid">{standardUnits.map((unit) => <UnitCard key={unit.id} unit={unit} completedUnits={completedUnits} classroomMode={classroomMode} examMode={examMode} onStart={start} />)}</div></section></section></main>;
}
