import { ArrowLeft, Check, ChevronRight, GripVertical, Lightbulb, RotateCcw, Sparkles, Trophy, Volume1, Volume2, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { pauseExamTimer } from '../lib/examTimerStore';
import { playDragSound } from '../lib/feedbackAudio';
import HintSatchel from './HintSatchel';
import SentenceWithBlank from './SentenceWithBlank';

const shuffle = (items) => {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
};

const readFirstWordSetting = () => {
  try { return JSON.parse(window.localStorage.getItem('eduquest-feedback-settings') || '{}').firstWordHint === true; } catch { return false; }
};

function Frame({ unit, taskLabel }) {
  const grade = unit.id.split('-')[0];
  const gradeLabel = grade === 'P6' ? '小六' : grade === 'P5' ? '小五' : grade === 'P4' ? '小四' : grade === 'P3' ? '小三' : grade === 'P2' ? '小二' : '小一';
  const hint = unit.interaction === 'english-sentence-read' ? '先以正常速度聽一次，留意句子的節奏；需要時轉為慢速，再跟讀兩次。' : '先找句首大寫字母的主詞，再把動詞、時間或地點詞語依序排好；老師開啟時可使用「提示首詞」。';
  return <><header className="activity-workbench-frame english-activity-frame"><span className="activity-file-tab">{grade}<br />ENGLISH</span><div className="activity-brand-lockup"><span className="activity-brand-mark"><i></i><i></i><i></i><Sparkles size={18} /></span><div><b>Edu<span>Quest</span></b><small>小學課堂展示版</small></div></div><div className="activity-course-file"><span>{gradeLabel}・英文</span><b>{unit.area}・{unit.title}</b></div><div className="activity-task-stamp"><span>課堂工作紙</span><b>{taskLabel}</b></div></header>{taskLabel !== '結算' && <HintSatchel hint={hint} title={unit.interaction === 'english-sentence-read' ? '例句跟讀錦囊' : '句子拼砌錦囊'} />}</>;
}

function speak(sentence, rate, { onStart, onBoundary, onEnd } = {}) {
  if (!('speechSynthesis' in window)) return false;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(sentence);
  utterance.lang = 'en-US';
  utterance.rate = rate;
  utterance.onstart = onStart;
  utterance.onboundary = (event) => { if (event.name === 'word') onBoundary?.(event.charIndex); };
  utterance.onend = onEnd;
  utterance.onerror = onEnd;
  window.speechSynthesis.speak(utterance);
  return true;
}

export default function EnglishSentenceActivity({ unit, onBack, onComplete }) {
  const isReading = unit.interaction === 'english-sentence-read';
  const [questions, setQuestions] = useState(() => shuffle(unit.questions));
  const [questionIndex, setQuestionIndex] = useState(0);
  const [heard, setHeard] = useState(false);
  const [speed, setSpeed] = useState('normal');
  const [spokenIndex, setSpokenIndex] = useState(null);
  const [selectedTokens, setSelectedTokens] = useState([]);
  const [draggedId, setDraggedId] = useState(null);
  const [dropPulse, setDropPulse] = useState(false);
  const [firstWordHintEnabled, setFirstWordHintEnabled] = useState(readFirstWordSetting);
  const [hintUsed, setHintUsed] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [shuffleRound, setShuffleRound] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const question = questions[questionIndex];
  const tokens = useMemo(() => shuffle(question.sentence.replace(/[.?!]$/, '').split(' ').map((word, index) => ({ id: `${question.id}-${index}`, word }))), [question, shuffleRound]);
  const availableTokens = tokens.filter((token) => !selectedTokens.some((selected) => selected.id === token.id));
  const firstToken = tokens.find((token) => token.id === `${question.id}-0`);

  useEffect(() => {
    const syncSettings = (event) => setFirstWordHintEnabled(event.detail?.firstWordHint === true);
    window.addEventListener('eduquest-feedback-settings', syncSettings);
    return () => window.removeEventListener('eduquest-feedback-settings', syncSettings);
  }, []);
  useEffect(() => () => { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); }, []);

  const resetQuestion = () => { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); setHeard(false); setSpokenIndex(null); setSelectedTokens([]); setDraggedId(null); setDropPulse(false); setHintUsed(false); setFeedback(null); setShuffleRound((round) => round + 1); };
  const goNext = () => {
    if (questionIndex >= questions.length - 1) { pauseExamTimer(); onComplete?.(unit, questions.map((item) => item.id)); setShowSummary(true); return; }
    setQuestionIndex((index) => index + 1);
    resetQuestion();
  };
  const replay = () => { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); setQuestions(shuffle(unit.questions)); setQuestionIndex(0); setHeard(false); setSpokenIndex(null); setSelectedTokens([]); setDraggedId(null); setDropPulse(false); setHintUsed(false); setFeedback(null); setShuffleRound(0); setShowSummary(false); setAttempts(0); setCorrectCount(0); };
  const checkSentence = () => {
    if (feedback || selectedTokens.length !== tokens.length) return;
    const correct = `${selectedTokens.map((token) => token.word).join(' ')}.` === question.sentence;
    setAttempts((count) => count + 1);
    if (correct) setCorrectCount((count) => count + 1);
    setFeedback({ correct });
  };
  const finishReading = () => { if (!heard) return; setAttempts((count) => count + 1); setCorrectCount((count) => count + 1); setFeedback({ correct: true }); };
  const startDrag = (event, token) => { event.dataTransfer.effectAllowed = 'move'; event.dataTransfer.setData('text/plain', token.id); setDraggedId(token.id); };
  const addToken = (token) => { if (!feedback) setSelectedTokens((current) => current.some((item) => item.id === token.id) ? current : [...current, token]); };
  const showDropFeedback = () => { playDragSound(); setDropPulse(true); window.setTimeout(() => setDropPulse(false), 420); };
  const dropToken = (event, targetId) => {
    event.preventDefault();
    if (feedback) return;
    const id = event.dataTransfer.getData('text/plain') || draggedId;
    const token = tokens.find((item) => item.id === id);
    if (!token) return;
    setSelectedTokens((current) => {
      const withoutToken = current.filter((item) => item.id !== token.id);
      const targetIndex = targetId ? withoutToken.findIndex((item) => item.id === targetId) : withoutToken.length;
      const insertAt = targetIndex < 0 ? withoutToken.length : targetIndex;
      return [...withoutToken.slice(0, insertAt), token, ...withoutToken.slice(insertAt)];
    });
    setDraggedId(null);
    showDropFeedback();
  };
  const revealFirstWord = () => {
    if (!firstToken || feedback || hintUsed) return;
    setSelectedTokens((current) => current.some((item) => item.id === firstToken.id) ? current : [firstToken, ...current]);
    setHintUsed(true);
  };

  if (showSummary) {
    const accuracy = attempts ? Math.round((correctCount / attempts) * 100) : 0;
    return <main className="site-shell english-choice-page"><Frame unit={unit} taskLabel="結算" /><section className="english-summary activity-summary"><span><Trophy size={22} /> 完成任務</span><h1>{unit.title}完成了！</h1><p>你已完成 {questions.length} 題練習，完成度為 {accuracy}%。</p><div><button onClick={onBack} className="english-back-button"><ArrowLeft size={17} /> 返回英文目錄</button><button onClick={replay} className="english-primary-button"><RotateCcw size={17} /> 隨機再玩一次</button></div></section></main>;
  }

  return <main className="site-shell english-choice-page"><Frame unit={unit} taskLabel={`任務 ${questionIndex + 1} / ${questions.length}`} /><header className="match-topbar english-match-topbar"><button onClick={onBack} className="match-back">返回英文目錄</button><div><span>{unit.area}・{unit.title}</span><b>第 {questionIndex + 1} / {questions.length} 題</b></div><div className="match-progress"><i style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }} /></div></header><section className="english-activity-stage english-sentence-stage"><div className="match-heading"><span><Sparkles size={16} /> {isReading ? '例句朗讀任務' : '句子拼砌任務'}</span><h1>{isReading ? '先聆聽，再跟讀這個例句。' : '看中文意思，把英文詞語排成完整句子。'}</h1><p>老師提示：{isReading ? '先選播放速度，再按播放鍵聆聽句子；朗讀時詞語會依序高亮。' : '可拖曳詞語到答案區並重新排序；平板可點選詞語作備援。'}</p></div><section className="english-sentence-paper"><span>中文意思</span><b>{question.translation}</b><p>{isReading ? <SentenceWithBlank text={question.sentence} highlightCharIndex={spokenIndex} showZoom={false} /> : `請拼砌出表示「${question.translation}」的英文句子。`}</p>{isReading ? <><div className="english-speed-toggle" role="group" aria-label="例句播放速度"><span>播放速度</span><button className={speed === 'slow' ? 'active' : ''} onClick={() => setSpeed('slow')}><Volume1 size={16} /> 慢速</button><button className={speed === 'normal' ? 'active' : ''} onClick={() => setSpeed('normal')}><Volume2 size={16} /> 正常</button></div><button className={`english-listen-button ${heard ? 'heard' : ''}`} onClick={() => { const started = speak(question.sentence, speed === 'slow' ? 0.58 : 0.9, { onStart: () => setSpokenIndex(0), onBoundary: setSpokenIndex, onEnd: () => setSpokenIndex(null) }); if (started) setHeard(true); }}><Volume2 size={22} /> <span>播放{speed === 'slow' ? '慢速' : '正常速度'}例句</span><small>{heard ? '已播放・請跟讀' : 'Listen and repeat'}</small></button></> : <div className="english-build-zone"><div className="english-drag-help"><GripVertical size={16} /> 可拖曳詞語到答案區並重新排序；點選仍可使用。</div>{firstWordHintEnabled && <div className="english-first-word-hint"><span><Lightbulb size={16} /> 老師已開啟首詞提示</span><button disabled={hintUsed} onClick={revealFirstWord}>{hintUsed ? `已提示：${firstToken?.word}` : '提示首詞'}</button></div>}<div className={`english-sentence-slot ${dropPulse ? 'drop-pulse' : ''}`} onDragOver={(event) => event.preventDefault()} onDrop={(event) => dropToken(event)} aria-label="已選詞語" aria-live="polite">{selectedTokens.length ? selectedTokens.map((token) => <button key={token.id} draggable={!feedback} onDragStart={(event) => startDrag(event, token)} onDragEnd={() => setDraggedId(null)} onDragOver={(event) => event.preventDefault()} onDrop={(event) => dropToken(event, token.id)} onClick={() => !feedback && setSelectedTokens((current) => current.filter((item) => item.id !== token.id))} className={draggedId === token.id ? 'dragging' : ''}><GripVertical size={13} /> {token.word}</button>) : <span>把下方英文詞語拖到這裡，或點選詞語</span>}</div><div className="english-word-bank">{availableTokens.map((token) => <button key={token.id} draggable={!feedback} disabled={Boolean(feedback)} onDragStart={(event) => startDrag(event, token)} onDragEnd={() => setDraggedId(null)} onClick={() => addToken(token)} className={draggedId === token.id ? 'dragging' : ''}><GripVertical size={13} /> {token.word}</button>)}</div><div className="english-build-actions"><button onClick={resetQuestion}><RotateCcw size={16} /> 重排</button><button className="english-primary-button" disabled={selectedTokens.length !== tokens.length || Boolean(feedback)} onClick={checkSentence}>檢查句子 <Check size={16} /></button></div></div>}</section>{(isReading ? heard : feedback) && <section className={`english-feedback ${feedback?.correct ? 'correct' : feedback ? 'incorrect' : 'ready'}`}><div className="english-feedback-icon">{feedback?.correct ? <Check size={22} /> : feedback ? <X size={22} /> : <Volume2 size={22} />}</div><div><b>{feedback?.correct ? '做得好！' : feedback ? '再檢查看看句子順序。' : '聽完後，按「我已跟讀」完成本題。'}</b><p>{feedback?.correct ? `例句：${question.sentence}` : feedback ? `正確句子是：${question.sentence}` : '跟讀時注意每個英文詞語之間的節奏。'}</p><div className="complete-actions">{isReading && !feedback ? <button onClick={finishReading}>我已跟讀 <Check size={17} /></button> : feedback?.correct ? <button onClick={goNext}>{questionIndex === questions.length - 1 ? '查看結算' : '下一題'} <ChevronRight size={17} /></button> : feedback ? <button onClick={resetQuestion}><RotateCcw size={16} /> 重排再試</button> : null}<button onClick={onBack}>返回英文目錄</button></div></div></section>}</section></main>;
}
