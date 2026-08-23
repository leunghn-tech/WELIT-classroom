import { ArrowLeft, BookMarked, Filter, SlidersHorizontal, Tags, Target } from 'lucide-react';
import { useMemo, useState } from 'react';

const subjectOrder = ['中文', '英文', '數學'];
const gradeOrder = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'];
const starValues = [1, 2, 3, 4, 5];

function getTopicStars(index, total) {
  if (total <= 1) return 3;
  return Math.round((index / (total - 1)) * 4) + 1;
}

function StarRating({ value }) {
  return <span className={`difficulty-stars stars-${value}`} role="img" aria-label={`難度 ${value} 星`} title={`同一單元內難度 ${value} 星`}>{starValues.map((star) => <span className={star <= value ? 'filled' : 'empty'} key={star} aria-hidden="true">{star <= value ? '★' : '☆'}</span>)}</span>;
}

export default function QuestionProfilePanel({ questionBanks, questionBank, onBack }) {
  const banks = questionBanks || (questionBank ? { 中文: { [questionBank.grade]: questionBank } } : {});
  const [subject, setSubject] = useState('中文');
  const [grade, setGrade] = useState('P1');
  const [topic, setTopic] = useState('全部');
  const [stars, setStars] = useState('全部');
  const [sortBy, setSortBy] = useState('topic');

  const availableSubjects = subjectOrder.filter((item) => banks[item]);
  const activeSubject = availableSubjects.includes(subject) ? subject : availableSubjects[0] || '中文';
  const availableGrades = gradeOrder.filter((item) => banks[activeSubject]?.[item]);
  const activeGrade = availableGrades.includes(grade) ? grade : availableGrades[0] || 'P1';
  const activeBank = banks[activeSubject]?.[activeGrade];
  const topics = activeBank?.units || [];
  const activeTopic = topics.some((unit) => unit.id === topic) ? topic : '全部';

  const records = useMemo(() => (activeBank?.units || []).flatMap((unit) => unit.questions.map((question, index) => ({
    ...question,
    unit,
    index,
    subject: activeSubject,
    grade: activeGrade,
    stars: getTopicStars(index, unit.questions.length),
  }))), [activeBank, activeSubject, activeGrade]);

  const visibleQuestions = useMemo(() => records
    .filter((question) => activeTopic === '全部' || question.unit.id === activeTopic)
    .filter((question) => stars === '全部' || question.stars === Number(stars))
    .sort((left, right) => {
      if (sortBy === 'difficulty') return left.stars - right.stars || left.unit.title.localeCompare(right.unit.title, 'zh-Hant') || left.index - right.index;
      if (sortBy === 'number') return left.index - right.index || left.unit.title.localeCompare(right.unit.title, 'zh-Hant');
      return left.unit.title.localeCompare(right.unit.title, 'zh-Hant') || left.index - right.index;
    }), [records, activeTopic, stars, sortBy]);
  const counts = records.reduce((total, question) => ({ ...total, [question.stars]: (total[question.stars] || 0) + 1 }), {});
  const visiblePreview = visibleQuestions.slice(0, 24);

  const updateSubject = (value) => { setSubject(value); setGrade('P1'); setTopic('全部'); setStars('全部'); };
  const updateGrade = (value) => { setGrade(value); setTopic('全部'); setStars('全部'); };

  return <main className="site-shell teacher-question-page"><header className="topbar teacher-question-topbar"><div className="teacher-question-brand"><Tags size={19} /><span><b>EduQuest</b><small>教師題庫管理</small></span></div>{onBack && <button className="text-button" onClick={onBack}><ArrowLeft size={17} /> 返回課程</button>}</header><section className="teacher-question-hero"><div><span><SlidersHorizontal size={16} /> 題庫篩選與排序</span><h1>快速找到<br />適合講解的題目。</h1><p>先選學科、年級與課題，再按同一單元內由易至難的星級排列；所有題目均附有對應學習目標。</p></div><aside><Target size={20} /><b>{visibleQuestions.length} 題</b><small>符合目前條件</small></aside></section><section className="teacher-question-workbench"><div className="question-filter-grid"><label>學科<select value={activeSubject} onChange={(event) => updateSubject(event.target.value)}>{availableSubjects.map((item) => <option key={item}>{item}</option>)}</select></label><label>年級<select value={activeGrade} onChange={(event) => updateGrade(event.target.value)}>{availableGrades.map((item) => <option key={item}>{item}</option>)}</select></label><label>主題／單元<select value={activeTopic} onChange={(event) => setTopic(event.target.value)}><option value="全部">全部主題</option>{topics.map((unit) => <option value={unit.id} key={unit.id}>{unit.area}・{unit.title}</option>)}</select></label><label>範疇內難度<select value={stars} onChange={(event) => setStars(event.target.value)}><option value="全部">全部星級</option>{starValues.map((value) => <option value={value} key={value}>{'★'.repeat(value)}{'☆'.repeat(5 - value)}（{counts[value] || 0} 題）</option>)}</select></label><label>排序方式<select value={sortBy} onChange={(event) => setSortBy(event.target.value)}><option value="topic">主題次序</option><option value="difficulty">星級由低至高</option><option value="number">題號次序</option></select></label></div><div className="teacher-result-head"><span><Filter size={16} /> {activeSubject}・{activeGrade}</span><b>{activeTopic === '全部' ? '全部課題' : topics.find((unit) => unit.id === activeTopic)?.title}</b><small>星級只在同一單元內比較；顯示首 {Math.min(visiblePreview.length, 24)} 題。</small></div><div className="teacher-question-list">{visiblePreview.map((question) => <article key={question.id}><div className="teacher-question-index"><span>{question.grade}</span><b>{String(question.index + 1).padStart(2, '0')}</b></div><div><div className="teacher-question-meta"><span>{question.unit.area}・{question.unit.title}</span><StarRating value={question.stars} /></div><h2>{question.prompt || question.sentence || question.baseWord}</h2><p><BookMarked size={15} /><strong>講解重點：</strong>{question.learningObjective}</p></div></article>)}{visibleQuestions.length === 0 && <div className="question-profile-empty">這個條件下暫時沒有題目，請調整篩選。</div>}</div></section></main>;
}
