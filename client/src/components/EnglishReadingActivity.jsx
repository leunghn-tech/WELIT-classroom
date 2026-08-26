/* 彩色課程工作檯：英文閱讀以藍色檔案標籤、共用材料與清晰題組脈絡，支援投影閱讀與逐題回饋。 */
import { ArrowLeft, Check, ChevronRight, RotateCcw, Sparkles, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { pauseExamTimer } from '../lib/examTimerStore';
import HintSatchel from './HintSatchel';
import UnitResultSummary from './UnitResultSummary';
import '../englishReading.css';

const shuffle = (items) => {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
};

const buildSession = (unit) => shuffle(unit.passageSets).flatMap((passage, passageIndex) => shuffle(passage.questions).map((question, questionIndex) => ({ ...question, passage, passageIndex, questionIndex })));

function ReadingFrame({ unit, taskLabel }) {
  const grade = unit.id.split('-')[0];
  const label = { P4: '小四', P5: '小五', P6: '小六' }[grade] || grade;
  return <><header className="activity-workbench-frame english-activity-frame"><span className="activity-file-tab">{grade}<br />ENGLISH</span><div className="activity-brand-lockup"><span className="activity-brand-mark"><i></i><i></i><i></i><Sparkles size={18} /></span><div><b>Edu<span>Quest</span></b><small>小學課堂展示版</small></div></div><div className="activity-course-file"><span>{label}・英文</span><b>{unit.area}・{unit.title}</b></div><div className="activity-task-stamp"><span>課堂工作紙</span><b>{taskLabel}</b></div></header>{taskLabel !== '結算' && <HintSatchel title="英文閱讀錦囊" hint="先讀完整篇材料，再圈出題目關鍵詞；回答推論題時，要用文中線索支持你的選擇。" />}</>;
}

export default function EnglishReadingActivity({ unit, onBack, onComplete }) {
  const [questions, setQuestions] = useState(() => buildSession(unit));
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [shuffleRound, setShuffleRound] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const question = questions[questionIndex];
  const choices = useMemo(() => shuffle(question.choices), [question, shuffleRound]);

  const retry = () => { setSelected(null); setFeedback(null); setShuffleRound((round) => round + 1); };
  const answer = (choice) => {
    if (feedback) return;
    const correct = choice === question.answer;
    setSelected(choice);
    setAttempts((count) => count + 1);
    if (correct) setCorrectCount((count) => count + 1);
    setFeedback({ correct });
  };
  const next = () => {
    if (questionIndex >= questions.length - 1) {
      pauseExamTimer();
      onComplete?.(unit, questions.map((item) => item.id));
      setShowSummary(true);
      return;
    }
    setQuestionIndex((index) => index + 1);
    retry();
  };
  const replay = () => { setQuestions(buildSession(unit)); setQuestionIndex(0); setSelected(null); setFeedback(null); setShuffleRound(0); setShowSummary(false); setAttempts(0); setCorrectCount(0); };

  if (showSummary) return <main className="site-shell english-reading-page"><ReadingFrame unit={unit} taskLabel="結算" /><UnitResultSummary unit={unit} total={questions.length} correct={correctCount} attempts={attempts} onBack={onBack} onReplay={replay} title="閱讀題組完成" description="兩篇短篇材料、十條理解題已完成；可利用以下資料與學生重溫事實、詞義、推論及主旨線索。" noun="題" backLabel="返回英文目錄" /></main>;

  const { passage } = question;
  return <main className="site-shell english-reading-page"><ReadingFrame unit={unit} taskLabel={`題組 ${question.passageIndex + 1}・第 ${question.questionIndex + 1} / 5 題`} /><header className="match-topbar english-match-topbar english-reading-topbar"><button onClick={onBack} className="match-back">返回英文目錄</button><div><span>{passage.title}・{question.skill}</span><b>第 {questionIndex + 1} / {questions.length} 題</b></div><div className="match-progress" aria-label={`進度 ${questionIndex + 1} / ${questions.length}`}><i style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }} /></div></header><section className="english-reading-stage"><div className="english-reading-heading"><span><Sparkles size={16} /> 短篇閱讀題組</span><h1>{question.prompt}</h1><p>先閱讀左側材料，再從文中找出支持答案的關鍵線索。</p></div><section className="english-reading-workbench"><article className="english-passage-sheet"><div className="english-passage-head"><span>Passage {question.passageIndex + 1} / {unit.passageSets.length}</span><b>{passage.title}</b><small>{passage.type}</small></div><div className="english-passage-copy">{passage.text.split('\n\n').map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div><footer><span>題組進度</span><b>本篇第 {question.questionIndex + 1} / {passage.questions.length} 題</b></footer></article><section className="english-reading-answer"><div className="bank-title"><span>選擇答案</span><small>選項會重新排列</small></div><div className="english-option-grid" data-option-safety-grid="true" data-question-id={question.id} data-answer-value={String(question.answer)}>{choices.map((choice, index) => <button key={choice} data-choice-value={String(choice)} disabled={Boolean(feedback)} onClick={() => answer(choice)} className={selected === choice ? feedback?.correct ? 'selected-correct' : 'selected-wrong' : ''}><span>{String.fromCharCode(65 + index)}</span><b>{choice}</b></button>)}</div></section></section>{feedback && <section className={`english-feedback ${feedback.correct ? 'correct' : 'incorrect'}`} role="status"><div className="english-feedback-icon">{feedback.correct ? <Check size={22} /> : <X size={22} />}</div><div><b>{feedback.correct ? '答對了！' : '這次還未選中正確答案。'}</b><p>{feedback.correct ? question.explanation : <>正確答案是 <strong>{question.answer}</strong>。{question.explanation}</>}</p><div className="complete-actions">{feedback.correct ? <button onClick={next}>{questionIndex === questions.length - 1 ? '查看結算' : '下一題'} <ChevronRight size={17} /></button> : <button onClick={retry}><RotateCcw size={16} /> 依線索再試</button>}<button onClick={onBack}>返回英文目錄</button></div></div></section>}</section></main>;
}
