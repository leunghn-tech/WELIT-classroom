// EduQuest「彩色課程工作檯」：低小合作模式將既有題庫轉化為「商量作答 → 合力攻擊 → 重試／下一題」的課堂投影活動，並讀取教師自訂戰鬥設定。
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
const readBattleSettings = () => { try { return { ...BATTLE_DEFAULTS, ...(JSON.parse(window.localStorage.getItem('eduquest-feedback-settings') || '{}').battle || {}) }; } catch { return BATTLE_DEFAULTS; } };
const shuffle = (items) => { const next = [...items]; for (let i = next.length - 1; i > 0; i -= 1) { const j = Math.floor(Math.random() * (i + 1)); [next[i], next[j]] = [next[j], next[i]]; } return next; };
const gradeLabel = (grade) => ({ P1: '小一', P2: '小二', P3: '小三' }[grade] || grade);
const makeBattleChoices = (question) => {
  if (Array.isArray(question.choices) && question.choices.length >= 2) return question.choices;
  const numericAnswer = Number(question.answer);
  if (!Number.isFinite(numericAnswer)) return [question.answer];
  const step = question.line?.step || 1;
  const minimum = question.line?.start ?? 0;
  const maximum = question.line?.end ?? Math.max(10, numericAnswer + (step * 5));
  const sameType = (value) => typeof question.answer === 'number' ? value : String(value);
  const choices = [question.answer];
  for (let distance = 1; choices.length < 4 && distance < 8; distance += 1) [numericAnswer - (step * distance), numericAnswer + (step * distance)].forEach((value) => { const candidate = sameType(value); if (value >= minimum && value <= maximum && !choices.includes(candidate) && choices.length < 4) choices.push(candidate); });
  return choices;
};

function BattleHeader({ unit, current, total, onBack, summary = false }) {
  const grade = unit.id.split('-')[0];
  return <><header className="activity-workbench-frame math-activity-frame battle-activity-frame"><span className="activity-file-tab">{grade}<br />MATH</span><div className="activity-brand-lockup"><span className="activity-brand-mark"><i></i><i></i><i></i><Sparkles size={18} /></span><div><b>Edu<span>Quest</span></b><small>小學課堂展示版</small></div></div><div className="activity-course-file"><span>{gradeLabel(grade)}數學</span><b>{unit.title}</b>{summary ? <small>合作任務結算</small> : <small>全班打怪獸・第 {current}／{total} 題</small>}</div>{!summary ? <ExamTimer /> : null}</header><div className="math-activity-controls battle-activity-controls"><button onClick={onBack} className="match-back"><ArrowLeft size={16} /> 結束合作・返回目錄</button><div className="battle-control-note"><Swords size={16} /> 老師引導全班商量後再選答案</div></div></>;
}

