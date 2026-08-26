import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, BookOpen, Calculator, Check, ChevronRight, CircleHelp, Languages, LayoutDashboard, PenLine, Play, Sparkles, X } from 'lucide-react';
import './teacherRefinements.css';
import curriculumDB from './data/curriculumDB.json';
import chineseCatalog from './data/chineseCatalog';
import { chineseQuestionBanks, getChineseQuestionBank } from './data/questionBanks/chinese/index.js';
import { englishQuestionBanks, getEnglishQuestionBank } from './data/questionBanks/english';
import { getMathQuestionBank, mathQuestionBanks } from './data/questionBanks/math';
import EnglishCatalog from './components/EnglishCatalog';
import MathCatalog from './components/MathCatalog';
import UnifiedChineseCatalog from './components/UnifiedChineseCatalog';
import EnglishChoiceActivity from './components/EnglishChoiceActivity';
import MathActivity from './components/MathActivity';
import MathInteractiveActivity from './components/MathInteractiveActivity';
import TeamMonsterMathActivity from './components/TeamMonsterMathActivity';
import TeamMonsterActivity from './components/TeamMonsterActivity';
import EnglishReadingActivity from './components/EnglishReadingActivity';
import EnglishSentenceActivity from './components/EnglishSentenceActivity';
import EnglishSentenceRewriteActivity from './components/EnglishSentenceRewriteActivity';
import EnglishWritingTemplateActivity from './components/EnglishWritingTemplateActivity';
import EnglishVerbMemoryActivity from './components/EnglishVerbMemoryActivity';
import WordMatchActivity from './components/WordMatchActivity';
import RadicalSortActivity from './components/RadicalSortActivity';
import PunctuationDropActivity from './components/PunctuationDropActivity';
import StoryStructureActivity from './components/StoryStructureActivity';
import SentenceExpandActivity from './components/SentenceExpandActivity';
import P2WritingActivity from './components/P2WritingActivity';
import FormatSortActivity from './components/FormatSortActivity';
import P3StudyActivity from './components/P3StudyActivity';
import ChoiceWorksheetActivity from './components/ChoiceWorksheetActivity';
import TaleReadingActivity from './components/TaleReadingActivity';
import ParagraphMarkActivity from './components/ParagraphMarkActivity';
import ChineseWritingScaffoldActivity from './components/ChineseWritingScaffoldActivity';
import QuestionProfilePanel from './components/QuestionProfilePanel';
import TeacherFeedbackSettings from './components/TeacherFeedbackSettings';
import TeacherClassroomToolkit, { TeacherActivityControls } from './components/TeacherClassroomToolkit';
import QuestionIssueReporter from './components/QuestionIssueReporter';
import QuestionIssueReports from './components/QuestionIssueReports';
import QuickExitTicket from './components/QuickExitTicket';
import OfflineStatus from './components/OfflineStatus';
import ExamTimer from './components/ExamTimer';
import { QUESTION_ISSUES_STORAGE_KEY } from './lib/questionIssueReports';
import { playCompletionSound, playCorrectSound, playWrongSound } from './lib/feedbackAudio';
import './mathProjectionRefinements.css';
import './activityPresentation.css';

const SUBJECTS = {
  中文: { icon: BookOpen, color: 'chinese', english: 'Chinese' },
  英文: { icon: Languages, color: 'english', english: 'English' },
  數學: { icon: Calculator, color: 'math', english: 'Mathematics' },
};
const GRADES = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'];
const GRADE_LABELS = ['一', '二', '三', '四', '五', '六'];
const SUBJECT_COVERS = {
  中文: '/manus-storage/course-cover-chinese_f886bfdd.png',
  英文: '/manus-storage/course-cover-english-v2_ded2565b.png',
  數學: '/manus-storage/course-cover-math-v2_ad8e426e.png',
};

function Brand() {
  return <div className="brand" aria-label="WELIT classroom"><span className="brand-mark"><i></i><i></i><i></i><Sparkles size={24} /></span><span><b>WELIT <span>classroom</span></b><small>小學課堂展示版</small></span></div>;
}

function Header({ onHome, action, onOpenQuestionManager, onOpenClassroomToolkit, onOpenQuickExit }) {
  return <header className="topbar"><Brand /><div className="topbar-right"><span className="demo-pill">課堂試玩・可儲存進度</span><OfflineStatus /><ExamTimer /><TeacherFeedbackSettings onOpenQuestionManager={onOpenQuestionManager} onOpenClassroomToolkit={onOpenClassroomToolkit} onOpenQuickExit={onOpenQuickExit} />{action}{onHome && <button className="icon-button" onClick={onHome} aria-label="返回首頁"><LayoutDashboard size={20} /></button>}</div></header>;
}

function TeacherSettingsDock({ onOpenQuestionManager, onOpenClassroomToolkit, onOpenQuickExit }) {
  return <div className="teacher-settings-access"><OfflineStatus /><TeacherFeedbackSettings onOpenQuestionManager={onOpenQuestionManager} onOpenClassroomToolkit={onOpenClassroomToolkit} onOpenQuickExit={onOpenQuickExit} /></div>;
}

