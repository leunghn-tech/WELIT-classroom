const TEAM_TEMPLATES = [
  { name: '紅隊', color: '#e96b5c' },
  { name: '藍隊', color: '#458be0' },
  { name: '綠隊', color: '#48ad78' },
  { name: '黃隊', color: '#d89a2d' },
];

export const createClassroomTeams = (count = 2) => TEAM_TEMPLATES.slice(0, count).map((team) => ({ ...team, score: 0, streak: 0 }));

export const clampTeamCount = (count) => Math.max(2, Math.min(4, Number(count) || 2));
