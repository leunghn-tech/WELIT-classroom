// WELIT classroom「彩色課程工作檯」：高小解題提示以草綠模型、短句步驟與可投影字級輔助理解，不重複題幹。
import { ArrowRight, CheckCircle2, Lightbulb, ScanSearch } from 'lucide-react';
import FormalMathText from './FormalMathText';

const getFirstFraction = (text = '') => {
  const found = text.match(/(\d+)\s*\/\s*(\d+)/);
  return found ? { numerator: Number(found[1]), denominator: Math.min(Number(found[2]), 12) } : { numerator: 3, denominator: 5 };
};

function FractionModel({ question }) {
  const { numerator, denominator } = getFirstFraction(question.prompt);
  return <div className="worked-fraction-model" aria-label="分數條模型">{Array.from({ length: denominator }, (_, index) => <i key={index} className={index < numerator ? 'filled' : ''} />)}</div>;
}

function PercentModel() {
  return <div className="worked-percent-model" aria-label="百分格模型">{Array.from({ length: 100 }, (_, index) => <i key={index} className={index < 25 ? 'filled' : ''} />)}<b>每格代表 1%</b></div>;
}

function EquationModel() {
  return <div className="worked-equation-model" aria-label="方程平衡模型"><span>x</span><i>＋／－／×／÷</i><b>=</b><span>已知量</span><small>兩邊同時作反運算</small></div>;
}

function FormulaModel({ type }) {
  const labels = type === 'circle' ? ['π', 'r', '圓周／面積'] : type === 'volume' ? ['長', '闊', '高'] : type === 'area' ? ['底', '高', '面積'] : ['邊長／數量', '運算', '答案'];
  return <div className="worked-formula-model" aria-label="公式模型">{labels.map((label, index) => <span key={label}>{label}{index < labels.length - 1 ? <ArrowRight size={17} /> : null}</span>)}</div>;
}

function RatioModel({ motion = false }) {
  return <div className="worked-ratio-model" aria-label={motion ? '行程三角模型' : '比例條模型'}>{motion ? <><b>距離</b><div><span>速度</span><span>時間</span></div></> : <><i>部分 A</i><i>部分 B</i><b>同一比例尺</b></>}</div>;
}

function DataModel() {
  return <div className="worked-data-model" aria-label="數據比較模型"><i style={{ height: '38%' }} /><i style={{ height: '66%' }} /><i style={{ height: '88%' }} /><b>先讀圖例與刻度，再比較數據</b></div>;
}

function ShapeModel() {
  return <div className="worked-shape-model" aria-label="圖形特徵模型"><i /><i /><i /><b>數邊、看角、找平行或相等標記</b></div>;
}

