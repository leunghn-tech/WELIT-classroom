import { ArrowDown, ArrowLeft, ArrowUp, CheckCircle2, ClipboardList, Dice5, Download, Play, Plus, Sparkles, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import OfflineStatus from './OfflineStatus';

const SUBJECTS = ['中文', '英文', '數學'];
const GRADES = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'];
const STORAGE_KEY = 'welitquest-classroom-session-once';
const defaultSession = () => ({ title: '', createdAt: new Date().toISOString(), items: [], completedKeys: [] });
const readSession = () => { try { const saved = JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) || 'null'); return saved && Array.isArray(saved.items) ? saved : defaultSession(); } catch { return defaultSession(); } };
const unitKey = (subject, unit) => `${subject}:${unit.id}`;

function downloadSummary(session) {
  const lines = [
    ['WelitQuest 課堂摘要'],
    [`課堂名稱,${session.title || '未命名課堂'}`],
    [`建立時間,${new Date(session.createdAt).toLocaleString('zh-HK')}`],
    ['次序,學科,年級,單元,題數,狀態'],
    ...session.items.map((item, index) => [index + 1, item.subject, item.grade, item.title, item.questionCount, session.completedKeys.includes(item.key) ? '已完成' : '未完成']),
  ].map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\n');
  const url = URL.createObjectURL(new Blob([`\uFEFF${lines}`], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `welitquest-${session.title?.trim() || 'classroom-session'}-summary.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export function TeacherActivityControls({ session, activeUnit, onBack, onOpenToolkit, onOpenQuickExit, onNextPlanned }) {
  const nextItem = session.items.find((item) => !session.completedKeys.includes(item.key) && item.unitId !== activeUnit.id);
  return <aside className="teacher-activity-controls" aria-label="教師課堂主控列"><span><Sparkles size={15} /> 教師控制</span><b>{session.title || '未命名課堂'}</b><OfflineStatus /><button onClick={onOpenQuickExit}><Dice5 size={16} /> 出口題</button><button onClick={onOpenToolkit}><ClipboardList size={16} /> 本課清單</button><button onClick={onBack}><ArrowLeft size={16} /> 返回目錄</button><button className="teacher-next-lesson" onClick={onNextPlanned} disabled={!nextItem}><Play size={16} fill="currentColor" /> {nextItem ? '下一項' : '已完成清單'}</button></aside>;
}

function ClearConfirmDialog({ session, completed, onBackup, onCancel, onContinue, onClear }) {
  const [finalStep, setFinalStep] = useState(false);
  const clearScope = `${session.items.length} 個單元、${completed} 個完成標記，以及出口題抽題與票數紀錄`;
  return <div className="clear-confirm-backdrop" role="presentation"><section className="clear-confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="clear-confirm-title"><span>清除本課・{finalStep ? '最後確認' : '先備份再確認'}</span><h2 id="clear-confirm-title">{finalStep ? '確定要清除本課嗎？' : '清除前，先下載摘要備份。'}</h2>{finalStep ? <p>按下「確認清除」後，<b>{clearScope}</b>會立即清除，而且無法復原。</p> : <><p>即將清除 <b>{clearScope}</b>。如要保留本次教學紀錄，可先下載不含學生姓名的課堂摘要。</p><button className="clear-backup-button" onClick={onBackup}><Download size={17} /> 先下載摘要備份</button></>}<footer><button onClick={onCancel}>取消・保留資料</button>{finalStep ? <button className="clear-danger-button" onClick={onClear}><Trash2 size={16} /> 確認清除</button> : <button className="clear-continue-button" onClick={() => setFinalStep(true)}>已備份／不需要備份・繼續</button>}</footer></section></div>;
}

export default function TeacherClassroomToolkit({ questionBanks, session: initialSession, onSessionChange, onEndSession, onBack, onStartUnit }) {
  const [session, setSession] = useState(initialSession || readSession);
  const [subject, setSubject] = useState('中文');
  const [grade, setGrade] = useState('P1');
  const [notice, setNotice] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [clearedToast, setClearedToast] = useState(false);
  useEffect(() => { setSession(initialSession || readSession()); }, [initialSession]);
  useEffect(() => { if (!clearedToast) return undefined; const timer = window.setTimeout(() => setClearedToast(false), 4200); return () => window.clearTimeout(timer); }, [clearedToast]);
  const bank = questionBanks[subject]?.[grade];
  const availableUnits = useMemo(() => bank?.units || [], [bank]);
  const completed = session.items.filter((item) => session.completedKeys.includes(item.key)).length;
  const updateSession = (next) => { setSession(next); window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next)); onSessionChange?.(next); };
  const requestEndSession = () => { if (!session.items.length) { setNotice('本課尚未加入單元，沒有資料需要清除。'); return; } setShowClearConfirm(true); };
  const endSession = () => { const next = defaultSession(); setSession(next); window.sessionStorage.removeItem(STORAGE_KEY); onEndSession?.(next); setShowClearConfirm(false); setClearedToast(true); setNotice('本課暫存已清除；下次開啟會是新的課堂。'); };
  const addUnit = (unit) => { const key = unitKey(subject, unit); if (session.items.some((item) => item.key === key)) { setNotice('這個單元已加入本課清單。'); return; } updateSession({ ...session, items: [...session.items, { key, unitId: unit.id, subject, grade, title: unit.title, area: unit.area, questionCount: unit.questions.length }] }); setNotice(`已加入：${grade} ${subject}・${unit.title}`); };
  const moveItem = (index, direction) => { const target = index + direction; if (target < 0 || target >= session.items.length) return; const items = [...session.items]; [items[index], items[target]] = [items[target], items[index]]; updateSession({ ...session, items }); };
  const removeItem = (key) => updateSession({ ...session, items: session.items.filter((item) => item.key !== key), completedKeys: session.completedKeys.filter((item) => item !== key) });
  const startItem = (item) => { const unit = questionBanks[item.subject]?.[item.grade]?.units.find((candidate) => candidate.id === item.unitId); if (unit) onStartUnit(unit, item.subject, item.grade); };

  return <main className={`site-shell teacher-toolkit-page toolkit-subject-${subject}`}>
    {clearedToast && <div className="classroom-cleared-toast" role="status"><CheckCircle2 size={19} /><span><b>已清除本課資料</b><small>你可以開始編排新的課堂清單。</small></span></div>}
    {showClearConfirm && <ClearConfirmDialog session={session} completed={completed} onBackup={() => downloadSummary(session)} onCancel={() => { setShowClearConfirm(false); setNotice('已取消清除，本課資料仍然保留。'); }} onContinue={() => undefined} onClear={endSession} />}
    <header className="topbar"><div className="teacher-toolkit-brand" aria-label="WelitQuest"><span className="brand-mark"><i></i><i></i><i></i><Sparkles size={21} /></span><span><b>Welit<span>Quest</span></b><small>教師課堂工具包</small></span></div><button className="text-button" onClick={onBack}><ArrowLeft size={17} /> 返回課程</button></header>
    <section className="teacher-toolkit-hero"><div><span><Sparkles size={16} /> 本課編排</span><h1>先排好流程，<br /><em>再帶領全班。</em></h1><p>把今天要做的單元放進清單，依次開啟；完成後可下載不含學生資料的課堂摘要。</p></div><aside><CheckCircle2 size={20} /><b>{completed} / {session.items.length}</b><small>本次已完成項目</small></aside></section>
    <section className="teacher-toolkit-workbench"><section className="lesson-plan-sheet"><header><div><span>01・本課檔案</span><b>課堂清單</b></div><div className="toolkit-header-actions"><button className="toolkit-download" onClick={() => downloadSummary(session)} disabled={!session.items.length}><Download size={16} /> 下載摘要</button><button className="toolkit-end-session" onClick={requestEndSession}><Trash2 size={16} /> 結束並清除</button></div></header><label className="lesson-title-input"><span>課堂名稱</span><input value={session.title} onChange={(event) => updateSession({ ...session, title: event.target.value })} placeholder="例如：P3 英文過去式複習" maxLength="60" /></label>{session.items.length ? <ol className="lesson-plan-list">{session.items.map((item, index) => <li key={item.key} className={session.completedKeys.includes(item.key) ? 'complete' : ''}><span className="lesson-plan-order">{String(index + 1).padStart(2, '0')}</span><div><small>{item.grade}・{item.subject}・{item.area}</small><b>{item.title}</b><span>{item.questionCount} 題 {session.completedKeys.includes(item.key) ? '・本次已完成' : ''}</span></div><div className="lesson-plan-actions"><button onClick={() => moveItem(index, -1)} disabled={!index} aria-label="上移此單元"><ArrowUp size={15} /></button><button onClick={() => moveItem(index, 1)} disabled={index === session.items.length - 1} aria-label="下移此單元"><ArrowDown size={15} /></button><button className="lesson-start" onClick={() => startItem(item)}><Play size={15} fill="currentColor" /> 開始</button><button className="lesson-remove" onClick={() => removeItem(item.key)} aria-label="移除此單元"><Trash2 size={15} /></button></div></li>)}</ol> : <div className="lesson-plan-empty"><ClipboardList size={28} /><b>尚未加入單元</b><span>從右側課程庫選擇今天要用的題組。</span></div>}<footer><small>本課資料只暫存在目前瀏覽頁；關閉分頁或按「結束並清除」後不會保留。下載摘要不含學生姓名或個人資料。</small></footer></section><section className="lesson-library-sheet"><header><div><span>02・課程庫</span><b>加入單元</b></div><small>選擇學科和年級</small></header><div className="toolkit-filter-row"><label>學科<select value={subject} onChange={(event) => setSubject(event.target.value)}>{SUBJECTS.map((item) => <option key={item}>{item}</option>)}</select></label><label>年級<select value={grade} onChange={(event) => setGrade(event.target.value)}>{GRADES.map((item) => <option key={item}>{item}</option>)}</select></label></div>{notice ? <p className="toolkit-notice" role="status">{notice}</p> : null}<div className="lesson-library-list">{availableUnits.map((unit) => <article key={unit.id}><div><small>{unit.area}・{unit.questions.length} 題</small><b>{unit.title}</b><span>{unit.objective}</span></div><button onClick={() => addUnit(unit)}><Plus size={17} /> 加入</button></article>)}</div></section></section>
  </main>;
}
