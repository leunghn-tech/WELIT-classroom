import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import './welitClassroom.css';
import './p1Difficulty.css';
import './teacherClassroomToolkit.css';
import './classroomExtensions.css';
import './publicationRefinements.css';
import './publicationBattleRefinements.css';
import './oneTimeSession.css';
import './clearProtection.css';
import './quickExitSentence.css';
import './lessonSupport.css';
import './finalWorksheetTypography.css';
import './questionIssueReports.css';

createRoot(document.getElementById('root')).render(<App />);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {}));
}
