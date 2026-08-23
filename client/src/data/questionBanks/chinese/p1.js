/* P1 中文題庫：日後只在此檔案加入小一題目，不影響其他年級。 */
export default {
  grade: 'P1', subject: '中文',
  units: [
    {
      id: 'P1-CN-R01', area: '閱讀', title: '認讀基礎字詞', interaction: 'word-match',
      questions: [
        {
          id: 'P1-CN-R01-Q01', prompt: '把字詞卡拖到最合適的圖意卡。',
          matches: [
            { id: 'sun', word: '太陽', symbol: '☀️', meaning: '白天照亮大地' },
            { id: 'umbrella', word: '雨傘', symbol: '☂️', meaning: '下雨時用來遮雨' },
            { id: 'bag', word: '書包', symbol: '🎒', meaning: '上學時用來裝書本' },
          ],
          explanation: '太陽照亮大地；雨傘遮雨；書包用來裝書本。',
        },
        {
          id: 'P1-CN-R01-Q02', prompt: '看清圖意，配對正確的字詞。',
          matches: [
            { id: 'dog', word: '小狗', symbol: '🐶', meaning: '會汪汪叫的小動物' },
            { id: 'flower', word: '花朵', symbol: '🌷', meaning: '植物開出的彩色部分' },
            { id: 'moon', word: '月亮', symbol: '🌙', meaning: '晚上常在天空看見' },
          ],
          explanation: '小狗是小動物；花朵是植物的一部分；月亮常在晚上出現。',
        },
        {
          id: 'P1-CN-R01-Q03', prompt: '把生活用品和正確圖意配在一起。',
          matches: [
            { id: 'apple', word: '蘋果', symbol: '🍎', meaning: '紅色或綠色的水果' },
            { id: 'cup', word: '水杯', symbol: '🥛', meaning: '用來盛水喝水' },
            { id: 'shoes', word: '鞋子', symbol: '👟', meaning: '穿在腳上走路' },
          ],
          explanation: '蘋果是水果；水杯用來喝水；鞋子穿在腳上。',
        },
        {
          id: 'P1-CN-R01-Q04', prompt: '把校園字詞和圖意配對。',
          matches: [
            { id: 'gate', word: '校門', symbol: '🏫', meaning: '進入學校的門口' },
            { id: 'teacher', word: '老師', symbol: '🧑‍🏫', meaning: '在課室教導學生的人' },
            { id: 'classmate', word: '同學', symbol: '🧒', meaning: '和我一起上課的學生' },
          ],
          explanation: '校門在學校入口；老師教導學生；同學一起上課。',
        },
        {
          id: 'P1-CN-R01-Q05', prompt: '把出行和休憩的字詞配對。',
          matches: [
            { id: 'bus', word: '巴士', symbol: '🚌', meaning: '在路上載客的交通工具' },
            { id: 'light', word: '紅綠燈', symbol: '🚦', meaning: '過馬路時看它的顏色' },
            { id: 'park', word: '公園', symbol: '🌳', meaning: '可以散步和遊玩的地方' },
          ],
          explanation: '巴士載客；紅綠燈指示過路；公園可散步遊玩。',
        },
        { id: 'P1-CN-R01-Q06', prompt: '把農場字詞和圖意配對。', matches: [{ id: 'bird', word: '小鳥', symbol: '🐦', meaning: '有翅膀、會在天空飛' }, { id: 'farmer', word: '農夫', symbol: '🧑‍🌾', meaning: '在田地種植農作物的人' }, { id: 'grass', word: '青草', symbol: '🌱', meaning: '長在地上的綠色植物' }], explanation: '小鳥會飛；農夫在田地工作；青草是綠色植物。' },
        { id: 'P1-CN-R01-Q07', prompt: '把水果和正確圖意配對。', matches: [{ id: 'banana', word: '香蕉', symbol: '🍌', meaning: '彎彎的黃色水果' }, { id: 'grape', word: '葡萄', symbol: '🍇', meaning: '一粒粒串在一起的水果' }, { id: 'watermelon', word: '西瓜', symbol: '🍉', meaning: '有紅色果肉的大水果' }], explanation: '香蕉彎彎；葡萄成串；西瓜有紅色果肉。' },
        { id: 'P1-CN-R01-Q08', prompt: '把身體字詞和正確用途配對。', matches: [{ id: 'eye', word: '眼睛', symbol: '👁️', meaning: '用來看見東西' }, { id: 'hand', word: '手掌', symbol: '🖐️', meaning: '用來拿東西和拍手' }, { id: 'mouth', word: '嘴巴', symbol: '👄', meaning: '用來說話和吃東西' }], explanation: '眼睛看、手掌拿、嘴巴說話和吃東西。' },
        { id: 'P1-CN-R01-Q09', prompt: '把天氣字詞和圖意配對。', matches: [{ id: 'rain', word: '雨點', symbol: '🌧️', meaning: '從天空落下的水珠' }, { id: 'cloud', word: '白雲', symbol: '☁️', meaning: '飄在天空的白色雲團' }, { id: 'rainbow', word: '彩虹', symbol: '🌈', meaning: '雨後天空出現的七彩弧形' }], explanation: '雨點落下；白雲飄在天上；彩虹常在雨後出現。' },
        { id: 'P1-CN-R01-Q10', prompt: '把課室用品和正確用途配對。', matches: [{ id: 'pencil', word: '鉛筆', symbol: '✏️', meaning: '用來寫字和畫畫' }, { id: 'ruler', word: '尺子', symbol: '📏', meaning: '用來量長短和畫直線' }, { id: 'book', word: '課本', symbol: '📘', meaning: '上課時用來閱讀和學習' }], explanation: '鉛筆寫畫；尺子量和畫線；課本用來學習。' },
      ],
    },
    {
      id: 'P1-CN-R02', area: '閱讀', title: '常用部首認識', interaction: 'radical-sort',
      questions: [
        { id: 'P1-CN-R02-Q01', prompt: '「河」字的部首是哪一個？', character: '河', radical: '氵', radicalName: '三點水', choices: ['氵', '木', '口', '女'], explanation: '「河」的左邊是「氵」，表示它和水有關。' },
        { id: 'P1-CN-R02-Q02', prompt: '「林」字的部首是哪一個？', character: '林', radical: '木', radicalName: '木字旁', choices: ['日', '木', '扌', '口'], explanation: '「林」由兩個「木」組成，所以部首是「木」。' },
        { id: 'P1-CN-R02-Q03', prompt: '「媽」字的部首是哪一個？', character: '媽', radical: '女', radicalName: '女字旁', choices: ['女', '氵', '日', '木'], explanation: '「媽」的左邊是「女」，所以部首是「女」。' },
        { id: 'P1-CN-R02-Q04', prompt: '「問」字的部首是哪一個？', character: '問', radical: '門', radicalName: '門字框', choices: ['門', '口', '女', '木'], explanation: '「問」字按部首查字時歸入「門」部；「口」是字內的組成部分。' },
        { id: 'P1-CN-R02-Q05', prompt: '「明」字的部首是哪一個？', character: '明', radical: '日', radicalName: '日字旁', choices: ['日', '氵', '口', '扌'], explanation: '「明」的左邊是「日」，表示太陽帶來光明。' },
        { id: 'P1-CN-R02-Q06', prompt: '「抱」字的部首是哪一個？', character: '抱', radical: '扌', radicalName: '提手旁', choices: ['女', '木', '扌', '日'], explanation: '「抱」的左邊是「扌」，表示用手做動作。' },
        { id: 'P1-CN-R02-Q07', prompt: '「奶」字的部首是哪一個？', character: '奶', radical: '女', radicalName: '女字旁', choices: ['女', '日', '口', '木'], explanation: '「奶」的左邊是「女」，所以部首是「女」。' },
        { id: 'P1-CN-R02-Q08', prompt: '「拍」字的部首是哪一個？', character: '拍', radical: '扌', radicalName: '提手旁', choices: ['氵', '扌', '女', '口'], explanation: '「拍」的左邊是「扌」，拍手時會用到手。' },
        { id: 'P1-CN-R02-Q09', prompt: '「喝」字的部首是哪一個？', character: '喝', radical: '口', radicalName: '口字旁', choices: ['木', '日', '口', '氵'], explanation: '「喝」和用口喝水有關，所以部首是「口」。' },
        { id: 'P1-CN-R02-Q10', prompt: '「洗」字的部首是哪一個？', character: '洗', radical: '氵', radicalName: '三點水', choices: ['女', '扌', '氵', '木'], explanation: '「洗」和水有關，左邊是「氵」。' },
      ],
    },
    {
      id: 'P1-CN-R03', area: '閱讀', title: '基本標點符號', interaction: 'punctuation-drop',
      questions: [
        { id: 'P1-CN-R03-Q01', prompt: '把正確標點拖到句子空格。', before: '今天天氣很好', after: '', answer: '。', choices: ['。', '？', '！'], explanation: '這是一句陳述句，句末用句號。' },
        { id: 'P1-CN-R03-Q02', prompt: '把正確標點拖到句子空格。', before: '你今天快樂嗎', after: '', answer: '？', choices: ['！', '？', '。'], explanation: '這是一句問句，句末用問號。' },
        { id: 'P1-CN-R03-Q03', prompt: '把正確標點拖到句子空格。', before: '小心車輛', after: '', answer: '！', choices: ['。', '！', '？'], explanation: '這是一句提醒，語氣較強，句末用感嘆號。' },
        { id: 'P1-CN-R03-Q04', prompt: '把正確標點拖到句子空格。', before: '花兒真美', after: '', answer: '！', choices: ['？', '。', '！'], explanation: '這是在讚美花兒，帶有強烈感受，句末用感嘆號。' },
        { id: 'P1-CN-R03-Q05', prompt: '把正確標點拖到句子空格。', before: '星期日你會去公園嗎', after: '', answer: '？', choices: ['。', '？', '！'], explanation: '這是在詢問別人，句末用問號。' },
        { id: 'P1-CN-R03-Q06', prompt: '把正確標點拖到句子空格。', before: '請把書放在桌上', after: '', answer: '。', choices: ['！', '。', '？'], explanation: '這是一句平靜的請求，句末用句號。' },
        { id: 'P1-CN-R03-Q07', prompt: '把正確標點拖到句子空格。', before: '誰和你一起上學', after: '', answer: '？', choices: ['！', '。', '？'], explanation: '這是在詢問「誰」，句末用問號。' },
        { id: 'P1-CN-R03-Q08', prompt: '把正確標點拖到句子空格。', before: '爸爸今天煮了湯', after: '', answer: '。', choices: ['？', '。', '！'], explanation: '這是在平靜地說一件事，句末用句號。' },
        { id: 'P1-CN-R03-Q09', prompt: '把正確標點拖到句子空格。', before: '太好了我們贏了', after: '', answer: '！', choices: ['。', '？', '！'], explanation: '這是在表達高興和興奮，句末用感嘆號。' },
        { id: 'P1-CN-R03-Q10', prompt: '把正確標點拖到句子空格。', before: '你喜歡這本圖畫書嗎', after: '', answer: '？', choices: ['！', '？', '。'], explanation: '這是一句問句，句末用問號。' },
      ],
    },
    {
      id: 'P1-CN-W01', area: '寫作', title: '句子擴寫', interaction: 'sentence-expand',
      questions: [
        { id: 'P1-CN-W01-Q01', prompt: '依照小安上體育課的情境，選詞完成句子。', parts: { time: { label: '時間', answer: '今天早上', choices: ['今天早上', '昨天晚上', '下星期'] }, person: { label: '人物', answer: '小安', choices: ['小安', '媽媽', '小狗'] }, place: { label: '地點', answer: '學校操場', choices: ['學校操場', '圖書館', '廚房'] }, action: { label: '動作', answer: '跑步', choices: ['跑步', '看書', '煮飯'] } }, explanation: '完整句子是「今天早上，小安在學校操場跑步。」' },
        { id: 'P1-CN-W01-Q02', prompt: '依照小琪借書的情境，選詞完成句子。', parts: { time: { label: '時間', answer: '星期日下午', choices: ['星期日下午', '清晨', '晚上睡前'] }, person: { label: '人物', answer: '小琪', choices: ['小琪', '弟弟', '老師'] }, place: { label: '地點', answer: '圖書館', choices: ['圖書館', '公園', '巴士站'] }, action: { label: '動作', answer: '看圖畫書', choices: ['看圖畫書', '踢足球', '洗碗'] } }, explanation: '完整句子是「星期日下午，小琪在圖書館看圖畫書。」' },
        { id: 'P1-CN-W01-Q03', prompt: '依照小明幫忙的情境，選詞完成句子。', parts: { time: { label: '時間', answer: '昨天傍晚', choices: ['昨天傍晚', '明年', '午飯後'] }, person: { label: '人物', answer: '小明', choices: ['小明', '奶奶', '小鳥'] }, place: { label: '地點', answer: '家裏', choices: ['家裏', '泳池', '花園'] }, action: { label: '動作', answer: '收拾玩具', choices: ['收拾玩具', '種花', '游泳'] } }, explanation: '完整句子是「昨天傍晚，小明在家裏收拾玩具。」' },
        { id: 'P1-CN-W01-Q04', prompt: '依照同學觀察植物的情境，選詞完成句子。', parts: { time: { label: '時間', answer: '今天中午', choices: ['今天中午', '冬天', '明天晚上'] }, person: { label: '人物', answer: '同學們', choices: ['同學們', '小貓', '爸爸'] }, place: { label: '地點', answer: '學校花園', choices: ['學校花園', '商店', '課室'] }, action: { label: '動作', answer: '看花朵', choices: ['看花朵', '做功課', '吃早餐'] } }, explanation: '完整句子是「今天中午，同學們在學校花園看花朵。」' },
        { id: 'P1-CN-W01-Q05', prompt: '依照小樂畫畫的情境，選詞完成句子。', parts: { time: { label: '時間', answer: '星期六早上', choices: ['星期六早上', '昨天深夜', '下個月'] }, person: { label: '人物', answer: '小樂', choices: ['小樂', '校長', '小魚'] }, place: { label: '地點', answer: '美術室', choices: ['美術室', '操場', '飯堂'] }, action: { label: '動作', answer: '畫彩虹', choices: ['畫彩虹', '讀故事', '掃地'] } }, explanation: '完整句子是「星期六早上，小樂在美術室畫彩虹。」' },
        { id: 'P1-CN-W01-Q06', prompt: '依照爸爸運動的情境，選詞完成句子。', parts: { time: { label: '時間', answer: '清晨', choices: ['清晨', '昨天午夜', '下學期'] }, person: { label: '人物', answer: '爸爸', choices: ['爸爸', '小鳥', '同學'] }, place: { label: '地點', answer: '海旁', choices: ['海旁', '課室', '書房'] }, action: { label: '動作', answer: '散步', choices: ['散步', '上課', '畫畫'] } }, explanation: '完整句子是「清晨，爸爸在海旁散步。」' },
        { id: 'P1-CN-W01-Q07', prompt: '依照小玲照顧動物的情境，選詞完成句子。', parts: { time: { label: '時間', answer: '放學後', choices: ['放學後', '明年夏天', '午夜'] }, person: { label: '人物', answer: '小玲', choices: ['小玲', '老師', '哥哥'] }, place: { label: '地點', answer: '家中', choices: ['家中', '圖書館', '球場'] }, action: { label: '動作', answer: '餵小狗', choices: ['餵小狗', '寫毛筆字', '踢球'] } }, explanation: '完整句子是「放學後，小玲在家中餵小狗。」' },
        { id: 'P1-CN-W01-Q08', prompt: '依照弟弟準備上課的情境，選詞完成句子。', parts: { time: { label: '時間', answer: '星期一早上', choices: ['星期一早上', '昨天晚上', '明天深夜'] }, person: { label: '人物', answer: '弟弟', choices: ['弟弟', '媽媽', '小貓'] }, place: { label: '地點', answer: '課室', choices: ['課室', '廚房', '車站'] }, action: { label: '動作', answer: '讀課本', choices: ['讀課本', '吃西瓜', '種樹'] } }, explanation: '完整句子是「星期一早上，弟弟在課室讀課本。」' },
        { id: 'P1-CN-W01-Q09', prompt: '依照媽媽買水果的情境，選詞完成句子。', parts: { time: { label: '時間', answer: '今天下午', choices: ['今天下午', '凌晨', '下星期日'] }, person: { label: '人物', answer: '媽媽', choices: ['媽媽', '小安', '農夫'] }, place: { label: '地點', answer: '市場', choices: ['市場', '操場', '禮堂'] }, action: { label: '動作', answer: '買蘋果', choices: ['買蘋果', '游泳', '唱歌'] } }, explanation: '完整句子是「今天下午，媽媽在市場買蘋果。」' },
        { id: 'P1-CN-W01-Q10', prompt: '依照小偉觀察天空的情境，選詞完成句子。', parts: { time: { label: '時間', answer: '雨後', choices: ['雨後', '睡覺時', '考試前'] }, person: { label: '人物', answer: '小偉', choices: ['小偉', '醫生', '姐姐'] }, place: { label: '地點', answer: '窗前', choices: ['窗前', '飯堂', '泳池'] }, action: { label: '動作', answer: '看彩虹', choices: ['看彩虹', '做早操', '洗衣服'] } }, explanation: '完整句子是「雨後，小偉在窗前看彩虹。」' },
      ],
    },
  ],
};
