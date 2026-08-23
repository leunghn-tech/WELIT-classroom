/* P2 英文題庫：以現在進行式、一般現在式、Wh 問句與 can／can't 建立生活句型。 */
const p2EnglishBank = {
  grade: 'P2',
  subject: '英文',
  units: [
    {
      id: 'P2-EN-P01', area: '拼讀與發音', title: '混合音與二合字母', objective: '辨認常見 blends（bl-, cr-, st-）及 digraphs（sh, ch, th）的開頭發音。', interaction: 'english-phonics-choice', questions: [
        ['🔊', 'Which word begins with the /sh/ sound?', 'ship', 'ship|chip|thin|flag', 'ship begins with sh, which makes the /sh/ sound.'],
        ['🔊', 'Which word begins with the /ch/ sound?', 'chair', 'chair|share|three|black', 'chair begins with ch, which makes the /ch/ sound.'],
        ['🔊', 'Which word begins with the /th/ sound?', 'three', 'three|tree|cheese|sleep', 'three begins with th, which makes the /th/ sound.'],
        ['🔊', 'Which word begins with the bl- blend?', 'blue', 'blue|clue|shoe|thin', 'blue begins with the two-letter blend bl-.'],
        ['🔊', 'Which word begins with the cr- blend?', 'crab', 'crab|grab|ship|train', 'crab begins with the two-letter blend cr-.'],
        ['🔊', 'Which word begins with the st- blend?', 'star', 'star|car|chair|three', 'star begins with the two-letter blend st-.'],
        ['🔊', 'Which word begins with the fl- blend?', 'flag', 'flag|frog|chair|shop', 'flag begins with the two-letter blend fl-.'],
        ['🔊', 'Which word begins with the gr- blend?', 'green', 'green|queen|thin|shoe', 'green begins with the two-letter blend gr-.'],
        ['🔊', 'Which word begins with the same sound as “sheep”?', 'shop', 'shop|chop|top|clap', 'shop and sheep both begin with sh, which makes the /sh/ sound.'],
        ['🔊', 'Which word begins with the same sound as “cheese”?', 'chicken', 'chicken|thicken|ship|black', 'chicken and cheese both begin with ch, which makes the /ch/ sound.'],
      ].map(([symbol, sentence, answer, choices, explanation], index) => ({ id: `P2-EN-P01-Q${String(index + 1).padStart(2, '0')}`, prompt: 'Read the sound clue and choose the word.', symbol, sentence, answer, choices: choices.split('|'), explanation })),
    },
    {
      id: 'P2-EN-G01', area: '核心文法', title: '正在做甚麼？', objective: '辨認 be + V-ing 的現在進行式與 now、look、listen 等提示。', interaction: 'english-continuous-choice',
      questions: [
        { id: 'P2-EN-G01-Q01', prompt: '選出最合適的英文答案。', symbol: '⏱️', sentence: 'Look! Tom ___ a book.', choices: ['is reading', 'reads', 'read', 'are reading'], answer: 'is reading', explanation: 'Look! 表示現在正在發生；Tom 用 is reading。' },
        { id: 'P2-EN-G01-Q02', prompt: '選出最合適的英文答案。', symbol: '⏱️', sentence: 'The girls ___ in the playground now.', choices: ['are playing', 'is playing', 'play', 'played'], answer: 'are playing', explanation: 'girls 是複數，現在進行式用 are playing。' },
        { id: 'P2-EN-G01-Q03', prompt: '選出最合適的英文答案。', symbol: '👂', sentence: 'Listen! The baby ___.', choices: ['is crying', 'are crying', 'cries', 'cry'], answer: 'is crying', explanation: 'Listen! 表示現在正在聽見；baby 用 is crying。' },
        { id: 'P2-EN-G01-Q04', prompt: '選出最合適的英文答案。', symbol: '🖍️', sentence: 'I ___ a picture now.', choices: ['am drawing', 'is drawing', 'draw', 'are drawing'], answer: 'am drawing', explanation: '主語 I 的現在進行式用 am drawing。' },
        { id: 'P2-EN-G01-Q05', prompt: '選出最合適的英文答案。', symbol: '🍽️', sentence: 'Dad ___ dinner at the moment.', choices: ['is cooking', 'are cooking', 'cook', 'cooks'], answer: 'is cooking', explanation: 'Dad 是單數，at the moment 用 is cooking。' },
        { id: 'P2-EN-G01-Q06', prompt: '選出最合適的英文答案。', symbol: '☔', sentence: 'It ___ outside now.', choices: ['is raining', 'are raining', 'rains', 'rain'], answer: 'is raining', explanation: 'It 是單數，現在正在下雨用 is raining。' },
        { id: 'P2-EN-G01-Q07', prompt: '選出最合適的英文答案。', symbol: '🎵', sentence: 'We ___ a song now.', choices: ['are singing', 'is singing', 'sing', 'sings'], answer: 'are singing', explanation: 'We 是複數，現在進行式用 are singing。' },
        { id: 'P2-EN-G01-Q08', prompt: '選出最合適的英文答案。', symbol: '🧹', sentence: 'Mum ___ the floor now.', choices: ['is cleaning', 'are cleaning', 'cleans', 'clean'], answer: 'is cleaning', explanation: 'Mum 是單數，now 用 is cleaning。' },
        { id: 'P2-EN-G01-Q09', prompt: '選出最合適的英文答案。', symbol: '🏃', sentence: 'The boys ___ fast.', choices: ['are running', 'is running', 'run', 'runs'], answer: 'are running', explanation: 'boys 是複數，正在跑用 are running。' },
        { id: 'P2-EN-G01-Q10', prompt: '選出最合適的英文答案。', symbol: '📺', sentence: 'She ___ TV at the moment.', choices: ['is watching', 'are watching', 'watches', 'watch'], answer: 'is watching', explanation: 'She 是單數，at the moment 用 is watching。' },
      ],
    },
    {
      id: 'P2-EN-G02', area: '核心文法', title: '每天做甚麼？', objective: '用一般現在式描述事實與習慣，辨認 always、usually、every day。', interaction: 'english-present-choice',
      questions: [
        { id: 'P2-EN-G02-Q01', prompt: '選出最合適的英文答案。', symbol: '📅', sentence: 'I ___ to school every day.', choices: ['walk', 'walks', 'am walking', 'walked'], answer: 'walk', explanation: 'I 配普通動詞原形；every day 表示習慣。' },
        { id: 'P2-EN-G02-Q02', prompt: '選出最合適的英文答案。', symbol: '🥛', sentence: 'Amy ___ milk every morning.', choices: ['drinks', 'drink', 'is drinking', 'drank'], answer: 'drinks', explanation: 'Amy 是第三人稱單數，習慣動作用 drinks。' },
        { id: 'P2-EN-G02-Q03', prompt: '選出最合適的英文答案。', symbol: '⚽', sentence: 'They ___ football on Sundays.', choices: ['play', 'plays', 'are playing', 'played'], answer: 'play', explanation: 'They 是複數，on Sundays 表示習慣，用 play。' },
        { id: 'P2-EN-G02-Q04', prompt: '選出最合適的英文答案。', symbol: '📚', sentence: 'Ben ___ books after school.', choices: ['reads', 'read', 'is reading', 'reading'], answer: 'reads', explanation: 'Ben 是第三人稱單數，日常習慣用 reads。' },
        { id: 'P2-EN-G02-Q05', prompt: '選出最合適的英文答案。', symbol: '🪥', sentence: 'We ___ our teeth every day.', choices: ['brush', 'brushes', 'are brushing', 'brushed'], answer: 'brush', explanation: 'We 配動詞原形；every day 表示習慣。' },
        { id: 'P2-EN-G02-Q06', prompt: '選出最合適的英文答案。', symbol: '☀️', sentence: 'The sun ___ in the east.', choices: ['rises', 'rise', 'is rising', 'rose'], answer: 'rises', explanation: '這是事實；sun 是第三人稱單數，用 rises。' },
        { id: 'P2-EN-G02-Q07', prompt: '選出最合適的英文答案。', symbol: '🎹', sentence: 'My sister usually ___ the piano.', choices: ['plays', 'play', 'is playing', 'played'], answer: 'plays', explanation: 'usually 表示習慣；My sister 用 plays。' },
        { id: 'P2-EN-G02-Q08', prompt: '選出最合適的英文答案。', symbol: '🍎', sentence: 'Cats ___ fish.', choices: ['like', 'likes', 'are liking', 'liked'], answer: 'like', explanation: 'Cats 是複數，表達一般事實用 like。' },
        { id: 'P2-EN-G02-Q09', prompt: '選出最合適的英文答案。', symbol: '🛏️', sentence: 'He always ___ at nine o’clock.', choices: ['sleeps', 'sleep', 'is sleeping', 'slept'], answer: 'sleeps', explanation: 'always 表示習慣；He 用 sleeps。' },
        { id: 'P2-EN-G02-Q10', prompt: '選出最合適的英文答案。', symbol: '🚌', sentence: 'My friends ___ the bus to school.', choices: ['take', 'takes', 'are taking', 'took'], answer: 'take', explanation: 'friends 是複數，習慣動作用 take。' },
      ],
    },
    {
      id: 'P2-EN-G05', area: '核心文法', title: '這裡有甚麼？', objective: '按物件數量選用 There is 或 There are，並配合 a／an 和複數名詞。', interaction: 'english-there-be-choice',
      questions: [
        { id: 'P2-EN-G05-Q01', prompt: '選出最合適的英文答案。', symbol: '🎒', sentence: '___ a book in my bag.', choices: ['There is', 'There are', 'There am', 'There be'], answer: 'There is', explanation: '一冊書是單數，所以用 There is。' },
        { id: 'P2-EN-G05-Q02', prompt: '選出最合適的英文答案。', symbol: '🖍️', sentence: '___ three crayons on the table.', choices: ['There are', 'There is', 'There am', 'There be'], answer: 'There are', explanation: 'three crayons 是複數，所以用 There are。' },
        { id: 'P2-EN-G05-Q03', prompt: '選出最合適的英文答案。', symbol: '🐱', sentence: '___ a cat under the chair.', choices: ['There is', 'There are', 'It are', 'They is'], answer: 'There is', explanation: 'a cat 是單數，所以用 There is。' },
        { id: 'P2-EN-G05-Q04', prompt: '選出最合適的英文答案。', symbol: '🍎', sentence: '___ two apples in the bowl.', choices: ['There are', 'There is', 'There am', 'It is'], answer: 'There are', explanation: 'two apples 是複數，所以用 There are。' },
        { id: 'P2-EN-G05-Q05', prompt: '選出最合適的英文答案。', symbol: '🏫', sentence: '___ an art room in our school.', choices: ['There is', 'There are', 'There am', 'They are'], answer: 'There is', explanation: 'an art room 是單數，所以用 There is。' },
        { id: 'P2-EN-G05-Q06', prompt: '選出最合適的英文答案。', symbol: '🌳', sentence: '___ many trees in the park.', choices: ['There are', 'There is', 'There am', 'It are'], answer: 'There are', explanation: 'many trees 是複數，所以用 There are。' },
        { id: 'P2-EN-G05-Q07', prompt: '選出最合適的英文答案。', symbol: '🚪', sentence: '___ a door next to the window.', choices: ['There is', 'There are', 'There am', 'They is'], answer: 'There is', explanation: 'a door 是單數，所以用 There is。' },
        { id: 'P2-EN-G05-Q08', prompt: '選出最合適的英文答案。', symbol: '🪑', sentence: '___ four chairs in the classroom.', choices: ['There are', 'There is', 'There am', 'It is'], answer: 'There are', explanation: 'four chairs 是複數，所以用 There are。' },
        { id: 'P2-EN-G05-Q09', prompt: '選出最合適的英文答案。', symbol: '🍰', sentence: '___ a cake on the plate.', choices: ['There is', 'There are', 'There am', 'They are'], answer: 'There is', explanation: 'a cake 是單數，所以用 There is。' },
        { id: 'P2-EN-G05-Q10', prompt: '選出最合適的英文答案。', symbol: '📖', sentence: '___ some books on the shelf.', choices: ['There are', 'There is', 'There am', 'It is'], answer: 'There are', explanation: 'some books 表示多於一本書，所以用 There are。' },
      ],
    },
    {
      id: 'P2-EN-G03', area: '提問與回答', title: '問一問', objective: '選用 Who、What、Where、When、What time、How many 提問。', interaction: 'english-question-choice',
      questions: [
        { id: 'P2-EN-G03-Q01', prompt: '選出最合適的英文答案。', symbol: '❓', sentence: '___ is your best friend? — Tom.', choices: ['Who', 'What', 'Where', 'When'], answer: 'Who', explanation: '答案是人名 Tom，所以問人用 Who。' },
        { id: 'P2-EN-G03-Q02', prompt: '選出最合適的英文答案。', symbol: '❓', sentence: '___ do you live? — In Hong Kong.', choices: ['Where', 'Who', 'What time', 'How many'], answer: 'Where', explanation: '答案是地點，所以用 Where。' },
        { id: 'P2-EN-G03-Q03', prompt: '選出最合適的英文答案。', symbol: '❓', sentence: '___ is your birthday? — In May.', choices: ['When', 'Who', 'What', 'Where'], answer: 'When', explanation: '答案是時間 In May，所以用 When。' },
        { id: 'P2-EN-G03-Q04', prompt: '選出最合適的英文答案。', symbol: '❓', sentence: '___ pencils do you have? — Three.', choices: ['How many', 'What time', 'Where', 'Who'], answer: 'How many', explanation: '答案是數量 Three，所以用 How many。' },
        { id: 'P2-EN-G03-Q05', prompt: '選出最合適的英文答案。', symbol: '❓', sentence: '___ do you get up? — At seven o’clock.', choices: ['What time', 'Where', 'Who', 'How many'], answer: 'What time', explanation: '答案是具體鐘點，所以用 What time。' },
        { id: 'P2-EN-G03-Q06', prompt: '選出最合適的英文答案。', symbol: '❓', sentence: '___ is this? — It is a ruler.', choices: ['What', 'Who', 'Where', 'When'], answer: 'What', explanation: '答案是物件名稱，所以用 What。' },
        { id: 'P2-EN-G03-Q07', prompt: '選出最合適的英文答案。', symbol: '❓', sentence: '___ is your teacher? — Mr Chan.', choices: ['Who', 'What time', 'Where', 'How many'], answer: 'Who', explanation: '答案是人名 Mr Chan，所以問人用 Who。' },
        { id: 'P2-EN-G03-Q08', prompt: '選出最合適的英文答案。', symbol: '❓', sentence: '___ do you go to the park? — On Sunday.', choices: ['When', 'Who', 'What', 'Where'], answer: 'When', explanation: '答案是日期或日子，所以用 When。' },
        { id: 'P2-EN-G03-Q09', prompt: '選出最合適的英文答案。', symbol: '❓', sentence: '___ are my shoes? — Under the bed.', choices: ['Where', 'Who', 'What time', 'How many'], answer: 'Where', explanation: '答案是位置 Under the bed，所以用 Where。' },
        { id: 'P2-EN-G03-Q10', prompt: '選出最合適的英文答案。', symbol: '❓', sentence: '___ is in the box? — A toy car.', choices: ['What', 'Who', 'When', 'How many'], answer: 'What', explanation: '答案是一件物品，所以用 What。' },
      ],
    },
    {
      id: 'P2-EN-G04', area: '提問與回答', title: '我做得到！', objective: '用 can／can’t 表達能力和不能做到的事。', interaction: 'english-modal-choice',
      questions: [
        { id: 'P2-EN-G04-Q01', prompt: '選出最合適的英文答案。', symbol: '🐦', sentence: 'A bird ___ fly.', choices: ['can', 'can’t', 'is', 'are'], answer: 'can', explanation: '小鳥有飛行能力，所以用 can。' },
        { id: 'P2-EN-G04-Q02', prompt: '選出最合適的英文答案。', symbol: '🐟', sentence: 'Fish ___ walk.', choices: ['can’t', 'can', 'isn’t', 'aren’t'], answer: 'can’t', explanation: '魚不能走路，所以用 can’t。' },
        { id: 'P2-EN-G04-Q03', prompt: '選出最合適的英文答案。', symbol: '🚲', sentence: 'I ___ ride a bike.', choices: ['can', 'can’t', 'am', 'do'], answer: 'can', explanation: '表達能力用 can + 動詞原形。' },
        { id: 'P2-EN-G04-Q04', prompt: '選出最合適的英文答案。', symbol: '🍼', sentence: 'A baby ___ drive a car.', choices: ['can’t', 'can', 'is', 'has'], answer: 'can’t', explanation: '嬰兒不能駕駛汽車，所以用 can’t。' },
        { id: 'P2-EN-G04-Q05', prompt: '選出最合適的英文答案。', symbol: '🎹', sentence: 'My sister ___ play the piano.', choices: ['can', 'can’t', 'are', 'has'], answer: 'can', explanation: '表達姐姐有彈琴能力，用 can。' },
        { id: 'P2-EN-G04-Q06', prompt: '選出最合適的英文答案。', symbol: '🚗', sentence: 'We ___ fly a car.', choices: ['can’t', 'can', 'do', 'have'], answer: 'can’t', explanation: '汽車不能飛，所以用 can’t。' },
        { id: 'P2-EN-G04-Q07', prompt: '選出最合適的英文答案。', symbol: '💬', sentence: 'Tom ___ speak English.', choices: ['can', 'can’t', 'is', 'was'], answer: 'can', explanation: 'can 後面接動詞原形 speak。' },
        { id: 'P2-EN-G04-Q08', prompt: '選出最合適的英文答案。', symbol: '🐕', sentence: 'Dogs ___ read books.', choices: ['can’t', 'can', 'are', 'do'], answer: 'can’t', explanation: '小狗不能閱讀書本，所以用 can’t。' },
        { id: 'P2-EN-G04-Q09', prompt: '選出最合適的英文答案。', symbol: '🏊', sentence: 'She ___ swim very well.', choices: ['can', 'can’t', 'is', 'has'], answer: 'can', explanation: '表達游泳能力，用 can。' },
        { id: 'P2-EN-G04-Q10', prompt: '選出最合適的英文答案。', symbol: '🌙', sentence: 'I ___ see in the dark.', choices: ['can’t', 'can', 'am', 'do'], answer: 'can’t', explanation: '在黑暗中不能看見，所以用 can’t。' },
      ],
    },
    {
      id: 'P2-EN-W01',
      area: '看圖寫作',
      title: '看圖故事段落',
      objective: '按三幅連環圖選出開頭、經過和結尾，寫出有次序的簡單故事段落。',
      interaction: 'english-writing-template',
      templateMode: 'english-picture-story-template',
      questions: [
        {
          id: 'P2-EN-W01-Q01', title: 'A Puppy in the Rain', brief: 'Look at the three pictures and build a short story about helping a puppy.', prompt: 'Build a simple picture-story paragraph in the correct order.',
          pictureStrip: [{ emoji: '☔', label: 'Mia walks home.' }, { emoji: '🐶', label: 'She sees a puppy.' }, { emoji: '🏠', label: 'The puppy is safe.' }],
          steps: [
            { id: 'beginning', label: 'Picture 1: Beginning', focus: 'Say who is there and where the story starts.', answer: 'One rainy day, Mia is walking home with her umbrella.', options: ['One rainy day, Mia is walking home with her umbrella.', 'Mia does not want a story.', 'The ending comes before the beginning.'] },
            { id: 'middle', label: 'Picture 2: What happens?', focus: 'Use the picture to tell the important action.', answer: 'She sees a small puppy under a bench and calls her mum.', options: ['She sees a small puppy under a bench and calls her mum.', 'The puppy is not in the picture.', 'Mia stops telling the story.'] },
            { id: 'ending', label: 'Picture 3: Ending', focus: 'Tell readers what happens at the end.', answer: 'They take the puppy home, and it is warm and safe.', options: ['They take the puppy home, and it is warm and safe.', 'The story has no ending.', 'Nobody helps the puppy.'] },
          ], explanation: 'A clear picture story starts with the setting, tells the important action, then gives an ending.'
        },
        {
          id: 'P2-EN-W01-Q02', title: 'The Lost Balloon', brief: 'Look at the three pictures and tell how Sam gets his balloon back.', prompt: 'Build a simple picture-story paragraph in the correct order.',
          pictureStrip: [{ emoji: '🎈', label: 'Sam has a balloon.' }, { emoji: '🌳', label: 'It is in a tree.' }, { emoji: '🧑‍🚒', label: 'A helper returns it.' }],
          steps: [
            { id: 'beginning', label: 'Picture 1: Beginning', focus: 'Introduce the person and the special object.', answer: 'Sam has a red balloon at the park.', options: ['Sam has a red balloon at the park.', 'Sam has no picture to see.', 'The ending is the first sentence.'] },
            { id: 'middle', label: 'Picture 2: What happens?', focus: 'Tell readers about the problem in the next picture.', answer: 'Then the balloon flies into a tall tree.', options: ['Then the balloon flies into a tall tree.', 'The balloon is never important.', 'Sam writes about a different day.'] },
            { id: 'ending', label: 'Picture 3: Ending', focus: 'Show how the problem is solved.', answer: 'A kind firefighter gets it down, and Sam smiles.', options: ['A kind firefighter gets it down, and Sam smiles.', 'Nobody can solve the problem.', 'The story stops without an ending.'] },
          ], explanation: 'Use the pictures in order: start with the balloon, show the problem, then tell how Sam gets help.'
        },
        {
          id: 'P2-EN-W01-Q03', title: 'Watering the Garden', brief: 'Look at the three pictures and tell how two friends care for the class garden.', prompt: 'Build a simple picture-story paragraph in the correct order.',
          pictureStrip: [{ emoji: '🌱', label: 'The plants look dry.' }, { emoji: '🚿', label: 'The friends water them.' }, { emoji: '🌼', label: 'The plants look happy.' }],
          steps: [
            { id: 'beginning', label: 'Picture 1: Beginning', focus: 'Describe what the children notice first.', answer: 'Ben and Eva see that the garden plants look dry.', options: ['Ben and Eva see that the garden plants look dry.', 'The plants are not part of the story.', 'The garden is the final sentence.'] },
            { id: 'middle', label: 'Picture 2: What happens?', focus: 'Use an action to show how they help.', answer: 'They fill a watering can and water the plants together.', options: ['They fill a watering can and water the plants together.', 'They do not do anything at all.', 'The story is only about a chair.'] },
            { id: 'ending', label: 'Picture 3: Ending', focus: 'End with the result and a feeling.', answer: 'Soon the flowers look fresh, and the friends feel proud.', options: ['Soon the flowers look fresh, and the friends feel proud.', 'There is no result in the story.', 'The garden disappears from the story.'] },
          ], explanation: 'The middle picture gives the action. The last picture can show the result and how the characters feel.'
        },
        {
          id: 'P2-EN-W01-Q04', title: 'A Picnic Helper', brief: 'Look at the three pictures and tell how Leo helps during a class picnic.', prompt: 'Build a simple picture-story paragraph in the correct order.',
          pictureStrip: [{ emoji: '🧺', label: 'The picnic basket is heavy.' }, { emoji: '🤝', label: 'Leo carries it.' }, { emoji: '🍎', label: 'The class enjoys lunch.' }],
          steps: [
            { id: 'beginning', label: 'Picture 1: Beginning', focus: 'State the place and the small problem.', answer: 'At the park, Ms Lee has a heavy picnic basket.', options: ['At the park, Ms Lee has a heavy picnic basket.', 'The class is not at a picnic.', 'The story starts with the ending.'] },
            { id: 'middle', label: 'Picture 2: What happens?', focus: 'Tell readers who helps and what the person does.', answer: 'Leo carries the basket to the picnic table for her.', options: ['Leo carries the basket to the picnic table for her.', 'Leo hides from the picnic.', 'The basket is not used in the story.'] },
            { id: 'ending', label: 'Picture 3: Ending', focus: 'Finish with the result of the helpful action.', answer: 'The class can eat lunch together, and Ms Lee says thank you.', options: ['The class can eat lunch together, and Ms Lee says thank you.', 'The story has no result.', 'Nobody notices Leo’s help.'] },
          ], explanation: 'A helpful-story paragraph can show a problem, a kind action and a happy result.'
        },
        {
          id: 'P2-EN-W01-Q05', title: 'The Library Book', brief: 'Look at the three pictures and tell how Amy chooses and shares a library book.', prompt: 'Build a simple picture-story paragraph in the correct order.',
          pictureStrip: [{ emoji: '📚', label: 'Amy visits the library.' }, { emoji: '📖', label: 'She finds a book.' }, { emoji: '👭', label: 'She reads with a friend.' }],
          steps: [
            { id: 'beginning', label: 'Picture 1: Beginning', focus: 'Say where the character goes.', answer: 'After school, Amy goes to the library with her friend.', options: ['After school, Amy goes to the library with her friend.', 'Amy does not go anywhere.', 'The library is not in the story.'] },
            { id: 'middle', label: 'Picture 2: What happens?', focus: 'Tell what the character finds or does next.', answer: 'She finds a funny animal book and opens it carefully.', options: ['She finds a funny animal book and opens it carefully.', 'She forgets every part of the story.', 'The book has no place in the picture.'] },
            { id: 'ending', label: 'Picture 3: Ending', focus: 'End with a shared activity or feeling.', answer: 'Amy reads the book with her friend, and they laugh together.', options: ['Amy reads the book with her friend, and they laugh together.', 'The story cannot have an ending.', 'Nobody reads the book.'] },
          ], explanation: 'The pictures help you keep the story in order: place, action, then ending.'
        },
        {
          id: 'P2-EN-W01-Q06', title: 'A Birthday Card', brief: 'Look at the three pictures and tell how Kim makes a card for her dad.', prompt: 'Build a simple picture-story paragraph in the correct order.',
          pictureStrip: [{ emoji: '✂️', label: 'Kim has paper and crayons.' }, { emoji: '💌', label: 'She makes a card.' }, { emoji: '🎂', label: 'Dad opens it.' }],
          steps: [
            { id: 'beginning', label: 'Picture 1: Beginning', focus: 'Introduce the materials and the idea.', answer: 'Kim has paper and crayons for her dad’s birthday.', options: ['Kim has paper and crayons for her dad’s birthday.', 'Kim has no idea for a card.', 'The card is the ending only.'] },
            { id: 'middle', label: 'Picture 2: What happens?', focus: 'Tell what the character makes.', answer: 'She draws a big cake and writes, “Happy Birthday, Dad!”', options: ['She draws a big cake and writes, “Happy Birthday, Dad!”', 'She does not make a card.', 'The picture has no message.'] },
            { id: 'ending', label: 'Picture 3: Ending', focus: 'Finish with the receiver’s reaction.', answer: 'Dad opens the card and gives Kim a big hug.', options: ['Dad opens the card and gives Kim a big hug.', 'Dad never sees the card.', 'The story ends before Dad is happy.'] },
          ], explanation: 'A good ending shows what happens after the main action and can include a character’s feeling.'
        },
      ],
    },
  ].sort((left, right) => ['P2-EN-P01', 'P2-EN-G01', 'P2-EN-G05', 'P2-EN-G02', 'P2-EN-G03', 'P2-EN-G04', 'P2-EN-W01'].indexOf(left.id) - ['P2-EN-P01', 'P2-EN-G01', 'P2-EN-G05', 'P2-EN-G02', 'P2-EN-G03', 'P2-EN-G04', 'P2-EN-W01'].indexOf(right.id)),
};

export default p2EnglishBank;
