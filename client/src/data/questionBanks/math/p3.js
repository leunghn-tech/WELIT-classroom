/* P3 數與代數：五位數、乘除、運算順序與分數初步，連接小三核心計算能力。 */
const numericChoices = (answer) => [answer, answer + 1, Math.max(0, answer - 1), answer + 2];
const makeLine = (unitId, rows) => rows.map(([prompt, answer, start, end, step, explanation], index) => ({ id: `${unitId}-Q${String(index + 1).padStart(2, '0')}`, prompt, answer, line: { start, end, step }, explanation }));
const makeChoice = (unitId, rows) => rows.map(([prompt, answer, choices, explanation], index) => ({ id: `${unitId}-Q${String(index + 1).padStart(2, '0')}`, prompt, answer, choices: choices || numericChoices(answer), explanation }));
const withShareVisuals = (questions, groups) => questions.map((question, index) => groups[index] ? ({ ...question, visual: { type: 'share', ...groups[index] } }) : question);
const withFractionVisuals = (questions, fractions) => questions.map((question, index) => fractions[index] ? ({ ...question, visual: { type: 'fraction', ...fractions[index] } }) : question);

const p3MathBank = {
  grade: 'P3', subject: '數學',
  units: [
    { id: 'P3-MATH-A02', area: '數與代數', title: '乘法進階', objective: '運用分配策略完成一位數乘兩／三位數，並解決乘法應用題。', interaction: 'math-choice', questions: makeChoice('P3-MATH-A02', [
      ['24 × 3 = ?', 72, null, '20 × 3 = 60，4 × 3 = 12，共 72。'], ['15 × 4 = ?', 60, null, '10 × 4 = 40，5 × 4 = 20，共 60。'], ['32 × 2 = ?', 64, null, '32 的兩倍是 64。'], ['125 × 3 = ?', 375, null, '100 × 3 = 300，20 × 3 = 60，5 × 3 = 15；共 375。'], ['204 × 4 = ?', 816, null, '200 × 4 = 800，4 × 4 = 16；共 816。'], ['138 × 2 = ?', 276, null, '100 × 2 = 200，30 × 2 = 60，8 × 2 = 16；共 276。'], ['250 × 3 = ?', 750, null, '25 個十乘 3 是 75 個十，即 750。'], ['306 × 2 = ?', 612, null, '300 × 2 = 600，6 × 2 = 12；共 612。'], ['19 × 5 = ?', 95, null, '20 × 5 = 100，再減 5 是 95。'], ['每盒有 125 張卡，3 盒共有多少張？', 375, null, '125 × 3 = 375。'],
    ]) },
    { id: 'P3-MATH-A03', area: '數與代數', title: '平均分與除法', objective: '完成一位數除兩／三位數，並以商和餘數解釋平均分與分組情境。', interaction: 'math-choice', questions: withShareVisuals(makeChoice('P3-MATH-A03', [
      ['24 顆糖平均分給 6 人，每人有多少顆？', 4, null, '24 ÷ 6 = 4。'], ['84 ÷ 4 = ?', 21, null, '4 × 21 = 84，所以 84 ÷ 4 = 21。'], ['156 ÷ 3 = ?', 52, null, '3 × 52 = 156。'], ['245 ÷ 5 = ?', 49, null, '5 × 49 = 245。'], ['128 張貼紙每人分 4 張，可分給多少人？', 32, null, '128 ÷ 4 = 32。'], ['360 個蘋果每箱放 9 個，共要多少箱？', 40, null, '360 ÷ 9 = 40。'], ['127 粒珠平均分給 6 人，每人有多少粒，餘多少粒？', '每人 21 粒，餘 1 粒', ['每人 20 粒，餘 7 粒', '每人 21 粒，餘 1 粒', '每人 22 粒，餘 0 粒', '每人 23 粒，餘 5 粒'], '6 × 21 = 126，127 − 126 = 1。'], ['98 本書每 7 本放一疊，可放多少疊？', 14, null, '98 ÷ 7 = 14。'], ['38 支旗每 6 支一組，可組成幾組，餘多少支？', '6 組，餘 2 支', ['5 組，餘 8 支', '6 組，餘 2 支', '7 組，餘 0 支', '8 組，餘 6 支'], '6 × 6 = 36，38 − 36 = 2。'], ['432 ÷ 8 = ?', 54, null, '8 × 54 = 432。'],
    ]), [{ groups: 6, each: 4, kind: 'sweet' }, null, null, null, null, null, null, null, { groups: 6, each: 6, remainder: 2, kind: 'flag' }, null]) },
    { id: 'P3-MATH-A04', area: '數與代數', title: '四則混合運算', objective: '在沒有括號的算式中，先完成乘除，再進行加減，鞏固四則運算的應用。', interaction: 'math-choice', questions: makeChoice('P3-MATH-A04', [
      ['3 + 4 × 2 = ?', 11, null, '先算 4 × 2 = 8，再加 3，得 11。'], ['20 − 3 × 4 = ?', 8, null, '先算 3 × 4 = 12，20 − 12 = 8。'], ['18 ÷ 3 + 5 = ?', 11, null, '先算 18 ÷ 3 = 6，再加 5。'], ['6 × 5 − 7 = ?', 23, null, '先算 6 × 5 = 30，再減 7。'], ['24 ÷ 6 + 9 = ?', 13, null, '先算 24 ÷ 6 = 4，再加 9。'], ['8 + 15 ÷ 3 = ?', 13, null, '先算 15 ÷ 3 = 5，再加 8。'], ['5 × 4 + 6 = ?', 26, null, '先算 5 × 4 = 20，再加 6。'], ['30 − 16 ÷ 4 = ?', 26, null, '先算 16 ÷ 4 = 4，再用 30 − 4。'], ['7 + 3 × 5 = ?', 22, null, '先算 3 × 5 = 15，再加 7。'], ['48 ÷ 8 + 14 = ?', 20, null, '先算 48 ÷ 8 = 6，再加 14。'],
    ]) },
    { id: 'P3-MATH-A05', area: '數與代數', title: '分數初步', objective: '認識分子、分母及同分母分數的大小，連結平均分的生活情境。', interaction: 'math-choice', questions: withFractionVisuals(makeChoice('P3-MATH-A05', [
      ['把一個蛋糕平均分成 4 份，吃了 1 份，是全個蛋糕的幾分之幾？', '1/4', ['1/4', '1/3', '2/4', '4/1'], '平均分成 4 份，取其中 1 份，是 1/4。'], ['把 8 個橙平均分成 4 組，每組有幾個？', 2, null, '8 ÷ 4 = 2。'], ['哪一個分數較大？', '3/5', ['2/5', '3/5', '1/5', '0/5'], '分母相同時，分子較大的分數較大。'], ['哪一個分數表示一半？', '1/2', ['1/2', '1/3', '2/3', '1/4'], '一個整體平均分成 2 份，取 1 份就是一半。'], ['把一條紙帶平均分成 6 份，塗了 4 份，是多少？', '4/6', ['4/6', '6/4', '2/6', '1/6'], '總共 6 份，塗了 4 份，是 4/6。'], ['在 1/8、5/8、3/8 中，哪一個最大？', '5/8', ['1/8', '5/8', '3/8', '0/8'], '分母相同，5 個八分之一最多。'], ['2/7 表示甚麼？', '把整體平均分成 7 份，取其中 2 份。', ['把整體平均分成 7 份，取其中 2 份。', '把整體分成 2 份，取 7 份。', '有 2 個整體和 7 份。', '把整體平均分成 2 份，取 7 份。'], '分母 7 表示平均分成 7 份；分子 2 表示取 2 份。'], ['哪一個與 2/4 有相同分母？', '3/4', ['3/4', '2/3', '4/2', '1/2'], '2/4 和 3/4 的分母都是 4。'], ['一個西瓜平均切成 10 片，吃了 7 片，是幾分之幾？', '7/10', ['7/10', '10/7', '3/10', '1/10'], '總共 10 片，吃了 7 片，是 7/10。'], ['哪一個分數最小？', '1/6', ['1/6', '2/6', '4/6', '5/6'], '分母相同時，分子最小的分數最小。'],
    ]), [{ total: 4, filled: 1, label: '1/4' }, null, { total: 5, filled: 3, label: '3/5' }, { total: 2, filled: 1, label: '1/2' }, { total: 6, filled: 4, label: '4/6' }, { total: 8, filled: 5, label: '5/8' }, { total: 7, filled: 2, label: '2/7' }, { total: 4, filled: 2, label: '2/4' }, { total: 10, filled: 7, label: '7/10' }, { total: 6, filled: 1, label: '1/6' }]) },
    { id: 'P3-MATH-M01', area: '度量', title: '距離與長度進階', objective: '認識公里 km、米 m、厘米 cm、毫米 mm，並完成簡單單位換算。', interaction: 'math-choice', questions: makeChoice('P3-MATH-M01', [
      ['學校到博物館的距離較適合用哪個單位？', 'km', ['mm', 'cm', 'm', 'km'], '兩地距離較遠，適合用公里 km。'], ['一枚硬幣的厚度較適合用哪個單位？', 'mm', ['mm', 'cm', 'm', 'km'], '硬幣很薄，適合用毫米 mm。'], ['1 m 等於多少 cm？', '100 cm', ['10 cm', '100 cm', '1 000 cm', '10 000 cm'], '1 米等於 100 厘米。'], ['1 m 等於多少 mm？', '1 000 mm', ['100 mm', '1 000 mm', '10 000 mm', '1 mm'], '1 米等於 1 000 毫米。'], ['2 km 等於多少 m？', '2 000 m', ['200 m', '2 000 m', '20 000 m', '200 000 m'], '1 km = 1 000 m，所以 2 km = 2 000 m。'], ['3 000 mm 等於多少 m？', '3 m', ['0.3 m', '3 m', '30 m', '300 m'], '每 1 000 mm 是 1 m，3 000 mm 是 3 m。'], ['250 cm 等於多少 m 和 cm？', '2 m 50 cm', ['2 m 5 cm', '2 m 50 cm', '25 m', '250 m'], '200 cm 是 2 m，餘下 50 cm。'], ['一條絲帶長 1 m 20 cm，另一條長 95 cm，哪條較長？', '1 m 20 cm 的絲帶', ['1 m 20 cm 的絲帶', '95 cm 的絲帶', '一樣長', '不能比較'], '1 m 20 cm = 120 cm，120 大於 95。'], ['5 km 比 3 km 遠多少？', '2 km', ['1 km', '2 km', '3 km', '8 km'], '5 − 3 = 2。'], ['哪個長度最短？', '8 mm', ['8 mm', '8 cm', '8 m', '8 km'], '相同數字下，毫米 mm 是最短單位。'],
    ]) },
    { id: 'P3-MATH-M02', area: '度量', title: '時間與報時', objective: '認識秒、24 小時制及時間計算，並把生活時間轉換為 24 小時報時。', interaction: 'math-measurement', questions: [
      { id: 'P3-MATH-M02-Q01', prompt: '1 分鐘有多少秒？', visual: { type: 'clock', hour: 1, minute: 0 }, answer: '60 秒', choices: ['30 秒', '60 秒', '100 秒', '120 秒'], explanation: '1 分鐘共有 60 秒。' },
      { id: 'P3-MATH-M02-Q02', prompt: '2 分鐘有多少秒？', visual: { type: 'clock', hour: 2, minute: 0 }, answer: '120 秒', choices: ['60 秒', '90 秒', '120 秒', '200 秒'], explanation: '2 × 60 = 120。' },
      { id: 'P3-MATH-M02-Q03', prompt: '24 小時制的 13:00 是下午幾時？', visual: { type: 'clock', hour: 13, minute: 0 }, answer: '下午 1:00', choices: ['上午 1:00', '下午 1:00', '下午 3:00', '晚上 1:00'], explanation: '13:00 比 12:00 多 1 小時，即下午 1 時。' },
      { id: 'P3-MATH-M02-Q04', prompt: '24 小時制的 18:30 是甚麼時間？', visual: { type: 'clock', hour: 18, minute: 30 }, answer: '下午 6:30', choices: ['上午 6:30', '下午 6:30', '下午 8:30', '晚上 12:30'], explanation: '18 − 12 = 6，所以是下午 6:30。' },
      { id: 'P3-MATH-M02-Q05', prompt: '下午 3:15 用 24 小時制寫成甚麼？', visual: { type: 'clock', hour: 15, minute: 15 }, answer: '15:15', choices: ['3:15', '12:15', '15:15', '18:15'], explanation: '下午 3 時加 12 小時，是 15:15。' },
      { id: 'P3-MATH-M02-Q06', prompt: '由 09:45 到 10:20，經過多久？', visual: { type: 'clock', hour: 9, minute: 45, endHour: 10, endMinute: 20 }, answer: '35 分鐘', choices: ['25 分鐘', '30 分鐘', '35 分鐘', '45 分鐘'], explanation: '由 9:45 到 10:00 有 15 分鐘，再加 20 分鐘，共 35 分鐘。' },
      { id: 'P3-MATH-M02-Q07', prompt: '電影由 14:10 開始，15:40 結束，播放多久？', visual: { type: 'clock', hour: 14, minute: 10, endHour: 15, endMinute: 40 }, answer: '1 小時 30 分鐘', choices: ['1 小時', '1 小時 20 分鐘', '1 小時 30 分鐘', '1 小時 40 分鐘'], explanation: '14:10 至 15:10 是 1 小時，再至 15:40 是 30 分鐘。' },
      { id: 'P3-MATH-M02-Q08', prompt: '哪個活動最適合用「秒」量度？', visual: { type: 'clock', hour: 0, minute: 1 }, answer: '跑 100 米的時間', choices: ['上學的年份', '跑 100 米的時間', '一節課的長度', '一個月'], explanation: '短時間如跑步成績常以秒作單位。' },
      { id: 'P3-MATH-M02-Q09', prompt: '23:00 是甚麼時間？', visual: { type: 'clock', hour: 23, minute: 0 }, answer: '晚上 11:00', choices: ['上午 11:00', '下午 11:00', '晚上 11:00', '晚上 1:00'], explanation: '23 − 12 = 11，是晚上 11 時。' },
      { id: 'P3-MATH-M02-Q10', prompt: '由 07:30 到 08:05，經過多久？', visual: { type: 'clock', hour: 7, minute: 30, endHour: 8, endMinute: 5 }, answer: '35 分鐘', choices: ['25 分鐘', '30 分鐘', '35 分鐘', '45 分鐘'], explanation: '7:30 至 8:00 是 30 分鐘，再加 5 分鐘。' },
    ] },
    { id: 'P3-MATH-M03', area: '度量', title: '容量', objective: '認識升 L、毫升 mL，讀取量杯並比較與計算容量。', interaction: 'math-measurement', questions: [
      { id: 'P3-MATH-M03-Q01', prompt: '量杯中的果汁有多少？', visual: { type: 'cup', value: 300, max: 500 }, answer: '300 mL', choices: ['100 mL', '200 mL', '300 mL', '500 mL'], explanation: '液面對準 300 mL 刻度。' },
      { id: 'P3-MATH-M03-Q02', prompt: '一桶水的容量較適合用哪個單位？', visual: { type: 'cup', value: 1000, max: 1000 }, answer: 'L', choices: ['mm', 'cm', 'mL', 'L'], explanation: '較大量液體通常用升 L 量度。' },
      { id: 'P3-MATH-M03-Q03', prompt: '1 L 等於多少 mL？', visual: { type: 'cup', value: 1000, max: 1000 }, answer: '1 000 mL', choices: ['100 mL', '500 mL', '1 000 mL', '10 000 mL'], explanation: '1 升等於 1 000 毫升。' },
      { id: 'P3-MATH-M03-Q04', prompt: '由 250 mL 加至 700 mL，增加多少？', visual: { type: 'cup', value: 700, startValue: 250, max: 1000 }, answer: '450 mL', choices: ['350 mL', '400 mL', '450 mL', '950 mL'], explanation: '700 − 250 = 450。' },
      { id: 'P3-MATH-M03-Q05', prompt: '兩瓶水分別有 600 mL 和 300 mL，合共有多少？', visual: { type: 'cup', value: 600, max: 1000 }, answer: '900 mL', choices: ['300 mL', '600 mL', '900 mL', '1 200 mL'], explanation: '600 + 300 = 900。' },
      { id: 'P3-MATH-M03-Q06', prompt: '1 L 500 mL 等於多少 mL？', visual: { type: 'cup', value: 1000, max: 1000 }, answer: '1 500 mL', choices: ['500 mL', '1 000 mL', '1 500 mL', '5 000 mL'], explanation: '1 L = 1 000 mL；1 000 + 500 = 1 500。' },
      { id: 'P3-MATH-M03-Q07', prompt: '哪個容量較大？', visual: { type: 'cup', value: 800, max: 1000 }, answer: '800 mL', choices: ['0.5 L', '800 mL', '一樣大', '不能比較'], explanation: '0.5 L = 500 mL，800 mL 較大。' },
      { id: 'P3-MATH-M03-Q08', prompt: '量杯中有 900 mL 水，倒出 250 mL，剩下多少？', visual: { type: 'cup', value: 900, max: 1000 }, answer: '650 mL', choices: ['550 mL', '600 mL', '650 mL', '750 mL'], explanation: '900 − 250 = 650。' },
      { id: 'P3-MATH-M03-Q09', prompt: '哪個物品最可能裝有 250 mL？', visual: { type: 'cup', value: 250, max: 500 }, answer: '一盒小果汁', choices: ['一盒小果汁', '一個游泳池', '一條走廊', '一本課本'], explanation: '小盒飲品常以幾百毫升量度。' },
      { id: 'P3-MATH-M03-Q10', prompt: '兩個 500 mL 水樽裝滿後，共有多少？', visual: { type: 'cup', value: 500, max: 500 }, answer: '1 L', choices: ['500 mL', '750 mL', '1 L', '2 L'], explanation: '500 + 500 = 1 000 mL，即 1 L。' },
    ] },
    { id: 'P3-MATH-S01', area: '圖形與空間', title: '平行與垂直', objective: '辨別平行線和垂直線，並在生活物品中找出線條關係。', interaction: 'math-choice', questions: makeChoice('P3-MATH-S01', [
      ['兩條線永不相交，而且距離一樣，叫甚麼？', '平行線', ['平行線', '垂直線', '曲線', '圓線'], '永不相交、距離相等的兩線是平行線。'], ['兩條線相交成直角，叫甚麼？', '垂直線', ['平行線', '垂直線', '曲線', '斜線'], '相交成 90° 的線是垂直線。'], ['筆記簿橫線和橫線之間的關係是甚麼？', '平行', ['平行', '垂直', '相交成圓', '沒有關係'], '它們並排而且不會相交。'], ['門框的直邊和橫邊通常形成甚麼？', '垂直', ['平行', '垂直', '圓形', '三角形'], '直邊和橫邊相交成直角。'], ['鐵路的兩條路軌最像甚麼關係？', '平行', ['平行', '垂直', '重疊', '圓形'], '兩條路軌並排延伸，不相交。'], ['十字路口的兩條直路相交成直角，屬於甚麼？', '垂直', ['平行', '垂直', '曲線', '沒有線'], '相交成直角就是垂直。'], ['哪一對線最可能是平行線？', '長方形的上下邊', ['長方形的上下邊', '三角形的兩邊', '時鐘指針', '圓的邊'], '長方形的對邊平行。'], ['哪一對線最可能是垂直線？', '正方形的一條直邊和一條橫邊', ['兩條橫線', '兩條直線', '正方形的一條直邊和一條橫邊', '兩條斜線'], '相鄰邊相交成直角。'], ['平行線會不會相交？', '不會', ['一定會', '不會', '只在晚上會', '不知道'], '平行線無論延長多遠都不相交。'], ['垂直線相交時有多少個直角？', '4 個', ['1 個', '2 個', '3 個', '4 個'], '兩條直線垂直相交會形成 4 個直角。'],
    ]) },
    { id: 'P3-MATH-S03', area: '圖形與空間', title: '八個方向', objective: '認識東北、西北、東南、西南，並在地圖情境中判斷相對位置。', interaction: 'math-choice', questions: makeChoice('P3-MATH-S03', [
      ['東和北之間的方向是甚麼？', '東北', ['東北', '東南', '西北', '西南'], '東和北中間是東北。'], ['西和北之間的方向是甚麼？', '西北', ['東北', '東南', '西北', '西南'], '西和北中間是西北。'], ['東和南之間的方向是甚麼？', '東南', ['東北', '東南', '西北', '西南'], '東和南中間是東南。'], ['西和南之間的方向是甚麼？', '西南', ['東北', '東南', '西北', '西南'], '西和南中間是西南。'], ['公園在學校的東北面，由學校到公園要向哪裡走？', '東北', ['東北', '東南', '西北', '西南'], '公園在東北面，所以向東北走。'], ['超級市場在圖書館的西南面，圖書館在超級市場的哪個方向？', '東北', ['東北', '東南', '西北', '西南'], '西南的相反方向是東北。'], ['東南的相反方向是甚麼？', '西北', ['東北', '東南', '西北', '西南'], '東南和西北相對。'], ['西南的相反方向是甚麼？', '東北', ['東北', '東南', '西北', '西南'], '西南和東北相對。'], ['地圖右上方通常表示哪個方向？', '東北', ['東北', '東南', '西北', '西南'], '上是北、右是東，右上就是東北。'], ['地圖左下方通常表示哪個方向？', '西南', ['東北', '東南', '西北', '西南'], '下是南、左是西，左下就是西南。'],
    ]) },
  ],
};

