import { ArrowLeft, Download, Flag, MessageSquareWarning, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { clearQuestionIssueReports, QUESTION_ISSUES_EVENT, readQuestionIssueReports, removeQuestionIssueReport } from '../lib/questionIssueReports';

const SUBJECTS = ['全部', '中文', '英文', '數學'];
const GRADES = ['全部', 'P1', 'P2', 'P3', 'P4', 'P5', 'P6'];
const csvCell = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;

function downloadReports(reports) {
  const lines = [
    ['WELIT classroom 題目回報摘要'],
    ['建立時間', new Date().toLocaleString('zh-HK')],
    ['回報時間', '學科', '年級', '單元 ID', '單元', '題目 ID', '題號', '問題類型', '正式答案', '題幹', '教師備註'],
    ...reports.map((report) => [new Date(report.createdAt).toLocaleString('zh-HK'), report.subject, report.grade, report.unitId, report.unitTitle, report.questionId, report.questionNumber, report.issueType, report.answer, report.prompt, report.note]),
  ].map((row) => row.map(csvCell).join(',')).join('\n');
  const url = URL.createObjectURL(new Blob([`\uFEFF${lines}`], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `welit-classroom-question-issues-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function QuestionIssueReports({ onBack }) {
  const [reports, setReports] = useState(readQuestionIssueReports);
  const [subject, setSubject] = useState('全部');
  const [grade, setGrade] = useState('全部');
  const [notice, setNotice] = useState('');
  useEffect(() => {
    const sync = (event) => setReports(Array.isArray(event.detail) ? event.detail : readQuestionIssueReports());
    window.addEventListener(QUESTION_ISSUES_EVENT, sync);
    return () => window.removeEventListener(QUESTION_ISSUES_EVENT, sync);
  }, []);
  const visibleReports = useMemo(() => reports.filter((report) => (subject === '全部' || report.subject === subject) && (grade === '全部' || report.grade === grade)), [reports, subject, grade]);
  const remove = (id) => { removeQuestionIssueReport(id); setReports(readQuestionIssueReports()); setNotice('已移除該回報。'); };
  const clear = () => { if (!reports.length || !window.confirm('確定清除目前瀏覽器內的所有題目回報嗎？')) return; clearQuestionIssueReports(); setReports([]); setNotice('已清除本課所有題目回報。'); };

  return <main className="site-shell issue-reports-page">
    <header className="topbar">
      <div className="teacher-toolkit-brand" aria-label="WELIT classroom 題目回報"><span className="brand-mark"><i></i><i></i><i></i><Flag size={21} /></span><span><b>WELIT <span>classroom</span></b><small>教師題目回報</small></span></div>
      <button className="text-button" onClick={onBack}><ArrowLeft size={17} /> 返回課堂</button>
    </header>
    <section className="issue-reports-hero" aria-labelledby="issue-report-heading">
      <span className="issue-file-tab">TEACHER<br />LOG</span>
      <div>
        <span><MessageSquareWarning size={17} /> 本課品質記錄</span>
        <h1 id="issue-report-heading">把疑慮留下，<br /><em>下一次一起修好。</em></h1>
        <p>每次回報會帶有學科、年級、單元和題目編號；可在這裡篩選、刪除或下載 CSV。資料只暫存在目前瀏覽器工作階段。</p>
      </div>
      <aside aria-label={`本課已記錄 ${reports.length} 項回報`}><Flag size={22} /><b>{reports.length}</b><small>本課已記錄回報</small><i>QUALITY LOG</i></aside>
    </section>
    <section className="issue-reports-sheet" aria-label="題目回報清單">
      <div className="issue-workflow-track" aria-label="教師處理步驟"><span><b>01</b> 記下疑慮</span><i></i><span><b>02</b> 篩選核對</span><i></i><span><b>03</b> 下載跟進</span></div>
      <header>
        <div><span>題目回報清單</span><b>{visibleReports.length} 項顯示中</b></div>
        <div><button onClick={() => downloadReports(visibleReports)} disabled={!visibleReports.length}><Download size={16} /> 下載 CSV</button><button className="issue-clear-button" onClick={clear} disabled={!reports.length}><Trash2 size={16} /> 清空回報</button></div>
      </header>
      <div className="issue-filter-row">
        <label><i>01</i>學科<select value={subject} onChange={(event) => setSubject(event.target.value)}>{SUBJECTS.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label><i>02</i>年級<select value={grade} onChange={(event) => setGrade(event.target.value)}>{GRADES.map((item) => <option key={item}>{item}</option>)}</select></label>
      </div>
      {notice && <p className="issue-reports-notice" role="status">{notice}</p>}
      {visibleReports.length ? <ol className="issue-report-list">{visibleReports.map((report, index) => <li key={report.id} data-subject={report.subject}><span className="issue-report-index"><Flag size={16} /><small>R{String(index + 1).padStart(2, '0')}</small></span><div><small>{report.grade}・{report.subject}・{report.unitId}・第 {report.questionNumber} 題</small><b>{report.issueType}</b><p>{report.prompt || '互動題目'}</p><span>正式答案：{String(report.answer || '不適用')} {report.note ? `・備註：${report.note}` : ''}</span><time>{new Date(report.createdAt).toLocaleString('zh-HK')}</time></div><button onClick={() => remove(report.id)} aria-label="移除這項回報"><Trash2 size={16} /></button></li>)}</ol> : <div className="issue-report-empty"><MessageSquareWarning size={29} /><b>尚未有題目回報</b><span>在任何活動頁按「問題回報」，紀錄會立即出現在這裡。</span><small>等待第一張回報紙條。</small></div>}
      <footer><small>此版本不會將回報傳送至伺服器或其他教師帳戶；下載 CSV 後可交由課程管理者集中跟進。</small><span>WELIT classroom · SESSION FILE</span></footer>
    </section>
  </main>;
}