export default function TeamMonsterMathActivity({ unit, onBack, onComplete }) {
  const [questions, setQuestions] = useState(() => shuffle(unit.questions));
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [monsterHp, setMonsterHp] = useState(() => unit.questions.length * 10);
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
  const choices = useMemo(() => shuffle(makeBattleChoices(question)), [question, choiceRound]);
  const maxHp = questions.length * 10;
  const status = feedback?.correct ? 'hit' : feedback ? 'retry' : 'ready';
  useEffect(() => { const sync = (event) => setBattleSettings({ ...BATTLE_DEFAULTS, ...(event.detail?.battle || {}) }); window.addEventListener('eduquest-feedback-settings', sync); return () => window.removeEventListener('eduquest-feedback-settings', sync); }, []);
  const celebrate = (kind) => playBattleCelebration(kind, monster.id);
  const setBattleTeamCount = (count) => { const nextCount = clampTeamCount(count); setTeamCount(nextCount); setTeams(createClassroomTeams(nextCount)); setActiveTeamIndex(0); setStreak(0); };
  const adjustTeamScore = (targetIndex, change) => setTeams((current) => current.map((team, index) => index === targetIndex ? { ...team, score: Math.max(0, team.score + change) } : team));
  const answer = (choice) => { if (feedback) return; const isCorrect = choice === question.answer; setAttempts((value) => value + 1); if (isCorrect) { const nextStreak = streak + 1; const kind = nextStreak >= battleSettings.ultimateStreak ? 'ultimate' : nextStreak === battleSettings.skillStreak ? 'skill' : null; const source = kind === 'ultimate' ? monster.ultimate : kind === 'skill' ? monster.skill : null; const bonus = kind === 'ultimate' ? battleSettings.ultimateBonusDamage : kind === 'skill' ? battleSettings.skillBonusDamage : 0; const damage = battleSettings.baseDamage + bonus; const attack = source ? { ...source, kind, threshold: nextStreak, damage } : null; setCorrect((value) => value + 1); setTeams((current) => current.map((team, index) => index === activeTeamIndex ? { ...team, score: team.score + 1, streak: kind === 'ultimate' ? 0 : nextStreak } : team)); setTeamPower((value) => value + (kind === 'ultimate' ? 50 : kind === 'skill' ? 25 : 10)); setMonsterHp((value) => Math.max(0, value - damage)); setStreak(kind === 'ultimate' ? 0 : nextStreak); setSpecialAttack(attack); if (attack) celebrate(kind); setFeedback({ correct: true, choice, damage, special: attack }); } else { setTeams((current) => current.map((team, index) => index === activeTeamIndex ? { ...team, streak: 0 } : team)); setStreak(0); setSpecialAttack(null); setFeedback({ correct: false, choice }); } };
  const retry = () => { setFeedback(null); setSpecialAttack(null); setChoiceRound((value) => value + 1); };
  const next = () => { if (index === questions.length - 1) { pauseExamTimer(); onComplete?.(unit, questions.map((item) => item.id)); setShowSummary(true); return; } setIndex((value) => value + 1); setActiveTeamIndex((value) => (value + 1) % teamCount); setStreak(0); setFeedback(null); setSpecialAttack(null); setChoiceRound((value) => value + 1); };
  const replay = () => { setQuestions(shuffle(unit.questions)); setIndex(0); setFeedback(null); setAttempts(0); setCorrect(0); setMonsterHp(unit.questions.length * 10); setTeamPower(0); setMonster(pickTeamMonster()); setStreak(0); setSpecialAttack(null); setChoiceRound(0); setTeams(createClassroomTeams(teamCount)); setActiveTeamIndex(0); setShowSummary(false); };
  if (showSummary) return <main className="site-shell math-activity-page team-battle-page battle-subject-math"><BattleHeader unit={unit} onBack={onBack} summary /><section className="math-activity-stage"><TeamMonsterPanel current={questions.length} total={questions.length} monsterHp={monsterHp} monsterMaxHp={maxHp} teamPower={teamPower} monster={monster} status="hit" battleSettings={battleSettings} teams={teams} activeTeamIndex={activeTeamIndex} onActivateTeam={setActiveTeamIndex} onAdjustTeamScore={adjustTeamScore} teamCount={teamCount} onTeamCount={setBattleTeamCount} /><UnitResultSummary unit={unit} total={questions.length} correct={correct} attempts={attempts} onBack={onBack} onReplay={replay} title={monsterHp === 0 ? `${monster.name}已被全班擊退！` : '全班合作任務完成！'} description="每一題都由同學一起商量並完成。教師可按正確率安排重試或開啟下一個互動單元。" noun="題" backLabel="返回數學目錄" /></section></main>;
  return <main className="site-shell math-activity-page team-battle-page battle-subject-math"><BattleHeader unit={unit} current={index + 1} total={questions.length} onBack={onBack} /><section className="math-activity-stage team-battle-stage"><TeamMonsterPanel current={index + 1} total={questions.length} monsterHp={monsterHp} monsterMaxHp={maxHp} teamPower={teamPower} streak={streak} specialAttack={specialAttack} monster={monster} status={status} battleSettings={battleSettings} onPreviewAttack={celebrate} teams={teams} activeTeamIndex={activeTeamIndex} onActivateTeam={setActiveTeamIndex} onAdjustTeamScore={adjustTeamScore} teamCount={teamCount} onTeamCount={setBattleTeamCount} /><section className="team-battle-question"><span><Swords size={17} /> {teams[activeTeamIndex]?.name}・輪到你們</span><h1>{question.prompt}</h1><p>先舉手說出想法，全班確認後再由老師或同學選答案。</p><div className="math-option-grid team-battle-options">{choices.map((choice, choiceIndex) => <button key={String(choice)} disabled={Boolean(feedback)} onClick={() => answer(choice)} className={feedback && feedback.choice === choice ? feedback.correct ? 'selected-correct' : 'selected-wrong' : ''}><span>{String.fromCharCode(65 + choiceIndex)}</span><b>{choice}</b></button>)}</div></section>{feedback ? <section className={`math-feedback team-battle-feedback ${feedback.correct ? 'correct' : 'incorrect'} ${feedback.special ? 'special-hit' : ''}`} role="status"><div>{feedback.correct ? <Check size={22} /> : <X size={22} />}</div><section><b>{feedback.special ? `${feedback.special.title}發動！${monster.name}受到 ${feedback.damage} 點傷害。` : feedback.correct ? `${teams[activeTeamIndex]?.name}答對了！${monster.name}被知識光束擊中！` : `${teams[activeTeamIndex]?.name}先看看提示，再商量一次。`}</b><p>{feedback.special ? feedback.special.message : feedback.correct ? question.explanation : <>正確答案是 <strong>{question.answer}</strong>。{question.explanation}</>}</p><div className="complete-actions">{feedback.correct ? <button onClick={next}>{index === questions.length - 1 ? '查看合作結算' : `下一題・換 ${teams[(activeTeamIndex + 1) % teamCount]?.name}`} <ChevronRight size={17} /></button> : <button onClick={retry}><RotateCcw size={16} /> 重新商量再試</button>}<button onClick={onBack}><ArrowLeft size={16} /> 返回數學目錄</button></div></section></section> : null}</section></main>;
}