function getPlan(unit) {
  const title = unit.title;
  if (title.includes('分數')) return { tag: '分數條', key: '分數', note: '先以相同大小的整體表示分數；做加減時，先把每一份化成同樣大小。', formula: '分母相同才可直接合併分子；答案再約成最簡。', diagram: 'fraction' };
  if (title.includes('小數')) return { tag: '位值表', key: '小數點與位值', note: '把個位、十分位、百分位對齊；小數點必須在同一直線。', formula: '先按整數方法計算，最後依位值放回小數點。', diagram: 'formula' };
  if (title.includes('百分比')) return { tag: '百分格', key: '整體的 100 份', note: '把整體想成 100 份；先找每 1% 或每一份代表多少。', formula: '部分量 = 整體 × 百分率；需要反推時，使用部分量 ÷ 百分率。', diagram: 'percent' };
  if (title.includes('方程') || title.includes('代數')) return { tag: '平衡式', key: '未知數與已知量', note: '把等號兩邊看成平衡；先找與 x 相連的運算。', formula: '對等號兩邊同時做相反運算，再代回原式檢查。', diagram: 'equation' };
  if (title.includes('比例') || title.includes('放大') || title.includes('縮小')) return { tag: '比例條', key: '對應部分與比例尺', note: '先把相同單位的量排在一起，找出每一份代表多少。', formula: '每一部分 = 總量 ÷ 總份數；再乘所需份數。', diagram: 'ratio' };
  if (title.includes('行程') || title.includes('速度')) return { tag: '行程三角', key: '距離、速度、時間', note: '先辨認題目給了哪兩個量，並統一時間與距離單位。', formula: '距離 = 速度 × 時間；速度 = 距離 ÷ 時間；時間 = 距離 ÷ 速度。', diagram: 'motion' };
  if (title.includes('棒形圖') || title.includes('折線圖') || title.includes('平均數')) return { tag: '數據柱', key: '圖例、刻度與數值', note: '先讀清楚每格／每段代表多少，再讀取或比較柱高與趨勢。', formula: title.includes('平均數') ? '平均數 = 總和 ÷ 數量；反推總和時再乘回數量。' : '需要相差時先相減；需要合計時再相加。', diagram: 'data' };
  if (title.includes('圓')) return { tag: '圓形公式', key: '半徑、直徑與 π', note: '先確認題目給的是半徑還是直徑；直徑 = 半徑 × 2。', formula: '圓周 = πd；圓面積 = πr²。計算後核對單位。', diagram: 'circle' };
  if (title.includes('面積') || title.includes('周界') || title.includes('體積')) return { tag: '公式方塊', key: '圖形的量度資料', note: '先分辨題目問周界、面積還是體積，再圈出所需的長、闊、高或底、高。', formula: title.includes('體積') ? '體積 = 長 × 闊 × 高。' : title.includes('周界') ? '周界是外圍各邊長相加。' : '面積以合適的底和高代入公式。', diagram: title.includes('體積') ? 'volume' : title.includes('面積') ? 'area' : 'formula' };
  if (unit.area === '圖形與空間') return { tag: '圖形標記', key: '邊、角與對稱', note: '用眼睛沿圖形外圍數邊，再找直角、平行線與相等邊的標記。', formula: '只根據圖形特徵作判斷，不以圖形擺放方向或顏色判斷。', diagram: 'shape' };
  return { tag: '運算拆步', key: '已知量與問題', note: '先圈出題目已知的數字和單位，確認要求的是合計、相差、平均或倍數。', formula: '按運算次序逐步計算，最後以估算或反運算檢查。', diagram: 'formula' };
}

function StrategyModel({ plan, question }) {
  if (plan.diagram === 'fraction') return <FractionModel question={question} />;
  if (plan.diagram === 'percent') return <PercentModel />;
  if (plan.diagram === 'equation') return <EquationModel />;
  if (plan.diagram === 'ratio') return <RatioModel />;
  if (plan.diagram === 'motion') return <RatioModel motion />;
  if (plan.diagram === 'data') return <DataModel />;
  if (plan.diagram === 'shape') return <ShapeModel />;
  return <FormulaModel type={plan.diagram} />;
}

export default function HighMathWorkedSteps({ unit, question }) {
  const plan = getPlan(unit);
  return <section className="worked-steps" aria-label="圖像化解題步驟"><header><span><Lightbulb size={17} /> 圖像化解題步驟</span><small>{plan.tag}</small></header><p className="worked-step-intro">跟著綠色路徑，一步一步把答案想清楚。</p><div className="worked-step-grid"><article className="worked-step-card step-1"><b><i>1</i><ScanSearch size={18} /> 看甚麼？</b><p><strong>{plan.key}</strong><FormalMathText text={plan.note} /></p></article><article className="worked-model worked-step-card step-2"><b><i>2</i> 用模型想一想</b><StrategyModel plan={plan} question={question} /></article><article className="worked-step-card step-3"><b><i>3</i><CheckCircle2 size={18} /> 列式與檢查</b><p><FormalMathText text={plan.formula} /></p><em><FormalMathText text={question.explanation} /></em></article></div></section>;
}