function Home({ onStart, onCatalog, onOpenQuestionManager, onOpenClassroomToolkit, onOpenQuickExit }) {
  const [grade, setGrade] = useState('P1');
  const [subject, setSubject] = useState('中文');
  const subjects = [{ key: '中文', label: '中文', note: '閱讀・寫作', action: '開啟中文課程', Icon: BookOpen }, { key: '英文', label: '英文', note: '詞彙・文法・聽讀', action: '開啟英文課程', Icon: Languages }, { key: '數學', label: '數學', note: '數感・推理・操作', action: '開啟數學課程', Icon: Calculator }];
  const selectedSubject = subjects.find((item) => item.key === subject) || subjects[0];
  const SelectedIcon = selectedSubject.Icon;
  return <main className="site-shell home-page"><Header onOpenQuestionManager={onOpenQuestionManager} onOpenClassroomToolkit={onOpenClassroomToolkit} onOpenQuickExit={onOpenQuickExit} /><div className="floaters" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div><section className="home-hero home-hero-workbench"><div className="hero-copy"><span className="kicker"><Sparkles size={15} /> WELIT classroom・課堂工作檯</span><h1>今天的課堂，<em>從這裡開始。</em></h1><p>由年級、學科到互動任務，所有入口都放在同一張開課檯面。先選好今天的班別，再開啟最合適的課程。</p><div className="hero-actions"><button className="primary-button" onClick={onStart}><Play size={18} fill="currentColor" /> 查看全部年級與學科 <ChevronRight size={18} /></button><span>右側可直接選擇今天的開課組合。</span></div><div className="home-route-note" aria-label="開課步驟"><span><b>01</b> 選年級</span><i></i><span><b>02</b> 選學科</span><i></i><span><b>03</b> 開啟任務</span></div></div><aside className="launch-desk launch-desk-interactive" aria-label="今天的開課檯"><div className="desk-heading"><span><i>✦</i> WELIT classroom・開課檔案</span><b>選好就開課</b></div><section className="home-grade-picker"><div><span>01・年級籤</span><small>選擇班別</small></div><div role="group" aria-label="選擇年級">{GRADES.map((item, index) => <button key={item} className={grade === item ? 'active' : ''} onClick={() => setGrade(item)}><b>{item}</b><small>小{GRADE_LABELS[index]}</small></button>)}</div></section><section className="home-subject-picker"><div><span>02・學科工作帶</span><small>選擇今天的重點</small></div>{subjects.map((item) => { const Icon = item.Icon; return <button key={item.key} className={`${item.key === subject ? 'active' : ''} ${item.key === '中文' ? 'chinese' : item.key === '英文' ? 'english' : 'math'}`} onClick={() => setSubject(item.key)}><span><Icon size={18} /></span><div><b>{item.label}</b><small>{item.note}</small></div><i>{item.key === subject ? '已選' : '選擇'}</i></button>; })}</section><button className={`home-demo-task ${subject === '中文' ? 'chinese' : subject === '英文' ? 'english' : 'math'}`} onClick={() => onCatalog(grade, subject)}><span>03・課堂任務卡</span><div><SelectedIcon size={22} /><p><b>{grade}・{selectedSubject.label}</b><small>{selectedSubject.note}</small></p><ChevronRight size={21} /></div><strong>{selectedSubject.action}</strong></button><div className="desk-note"><CircleHelp size={17} /><span>可先選年級與學科，再直接進入對應目錄。</span></div></aside></section><section className="home-stats"><article><b>6</b><span>小學年級</span></article><article><b>3</b><span>核心學科</span></article><article><b>1,541</b><span>已覆核題目</span></article></section></main>;
}

function CourseCard({ topic, onOpen, onCatalog }) {
  const subject = SUBJECTS[topic.subject];
  const Icon = subject.icon;
  const isChinese = topic.subject === '中文';
  const isEnglish = topic.subject === '英文';
  const isMathCatalog = topic.subject === '數學' && ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'].includes(topic.grade);
  const isCatalog = isChinese || isEnglish || isMathCatalog;
  const openCard = () => isCatalog ? onCatalog(topic.grade, topic.subject) : onOpen(topic);
  const description = isChinese ? '閱讀、寫作與分級練習' : isEnglish ? '核心文法與互動題庫' : isMathCatalog ? ['P4', 'P5', 'P6'].includes(topic.grade) ? '分數・小數・百分比呈分試' : '數與代數・互動題庫' : topic.description;
  return <button type="button" className={`course-card ${subject.color} clickable-card`} onClick={openCard} aria-label={isCatalog ? `開啟 ${topic.grade} ${topic.subject}課程目錄` : `開啟 ${topic.title} 示範題`}><div className="course-card-icon"><Icon size={27} /></div><div className="course-card-main"><span>{topic.grade}・{topic.subject}</span><h3>{topic.subject}</h3><p>{description}</p></div><div className="course-card-action"><strong className="course-card-cta">{isCatalog ? '開啟課程' : '開啟示範'} <ChevronRight size={17} /></strong></div></button>;
}

function Courses({ onBack, onOpen, onCatalog, onOpenQuestionManager, onOpenClassroomToolkit, onOpenQuickExit }) {
  const [grade, setGrade] = useState('P1');
  const gradeTopics = useMemo(() => curriculumDB.topics.filter((topic) => topic.grade === grade), [grade]);
  const gradeIndex = GRADES.indexOf(grade);
  return <main className="site-shell courses-page"><Header onHome={onBack} onOpenQuestionManager={onOpenQuestionManager} onOpenClassroomToolkit={onOpenClassroomToolkit} onOpenQuickExit={onOpenQuickExit} action={<button className="text-button" onClick={onBack}><ArrowLeft size={17} /> 返回首頁</button>} /><section className="course-header"><div><span className="kicker">今天開課</span><h1>選擇今天的<br /><em>年級與學科。</em></h1><p>每一個年級均已設有中文、英文和數學課程目錄；可按班別開啟分級互動題庫、寫作活動及數學操作工作紙。</p></div><div className="course-summary"><span>已建立</span><b>6 年級 × 3 學科</b><small>三科分級目錄及互動題庫</small></div></section><div className="route-trail"><span className="done"><b>01</b> 選年級</span><i></i><span className="active"><b>02</b> 選學科</span><i></i><span><b>03</b> 查看目錄或試玩</span></div><section className="course-workbench"><aside className="grade-rail"><span>年級</span>{GRADES.map((item, index) => <button className={grade === item ? 'active' : ''} onClick={() => setGrade(item)} key={item}><b>{item}</b><small>小{GRADE_LABELS[index]}</small></button>)}</aside><div className="subject-workspace"><div className="workspace-heading"><span className="grade-chip">{grade}・小{GRADE_LABELS[gradeIndex]}</span><h2>選一科，查看目錄或試玩示範。</h2></div><div className="course-stack">{gradeTopics.map((topic) => <CourseCard key={topic.id} topic={topic} onOpen={onOpen} onCatalog={onCatalog} />)}</div><p className="workspace-note">三科課程均已按年級重點整理；可由課程卡直接開啟相應目錄、題組和互動學習活動。</p></div></section></main>;
}