const p3Difficulties = {
  'P3-MATH-A02': { level: 2, label: '鞏固', note: '以分配策略完成一位數乘兩／三位數。' },
  'P3-MATH-A03': { level: 2, label: '鞏固', note: '把平均分、分組和商餘數連結至除法。' },
  'P3-MATH-A04': { level: 3, label: '挑戰', note: '按運算次序完成多步算式。', prerequisite: '熟練乘法表及基本加、減、乘、除運算；先記住「先乘除，後加減」。' },
  'P3-MATH-A05': { level: 2, label: '鞏固', note: '把平均分概念連結分子、分母及同分母比較。' },
  'P3-MATH-M01': { level: 2, label: '鞏固', note: '比較 km、m、cm、mm，並作簡單換算。' },
  'P3-MATH-M02': { level: 3, label: '挑戰', note: '以 24 小時制及跨整點時間計算處理生活情境。', prerequisite: '能讀出時和分，並以 5 分鐘為單位數數；了解 60 分鐘等於 1 小時。' },
  'P3-MATH-M03': { level: 2, label: '鞏固', note: '讀取量杯並在 L 與 mL 間轉換。' },
  'P3-MATH-S01': { level: 1, label: '入門', note: '由直角辨認平行與垂直線的基本關係。' },
  'P3-MATH-S03': { level: 1, label: '入門', note: '以東、南、西、北延伸至四個斜向方向。' },
};
p3MathBank.units.forEach((unit) => { if (p3Difficulties[unit.id]) unit.difficulty = p3Difficulties[unit.id]; });

// 八個方向在小四進入較抽象的空間概念；小三保留平行與垂直線。
export const p3TransitionUnits = p3MathBank.units.filter((unit) => unit.id === 'P3-MATH-S03');
p3MathBank.units = p3MathBank.units.filter((unit) => !p3TransitionUnits.includes(unit));
p3MathBank.units = p3MathBank.units.filter((unit) => !['P3-MATH-A01', 'P3-MATH-S02', 'P3-MATH-D01'].includes(unit.id));

export default p3MathBank;
