/* P6 英文題庫：整合條件、轉述、非限定動詞與短語動詞，為升中前的句式運用作準備。 */
const makeQuestions = (unitId, rows) => rows.map(([symbol, sentence, answer, choices, explanation], index) => ({
  id: `${unitId}-Q${String(index + 1).padStart(2, '0')}`,
  prompt: '選出最合適的英文答案。', symbol, sentence, answer, choices: choices.split('|'), explanation,
}));

const readingPassageSets = [
  {
    id: 'P6-EN-R01-P01', title: 'The Stream Clean-up Plan', type: 'project report',
    text: 'Last term, the P6 Eco Team planned a weekend clean-up beside Maple Stream. The team had hoped to remove litter before the rainy season, but a storm warning was issued two days before the event. The teacher in charge told the volunteers, “We will put off the clean-up until it is safe.” Later, she explained that the group would set off at eight o’clock on the new date and would work in pairs. If the water level rose again, the event would be called off. On the clean-up day, students collected 28 bags of rubbish and separated recyclable bottles from other waste. They also made signs asking visitors not to leave plastic near the stream.',
    questions: [
      { id: 'P6-EN-R01-Q01', passageId: 'P6-EN-R01-P01', skill: 'detail', prompt: 'Why was the original clean-up date changed?', answer: 'A storm warning had been issued.', choices: ['A storm warning had been issued.', 'The stream had no rubbish.', 'Students had an exam.', 'The signs were not ready.'], explanation: 'The passage says that a storm warning was issued two days before the event.' },
      { id: 'P6-EN-R01-Q02', passageId: 'P6-EN-R01-P01', skill: 'phrasal verb', prompt: 'What does “put off” mean in the teacher’s message?', answer: 'Delay until later', choices: ['Delay until later', 'Start earlier', 'Look after carefully', 'Search in a dictionary'], explanation: 'The clean-up was moved to a new date, so put off means delay.' },
      { id: 'P6-EN-R01-Q03', passageId: 'P6-EN-R01-P01', skill: 'reported speech', prompt: 'Which correctly reports the teacher’s message?', answer: 'She said that they would put off the clean-up until it was safe.', choices: ['She said that they would put off the clean-up until it was safe.', 'She said that they will put off the clean-up until it is safe.', 'She said that they put off the clean-up yesterday.', 'She said that they would call off the stream.'], explanation: 'In reported speech, “will” changes to “would” and “it is” changes to “it was”.' },
      { id: 'P6-EN-R01-Q04', passageId: 'P6-EN-R01-P01', skill: 'conditional inference', prompt: 'What would happen if the water level rose again?', answer: 'The event would be called off.', choices: ['The event would be called off.', 'Students would collect more bags.', 'The team would start at eight.', 'Visitors would make new signs.'], explanation: 'The teacher explained this exact safety condition in the passage.' },
      { id: 'P6-EN-R01-Q05', passageId: 'P6-EN-R01-P01', skill: 'main idea', prompt: 'What is the main purpose of the P6 Eco Team’s project?', answer: 'To clean the stream safely and reduce litter.', choices: ['To clean the stream safely and reduce litter.', 'To build a new bridge.', 'To teach visitors how to swim.', 'To collect rainwater for school.'], explanation: 'The team delayed for safety, removed litter and made signs to prevent more plastic waste.' },
    ],
  },
  {
    id: 'P6-EN-R01-P02', title: 'A Fairer Lunch Queue', type: 'student proposal',
    text: 'At Lakeside Primary, some pupils complained that they spent too long waiting for lunch. The Student Council observed the queue for five days and found that the longest wait was 18 minutes on Wednesdays. They noticed that many children decided what to buy only when they reached the counter. The council proposed a two-part solution. First, menus would be displayed outside the canteen so pupils could choose earlier. Second, students who brought lunch from home would use a separate line. The principal said that the plan might work if everyone followed the new signs. After a two-week trial, the council will compare the waiting times and report the results to all classes.',
    questions: [
      { id: 'P6-EN-R01-Q06', passageId: 'P6-EN-R01-P02', skill: 'detail', prompt: 'On which day was the lunch wait the longest?', answer: 'Wednesday', choices: ['Wednesday', 'Monday', 'Friday', 'Every day'], explanation: 'The council found that the longest wait, 18 minutes, was on Wednesdays.' },
      { id: 'P6-EN-R01-Q07', passageId: 'P6-EN-R01-P02', skill: 'inference', prompt: 'Why will menus be displayed outside the canteen?', answer: 'Pupils can decide what to buy before reaching the counter.', choices: ['Pupils can decide what to buy before reaching the counter.', 'The canteen will sell fewer meals.', 'Teachers will choose lunch for pupils.', 'The queue will become longer.'], explanation: 'The observation showed that deciding at the counter caused delays.' },
      { id: 'P6-EN-R01-Q08', passageId: 'P6-EN-R01-P02', skill: 'vocabulary', prompt: 'What does “trial” most nearly mean in the passage?', answer: 'A test for a short period', choices: ['A test for a short period', 'A final school rule', 'A long holiday', 'A student competition'], explanation: 'The plan will be tried for two weeks before the council compares results.' },
      { id: 'P6-EN-R01-Q09', passageId: 'P6-EN-R01-P02', skill: 'conditional meaning', prompt: 'What does the principal mean by “if everyone followed the new signs”?', answer: 'The plan depends on people following the system.', choices: ['The plan depends on people following the system.', 'The signs are only for teachers.', 'The canteen will close immediately.', 'Everyone must bring lunch from home.'], explanation: 'The principal states a condition: the system can work only when people follow the signs.' },
      { id: 'P6-EN-R01-Q10', passageId: 'P6-EN-R01-P02', skill: 'evaluation', prompt: 'Which evidence would best show that the plan was successful?', answer: 'Average waiting times became shorter after two weeks.', choices: ['Average waiting times became shorter after two weeks.', 'More pupils complained about the queue.', 'Menus were removed from outside the canteen.', 'The Student Council stopped observing lunch.'], explanation: 'The purpose is to reduce waiting, so shorter average waiting times would be the strongest evidence.' },
    ],
  },
];

