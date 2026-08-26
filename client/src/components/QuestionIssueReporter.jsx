import { Flag, Send, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { saveQuestionIssueReport } from '../lib/questionIssueReports';

const ISSUE_TYPES = ['題幹或語意不清楚', '正確答案可能不正確', '選項有多於一個正確／不足', '解釋、材料或插畫有疑慮', '錦囊或互動功能問題', '其他'];
const subjectFromUnit = (unit) => unit.subject || (unit.id?.includes('-EN-') ? '英文' : unit.id?.includes('-CN-') ? '中文' : '數學');
const gradeFromUnit = (unit) => unit.grade || unit.id?.split('-')[0] || '';
const questionSignals = (question) => [question.prompt, question.sentence, question.translation, question.title, question.baseWord, question.word, question.target, question.context, question.source, question.profile, question.document, ...(question.matches || []).flatMap((item) => [item.word, item.meaning]), ...(question.blocks || []).map((item) => item.text), ...(question.paragraphs || []).map((item) => item.text)].filter((value) => typeof value === 'string' && value.trim().length > 1);
const normaliseVisibleText = (value) => String(value || '').normalize('NFKC').replace(/[／/]/gu, '').replace(/[−–—]/gu, '-').replace(/\s+/gu, '').trim();

export default function QuestionIssueReporter({ unit }) {
  const questions = useMemo(() => unit?.questions || [], [unit]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [issueType, setIssueType] = useState(ISSUE_TYPES[0]);
  const [note, setNote] = useState('');
  const [notice, setNotice] = useState('');
  const question = questions[questionIndex] || questions[0];

  useEffect(() => {
    if (!unit || !questions.length) return undefined;
    const counts = questions.flatMap(questionSignals).map(normaliseVisibleText).filter(Boolean).reduce((result, signal) => ({ ...result, [signal]: (result[signal] || 0) + 1 }), {});
    const locate = () => {
      const markedId = document.querySelector('[data-question-id]')?.getAttribute('data-question-id');
      const markedIndex = questions.findIndex((candidate) => candidate.id === markedId);
      if (markedIndex >= 0) { setQuestionIndex(markedIndex); return; }
      const pageText = normaliseVisibleText(document.querySelector('main.site-shell')?.textContent);
      const candidates = questions.map((candidate, index) => ({ index, score: questionSignals(candidate).map(normaliseVisibleText).filter((signal) => counts[signal] === 1 && signal.length >= 4 && pageText.includes(signal)).reduce((sum, signal) => sum + Math.min(signal.length, 40), 0) })).sort((left, right) => right.score - left.score);
      if (candidates[0]?.score) setQuestionIndex(candidates[0].index);
    };
    const frame = window.requestAnimationFrame(locate);
    const root = document.querySelector('main.site-shell');
    const observer = root ? new MutationObserver(locate) : null;
    observer?.observe(root, { childList: true, subtree: true, characterData: true });
    return () => { window.cancelAnimationFrame(frame); observer?.disconnect(); };
  }, [unit, questions]);

  if (!unit || !question) return null;
  const close = () => { setOpen(false); setNotice(''); };
  const submit = (event) => {
    event.preventDefault();
    const report = {
      id: globalThis.crypto?.randomUUID?.() || `issue-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      createdAt: new Date().toISOString(),
      subject: subjectFromUnit(unit),
      grade: gradeFromUnit(unit),
      unitId: unit.id,
      unitTitle: unit.title,
      questionId: question.id || `${unit.id}-Q${questionIndex + 1}`,
      questionNumber: questionIndex + 1,
      prompt: String(question.prompt || question.sentence || question.title || question.target || question.baseWord || '互動題目').replace(/\s+/gu, ' ').trim(),
      answer: question.answer ?? question.radical ?? '',
      issueType,
      note: note.trim(),
    };
    saveQuestionIssueReport(report);
    setNotice('已加入教師工具列的「題目回報」。');
    setNote('');
    window.setTimeout(close, 900);
  };

  return <>
    <aside className="question-issue-entry" aria-label="題目問題回報"><button type="button" onClick={() => setOpen(true)}><Flag size={16} /><span>問題回報</span><small>第 {questionIndex + 1} 題</small></button></aside>
    {open && <div className="question-issue-backdrop" role="presentation"><form className="question-issue-dialog" onSubmit={submit} role="dialog" aria-modal="true" aria-labelledby="question-issue-title"><header><div><span><Flag size={17} /> 題目回報</span><h2 id="question-issue-title">回報這道題目的疑慮</h2></div><button type="button" onClick={close} aria-label="關閉問題回報"><X size={19} /></button></header><p className="question-issue-reference"><b>{gradeFromUnit(unit)}・{subjectFromUnit(unit)}・{unit.title}</b><span>第 {questionIndex + 1} 題・{question.id || '未命名題目'}</span></p><label>問題類型<select value={issueType} onChange={(event) => setIssueType(event.target.value)}>{ISSUE_TYPES.map((type) => <option key={type}>{type}</option>)}</select></label><label>備註（可選）<textarea value={note} onChange={(event) => setNote(event.target.value)} maxLength="280" placeholder="例如：選項 B 似乎也合理；請說明原因。" /></label><small>回報只保存在本課瀏覽器工作階段；可在教師工具列的「題目回報」查看及下載 CSV。</small>{notice && <p className="question-issue-notice" role="status">{notice}</p>}<footer><button type="button" onClick={close}>取消</button><button type="submit"><Send size={16} /> 儲存回報</button></footer></form></div>}
  </>;
}
