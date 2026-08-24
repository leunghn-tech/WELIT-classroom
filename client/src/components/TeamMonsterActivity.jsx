// EduQuest 低小跨科合作模式：將中文、英文及數學的可選答題庫轉為「全班商量 → 合力攻擊」的課堂遊戲。
import { ArrowLeft, Check, ChevronRight, RotateCcw, Sparkles, Swords, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { pauseExamTimer } from '../lib/examTimerStore';
import { playBattleCelebration } from '../lib/battleSounds';
import ExamTimer from './ExamTimer';
import TeamMonsterPanel, { pickTeamMonster } from './TeamMonsterPanel';
import UnitResultSummary from './UnitResultSummary';
import { clampTeamCount, createClassroomTeams } from '../lib/classroomTeams';
import '../mathLearning.css';

const BATTLE_DEFAULTS = { skillStreak: 3, ultimateStreak: 5, baseDamage: 10, skillBonusDamage: 15, ultimateBonusDamage: 35 };
const SUBJECT_LABELS = { 中文: '中國語文', 英文: 'English', 數學: '數學' };
const gradeLabel = (grade) => ({ P1: '小一', P2: '小二', P3: '小三' }[grade] || grade);
const shuffle = (items) => { const next = [...items]; for (let i = next.length - 1; i > 0; i -= 1) { const j = Math.floor(Math.random() * (i + 1)); [next[i], next[j]] = [next[j], next[i]]; } return next; };
const readBattleSettings = () => { try { return { ...BATTLE_DEFAULTS, ...(JSON.parse(window.localStorage.getItem('eduquest-feedback-settings') || '{}').battle || {}) }; } catch { return BATTLE_DEFAULTS; } };
const asBattleQuestion = (question) => {
  if (Array.isArray(question.choices) && question.choices.length >= 2 && question.answer !== undefined) return question;
  if (Array.isArray(question.matches) && question.matches.length >= 2) { const target = question.matches[0]; return { id: question.id, prompt: `${question.prompt} 這一輪請選出「${target.symbol}」代表的字詞。`, choices: question.matches.map((item) => item.word), answer: target.word, explanation: `${target.symbol} 代表「${target.word}」。${target.meaning}。` }; }
  return null;
};

function BattleHeader({ unit, subject, current, total, onBack, summary = false }) {
  const grade = unit.id.split('-')[0];
  return <><header className="activity-workbench-frame math-activity-frame battle-activity-frame cross-subject-battle-frame"><span className="activity-file-tab">{grade}<br />{subject === '中文' ? 'CN' : 'EN'}</span><div className="activity-brand-lockup"><span className="activity-brand-mark"><i></i><i></i><i></i><Sparkles size={18} /></span><div><b>Edu<span>Quest</span></b><small>小學課堂展示版</small></div></div><div className="activity-course-file"><span>{gradeLabel(grade)}・{SUBJECT_LABELS[subject]}</span><b>{unit.title}</b><small>{summary ? '合作任務結算' : `全班打怪獸・第 ${current}／${total} 題`}</small></div>{!summary ? <ExamTimer /> : null}</header><div className="math-activity-controls battle-activity-controls"><button onClick={onBack} className="match-back"><ArrowLeft size={16} /> 結束合作・返回目錄</button><div className="battle-control-note"><Swords size={16} /> 老師引導全班商量後再選答案</div></div></>;
}

export default function TeamMonsterActivity({ unit, subject, onBack, onComplete }) {
  const [questions, setQuestions] = useState(() => shuffle(unit.questions.map(asBattleQuestion).filter(Boolean)).slice(0, 10));
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [monsterHp, setMonsterHp] = useState(() => Math.max(1, unit.questions.length) * 10);
  const [teamPower, setTeamPower] = useState(0);
  const [monster, setMonster] = useState(() => pickTeamMonster());
  const [streak, setStreak] = useState(0);
  const [specialAttack, setSpecialAttack] = useState(null);
  const [choiceRound, setChoiceRound] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [battleSettings, setBattleSettings] = useState(readBattleSettings);
  const [teamCount, setTeamCount] = useState(2);
  const [teams, setTeams] = useState(() => createClassroomTeams(2));
  const [activeTeamIndex, setActiveTeamIndex] = useState(0);
  const question = questions[index];
  const choices = useMemo(() => question ? shuffle(question.choices) : [], [question, choiceRound]);
  const maxHp = Math.max(1, questions.length) * 10;
  const status = feedback?.correct ? 'hit' : feedback ? 'retry' : 'ready';
  useEffect(() => { const sync = (event) => setBattleSettings({ ...BATTLE_DEFAULTS, ...(event.detail?.battle || {}) }); window.addEventListener('eduquest-feedback-settings', sync); return () => window.removeEventListener('eduquest-feedback-settings', sync); }, []);
  const celebrate = (kind) => playBattleCelebration(kind, monster.id);
  const setBattleTeamCount = (count) => { const nextCount = clampTeamCount(count); setTeamCount(nextCount); setTeams(createClassroomTeams(nextCount)); setActiveTeamIndex(0); setStreak(0); };
  const adjustTeamScore = (targetIndex, change) => setTeams((current) => current.map((team, index) => index === targetIndex ? { ...team, score: Math.max(0, team.score + change) } : team));
  const answer = (choice) => { if (feedback) return; const isCorrect = choice === question.answer; setAttempts((value) => value + 1); if (isCorrect) { const nextStreak = streak + 1; const kind = nextStreak >= battleSettings.ultimateStreak ? 'ultimate' : nextStreak === battleSettings.skillStreak ? 'skill' : null; const source = kind === 'ultimate' ? monster.ultimate : kind === 'skill' ? monster.skill : null; const bonus = kind === 'ultimate' ? battleSettings.ultimateBonusDamage : kind === 'skill' ? battleSettings.skillBonusDamage : 0; const damage = battleSettings.baseDamage + bonus; const attack = source ? { ...source, kind, threshold: nextStreak, damage } : null; setCorrect((value) => value + 1); setTeams((current) => current.map((team, index) => index === activeTeamIndex ? { ...team, score: team.score + 1, streak: kind === 'ultimate' ? 0 : nextStreak } : team)); setTeamPower((value) => value + (kind === 'ultimate' ? 50 : kind === 'skill' ? 25 : 10)); setMonsterHp((value) => Math.max(0, value - damage)); setStreak(kind === 'ultimate' ? 0 : nextStreak); setSpecialAttack(attack); if (attack) celebrate(kind); setFeedback({ correct: true, choice, damage, special: attack }); } else { setTeams((current) => current.map((team, index) => index === activeTeamIndex ? { ...team, streak: 0 } : team)); setStreak(0); setSpecialAttack(null); setFeedback({ correct: false, choice }); } };
  const retry = () => { setFeedback(null); setSpecialAttack(null); setChoiceRound((value) => value + 1); };
  const next = () => { if (index === questions.length - 1) { pauseExamTimer(); onComplete?.(unit, questions.map((item) => item.id)); setShowSummary(true); return; } setIndex((value) => value + 1); setActiveTeamIndex((value) => (value + 1) % teamCount); setStreak(0); setFeedback(null); setSpecialAttack(null); setChoiceRound((value) => value + 1); };
  const replay = () => { setQuestions(shuffle(unit.questions.map(asBattleQuestion).filter(Boolean)).slice(0, 10)); setIndex(0); setFeedback(null); setAttempts(0); setCorrect(0); setMonsterHp(maxHp); setTeamPower(0); setMonster(pickTeamMonster()); setStreak(0); setSpecialAttack(null); setChoiceRound(0); setTeams(createClassroomTeams(teamCount)); setActiveTeamIndex(0); setShowSummary(false); };
  const subjectClass = subject === '中文' ? 'battle-subject-chinese' : 'battle-subject-english';
  if (!questions.length) return <main className={`site-shell math-activity-page team-battle-page ${subjectClass}`}><BattleHeader unit={unit} subject={subject} onBack={onBack} summary /><section className="math-activity-stage"><section className="team-battle-question no-battle-questions"><span><Swords size={17} /> 全班打怪獸</span><h1>這個單元暫時需要個別操作。</h1><p>請從目錄選擇帶有「全班合力開戰」標示的單元，或以一般互動完成這個拖曳／排序任務。</p><button onClick={onBack} className="match-back"><ArrowLeft size={16} /> 返回目錄選擇遊戲</button></section></section></main>;
  if (showSummary) return <main className={`site-shell math-activity-page team-battle-page ${subjectClass}`}><BattleHeader unit={unit} subject={subject} onBack={onBack} summary /><section className="math-activity-stage"><TeamMonsterPanel current={questions.length} total={questions.length} monsterHp={monsterHp} monsterMaxHp={maxHp} teamPower={teamPower} monster={monster} status="hit" battleSettings={battleSettings} teams={teams} activeTeamIndex={activeTeamIndex} onActivateTeam={setActiveTeamIndex} onAdjustTeamScore={adjustTeamScore} teamCount={teamCount} onTeamCount={setBattleTeamCount} /><UnitResultSummary unit={unit} total={questions.length} correct={correct} attempts={attempts} onBack={onBack} onReplay={replay} title={monsterHp === 0 ? `${monster.name}已被全班擊退！` : '全班合作任務完成！'} description="每一題都由同學一起商量並完成。教師可按正確率安排重試或開啟下一個互動單元。" noun="題" backLabel={`返回${subject}目錄`} /></section></main>;
  return <main className={`site-shell math-activity-page team-battle-page ${subjectClass}`}><BattleHeader unit={unit} subject={subject} current={index + 1} total={questions.length} onBack={onBack} /><section className="math-activity-stage team-battle-stage"><TeamMonsterPanel current={index + 1} total={questions.length} monsterHp={monsterHp} monsterMaxHp={maxHp} teamPower={teamPower} streak={streak} specialAttack={specialAttack} monster={monster} status={status} battleSettings={battleSettings} onPreviewAttack={celebrate} teams={teams} activeTeamIndex={activeTeamIndex} onActivateTeam={setActiveTeamIndex} onAdjustTeamScore={adjustTeamScore} teamCount={teamCount} onTeamCount={setBattleTeamCount} /><section className="team-battle-question"><span><Swords size={17} /> {teams[activeTeamIndex]?.name}・輪到你們</span><h1>{question.prompt}</h1><p>先舉手說出想法，全班確認後再由老師或同學選答案。</p><div className="math-option-grid team-battle-options">{choices.map((choice, choiceIndex) => <button key={String(choice)} disabled={Boolean(feedback)} onClick={() => answer(choice)} className={feedback && feedback.choice === choice ? feedback.correct ? 'selected-correct' : 'selected-wrong' : ''}><span>{String.fromCharCode(65 + choiceIndex)}</span><b>{choice}</b></button>)}</div></section>{feedback ? <section className={`math-feedback team-battle-feedback ${feedback.correct ? 'correct' : 'incorrect'} ${feedback.special ? 'special-hit' : ''}`} role="status"><div>{feedback.correct ? <Check size={22} /> : <X size={22} />}</div><section><b>{feedback.special ? `${feedback.special.title}發動！${monster.name}受到 ${feedback.damage} 點傷害。` : feedback.correct ? `${teams[activeTeamIndex]?.name}答對了！${monster.name}被知識光束擊中！` : `${teams[activeTeamIndex]?.name}先看看提示，再商量一次。`}</b><p>{feedback.special ? feedback.special.message : feedback.correct ? question.explanation : <>正確答案是 <strong>{question.answer}</strong>。{question.explanation}</>}</p><div className="complete-actions">{feedback.correct ? <button onClick={next}>{index === questions.length - 1 ? '查看合作結算' : `下一題・換 ${teams[(activeTeamIndex + 1) % teamCount]?.name}`} <ChevronRight size={17} /></button> : <button onClick={retry}><RotateCcw size={16} /> 重新商量再試</button>}<button onClick={onBack}><ArrowLeft size={16} /> 返回目錄</button></div></section></section> : null}</section></main>;
}