function QuestionBankStatus({ questionBank, completedUnits, onStartUnit }) {
  const questionCount = questionBank.units.reduce((total, unit) => total + unit.questions.length, 0);
  const readyCount = questionBank.units.filter((unit) => unit.questions.length > 0).length;
  return <section className="question-bank-status"><div className="bank-overview"><div><span>本級試題庫</span><b>{readyCount} 個單元可開始</b><small>共 {questionBank.units.length} 個單元入口，已加入 {questionCount} 題。</small></div><strong className="bank-total-chip">{questionCount} 題</strong></div><div className="bank-unit-grid">{questionBank.units.map((unit) => { const completed = Math.min(Array.isArray(completedUnits[unit.id]) ? completedUnits[unit.id].length : completedUnits[unit.id] || 0, unit.questions.length); const percent = unit.questions.length ? Math.round((completed / unit.questions.length) * 100) : 0; const content = <><div className="bank-unit-card-top"><span>{unit.area}</span><b className="bank-unit-count">{unit.questions.length} 題</b></div><strong>{unit.title}</strong><div className="bank-unit-progress"><span>{completed} / {unit.questions.length} 題已完成</span><i><b style={{ width: `${percent}%` }} /></i></div></>; return <button key={unit.id} className="bank-unit-card ready" onClick={() => onStartUnit(unit)}>{content}<ChevronRight size={18} /></button>; })}</div></section>;
}

function ChineseCatalog({ onBack, onHome, initialGrade, onStartUnit, completedUnits }) {
  const [grade, setGrade] = useState(initialGrade || 'P1');
  const catalog = chineseCatalog[grade];
  const questionBank = getChineseQuestionBank(grade);
  return <main className="site-shell catalog-page"><Header onHome={onHome} action={<button className="text-button" onClick={onBack}><ArrowLeft size={17} /> 返回選科</button>} /><section className="catalog-header"><div><span className="kicker"><BookOpen size={15} /> 中文課程目錄</span><h1>中文課程，<br /><em>從閱讀走向寫作。</em></h1><p>以下按分級重點整理。每級以「閱讀」和「寫作」兩條學習線並行，方便備課與開啟互動練習。</p></div><aside className="catalog-key"><span>分級方式</span><b>閱讀 × 寫作</b><small>目前版本：中文科目錄</small></aside></section><div className="route-trail catalog-route"><span className="done"><b>01</b> 選年級</span><i></i><span className="active"><b>02</b> 查看中文目錄</span><i></i><span><b>03</b> 開始練習</span></div><section className="catalog-workbench"><aside className="catalog-grade-rail"><span>選擇年級</span>{GRADES.map((item, index) => <button className={grade === item ? 'active' : ''} onClick={() => setGrade(item)} key={item}><b>{item}</b><small>小{GRADE_LABELS[index]}</small></button>)}</aside><div className="catalog-content"><div className="catalog-grade-heading"><span>{catalog.grade}・{catalog.gradeLabel}</span><h2>{catalog.focus}</h2><p>{catalog.summary}</p></div><div className="catalog-columns"><article className="catalog-area reading"><div className="catalog-area-head"><span className="catalog-icon"><BookOpen size={24} /></span><div><b>閱讀</b><small>閱讀重點</small></div></div><ul>{catalog.reading.map((item) => <li key={item}>{item}</li>)}</ul></article><article className="catalog-area writing"><div className="catalog-area-head"><span className="catalog-icon"><PenLine size={24} /></span><div><b>寫作</b><small>寫作重點</small></div></div><ul>{catalog.writing.map((item) => <li key={item}>{item}</li>)}</ul></article></div><QuestionBankStatus questionBank={questionBank} completedUnits={completedUnits} onStartUnit={onStartUnit} /><QuestionProfilePanel questionBank={questionBank} /><div className="catalog-note"><CircleHelp size={17} /><span>本目錄依現有分級範疇整理；可從下方任務卡直接開始題庫練習。</span></div></div></section></main>;
}

function Demo({ topic, onBack }) {
  const [choice, setChoice] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const subject = SUBJECTS[topic.subject];
  const Icon = subject.icon;
  const answer = (index) => { if (feedback) return; setChoice(index); setFeedback({ correct: index === topic.answerIndex }); };
  const reset = () => { setChoice(null); setFeedback(null); };
  return <main className={`site-shell demo-page ${subject.color}`}><Header onHome={onBack} action={<button className="text-button" onClick={onBack}><ArrowLeft size={17} /> 返回選科</button>} /><div className="route-trail demo-route"><span className="done"><b>01</b> 選年級</span><i></i><span className="done"><b>02</b> 選學科</span><i></i><span className="active"><b>03</b> 試玩一題</span></div><section className="demo-layout"><div className="demo-context"><span className={`subject-badge ${subject.color}`}><Icon size={17} /> {topic.subject}・{subject.english}</span><p>{topic.grade}・{topic.gradeLabel}</p><h1>{topic.title}</h1><span className="demo-caption">課堂示範 01 / 01</span><div className="demo-orbit" aria-hidden="true"><i></i><i></i><i></i></div></div><section className="question-sheet worksheet-card"><div className="sheet-tab">{topic.subject} 任務卡</div><div className="sheet-top"><span>試玩一題</span><small>{topic.grade}・{topic.gradeLabel}・{topic.description}</small></div><h2>{topic.prompt}</h2><div className="answer-options">{topic.options.map((option, index) => <button key={option} disabled={Boolean(feedback)} className={choice === index ? (index === topic.answerIndex ? 'selected-correct' : 'selected-wrong') : ''} onClick={() => answer(index)}><span>{String.fromCharCode(65 + index)}</span>{option}</button>)}</div>{feedback && <aside className={`answer-feedback ${feedback.correct ? 'correct' : 'incorrect'}`} role="status"><div className="feedback-symbol">{feedback.correct ? <Check size={24} /> : <X size={24} />}</div><div><b>{feedback.correct ? '答對了！' : '這次未選中正確答案。'}</b><p>{feedback.correct ? '示範流程完成，可以返回選科或再試一次。' : <>正確答案是「{topic.options[topic.answerIndex]}」。{topic.explanation}</>}</p><div className="feedback-actions"><button className="ghost-button" onClick={onBack}>返回選科</button><button className="feedback-primary" onClick={reset}>{feedback.correct ? '再試一題' : '重新作答'} <ChevronRight size={17} /></button></div></div></aside>}</section></section></main>;
}

