/* 教師設定面板：以本機儲存記錄音效、音量、動畫、提示、投影字級及低小全班戰鬥偏好。 */
import { Gauge, Lightbulb, ListFilter, ListMinus, MonitorUp, Settings2, Sparkles, Swords, Type, Volume2, VolumeX, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { playSoundPreview } from '../lib/feedbackAudio';
import '../battleSettings.css';

const BATTLE_DEFAULTS = { skillStreak: 3, ultimateStreak: 5, baseDamage: 10, skillBonusDamage: 15, ultimateBonusDamage: 35 };
const BATTLE_PRESETS = [
  { id: 'easy', label: '輕鬆', note: '快速建立成功感', battle: { skillStreak: 2, ultimateStreak: 4, baseDamage: 15, skillBonusDamage: 20, ultimateBonusDamage: 40 } },
  { id: 'standard', label: '標準', note: '適合一般課堂節奏', battle: BATTLE_DEFAULTS },
  { id: 'challenge', label: '挑戰', note: '延長合作及策略討論', battle: { skillStreak: 4, ultimateStreak: 7, baseDamage: 8, skillBonusDamage: 12, ultimateBonusDamage: 25 } },
];
const SIZES = [{ value: 'standard', label: '標準' }, { value: 'large', label: '放大' }, { value: 'xlarge', label: '特大' }];
const READING_LINE_HEIGHTS = [{ value: 'compact', label: '緊密' }, { value: 'comfortable', label: '舒適' }, { value: 'spacious', label: '寬鬆' }];
const READING_COLUMN_WIDTHS = [{ value: 'narrow', label: '窄欄' }, { value: 'standard', label: '標準' }, { value: 'wide', label: '寬欄' }];
const DEFAULTS = { sound: true, soundVolume: 80, animation: true, hintSatchel: false, eliminateTwoOptions: true, firstWordHint: false, showMathWorkedHints: true, projectionSize: 'standard', minimalProjection: false, readingLineHeight: 'comfortable', readingColumnWidth: 'standard', battlePreset: 'standard', battle: BATTLE_DEFAULTS };
const readSettings = () => { try { const stored = JSON.parse(window.localStorage.getItem('eduquest-feedback-settings') || '{}'); const eliminateTwoOptions = stored.eliminateTwoOptionsConfigured === true ? stored.eliminateTwoOptions === true : true; return { ...DEFAULTS, ...stored, eliminateTwoOptions, battle: { ...BATTLE_DEFAULTS, ...(stored.battle || {}) } }; } catch { return DEFAULTS; } };
const saveSettings = (next) => { window.localStorage.setItem('eduquest-feedback-settings', JSON.stringify(next)); window.dispatchEvent(new CustomEvent('eduquest-feedback-settings', { detail: next })); };

export default function TeacherFeedbackSettings({ onOpenQuestionManager }) {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState(readSettings);
  useEffect(() => { document.documentElement.dataset.mathWorkedHints = settings.showMathWorkedHints ? 'on' : 'off'; }, [settings.showMathWorkedHints]);
  const save = (next) => { setSettings(next); saveSettings(next); };
  const update = (key) => save({ ...settings, [key]: !settings[key], ...(key === 'eliminateTwoOptions' ? { eliminateTwoOptionsConfigured: true } : {}) });
  const updateSoundVolume = (rawValue) => save({ ...settings, soundVolume: Math.min(100, Math.max(10, Number(rawValue) || 10)) });
  const updateProjection = (projectionSize) => save({ ...settings, projectionSize });
  const updateReading = (key, value) => save({ ...settings, [key]: value });
  const applyPreset = (preset) => save({ ...settings, battlePreset: preset.id, battle: { ...preset.battle } });
  const updateBattle = (key, rawValue) => {
    const value = Number(rawValue);
    const battle = { ...settings.battle, [key]: value };
    if (key === 'skillStreak') battle.skillStreak = Math.min(Math.max(2, value), battle.ultimateStreak - 1);
    if (key === 'ultimateStreak') battle.ultimateStreak = Math.max(Math.min(8, value), battle.skillStreak + 1);
    if (['baseDamage', 'skillBonusDamage', 'ultimateBonusDamage'].includes(key)) battle[key] = Math.min(Math.max(5, value), 60);
    save({ ...settings, battlePreset: 'custom', battle });
  };

  return <div className="teacher-settings">
    <button className="teacher-settings-trigger" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label="開啟教師回饋設定"><Settings2 size={17} /> 教師設定</button>
    {open && <aside className="teacher-settings-panel">
      <button className="settings-close" onClick={() => setOpen(false)} aria-label="關閉設定"><X size={16} /></button>
      <span>課堂回饋設定</span><b>控制全站鼓勵與提示</b><p>設定會儲存在這部裝置，下次開啟仍會保留。</p>
      <button className={`settings-toggle ${settings.sound ? 'on' : ''}`} onClick={() => update('sound')}><span>{settings.sound ? <Volume2 size={18} /> : <VolumeX size={18} />} 音效</span><i>{settings.sound ? '開啟' : '關閉'}</i></button>
      <section className={`sound-volume-control ${settings.sound ? '' : 'muted'}`}>
        <div><span><Volume2 size={18} /> 音效音量</span><small>配對模型及答題回饋</small></div>
        <div><input type="range" min="10" max="100" step="5" value={settings.soundVolume} onChange={(event) => updateSoundVolume(event.target.value)} disabled={!settings.sound} aria-label="音效音量" aria-valuetext={`${settings.soundVolume}%`} /><output>{settings.soundVolume}%</output></div>
      </section>
      <button className={`settings-toggle sound-preview ${settings.sound ? 'on' : ''}`} onClick={playSoundPreview} disabled={!settings.sound} aria-label="以目前音量試聽音效"><span><Volume2 size={18} /> 音效試聽</span><i>{settings.sound ? '播放' : '請先開啟'}</i></button>
      <button className={`settings-toggle ${settings.animation ? 'on' : ''}`} onClick={() => update('animation')}><span><Sparkles size={18} /> 動畫</span><i>{settings.animation ? '開啟' : '關閉'}</i></button>
      <button className={`settings-toggle ${settings.hintSatchel ? 'on' : ''}`} onClick={() => update('hintSatchel')}><span><Lightbulb size={18} /> 提示錦囊</span><i>{settings.hintSatchel ? '開啟' : '關閉'}</i></button>
      <button className={`settings-toggle ${settings.eliminateTwoOptions ? 'on' : ''}`} onClick={() => update('eliminateTwoOptions')}><span><ListMinus size={18} /> 刪錯選項錦囊</span><i>{settings.eliminateTwoOptions ? '開啟' : '關閉'}</i></button><small className="eliminate-choice-setting-note">新題目預設可用；教師可隨時關閉。</small>
      <button className={`settings-toggle ${settings.firstWordHint ? 'on' : ''}`} onClick={() => update('firstWordHint')}><span><Lightbulb size={18} /> 提示首詞</span><i>{settings.firstWordHint ? '開啟' : '關閉'}</i></button>
      <button className={`settings-toggle ${settings.showMathWorkedHints ? 'on' : ''}`} onClick={() => update('showMathWorkedHints')}><span><Lightbulb size={18} /> 顯示解題提示</span><i>{settings.showMathWorkedHints ? '開啟' : '關閉'}</i></button><small className="eliminate-choice-setting-note">控制數學的解題模型、列式步驟及核對提示；不會隱藏必要操作材料。</small>
      <section className="projection-size-control"><div><span><Type size={18} /> 投影字體大小</span><small>調整課堂展示字級</small></div><div className="projection-size-options" role="group" aria-label="投影字體大小">{SIZES.map((size) => <button key={size.value} onClick={() => updateProjection(size.value)} className={settings.projectionSize === size.value ? 'active' : ''} aria-pressed={settings.projectionSize === size.value}>{size.label}</button>)}</div></section>
      <section className="projection-size-control reading-layout-control"><div><span><Type size={18} /> 閱讀行距</span><small>只套用長篇閱讀材料</small></div><div className="projection-size-options" role="group" aria-label="閱讀行距">{READING_LINE_HEIGHTS.map((option) => <button key={option.value} onClick={() => updateReading('readingLineHeight', option.value)} className={settings.readingLineHeight === option.value ? 'active' : ''} aria-pressed={settings.readingLineHeight === option.value}>{option.label}</button>)}</div></section>
      <section className="projection-size-control reading-layout-control"><div><span><Type size={18} /> 閱讀欄寬</span><small>手機會自動維持滿寬閱讀</small></div><div className="projection-size-options" role="group" aria-label="閱讀欄寬">{READING_COLUMN_WIDTHS.map((option) => <button key={option.value} onClick={() => updateReading('readingColumnWidth', option.value)} className={settings.readingColumnWidth === option.value ? 'active' : ''} aria-pressed={settings.readingColumnWidth === option.value}>{option.label}</button>)}</div></section>
      <button className={`settings-toggle ${settings.minimalProjection ? 'on' : ''}`} onClick={() => update('minimalProjection')}><span><MonitorUp size={18} /> 簡潔投影模式</span><i>{settings.minimalProjection ? '開啟' : '關閉'}</i></button><small className="eliminate-choice-setting-note">保留課題、題目、材料、答案及進度；隱藏輔助標籤與非必要提示。</small>
      {onOpenQuestionManager && <button className="question-manager-launch" onClick={() => { setOpen(false); onOpenQuestionManager(); }}><span><ListFilter size={18} /> 題庫篩選與排序</span><small>按主題、難度尋找講解題目</small></button>}
      <section className="battle-settings-section"><header><Gauge size={17} /><div><span>低小全班打怪獸</span><b>連勝與傷害設定</b></div></header><p><Swords size={14} /> 一鍵選擇節奏，或手動微調數值。</p><div className="battle-preset-row" aria-label="教師難度預設">{BATTLE_PRESETS.map((preset) => <button key={preset.id} className={settings.battlePreset === preset.id ? 'active' : ''} onClick={() => applyPreset(preset)}><b>{preset.label}</b><small>{preset.note}</small></button>)}</div><div className="battle-setting-grid"><label>技能連勝門檻<input type="number" min="2" max={settings.battle.ultimateStreak - 1} value={settings.battle.skillStreak} onChange={(event) => updateBattle('skillStreak', event.target.value)} /><small>第 {settings.battle.skillStreak} 題連答正確</small></label><label>終極技連勝門檻<input type="number" min={settings.battle.skillStreak + 1} max="8" value={settings.battle.ultimateStreak} onChange={(event) => updateBattle('ultimateStreak', event.target.value)} /><small>第 {settings.battle.ultimateStreak} 題連答正確</small></label><label>一般攻擊傷害<input type="number" min="5" max="60" step="5" value={settings.battle.baseDamage} onChange={(event) => updateBattle('baseDamage', event.target.value)} /><small>每題答對</small></label><label>技能額外傷害<input type="number" min="5" max="60" step="5" value={settings.battle.skillBonusDamage} onChange={(event) => updateBattle('skillBonusDamage', event.target.value)} /><small>連勝技能額外傷害</small></label><label>終極技額外傷害<input type="number" min="5" max="60" step="5" value={settings.battle.ultimateBonusDamage} onChange={(event) => updateBattle('ultimateBonusDamage', event.target.value)} /><small>終極技能加成</small></label></div></section>
    </aside>}
  </div>;
}
