/* 課堂工作檯視覺：以紙張閱讀器、珊瑚色任務標籤與高對比段落卡，引導小一學生看同一篇短文完成多題。 */
import { BookOpen, Check, ChevronRight, GripVertical, RotateCcw, Sparkles, Trophy, X } from 'lucide-react';
import { useState } from 'react';
import HintSatchel from './HintSatchel';
import UnitResultSummary from './UnitResultSummary';
import { pauseExamTimer } from '../lib/examTimerStore';

function WorkbenchFrame({ unit, taskLabel }) {
  const grade = unit.grade || unit.id?.split('-')[0] || 'P3';
  const gradeLabel = { P1: '小一', P2: '小二', P3: '小三', P4: '小四', P5: '小五', P6: '小六' }[grade] || grade;
  return <header className="activity-workbench-frame"><span className="activity-file-tab">{grade}<br />中文</span><div className="activity-brand-lockup"><span className="activity-brand-mark"><i></i><i></i><i></i><Sparkles size={18} /></span><div><b>Edu<span>Quest</span></b><small>小學課堂展示版</small></div></div><div className="activity-course-file"><span>{gradeLabel}・中國語文</span><b>{unit.area}・{unit.title}</b></div><div className="activity-task-stamp"><span>課堂工作紙</span><b>{taskLabel}</b></div></header>;
}

function shuffle(items) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

function createStorySession(stories) {
  const story = stories[Math.floor(Math.random() * stories.length)] || stories[0];
  return { story, questions: shuffle(story.questions) };
}

export default function StoryStructureActivity({ unit, onBack, onComplete }) {
  const [session, setSession] = useState(() => createStorySession(unit.stories));
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedStage, setSelectedStage] = useState(false);
  const [placedParagraph, setPlacedParagraph] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const { story, questions } = session;
  const question = questions[questionIndex];
  const paragraph = story.paragraphs.find((item) => item.id === placedParagraph);
  const completed = placedParagraph === question.answer;

  const resetQuestion = () => { setSelectedStage(false); setPlacedParagraph(null); setFeedback(null); };
  const replay = () => { setSession(createStorySession(unit.stories)); setQuestionIndex(0); setShowSummary(false); setAttempts(0); setCorrectCount(0); resetQuestion(); };
  const retryRandomQuestion = () => {
    const nextIndex = questions.length > 1 ? (questionIndex + 1 + Math.floor(Math.random() * (questions.length - 1))) % questions.length : 0;
    setQuestionIndex(nextIndex);
    resetQuestion();
  };
  const placeStage = (paragraphId, fromDrag = false) => {
    if (completed || (!selectedStage && !fromDrag)) return;
    if (paragraphId !== question.answer) {
      setAttempts((value) => value + 1);
      setFeedback({ correct: false, paragraphId });
      window.setTimeout(() => setFeedback(null), 760);
      setSelectedStage(false);
      return;
    }
    setPlacedParagraph(paragraphId);
    setAttempts((value) => value + 1);
    setCorrectCount((value) => value + 1);
    setSelectedStage(false);
    setFeedback({ correct: true, paragraphId });
  };
  const nextQuestion = () => {
    if (questionIndex >= questions.length - 1) { pauseExamTimer(); onComplete?.(unit, questions.map((item) => item.id)); setShowSummary(true); return; }
    setQuestionIndex((index) => index + 1);
    resetQuestion();
  };

  if (showSummary) return <main className="site-shell story-page"><WorkbenchFrame unit={unit} taskLabel="結算" /><UnitResultSummary unit={unit} total={questions.length} correct={correctCount} attempts={attempts} onBack={onBack} onReplay={replay} title="閱讀任務完成" description={`《${story.title}》的起、承、轉、合段落任務完成；隨機重玩會換一篇短文並重新排列題目。`} /></main>;

  const stageHint = '先看每段第一句：起會交代時間、人物或事情開始；承會寫事情發展；轉會出現問題或明顯改變；合會交代結果或人物感受。';
  return <main className="site-shell story-page"><WorkbenchFrame unit={unit} taskLabel={`任務 ${questionIndex + 1} / ${questions.length}`} /><header className="match-topbar"><button onClick={onBack} className="match-back">返回中文目錄</button><div><span>{unit.area}・{unit.title}</span><b>第 {questionIndex + 1} / {questions.length} 題</b></div><div className="match-progress" aria-label={`進度 ${questionIndex + 1} / ${questions.length}`}><i style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }} /></div></header><section className="story-stage"><div className="match-heading"><h1>{question.prompt}</h1><p>先讀短文；再把「{question.stage}」標籤拖到最合適的段落。平板上可先點標籤，再點段落。</p></div><section className="story-reader"><div className="story-reader-head"><span><BookOpen size={18} /> 閱讀短文</span><div><b>{story.title}</b><small>{story.intro}</small></div></div><div className="story-paragraphs">{story.paragraphs.map((item, index) => <button key={item.id} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); placeStage(item.id, true); }} onClick={() => placeStage(item.id)} className={`story-paragraph ${completed && item.id === paragraph?.id ? 'right' : ''} ${feedback?.correct === false && feedback.paragraphId === item.id ? 'wrong' : ''}`}><span>第 {index + 1} 段</span><p>{item.text}</p></button>)}</div></section><HintSatchel hint={stageHint} title="故事四步法" /><section className="story-stage-token" aria-label="段落結構標籤"><div><span>任務標籤</span><small><GripVertical size={14} /> 拖曳或點選</small></div><button draggable={Boolean(!completed)} disabled={completed} onDragStart={(event) => { event.dataTransfer.setData('story-stage', question.stage); setSelectedStage(true); }} onDragEnd={() => setSelectedStage(false)} onClick={() => setSelectedStage((current) => !current)} className={selectedStage ? 'selected' : ''}>{question.stage}</button></section>{feedback && !completed && <div className="match-feedback incorrect"><X size={19} /> 這段還未最符合「{question.stage}」的作用。請再看問題和段落線索。</div>}{completed && <div className="match-complete"><div><span><Check size={20} /> 配對正確</span><b>你找對第 {story.paragraphs.findIndex((item) => item.id === question.answer) + 1} 段了！</b><p>{question.explanation}</p></div><div className="complete-actions"><button onClick={retryRandomQuestion}><RotateCcw size={16} /> 隨機再試一題</button><button onClick={nextQuestion}>{questionIndex === questions.length - 1 ? '查看結算' : '下一題'} <ChevronRight size={17} /></button></div></div>}</section></main>;
}