export default function App() {
  const params = new URLSearchParams(window.location.search);
  const previewTopic = params.get('demo') ? curriculumDB.topics.find((item) => item.id === params.get('demo')) || curriculumDB.topics[0] : null;
  const previewEnglishGrade = params.get('unit')?.split('-')[0];
  const previewEnglishUnit = previewEnglishGrade ? getEnglishQuestionBank(previewEnglishGrade)?.units.find((unit) => unit.id === params.get('unit')) || null : null;
  const previewMathGrade = params.get('unit')?.split('-')[0];
  const previewMathUnit = previewMathGrade ? getMathQuestionBank(previewMathGrade)?.units.find((unit) => unit.id === params.get('unit')) || null : null;
  const previewChineseConfig = { 'p1-story': ['P3', 'P3-CN-R09'], 'p2-tale': ['P2', 'P2-CN-R03'], 'p3-story-structure': ['P3', 'P3-CN-R09'], 'p3-metaphor': ['P3', 'P3-CN-R04'], 'p3-personification': ['P3', 'P3-CN-R05'], 'p3-parallelism': ['P3', 'P3-CN-R06'], 'p3-word-relations': ['P3', 'P3-CN-R08'], 'p4-main-idea': ['P4', 'P4-CN-R06'], 'p4-paragraph-sort': ['P4', 'P4-CN-R07'], 'p4-summary-fill': ['P4', 'P4-CN-R08'], 'p5-expository-methods': ['P5', 'P5-CN-W05'], 'p5-expository-framework': ['P5', 'P5-CN-W06'], 'p6-classical': ['P6', 'P6-CN-R01'], 'p6-argument-evidence': ['P6', 'P6-CN-W06'], 'p6-counterargument': ['P6', 'P6-CN-W07'], 'p6-argument-rewrite': ['P6', 'P6-CN-W08'] }[params.get('activity')];
  const previewChineseUnit = previewChineseConfig ? getChineseQuestionBank(previewChineseConfig[0]).units.find((unit) => unit.id === previewChineseConfig[1]) || null : previewEnglishGrade ? getChineseQuestionBank(previewEnglishGrade)?.units.find((unit) => unit.id === params.get('unit')) || null : null;
  const previewUnit = previewEnglishUnit || previewMathUnit || previewChineseUnit;
  const chineseCatalogPreview = params.get('view') === 'chinese-catalog';
  const [screen, setScreen] = useState(previewUnit ? 'activity' : previewTopic ? 'demo' : params.get('view') === 'classroom-toolkit' ? 'classroom-toolkit' : params.get('view') === 'quick-exit' ? 'quick-exit' : params.get('view') === 'issue-reports' ? 'issue-reports' : params.get('view') === 'english-catalog' || params.get('view') === 'math-catalog' || chineseCatalogPreview ? 'catalog' : params.get('view') === 'courses' ? 'courses' : 'home');
  const [topic, setTopic] = useState(previewTopic);
  const [catalogGrade, setCatalogGrade] = useState(previewChineseConfig?.[0] || (GRADES.includes(params.get('grade')) ? params.get('grade') : 'P1'));
  const [catalogSubject, setCatalogSubject] = useState(params.get('view') === 'english-catalog' || previewEnglishUnit ? '英文' : previewMathUnit || params.get('view') === 'math-catalog' ? '數學' : '中文');
  const [activeUnit, setActiveUnit] = useState(previewUnit ? { ...previewUnit, activityMode: params.get('mode') === 'team-battle' ? 'team-battle' : previewUnit.activityMode } : null);
  const [questionManagerReturnScreen, setQuestionManagerReturnScreen] = useState('home');
  const [classroomToolkitReturnScreen, setClassroomToolkitReturnScreen] = useState('home');
  const [issueReportsReturnScreen, setIssueReportsReturnScreen] = useState('home');
  const [classroomSession, setClassroomSession] = useState(() => { try { const saved = JSON.parse(window.sessionStorage.getItem('welitquest-classroom-session-once') || 'null'); return saved && Array.isArray(saved.items) ? saved : { title: '', createdAt: new Date().toISOString(), items: [], completedKeys: [] }; } catch { return { title: '', createdAt: new Date().toISOString(), items: [], completedKeys: [] }; } });
  const [completedUnits, setCompletedUnits] = useState(() => { try { return JSON.parse(window.sessionStorage.getItem('welitquest-unit-progress-once') || '{}'); } catch { return {}; } });
  useEffect(() => {
    window.localStorage.removeItem('welitquest-classroom-session');
    window.localStorage.removeItem('eduquest-unit-progress');
    Object.keys(window.localStorage).filter((key) => key.startsWith('welitquest-exit-drawn:')).forEach((key) => window.localStorage.removeItem(key));
  }, []);
  useEffect(() => {
    const applyMotionPreference = (value) => { try { const settings = value || JSON.parse(window.localStorage.getItem('eduquest-feedback-settings') || '{}'); document.documentElement.dataset.eduquestAnimation = settings.animation === false ? 'off' : 'on'; document.documentElement.dataset.eduquestProjection = settings.projectionSize || 'standard'; document.documentElement.dataset.eduquestMinimalProjection = settings.minimalProjection === true ? 'on' : 'off'; document.documentElement.dataset.eduquestReadingLineHeight = settings.readingLineHeight || 'comfortable'; document.documentElement.dataset.eduquestReadingColumnWidth = settings.readingColumnWidth || 'standard'; } catch { document.documentElement.dataset.eduquestAnimation = 'on'; document.documentElement.dataset.eduquestProjection = 'standard'; document.documentElement.dataset.eduquestMinimalProjection = 'off'; document.documentElement.dataset.eduquestReadingLineHeight = 'comfortable'; document.documentElement.dataset.eduquestReadingColumnWidth = 'standard'; } };
    applyMotionPreference();
    const onSettingsChange = (event) => applyMotionPreference(event.detail);
    window.addEventListener('eduquest-feedback-settings', onSettingsChange);
    return () => window.removeEventListener('eduquest-feedback-settings', onSettingsChange);
  }, []);
  useEffect(() => {
    if (screen !== 'activity') return undefined;
    let frame = 0;
    const applyTitleScale = () => {
      document.querySelectorAll('main.site-shell h1').forEach((heading) => {
        const length = heading.textContent.replace(/\s+/g, '').length;
        heading.dataset.eduquestQuestionLength = length > 96 ? 'xlong' : length > 58 ? 'long' : length > 30 ? 'medium' : 'short';
      });
    };
    const schedule = () => { window.cancelAnimationFrame(frame); frame = window.requestAnimationFrame(applyTitleScale); };
    schedule();
    const activityRoot = document.querySelector('main.site-shell');
    if (!activityRoot) return () => window.cancelAnimationFrame(frame);
    const observer = new MutationObserver(schedule);
    observer.observe(activityRoot, { childList: true, subtree: true, characterData: true });
    return () => { window.cancelAnimationFrame(frame); observer.disconnect(); };
  }, [screen, activeUnit]);
  useEffect(() => {
    let lastCorrect = 0;
    let lastWrong = 0;
    let lastComplete = 0;
    const inspect = (node) => { if (!(node instanceof Element)) return; [node, ...node.querySelectorAll('*')].forEach((item) => { const classes = item.classList; if (classes?.contains('activity-summary') && Date.now() - lastComplete > 900) { lastComplete = Date.now(); playCompletionSound(); } if ((classes?.contains('selected-correct') || classes?.contains('correct-pop') || classes?.contains('right')) && Date.now() - lastCorrect > 340) { lastCorrect = Date.now(); playCorrectSound(); } if ((classes?.contains('selected-wrong') || classes?.contains('wrong')) && Date.now() - lastWrong > 340) { lastWrong = Date.now(); playWrongSound(); } }); };
    const observer = new MutationObserver((mutations) => mutations.forEach((mutation) => { if (mutation.type === 'attributes') inspect(mutation.target); mutation.addedNodes.forEach(inspect); }));
    observer.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (screen !== 'activity' || !activeUnit) return undefined;
    const questionSignals = (question) => [question.prompt, question.sentence, question.translation, question.title, question.baseWord, question.word, question.target, question.context, question.source, question.answer, question.profile, question.document, ...(question.matches || []).flatMap((item) => [item.word, item.meaning]), ...(question.blocks || []).map((item) => item.text), ...(question.paragraphs || []).map((item) => item.text)].filter((value) => typeof value === 'string' && value.trim().length > 1);
    const signalCounts = activeUnit.questions.flatMap(questionSignals).reduce((counts, signal) => ({ ...counts, [signal]: (counts[signal] || 0) + 1 }), {});
    const questionIndexFromPage = (pageText) => {
      const candidates = activeUnit.questions.map((question, index) => ({
        index,
        score: questionSignals(question).filter((signal) => signalCounts[signal] === 1 && pageText.includes(signal)).reduce((total, signal) => total + Math.min(signal.length, 40), 0),
      })).sort((left, right) => right.score - left.score);
      return candidates[0]?.score ? candidates[0].index : -1;
    };
    const decorateCourseHeader = () => {
      const courseFile = document.querySelector('.activity-workbench-frame .activity-course-file');
      if (!courseFile) return;
      const pageText = document.querySelector('main.site-shell')?.textContent || '';
      const questionIndex = questionIndexFromPage(pageText);
      if (questionIndex < 0) return;
      const total = activeUnit.questions.length;
      const stars = total <= 1 ? 3 : Math.round((questionIndex / (total - 1)) * 4) + 1;
      let difficulty = courseFile.querySelector('.activity-question-difficulty');
      if (!difficulty) {
        difficulty = document.createElement('span');
        difficulty.className = 'activity-question-difficulty';
        courseFile.append(difficulty);
      }
      if (difficulty.dataset.value === String(stars)) return;
      difficulty.dataset.value = String(stars);
      difficulty.setAttribute('role', 'img');
      difficulty.setAttribute('aria-label', `本題在此單元的難度：${stars} 星，共 5 星`);
      difficulty.title = '星級只在同一單元內比較';
      difficulty.replaceChildren(...Array.from({ length: 5 }, (_, index) => {
        const star = document.createElement('i');
        star.className = index < stars ? 'filled' : 'empty';
        star.textContent = index < stars ? '★' : '☆';
        return star;
      }));
    };
    const initialRender = window.requestAnimationFrame(decorateCourseHeader);
    const observer = new MutationObserver(decorateCourseHeader);
    observer.observe(document.body, { subtree: true, childList: true, characterData: true });
    return () => { window.cancelAnimationFrame(initialRender); observer.disconnect(); };
  }, [screen, activeUnit]);
  useEffect(() => {
    if (screen !== 'activity' || !activeUnit) return undefined;
    const choicesQuestions = activeUnit.questions?.length ? activeUnit.questions : activeUnit.passageSets?.flatMap((set) => set.questions) || activeUnit.stories?.flatMap((story) => story.questions) || [];
    const normaliseChoice = (value) => String(value ?? '').replace(/\s+/gu, '').replace(/^[$]/u, '');
    const questionSignals = (question) => [question.prompt, question.sentence, question.context, question.text, question.source, question.title, question.target, question.profile, question.document].filter((value) => typeof value === 'string' && value.trim().length > 1);
    const findQuestion = () => {
      const pageText = document.querySelector('main.site-shell')?.textContent || '';
      return choicesQuestions.map((question) => ({ question, score: questionSignals(question).filter((signal) => pageText.includes(signal)).reduce((total, signal) => total + Math.min(signal.length, 40), 0) })).sort((left, right) => right.score - left.score)[0]?.question;
    };
    const restoreChoices = () => document.querySelectorAll('.eliminated-choice, .eliminating-choice').forEach((option) => { option.classList.remove('eliminated-choice', 'eliminating-choice'); option.disabled = false; option.removeAttribute('aria-hidden'); option.removeAttribute('aria-disabled'); });
    const removeSatchels = () => document.querySelectorAll('.eliminate-choice-satchel').forEach((satchel) => satchel.remove());
    const settingsEnabled = () => { try { const stored = JSON.parse(window.localStorage.getItem('eduquest-feedback-settings') || '{}'); return stored.eliminateTwoOptionsConfigured === true ? stored.eliminateTwoOptions === true : true; } catch { return true; } };
    const installSatchel = () => {
      if (!settingsEnabled()) { restoreChoices(); removeSatchels(); return; }
      const question = findQuestion();
      const correctAnswer = question?.answer ?? question?.radical;
      if (!question?.choices?.length || correctAnswer === undefined) return;
      document.querySelectorAll('.english-option-grid, .math-option-grid, .team-battle-options, .worksheet-options > div:last-child, .writing-choice-bank > div:last-child, .p3-choice-bank > div:last-child, .tale-choice-bank > div:last-child, .radical-choice-grid, .punctuation-choice-grid').forEach((grid) => {
        const options = [...grid.querySelectorAll(':scope > button')];
        const existingSatchel = grid.parentElement?.querySelector('.eliminate-choice-satchel');
        if (existingSatchel?.dataset.used === 'true' && !options.some((option) => option.classList.contains('eliminated-choice') || option.classList.contains('eliminating-choice'))) existingSatchel.remove();
        if (options.length !== 4 || grid.parentElement?.querySelector('.eliminate-choice-satchel')) return;
        const satchel = document.createElement('aside');
        satchel.className = 'eliminate-choice-satchel';
        const button = document.createElement('button');
        button.type = 'button';
        button.innerHTML = '<b>幫我排除兩個錯誤選項</b>';
        button.setAttribute('aria-label', '刪去兩個錯誤選項，只保留正確答案和一個干擾選項');
        button.addEventListener('click', () => {
          const wrongOptions = options.filter((option) => normaliseChoice(option.dataset.choiceValue || option.querySelector('b')?.textContent || option.textContent) !== normaliseChoice(correctAnswer));
          for (let index = wrongOptions.length - 1; index > 0; index -= 1) { const swapIndex = Math.floor(Math.random() * (index + 1)); [wrongOptions[index], wrongOptions[swapIndex]] = [wrongOptions[swapIndex], wrongOptions[index]]; }
          const reducedMotion = document.documentElement.dataset.eduquestAnimation === 'off' || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          satchel.classList.add('satchel-activating');
          wrongOptions.slice(0, 2).forEach((option) => { option.classList.add('eliminating-choice'); option.disabled = true; option.setAttribute('aria-disabled', 'true'); });
          window.setTimeout(() => wrongOptions.slice(0, 2).forEach((option) => { option.classList.remove('eliminating-choice'); option.classList.add('eliminated-choice'); option.setAttribute('aria-hidden', 'true'); }), reducedMotion ? 0 : 620);
          window.setTimeout(() => satchel.classList.remove('satchel-activating'), reducedMotion ? 0 : 620);
          satchel.dataset.used = 'true';
          button.disabled = true;
          button.innerHTML = '<b>已協助排除兩個選項</b>';
        });
        satchel.append(button);
        grid.parentElement?.insertBefore(satchel, grid);
      });
    };
    const observer = new MutationObserver(installSatchel);
    const onSettingsChange = installSatchel;
    observer.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['disabled', 'class'] });
    window.addEventListener('eduquest-feedback-settings', onSettingsChange);
    const initialRender = window.requestAnimationFrame(installSatchel);
    return () => { window.cancelAnimationFrame(initialRender); observer.disconnect(); window.removeEventListener('eduquest-feedback-settings', onSettingsChange); removeSatchels(); };
  }, [screen, activeUnit]);
  const openDemo = (selectedTopic) => { setTopic(selectedTopic); setScreen('demo'); };
  const openCatalog = (grade = 'P1', subject = '中文') => { setCatalogGrade(grade); setCatalogSubject(subject); setScreen('catalog'); };
  const openQuestionManager = (returnScreen = screen) => { setQuestionManagerReturnScreen(returnScreen); setScreen('question-manager'); };
  const openClassroomToolkit = (returnScreen = screen) => { setClassroomToolkitReturnScreen(returnScreen); setScreen('classroom-toolkit'); };
  const openIssueReports = (returnScreen = screen) => { setIssueReportsReturnScreen(returnScreen); setScreen('issue-reports'); };
  const openQuickExit = () => setScreen('quick-exit');
  const updateClassroomSession = (next) => { setClassroomSession(next); window.sessionStorage.setItem('welitquest-classroom-session-once', JSON.stringify(next)); };
  const endClassroomSession = (next = { title: '', createdAt: new Date().toISOString(), items: [], completedKeys: [] }) => { setClassroomSession(next); setCompletedUnits({}); window.sessionStorage.removeItem('welitquest-classroom-session-once'); window.sessionStorage.removeItem('welitquest-unit-progress-once'); window.sessionStorage.removeItem(QUESTION_ISSUES_STORAGE_KEY); Object.keys(window.sessionStorage).filter((key) => key.startsWith('welitquest-exit-drawn:')).forEach((key) => window.sessionStorage.removeItem(key)); };
  const startClassroomUnit = (unit, subject, grade) => { setCatalogGrade(grade); setCatalogSubject(subject); setActiveUnit({ ...unit, activityMode: 'worksheet' }); setScreen('activity'); };
  const startNextClassroomUnit = (currentUnit) => {
    const nextItem = classroomSession.items.find((item) => !classroomSession.completedKeys.includes(item.key) && item.unitId !== currentUnit.id);
    if (!nextItem) { openClassroomToolkit('activity'); return; }
    const nextUnit = (nextItem.subject === '中文' ? chineseQuestionBanks : nextItem.subject === '英文' ? englishQuestionBanks : mathQuestionBanks)[nextItem.grade]?.units.find((unit) => unit.id === nextItem.unitId);
    if (nextUnit) startClassroomUnit(nextUnit, nextItem.subject, nextItem.grade);
  };
  const markUnitCompleted = (unit, questionIds = unit.questions.map((question) => question.id)) => {
    setCompletedUnits((current) => { const previous = Array.isArray(current[unit.id]) ? current[unit.id] : current[unit.id] >= unit.questions.length ? unit.questions.map((question) => question.id) : []; const next = { ...current, [unit.id]: [...new Set([...previous, ...questionIds])] }; window.sessionStorage.setItem('welitquest-unit-progress-once', JSON.stringify(next)); return next; });
    const subject = unit.id.includes('-EN-') ? '英文' : unit.id.includes('-CN-') ? '中文' : '數學';
    const key = `${subject}:${unit.id}`;
    setClassroomSession((current) => { if (!current.items.some((item) => item.key === key) || current.completedKeys.includes(key)) return current; const next = { ...current, completedKeys: [...current.completedKeys, key] }; window.sessionStorage.setItem('welitquest-classroom-session-once', JSON.stringify(next)); return next; });
  };
  if (screen === 'activity' && activeUnit) {
    const [unitGrade, unitSubjectCode] = activeUnit.id?.split('-') || [];
    const backToCatalog = () => {
      const destinationGrade = GRADES.includes(activeUnit.grade) ? activeUnit.grade : GRADES.includes(unitGrade) ? unitGrade : catalogGrade;
      const destinationSubject = activeUnit.subject || (unitSubjectCode === 'EN' ? '英文' : unitSubjectCode === 'CN' ? '中文' : unitSubjectCode === 'MATH' ? '數學' : catalogSubject);
      setCatalogGrade(destinationGrade);
      setCatalogSubject(destinationSubject);
      setScreen('catalog');
    };
    const withTeacherControls = (content) => <>{content}<QuestionIssueReporter unit={activeUnit} /><TeacherActivityControls session={classroomSession} activeUnit={activeUnit} onBack={backToCatalog} onOpenToolkit={() => openClassroomToolkit('activity')} onOpenQuickExit={openQuickExit} onOpenIssueReports={() => openIssueReports('activity')} onNextPlanned={() => startNextClassroomUnit(activeUnit)} /></>;
    if (activeUnit.activityMode === 'team-battle' && ['P1', 'P2', 'P3'].includes(unitGrade) && (unitSubjectCode === 'CN' || unitSubjectCode === 'EN')) return withTeacherControls(<><TeamMonsterActivity unit={activeUnit} subject={unitSubjectCode === 'CN' ? '中文' : '英文'} onBack={backToCatalog} onComplete={markUnitCompleted} /><TeacherSettingsDock onOpenClassroomToolkit={() => openClassroomToolkit('activity')} onOpenQuickExit={openQuickExit} /></>);
    if (activeUnit.interaction === 'english-sentence-read' || activeUnit.interaction === 'english-sentence-build') return withTeacherControls(<EnglishSentenceActivity unit={activeUnit} onBack={backToCatalog} onComplete={markUnitCompleted} />);
    if (activeUnit.interaction === 'english-reading-comprehension') return withTeacherControls(<EnglishReadingActivity unit={activeUnit} onBack={backToCatalog} onComplete={markUnitCompleted} />);
    if (activeUnit.interaction === 'english-sentence-rewrite-conditional' || activeUnit.interaction === 'english-sentence-rewrite-reported') return withTeacherControls(<EnglishSentenceRewriteActivity unit={activeUnit} onBack={backToCatalog} onComplete={markUnitCompleted} />);
    if (activeUnit.interaction === 'english-writing-template') return withTeacherControls(<EnglishWritingTemplateActivity unit={activeUnit} onBack={backToCatalog} onComplete={markUnitCompleted} />);
    if (activeUnit.interaction === 'english-verb-memory') return withTeacherControls(<EnglishVerbMemoryActivity unit={activeUnit} onBack={backToCatalog} onComplete={markUnitCompleted} />);
    if (activeUnit.id.includes('-EN-')) return withTeacherControls(<EnglishChoiceActivity unit={activeUnit} onBack={backToCatalog} onComplete={markUnitCompleted} />);
    if (activeUnit.activityMode === 'team-battle' && activeUnit.id.includes('-MATH-')) return withTeacherControls(<><TeamMonsterMathActivity unit={activeUnit} onBack={backToCatalog} onComplete={markUnitCompleted} /><TeacherSettingsDock onOpenClassroomToolkit={() => openClassroomToolkit('activity')} onOpenQuickExit={openQuickExit} /></>);
    if (['math-shopping', 'math-fraction-pie', 'math-fraction-compare', 'math-equal-groups', 'math-sharing', 'math-sharing-remainder'].includes(activeUnit.interaction)) return withTeacherControls(<MathInteractiveActivity unit={activeUnit} onBack={backToCatalog} onComplete={markUnitCompleted} />);
    if (activeUnit.id.includes('-MATH-')) return withTeacherControls(<><MathActivity unit={activeUnit} onBack={backToCatalog} onComplete={markUnitCompleted} /><TeacherSettingsDock onOpenClassroomToolkit={() => openClassroomToolkit('activity')} onOpenQuickExit={openQuickExit} /></>);
    if (activeUnit.interaction === 'paragraph-mark') return withTeacherControls(<ParagraphMarkActivity unit={activeUnit} onBack={backToCatalog} onComplete={markUnitCompleted} />);
    if (activeUnit.interaction === 'chinese-writing-scaffold') return withTeacherControls(<ChineseWritingScaffoldActivity unit={activeUnit} onBack={backToCatalog} onComplete={markUnitCompleted} />);
    if (activeUnit.interaction === 'p3-reading' || activeUnit.interaction === 'p3-idiom' || activeUnit.interaction === 'p3-figure') return withTeacherControls(<P3StudyActivity unit={activeUnit} onBack={backToCatalog} onComplete={markUnitCompleted} />);
    if (activeUnit.interaction === 'format-sort') return withTeacherControls(<FormatSortActivity unit={activeUnit} onBack={backToCatalog} onComplete={markUnitCompleted} />);
    if (activeUnit.interaction === 'writing-choice') return withTeacherControls(<P2WritingActivity unit={activeUnit} onBack={backToCatalog} onComplete={markUnitCompleted} />);
    if (activeUnit.interaction === 'tale-reading') return withTeacherControls(<TaleReadingActivity unit={activeUnit} onBack={backToCatalog} onComplete={markUnitCompleted} />);
    if (activeUnit.interaction === 'context-choice' || activeUnit.interaction === 'connector-cloze') return withTeacherControls(<ChoiceWorksheetActivity unit={activeUnit} onBack={backToCatalog} onComplete={markUnitCompleted} />);
    if (activeUnit.interaction === 'sentence-expand') return withTeacherControls(<SentenceExpandActivity unit={activeUnit} onBack={backToCatalog} onComplete={markUnitCompleted} />);
    if (activeUnit.interaction === 'story-structure') return withTeacherControls(<StoryStructureActivity unit={activeUnit} onBack={backToCatalog} onComplete={markUnitCompleted} />);
    if (activeUnit.interaction === 'punctuation-drop') return withTeacherControls(<PunctuationDropActivity unit={activeUnit} onBack={backToCatalog} onComplete={markUnitCompleted} />);
    if (activeUnit.interaction === 'radical-sort') return withTeacherControls(<RadicalSortActivity unit={activeUnit} onBack={backToCatalog} onComplete={markUnitCompleted} />);
    return withTeacherControls(<WordMatchActivity unit={activeUnit} onBack={backToCatalog} onComplete={markUnitCompleted} />);
  }
  if (screen === 'question-manager') return <QuestionProfilePanel questionBanks={{ 中文: chineseQuestionBanks, 英文: englishQuestionBanks, 數學: mathQuestionBanks }} onBack={() => setScreen(questionManagerReturnScreen)} />;
  if (screen === 'issue-reports') return <QuestionIssueReports onBack={() => setScreen(issueReportsReturnScreen)} />;
  if (screen === 'classroom-toolkit') return <TeacherClassroomToolkit questionBanks={{ 中文: chineseQuestionBanks, 英文: englishQuestionBanks, 數學: mathQuestionBanks }} session={classroomSession} onSessionChange={updateClassroomSession} onEndSession={endClassroomSession} onBack={() => setScreen(classroomToolkitReturnScreen)} onStartUnit={startClassroomUnit} />;
  if (screen === 'quick-exit') return <QuickExitTicket questionBanks={{ 中文: chineseQuestionBanks, 英文: englishQuestionBanks, 數學: mathQuestionBanks }} onBack={() => setScreen('courses')} />;
  if (screen === 'catalog') return <>{catalogSubject === '英文' ? <EnglishCatalog initialGrade={catalogGrade} onBack={() => setScreen('courses')} onHome={() => setScreen('home')} completedUnits={completedUnits} onStartUnit={(unit, activityMode = 'worksheet') => { setActiveUnit({ ...unit, activityMode }); setScreen('activity'); }} /> : catalogSubject === '數學' ? <MathCatalog initialGrade={catalogGrade} onBack={() => setScreen('courses')} onHome={() => setScreen('home')} completedUnits={completedUnits} onStartUnit={(unit, activityMode = 'worksheet') => { setActiveUnit({ ...unit, activityMode }); setScreen('activity'); }} /> : <UnifiedChineseCatalog initialGrade={catalogGrade} onBack={() => setScreen('courses')} onHome={() => setScreen('home')} completedUnits={completedUnits} onStartUnit={(unit, activityMode = 'worksheet') => { setActiveUnit({ ...unit, activityMode }); setScreen('activity'); }} />}<TeacherSettingsDock onOpenQuestionManager={() => openQuestionManager('catalog')} onOpenClassroomToolkit={() => openClassroomToolkit('catalog')} onOpenQuickExit={openQuickExit} /></>;
  if (screen === 'courses') return <Courses onBack={() => setScreen('home')} onOpen={openDemo} onCatalog={openCatalog} onOpenQuestionManager={() => openQuestionManager('courses')} onOpenClassroomToolkit={() => openClassroomToolkit('courses')} onOpenQuickExit={openQuickExit} />;
  if (screen === 'demo' && topic) return <Demo topic={topic} onBack={() => setScreen('courses')} />;
  return <Home onStart={() => setScreen('courses')} onCatalog={openCatalog} onOpenQuestionManager={() => openQuestionManager('home')} onOpenClassroomToolkit={() => openClassroomToolkit('home')} onOpenQuickExit={openQuickExit} />;
}
