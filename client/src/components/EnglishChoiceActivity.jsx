import { ArrowLeft, Check, ChevronRight, RotateCcw, Sparkles, Trophy, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { pauseExamTimer } from '../lib/examTimerStore';
import HintSatchel from './HintSatchel';
import EnglishSentenceListenButton from './EnglishSentenceListenButton';
import SentenceWithBlank from './SentenceWithBlank';

const shuffle = (items) => {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
};

const labels = {
  'english-letter-choice': { name: '字母偵察任務', tip: '先看清楚字母的形狀，再點選正確答案。', material: 'Letter card' },
  'english-vocabulary-choice': { name: '生活單字任務', tip: '先看中文圖意提示，再大聲讀出你認得的英文單字。', material: '中文圖意 / LOOK' },
  'english-article-choice': { name: 'A / An 任務', tip: '聽一聽單字開頭的聲音，再選 a 或 an。', material: 'Sentence clue' },
  'english-preposition-choice': { name: '位置偵察任務', tip: '先看物件的位置，再選出最合適的英文位置詞。', material: 'Place clue' },
  'english-noun-choice': { name: '名詞任務', tip: '先看數量，再留意名詞的單數、複數與不規則變化。', material: 'Noun clue' },
  'english-pronoun-foundation-choice': { name: '代名詞任務', tip: '先看句中代表的是誰或誰的物品，再選合適的代名詞。', material: 'Pronoun clue' },
  'english-be-have-choice': { name: 'to be／to have 任務', tip: '先找主語是單數還是複數，再配對 am、is、are、have 或 has。', material: 'Verb clue' },
  'english-continuous-choice': { name: '現在進行式任務', tip: '先找 now、look、listen 等時間提示，再選 be + V-ing。', material: 'Time clue' },
  'english-present-choice': { name: '一般現在式任務', tip: '先找 always、usually、every day 等習慣提示。', material: 'Habit clue' },
  'english-question-choice': { name: 'Wh-Questions 任務', tip: '先看答案是人物、地點、時間、物件還是數量。', material: 'Question clue' },
  'english-modal-choice': { name: 'Can / Can’t 任務', tip: '想一想主語是否真的有這種能力。', material: 'Ability clue' },
  'english-past-choice': { name: '一般過去式任務', tip: '先找 yesterday、last night、ago 等過去時間提示。', material: 'Past clue' },
  'english-irregular-choice': { name: '不規則動詞任務', tip: '想一想動詞的特別過去式變化。', material: 'Verb clue' },
  'english-pronoun-choice': { name: '代名詞任務', tip: '先看空格的位置，再選賓格或所有格代名詞。', material: 'Pronoun clue' },
  'english-connector-choice': { name: '連接詞任務', tip: '先想想兩句是並列、轉折、選擇還是原因關係。', material: 'Link clue' },
  'english-quantifier-choice': { name: '數量詞任務', tip: '先判斷名詞是否可數，再看句子是肯定、否定還是問句。', material: 'Quantity clue' },
  'english-adjective-choice': { name: '形容詞與副詞任務', tip: '先找被修飾的是名詞還是動詞。', material: 'Modifier clue' },
  'english-comparative-choice': { name: '比較級任務', tip: '先看是兩者比較還是多者比較，再選比較級或最高級。', material: 'Compare clue' },
  'english-advanced-modal-choice': { name: '規則與建議任務', tip: '想一想句子表達的是必要、禁止、建議還是責任。', material: 'Rule clue' },
  'english-reflexive-choice': { name: '反身代名詞任務', tip: '先看主語是誰，再選同一個人或物的反身代名詞。', material: 'Self clue' },
  'english-advanced-connector-choice': { name: '進階連接詞任務', tip: '先辨認句子之間的時間、條件或讓步關係。', material: 'Link clue' },
  'english-perfect-choice': { name: '現在完成式任務', tip: '先看主語配 have 還是 has，再找出動詞的第三態。', material: 'Perfect clue' },
  'english-perfect-time-choice': { name: '時間線索任務', tip: '先分辨是時間點還是時間長度，再找 already、yet、ever、never 或 just 的意思。', material: 'Time clue' },
  'english-passive-choice': { name: '被動語態任務', tip: '先找動作的承受者，再看時間決定用 am、is、are、was 或 were。', material: 'Passive clue' },
  'english-relative-choice': { name: '關係從句任務', tip: '先分辨要補的是人、物件，還是所屬關係。', material: 'Relative clue' },
  'english-correlative-choice': { name: '成對連接詞任務', tip: '先找句中的第一個搭配詞，再補上和它成對的連接詞。', material: 'Pair clue' },
  'english-conditional-choice': { name: '條件句任務', tip: '先判斷是真理、未來可能，還是假設情況，再配對兩個子句的時態。', material: 'Condition clue' },
  'english-reported-choice': { name: '轉述任務', tip: '先找說話者、時間詞和時態，再把直接說話改為轉述句。', material: 'Speech clue' },
  'english-nonfinite-choice': { name: '動詞搭配任務', tip: '先記住前面的動詞搭配，再決定接 V-ing 或 to + verb。', material: 'Verb clue' },
  'english-phrasal-choice': { name: '短語動詞任務', tip: '先看整個情境，再判斷動詞加上介詞後的特別意思。', material: 'Phrase clue' },
  'english-phonics-choice': { name: '拼讀任務', tip: '先慢慢讀出字首的兩個字母，再找出有相同聲音的單字。', material: 'Sound clue' },
  'english-there-be-choice': { name: '位置與數量任務', tip: '先數一數有多少東西；一個用 There is，多於一個用 There are。', material: 'Place clue' },
  'english-past-continuous-choice': { name: '過去時態任務', tip: '留意過去的特定時間；was／were + V-ing 表示當時正在發生的事。', material: 'Time clue' },
  'english-nonfinite-basic-choice': { name: '動詞搭配任務', tip: '先看前面的動詞，再判斷後面要接 V-ing 還是 to + verb。', material: 'Verb clue' },
  'english-future-choice': { name: '將來式任務', tip: '留意 tomorrow、next week 等未來時間提示，再選 will 或 be going to。', material: 'Future clue' },
  'english-quantifiers-advanced-choice': { name: '進階數量詞任務', tip: '先看名詞能否逐個數，再判斷數量是少、很多還是足夠。', material: 'Quantity clue' },
  'english-initial-final-phonics-choice': { name: '首尾音拼讀任務', tip: '先慢慢讀出單字，再留意它第一個或最後一個發音。', material: 'Sound clue' },
};

function ActivityFrame({ unit, taskLabel }) {
  const grade = unit.id.split('-')[0];
  const gradeLabel = grade === 'P6' ? '小六' : grade === 'P5' ? '小五' : grade === 'P4' ? '小四' : grade === 'P3' ? '小三' : grade === 'P2' ? '小二' : '小一';
  const hint = labels[unit.interaction]?.tip;
  return <><header className="activity-workbench-frame english-activity-frame"><span className="activity-file-tab">{grade}<br />ENGLISH</span><div className="activity-brand-lockup"><span className="activity-brand-mark"><i></i><i></i><i></i><Sparkles size={18} /></span><div><b>Edu<span>Quest</span></b><small>小學課堂展示版</small></div></div><div className="activity-course-file"><span>{gradeLabel}・英文</span><b>{unit.area}・{unit.title}</b></div><div className="activity-task-stamp"><span>課堂工作紙</span><b>{taskLabel}</b></div></header>{taskLabel !== '結算' && <HintSatchel hint={hint} title="英文解題錦囊" />}</>;
}

function MaterialCard({ question, interaction, label }) {
  const isLetter = interaction === 'english-letter-choice';
  const isVocabulary = interaction === 'english-vocabulary-choice';
  const [spokenIndex, setSpokenIndex] = useState(null);
  return <section className={`english-material-card ${isLetter ? 'letter' : ''}`}><div className="english-material-head"><span>{label.material}</span><small>{isVocabulary ? '先看圖意，再選英文答案' : 'Read and choose'}</small></div>{isLetter && <div className="english-letter-cue">{question.letter}</div>}{isVocabulary && <div className="english-word-cue"><span>{question.symbol}</span><small>中文提示</small><b>{question.clueChinese}</b></div>}{!isLetter && !isVocabulary && <><div className="english-scene-cue">{question.symbol}</div>{question.scene && <small className="english-scene-copy">{question.scene}</small>}<p><SentenceWithBlank text={question.sentence} highlightCharIndex={spokenIndex} /></p><EnglishSentenceListenButton sentence={question.sentence} label="聽句子" onStart={() => setSpokenIndex(0)} onBoundary={setSpokenIndex} onEnd={() => setSpokenIndex(null)} /></>}</section>;
}

export default function EnglishChoiceActivity({ unit, onBack, onComplete }) {
  const [questions, setQuestions] = useState(() => shuffle(unit.questions));
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [shuffleRound, setShuffleRound] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const question = questions[questionIndex];
  const label = labels[unit.interaction];
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
  const replay = () => {
    setQuestions(shuffle(unit.questions));
    setQuestionIndex(0);
    setSelected(null);
    setFeedback(null);
    setShuffleRound(0);
    setShowSummary(false);
    setAttempts(0);
    setCorrectCount(0);
  };

  if (showSummary) {
    const accuracy = attempts ? Math.round((correctCount / attempts) * 100) : 0;
    return <main className="site-shell english-choice-page"><ActivityFrame unit={unit} taskLabel="結算" /><section className="english-summary activity-summary"><span><Trophy size={22} /> 完成任務</span><h1>{unit.title}完成了！</h1><p>你已完成 {questions.length} 題練習。答對 {correctCount} 題，作答準確度為 {accuracy}%。</p><div><button onClick={onBack} className="english-back-button"><ArrowLeft size={17} /> 返回英文目錄</button><button onClick={replay} className="english-primary-button"><RotateCcw size={17} /> 隨機再玩一次</button></div></section></main>;
  }

  return <main className="site-shell english-choice-page"><ActivityFrame unit={unit} taskLabel={`任務 ${questionIndex + 1} / ${questions.length}`} /><header className="match-topbar english-match-topbar"><button onClick={onBack} className="match-back">返回英文目錄</button><div><span>{unit.area}・{unit.title}</span><b>第 {questionIndex + 1} / {questions.length} 題</b></div><div className="match-progress" aria-label={`進度 ${questionIndex + 1} / ${questions.length}`}><i style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }} /></div></header><section className="english-activity-stage"><div className="match-heading"><span><Sparkles size={16} /> {label.name}</span><h1>{question.prompt}</h1><p>老師提示：{label.tip}</p></div><section className="english-worksheet"><MaterialCard key={question.id} question={question} interaction={unit.interaction} label={label} /><section className="english-answer-zone"><div className="bank-title"><span>選擇答案</span><small>每次開始會重新排列</small></div><div className="english-option-grid" data-option-safety-grid="true" data-question-id={question.id} data-answer-value={String(question.answer)}>{choices.map((choice, index) => <button key={choice} data-choice-value={String(choice)} disabled={Boolean(feedback)} onClick={() => answer(choice)} className={selected === choice ? feedback?.correct ? 'selected-correct' : 'selected-wrong' : ''}><span>{String.fromCharCode(65 + index)}</span><b>{choice}</b></button>)}</div></section></section>{feedback && <section className={`english-feedback ${feedback.correct ? 'correct' : 'incorrect'}`} role="status"><div className="english-feedback-icon">{feedback.correct ? <Check size={22} /> : <X size={22} />}</div><div><b>{feedback.correct ? '答對了！' : '這次還未選中正確答案。'}</b><p>{feedback.correct ? question.explanation : <>正確答案是 <strong>{question.answer}</strong>。{question.explanation}</>}</p><div className="complete-actions">{feedback.correct ? <button onClick={next}>{questionIndex === questions.length - 1 ? '查看結算' : '下一題'} <ChevronRight size={17} /></button> : <button onClick={retry}><RotateCcw size={16} /> 依提示再試</button>}<button onClick={onBack}>返回英文目錄</button></div></div></section>}</section></main>;
}
