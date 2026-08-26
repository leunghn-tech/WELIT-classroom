export const QUESTION_ISSUES_STORAGE_KEY = 'welit-classroom-question-issues-once';
export const QUESTION_ISSUES_EVENT = 'welit-question-issues-updated';

export const readQuestionIssueReports = () => {
  try {
    const saved = JSON.parse(window.sessionStorage.getItem(QUESTION_ISSUES_STORAGE_KEY) || '[]');
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
};

const publish = (reports) => {
  window.sessionStorage.setItem(QUESTION_ISSUES_STORAGE_KEY, JSON.stringify(reports));
  window.dispatchEvent(new CustomEvent(QUESTION_ISSUES_EVENT, { detail: reports }));
  return reports;
};

export const saveQuestionIssueReport = (report) => publish([report, ...readQuestionIssueReports()]);
export const removeQuestionIssueReport = (reportId) => publish(readQuestionIssueReports().filter((report) => report.id !== reportId));
export const clearQuestionIssueReports = () => publish([]);