const p6EnglishBank = {
  grade: 'P6', subject: '英文',
  units: [
    { id: 'P6-EN-G01', area: '條件句', title: '如果……會怎樣？', objective: '按真實性與時間選用 Type 0、Type 1 或 Type 2 條件句。', interaction: 'english-conditional-choice', questions: makeQuestions('P6-EN-G01', [
      ['🧊', 'If you heat ice, it ___.', 'melts', 'melts|will melt|would melt|melted', 'Type 0 表達科學真理，兩句都用一般現在式。'],
      ['🌧️', 'If it rains tomorrow, we ___ at home.', 'will stay', 'will stay|stay|would stay|stayed', 'Type 1 表示未來可能，主句用 will + verb。'],
      ['💰', 'If I had a million dollars, I ___ around the world.', 'would travel', 'would travel|will travel|travel|travelled', 'Type 2 假設現在不大可能的情況，用 would + verb。'],
      ['📚', 'If you study hard, you ___ the test.', 'will pass', 'will pass|would pass|pass|passed', 'Type 1 的 if 子句用現在式，主句用 will pass。'],
      ['😴', "If people don't sleep, they ___ tired.", 'feel', 'feel|will feel|would feel|felt', 'Type 0 描述一般情況，主句用一般現在式 feel。'],
      ['🏀', 'If she were taller, she ___ basketball.', 'would play', 'would play|will play|plays|played', 'Type 2 假設句用 If + past，主句用 would + verb。'],
      ['🚌', 'If the bus is late, I ___ to school.', 'will walk', 'will walk|would walk|walked|walk', '這是未來可能情況，主句用 will walk。'],
      ['🎨', 'If you mix red and white, you ___ pink.', 'get', 'get|will get|would get|got', 'Type 0 表示固定結果，主句用一般現在式 get。'],
      ['💬', 'If I were you, I ___ the teacher.', 'would tell', 'would tell|will tell|tell|told', 'If I were you 是 Type 2 的常用假設句式。'],
      ['👋', 'If they arrive early, they ___ us at the gate.', 'will meet', 'will meet|would meet|met|meet', '未來可能的結果，主句用 will meet。'],
    ]) },
    { id: 'P6-EN-G02', area: '間接引語', title: '把話轉述出來', objective: '把直接引語按人稱、時間詞及時態變化轉為間接引語。', interaction: 'english-reported-choice', questions: makeQuestions('P6-EN-G02', [
      ['😴', 'Tom said, “I am tired.” Tom said that he ___.', 'was tired', 'was tired|is tired|were tired|has tired', 'am 轉述時通常後退為 was，I 轉為 he。'],
      ['📞', 'Amy said, “I will call you.” Amy said that she ___.', 'would call me', 'would call me|will call you|would calls me|called me', 'will 後退為 would；you 按說話對象轉為 me。'],
      ['📚', 'Ben said, “I have finished my homework.” Ben said that he ___.', 'had finished his homework', 'had finished his homework|has finished his homework|finished his homework|had finish his homework', '現在完成式轉述時可後退為 had finished。'],
      ['🏊', 'Linda said, “I can swim.” Linda said that she ___.', 'could swim', 'could swim|can swim|would swim|swam', 'can 轉述時後退為 could。'],
      ['🕘', 'Dad said, “The shop opens at nine.” Dad said that the shop ___.', 'opened at nine', 'opened at nine|opens at nine|had open at nine|would open at nine', '一般現在式轉述時後退為一般過去式 opened。'],
      ['🐦', 'May said, “I saw a bird.” May said that she ___.', 'had seen a bird', 'had seen a bird|saw a bird|has seen a bird|would see a bird', '一般過去式轉述時可後退為 had seen。'],
      ['📕', 'Peter said, “I like this book.” Peter said that he liked ___.', 'that book', 'that book|this book|those book|the book are', 'this 在轉述中通常轉為 that。'],
      ['👵', 'Mia said, “We will visit Grandma tomorrow.” Mia said that they would visit Grandma ___.', 'the next day', 'the next day|tomorrow|yesterday|now', 'tomorrow 轉述時轉為 the next day。'],
      ['📝', 'Sam said, “I am doing my project now.” Sam said that he was doing his project ___.', 'then', 'then|now|tomorrow|here', 'now 在轉述中通常轉為 then。'],
      ['🍽️', 'Mum said, “Dinner is ready.” Mum said that dinner ___.', 'was ready', 'was ready|is ready|were ready|has ready', 'is 轉述時通常後退為 was。'],
    ]) },
    { id: 'P6-EN-G03', area: '非限定動詞', title: 'V-ing 還是 to V？', objective: '按常見動詞搭配選用 gerund 或 infinitive。', interaction: 'english-nonfinite-choice', questions: makeQuestions('P6-EN-G03', [
      ['📖', 'I enjoy ___ storybooks.', 'reading', 'reading|to read|read|reads', 'enjoy 後面接 V-ing，所以用 reading。'],
      ['🧠', 'She wants ___ English.', 'to learn', 'to learn|learning|learned|learns', 'want 後面接 to + verb，所以用 to learn。'],
      ['🗾', 'We decided ___ the museum.', 'to visit', 'to visit|visiting|visited|visit', 'decide 後面接 to + verb。'],
      ['🧹', 'He dislikes ___ his room.', 'cleaning', 'cleaning|to clean|cleaned|cleans', 'dislike 後面可接 V-ing，這裡用 cleaning。'],
      ['🏆', 'They hope ___ the match.', 'to win', 'to win|winning|won|wins', 'hope 後面接 to + verb。'],
      ['🎨', 'My sister loves ___.', 'drawing', 'drawing|to drawing|drawn|draws', 'love 後可接 V-ing，這裡用 drawing 表示喜好。'],
      ['🤝', 'I agreed ___ my friend.', 'to help', 'to help|helping|helped|helps', 'agree 後面接 to + verb。'],
      ['👋', 'We look forward to ___ you.', 'meeting', 'meeting|meet|to meet|met', 'look forward to 的 to 是介詞，後面接 V-ing。'],
      ['🎤', 'She plans ___ the club.', 'to join', 'to join|joining|joined|joins', 'plan 後面接 to + verb。'],
      ['🧽', 'The children finished ___ the table.', 'cleaning', 'cleaning|to clean|cleaned|clean', 'finish 後面接 V-ing，所以用 cleaning。'],
    ]) },
    { id: 'P6-EN-G04', area: '短語動詞', title: '動詞多一個意思', objective: '在語境中理解並使用 look up、look after、put off、call off、set off 等短語動詞。', interaction: 'english-phrasal-choice', questions: makeQuestions('P6-EN-G04', [
      ['📚', 'Please ___ this word in the dictionary.', 'look up', 'look up|look after|put off|call off', 'look up 表示在字典中查找。'],
      ['👶', 'Can you ___ the baby for a minute?', 'look after', 'look after|look up|set off|put off', 'look after 表示照顧。'],
      ['📅', 'We have to ___ the meeting until Friday.', 'put off', 'put off|call off|look up|set off', 'put off 表示把事情延期。'],
      ['🌧️', 'They had to ___ the picnic because of rain.', 'call off', 'call off|put off|look after|look up', 'call off 表示取消原定活動。'],
      ['🚗', 'We will ___ early tomorrow morning.', 'set off', 'set off|look up|put off|call off', 'set off 表示出發。'],
      ['🔤', 'I always ___ new words after class.', 'look up', 'look up|look after|call off|set off', '查生字用 look up。'],
      ['🐶', 'Mia ___ her neighbour’s dog on weekends.', 'looks after', 'looks after|looks up|puts off|calls off', '照顧寵物用 look after；主語 Mia 配 looks after。'],
      ['⏰', 'Do not ___ your homework until tomorrow.', 'put off', 'put off|call off|set off|look up', '不要把功課延期，用 put off。'],
      ['⚽', 'The coach ___ the game because the field was wet.', 'called off', 'called off|put off|looked up|set off', '因場地濕而取消賽事，用過去式 called off。'],
      ['🧳', 'Our family ___ for the airport at six.', 'set off', 'set off|looked after|put off|called off', '到機場前出發，用 set off。'],
    ]) },
    { id: 'P6-EN-RW01', area: '條件句', title: '條件句改寫', objective: '把兩句提示合併成符合 Type 0、Type 1 或 Type 2 的條件句。', interaction: 'english-sentence-rewrite-conditional', questions: [
      { id: 'P6-EN-RW01-Q01', prompt: '把兩句合併成 Type 0 條件句。', instruction: '使用 If + present, present 表達固定事實。', source: 'You heat ice. It melts.', focus: '固定科學事實', placeholder: 'If you heat ice, ...', target: 'If you heat ice, it melts.', hint: '兩個子句都用一般現在式。', explanation: 'Type 0 表達固定結果，因此 heat 和 melts 都用一般現在式。' },
      { id: 'P6-EN-RW01-Q02', prompt: '把兩句合併成 Type 1 條件句。', instruction: '使用 If + present, will + verb 表達未來可能。', source: 'It rains tomorrow. We will stay at home.', focus: '明天可能下雨', placeholder: 'If it rains tomorrow, ...', target: 'If it rains tomorrow, we will stay at home.', hint: 'if 子句用 rains；主句用 will stay。', explanation: 'Type 1 的 if 子句用一般現在式，主句用 will + verb。' },
      { id: 'P6-EN-RW01-Q03', prompt: '把兩句合併成 Type 2 條件句。', instruction: '使用 If + past, would + verb 表達不大可能的假設。', source: 'I do not have a million dollars. I cannot travel around the world.', focus: '現在的假設情況', placeholder: 'If I had a million dollars, ...', target: 'If I had a million dollars, I would travel around the world.', hint: 'had 和 would travel 配成 Type 2。', explanation: 'Type 2 用過去式 had 表示假設，主句用 would travel。' },
      { id: 'P6-EN-RW01-Q04', prompt: '把兩句合併成 Type 1 條件句。', instruction: '使用 If + present, will + verb 表達未來可能。', source: 'You study hard. You will pass the test.', focus: '努力後可能有的結果', placeholder: 'If you study hard, ...', target: 'If you study hard, you will pass the test.', hint: 'if 子句用 study，不用 will study。', explanation: '未來可能的結果放在主句，用 will pass。' },
      { id: 'P6-EN-RW01-Q05', prompt: '把兩句合併成 Type 0 條件句。', instruction: '使用 If + present, present 表達一般情況。', source: 'People do not sleep. They feel tired.', focus: '一般情況', placeholder: 'If people do not sleep, ...', target: 'If people do not sleep, they feel tired.', hint: '這是一般情況，兩句都用現在式。', explanation: 'Type 0 用一般現在式描述每次都會出現的結果。' },
      { id: 'P6-EN-RW01-Q06', prompt: '把兩句合併成 Type 2 條件句。', instruction: '使用 If + past, would + verb 表達假設。', source: 'She is not taller. She cannot play basketball.', focus: '與現在相反的假設', placeholder: 'If she were taller, ...', target: 'If she were taller, she would play basketball.', hint: 'be 動詞用 were；主句用 would play。', explanation: 'Type 2 中常用 If she were...；結果用 would play。' },
      { id: 'P6-EN-RW01-Q07', prompt: '把兩句合併成 Type 1 條件句。', instruction: '使用 If + present, will + verb 表達未來可能。', source: 'The bus is late. I will walk to school.', focus: '可能發生的上學情況', placeholder: 'If the bus is late, ...', target: 'If the bus is late, I will walk to school.', hint: 'is late 用在 if 子句；will walk 在主句。', explanation: '未來可能結果用 will walk，條件仍用現在式 is late。' },
      { id: 'P6-EN-RW01-Q08', prompt: '把兩句合併成 Type 0 條件句。', instruction: '使用 If + present, present 表達固定結果。', source: 'You mix red and white. You get pink.', focus: '顏色混合的固定結果', placeholder: 'If you mix red and white, ...', target: 'If you mix red and white, you get pink.', hint: 'mix 和 get 都是一般現在式。', explanation: '這是固定的顏色混合結果，所以使用 Type 0。' },
      { id: 'P6-EN-RW01-Q09', prompt: '把兩句合併成 Type 2 條件句。', instruction: '使用 If + past, would + verb 表達建議式假設。', source: 'I am not you. I do not tell the teacher.', focus: '常見的 If I were you 建議句', placeholder: 'If I were you, ...', target: 'If I were you, I would tell the teacher.', hint: '這個句式用 were 和 would tell。', explanation: 'If I were you 是 Type 2 常用句式，用 would tell 給予建議。' },
      { id: 'P6-EN-RW01-Q10', prompt: '把兩句合併成 Type 1 條件句。', instruction: '使用 If + present, will + verb 表達未來可能。', source: 'They arrive early. They will meet us at the gate.', focus: '可能提早到達的結果', placeholder: 'If they arrive early, ...', target: 'If they arrive early, they will meet us at the gate.', hint: 'arrive 用現在式；結果用 will meet。', explanation: 'Type 1 的主句使用 will meet 表示未來結果。' },
    ] },
    { id: 'P6-EN-RW02', area: '間接引語', title: '間接引語改寫', objective: '把直接說話改寫為間接引語，處理人稱、時間詞和時態變化。', interaction: 'english-sentence-rewrite-reported', questions: [
      { id: 'P6-EN-RW02-Q01', prompt: '把直接說話改寫成間接引語。', instruction: '使用 Tom said that... 開始，留意 am 的時態後退。', source: 'Tom said, “I am tired.”', focus: 'I → he；am → was', placeholder: 'Tom said that ...', target: 'Tom said that he was tired.', hint: '主語 I 改成 he，am 後退為 was。', explanation: '轉述時人稱配合說話者 Tom，am 通常後退為 was。' },
      { id: 'P6-EN-RW02-Q02', prompt: '把直接說話改寫成間接引語。', instruction: '使用 Amy said that... 開始，留意 will 和 you 的變化。', source: 'Amy said, “I will call you.”', focus: 'I → she；will → would；you → me', placeholder: 'Amy said that ...', target: 'Amy said that she would call me.', hint: 'will 後退為 would；you 按聽話者轉為 me。', explanation: '轉述後要把說話者改為 she，will 改為 would。' },
      { id: 'P6-EN-RW02-Q03', prompt: '把直接說話改寫成間接引語。', instruction: '使用 Ben said that... 開始，留意現在完成式的後退。', source: 'Ben said, “I have finished my homework.”', focus: 'I → he；have finished → had finished', placeholder: 'Ben said that ...', target: 'Ben said that he had finished his homework.', hint: 'have finished 後退為 had finished。', explanation: '現在完成式在轉述中可後退為過去完成式 had finished。' },
      { id: 'P6-EN-RW02-Q04', prompt: '把直接說話改寫成間接引語。', instruction: '使用 Linda said that... 開始，留意 can 的變化。', source: 'Linda said, “I can swim.”', focus: 'I → she；can → could', placeholder: 'Linda said that ...', target: 'Linda said that she could swim.', hint: 'can 後退為 could。', explanation: '轉述時 can 通常後退為 could，說話者 I 轉為 she。' },
      { id: 'P6-EN-RW02-Q05', prompt: '把直接說話改寫成間接引語。', instruction: '使用 Dad said that... 開始，留意一般現在式的後退。', source: 'Dad said, “The shop opens at nine.”', focus: 'opens → opened', placeholder: 'Dad said that ...', target: 'Dad said that the shop opened at nine.', hint: 'opens 後退為 opened。', explanation: '一般現在式在轉述時通常後退為一般過去式 opened。' },
      { id: 'P6-EN-RW02-Q06', prompt: '把直接說話改寫成間接引語。', instruction: '使用 May said that... 開始，留意一般過去式的後退。', source: 'May said, “I saw a bird.”', focus: 'I → she；saw → had seen', placeholder: 'May said that ...', target: 'May said that she had seen a bird.', hint: 'saw 後退為 had seen。', explanation: '一般過去式在轉述時可後退為過去完成式 had seen。' },
      { id: 'P6-EN-RW02-Q07', prompt: '把直接說話改寫成間接引語。', instruction: '使用 Peter said that... 開始，留意 this 的變化。', source: 'Peter said, “I like this book.”', focus: 'I → he；like → liked；this → that', placeholder: 'Peter said that ...', target: 'Peter said that he liked that book.', hint: 'this 通常轉為 that，like 後退為 liked。', explanation: '轉述時人稱、時態和指示詞都要配合語境改變。' },
      { id: 'P6-EN-RW02-Q08', prompt: '把直接說話改寫成間接引語。', instruction: '使用 Mia said that... 開始，留意 tomorrow 的變化。', source: 'Mia said, “We will visit Grandma tomorrow.”', focus: 'we → they；will → would；tomorrow → the next day', placeholder: 'Mia said that ...', target: 'Mia said that they would visit Grandma the next day.', hint: 'tomorrow 轉為 the next day。', explanation: '轉述時 will 後退為 would，而 tomorrow 改為 the next day。' },
      { id: 'P6-EN-RW02-Q09', prompt: '把直接說話改寫成間接引語。', instruction: '使用 Sam said that... 開始，留意 now 的變化。', source: 'Sam said, “I am doing my project now.”', focus: 'I → he；am doing → was doing；now → then', placeholder: 'Sam said that ...', target: 'Sam said that he was doing his project then.', hint: 'now 通常改為 then。', explanation: '現在進行式後退為 was doing，now 轉為 then。' },
      { id: 'P6-EN-RW02-Q10', prompt: '把直接說話改寫成間接引語。', instruction: '使用 Mum said that... 開始，留意 is 的變化。', source: 'Mum said, “Dinner is ready.”', focus: 'is → was', placeholder: 'Mum said that ...', target: 'Mum said that dinner was ready.', hint: 'is 後退為 was。', explanation: '一般現在式 is 在轉述時通常後退為 was。' },
    ] },
    { id: 'P6-EN-R01', area: '進階閱讀理解', title: '證據式閱讀挑戰', objective: '閱讀較長材料後結合事實、詞義、轉述、條件句、推論及評估證據作答。', interaction: 'english-reading-comprehension', passageSets: readingPassageSets, questions: readingPassageSets.flatMap((passage) => passage.questions) },
  ].sort((left, right) => ['P6-EN-G01', 'P6-EN-RW01', 'P6-EN-G02', 'P6-EN-RW02', 'P6-EN-G03', 'P6-EN-G04', 'P6-EN-R01'].indexOf(left.id) - ['P6-EN-G01', 'P6-EN-RW01', 'P6-EN-G02', 'P6-EN-RW02', 'P6-EN-G03', 'P6-EN-G04', 'P6-EN-R01'].indexOf(right.id)),
};

export default p6EnglishBank;
