export default function DifficultyMeter({ difficulty, unitId }) {
  if (!difficulty) return null;
  const prerequisiteId = difficulty.prerequisite ? `prerequisite-${unitId}` : undefined;
  return <span className={`unit-difficulty unit-difficulty-level-${difficulty.level}`} aria-label={`難度：${difficulty.label}，${difficulty.level} 級（共三級）`} title={difficulty.note}><i aria-hidden="true">{[1, 2, 3].map((step) => <u className={step <= difficulty.level ? 'filled' : ''} key={step} />)}</i><em>難度 {difficulty.label}</em>{difficulty.prerequisite ? <><b className="unit-prerequisite-mark" aria-hidden="true">i</b><span id={prerequisiteId} className="unit-prerequisite-tooltip" role="tooltip"><strong>建議先備知識</strong><span>{difficulty.prerequisite}</span></span></> : null}</span>;
}
