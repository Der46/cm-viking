/*
 * 維京任務資料 / Viking quest data
 * ------------------------------------------------------------------
 * 新增其他維京任務：在 VIKING_QUESTS 陣列裡再加一個物件即可，頁面會自動出現切換按鈕。
 * 選填：theme: 'enchanted'（淺紫）/ 'event'（淡黃）/ 'tribal'（淡綠），不填為深紫；node: 'gift' 禮物盒 / 'crate' 叢林箱（預設 'bottle' 藥水瓶）
 * 兩種下注順序：每關用 { kind: 'choice', options: [{ when: 'seqMore', rule }, { when: 'seqLess', rule }] }
 *
 * sequence.bars[n] 下注規則（文字會依語言自動產生，不用自己翻譯）：
 *   { kind: 'max' }                         使用最高下注
 *   { kind: 'max', auto: true }             最高注開自動轉
 *   { kind: 'auto' }                        最低注自動轉
 *   { kind: 'auto', bet: 4 }                第四檔注自動轉（bet 1~4）
 *   { kind: 'free' }                        只用前兩檔注自由切換
 *   { kind: 'range', from: 1, to: 3 }      在第 from～to 檔注之間輪流轉到出獎勵（圖源沒給次數時用）
 *   { kind: 'ladder', steps: [[檔位, 次數], ...], cap: true, loop: true, more: true }
 *        檔位 1~6（1=最低注）；每一檔轉「次數」後沒出獎勵轉盤就加一檔
 *        最後一檔不論次數，一律顯示「轉到出獎勵轉盤為止」
 *        cap = 顯示「不再往上加注」（loop / more 為舊欄位，已不顯示）
 *   { kind: 'choice', options: [{ when: 'lowCoins' | 'highCoins', rule: {...} }] }
 *
 * tiers[] 主獎：id、prize（顯示用）、label（tierCards / medium …）、cards（金卡數）、
 *          popular（最熱門標籤）、default（預設選這個）、note（說明文字 key）
 * tiers[].bars[i] 每一關：
 *   goal:  目標金幣（字串，保留 K/B/T；圖源沒有就省略）
 *   wheel: true = 目標要在獎勵轉盤贏得
 *   rewards: [{ t: 類型, v: 數量, m: 分鐘, p: 百分比, about: 約略旋轉數 }]
 *   類型：spins coins petxp setBlast magicalChest smallSeasonal bigSeasonal seasonalChest
 *         diamondSeasonal regularChest blueChest jokerChest joker pinata goldCard
 *         diamondCard goldenHammers coinCraze tokens tokenBox gems redHammers
 * 沒有資料的主獎，bars 設為 null。
 */
window.VIKING_QUESTS = [
  {
    id: 'enchanted',
    title: 'Enchanted Viking Quest',
    theme: 'enchanted', // 淺紫色主題
    name: {
      'zh-TW': '魔法維京任務',
      en: 'Enchanted Viking Quest',
      ja: 'エンチャンテッド・バイキングクエスト',
      ko: '인챈티드 바이킹 퀘스트',
      th: 'ภารกิจไวกิ้งต้องมนตร์',
      vi: 'Nhiệm vụ Viking Phù Phép',
      id: 'Quest Viking Ajaib',
      es: 'Misión vikinga encantada',
      pt: 'Missão viking encantada'
    },
    // 10 個藥水瓶顏色，依關卡順序
    colors: ['#F4C95D', '#A6DB6E', '#4FCB98', '#5FCDC0', '#5AAEF2',
             '#8592F5', '#C383F2', '#F27FC4', '#F46A5E', '#F5A54A'],
    sequence: {
      bars: {
        1: { kind: 'max' },
        2: { kind: 'max' },
        3: { kind: 'max' },
        4: { kind: 'ladder', steps: [[1, 20], [2, 20], [3, 0]] },
        5: { kind: 'ladder', steps: [[1, 20], [2, 20], [3, 0]], cap: true },
        6: { kind: 'ladder', steps: [[1, 25], [2, 25], [3, 0]] },
        7: { kind: 'ladder', steps: [[1, 25], [2, 25], [3, 0]], cap: true },
        8: { kind: 'ladder', steps: [[1, 25], [2, 0]] },
        9: { kind: 'auto' },
        10: {
          kind: 'choice',
          options: [
            { when: 'lowCoins', rule: { kind: 'free' } },
            { when: 'highCoins', rule: { kind: 'ladder', steps: [[1, 25], [2, 25]], loop: true } }
          ]
        }
      }
    },
    tiers: [
      { id: '21k', prize: '21K', label: 'medium', cards: 1, bars: null },
      {
        id: '55k', prize: '55K', label: 'huge', cards: 2, note: 'note55',
        bars: [
          { goal: '930B', rewards: [{ t: 'spins', v: '1.8K' }, { t: 'coins', v: '65B' }, { t: 'petxp', v: '250K' }, { t: 'setBlast', m: 30 }] },
          { goal: '405B', rewards: [{ t: 'coins', v: '18B' }, { t: 'petxp', v: '200K' }, { t: 'magicalChest' }] },
          { goal: '2.85T', rewards: [{ t: 'spins', v: '3.4K' }, { t: 'coins', v: '75B' }, { t: 'petxp', v: '380K' }, { t: 'pinata' }] },
          { goal: '510B', wheel: true, rewards: [{ t: 'smallSeasonal' }, { t: 'coins', v: '42B' }, { t: 'petxp', v: '250K' }] },
          { goal: '3.1T', rewards: [{ t: 'spins', v: '3.5K' }, { t: 'pinata' }, { t: 'coins', v: '100B' }] },
          { goal: '8.17T', rewards: [{ t: 'spins', v: '8.8K' }, { t: 'pinata' }, { t: 'petxp', v: '700K' }] },
          { goal: '2.45T', wheel: true, rewards: [{ t: 'goldCard' }, { t: 'coins', v: '240B' }, { t: 'petxp', v: '420K' }] },
          { goal: '10.03T', rewards: [{ t: 'spins', v: '15K' }, { t: 'bigSeasonal' }, { t: 'goldenHammers' }] },
          { goal: '6.96T', wheel: true, rewards: [{ t: 'goldCard' }, { t: 'spins', v: '4.3K' }, { t: 'coinCraze', p: '150%' }, { t: 'petxp', v: '1.5M' }] },
          { goal: '21.11T', rewards: [{ t: 'spins', v: '55K' }, { t: 'goldCard' }, { t: 'seasonalChest' }, { t: 'diamondSeasonal' }, { t: 'regularChest' }, { t: 'spins', v: '1.5K' }] }
        ]
      },
      {
        id: '65k', prize: '65K', label: 'epic', cards: 2, popular: true, note: 'note65',
        bars: [
          { goal: '1.12T', rewards: [{ t: 'spins', v: '2.2K' }, { t: 'coins', v: '75B' }, { t: 'petxp', v: '330K' }, { t: 'setBlast', m: 30, p: '30%' }] },
          { goal: '525B', rewards: [{ t: 'coins', v: '21B' }, { t: 'petxp', v: '275K' }, { t: 'magicalChest' }] },
          { goal: '4.13T', rewards: [{ t: 'spins', v: '4.2K' }, { t: 'coins', v: '90B' }, { t: 'petxp', v: '560K' }, { t: 'pinata' }] },
          { goal: '745B', wheel: true, rewards: [{ t: 'coins', v: '50B' }, { t: 'petxp', v: '330K' }, { t: 'smallSeasonal' }] },
          { goal: '4.55T', rewards: [{ t: 'spins', v: '5K' }, { t: 'pinata' }, { t: 'coins', v: '85B' }] },
          { goal: '12.39T', rewards: [{ t: 'spins', v: '11.5K' }, { t: 'blueChest', about: '2.5K' }, { t: 'petxp', v: '880K' }] },
          { goal: '3.36T', wheel: true, rewards: [{ t: 'goldCard' }, { t: 'coins', v: '280B' }, { t: 'petxp', v: '550K' }] },
          { goal: '14.54T', rewards: [{ t: 'spins', v: '20K' }, { t: 'bigSeasonal' }, { t: 'goldenHammers', m: 10 }] },
          { goal: '8.6T', wheel: true, rewards: [{ t: 'goldCard' }, { t: 'spins', v: '5.5K' }, { t: 'coinCraze', p: '200%' }, { t: 'petxp', v: '1.8M' }] },
          { goal: '29.56T', rewards: [{ t: 'spins', v: '65K' }, { t: 'diamondCard' }, { t: 'diamondSeasonal' }, { t: 'jokerChest' }, { t: 'joker' }] }
        ]
      }
    ]
  },
  {
    id: 'event',
    title: 'Event Viking Quest',
    theme: 'event',   // 淡黃色主題（特殊活動）
    node: 'gift',     // 關卡地圖用禮物盒
    name: {
      'zh-TW': '活動維京任務',
      en: 'Event Viking Quest',
      ja: 'イベント・バイキングクエスト',
      ko: '이벤트 바이킹 퀘스트',
      th: 'ภารกิจไวกิ้งอีเวนต์',
      vi: 'Nhiệm vụ Viking sự kiện',
      id: 'Quest Viking Event',
      es: 'Misión vikinga de evento',
      pt: 'Missão viking de evento'
    },
    colors: ['#F4C95D', '#E8A04F', '#6FD3A0', '#4FC1D9', '#5AAEF2',
             '#7F9BF5', '#B58CF2', '#EE84B8', '#F2725F', '#E9C46A'],
    sequence: {
      bars: {
        1: { kind: 'max', auto: true },
        2: { kind: 'max', auto: true },
        3: { kind: 'max', auto: true },
        4: { kind: 'max', auto: true },
        5: { kind: 'ladder', steps: [[1, 15], [2, 15], [3, 15]], more: true },
        6: { kind: 'ladder', steps: [[1, 20], [2, 20], [3, 20], [4, 0]], cap: true },
        7: { kind: 'auto', bet: 4 },
        8: {
          kind: 'choice',
          options: [
            { when: 'lowCoins', rule: { kind: 'free' } },
            { when: 'highCoins', rule: { kind: 'ladder', steps: [[1, 20], [2, 20], [3, 20]], loop: true } }
          ]
        },
        9: { kind: 'ladder', steps: [[1, 20], [2, 20], [3, 20], [4, 20]], loop: true },
        10: { kind: 'ladder', steps: [[1, 25], [2, 25], [3, 25]], loop: true }
      }
    },
    tiers: [
      {
        id: '40k', prize: '40K', label: 'tierCards', cards: 2, note: 'noteVk40',
        // 圖源只有獎勵（金幣以 M 計，依村莊等級不同），沒有目標金幣
        bars: [
          { rewards: [{ t: 'spins', v: '2K' }, { t: 'coins', v: '55M' }, { t: 'petxp', v: '280K' }, { t: 'setBlast', p: '30%' }] },
          { rewards: [{ t: 'coins', v: '15M' }, { t: 'petxp', v: '225K' }, { t: 'magicalChest' }] },
          { rewards: [{ t: 'spins', v: '2K' }, { t: 'coins', v: '65M' }, { t: 'petxp', v: '425K' }, { t: 'blueChest' }] },
          { rewards: [{ t: 'coins', v: '35M' }, { t: 'petxp', v: '275K' }, { t: 'smallSeasonal' }] },
          { rewards: [{ t: 'spins', v: '4.6K' }, { t: 'pinata' }, { t: 'coins', v: '85M' }] },
          { rewards: [{ t: 'spins', v: '3.5K' }, { t: 'pinata' }, { t: 'petxp', v: '800K' }, { t: 'jokerChest' }] },
          { rewards: [{ t: 'coins', v: '200M' }, { t: 'petxp', v: '500K' }, { t: 'goldCard' }] },
          { rewards: [{ t: 'spins', v: '18.5K' }, { t: 'bigSeasonal' }, { t: 'goldenHammers' }] },
          { rewards: [{ t: 'spins', v: '5K' }, { t: 'coinCraze', p: '200%' }, { t: 'goldCard' }, { t: 'petxp', v: '1.7M' }] },
          { rewards: [{ t: 'spins', v: '40K' }, { t: 'joker' }, { t: 'diamondCard' }, { t: 'goldCard' }, { t: 'regularChest', about: '5K–99K' }] }
        ]
      },
      {
        id: '60k', prize: '60K', label: 'tierSpins', cards: 1, note: 'noteVk60', default: true,
        bars: [
          { goal: '2.12T', rewards: [{ t: 'spins', v: '2K' }, { t: 'coins', v: '55B' }, { t: 'petxp', v: '280K' }, { t: 'setBlast', m: 30, p: '30%' }] },
          { goal: '740B', rewards: [{ t: 'coins', v: '15B' }, { t: 'petxp', v: '225K' }, { t: 'magicalChest' }] },
          { goal: '3.82T', rewards: [{ t: 'spins', v: '2K' }, { t: 'coins', v: '65B' }, { t: 'petxp', v: '425K' }, { t: 'blueChest', about: '2.5K' }] },
          { goal: '725B', wheel: true, rewards: [{ t: 'coins', v: '35B' }, { t: 'petxp', v: '275K' }, { t: 'smallSeasonal' }] },
          { goal: '4.2T', rewards: [{ t: 'spins', v: '4.6K' }, { t: 'pinata' }, { t: 'coins', v: '85B' }] },
          { goal: '5.61T', wheel: true, rewards: [{ t: 'spins', v: '11.5K' }, { t: 'pinata' }, { t: 'petxp', v: '800K' }] },
          { goal: '8.5T', rewards: [{ t: 'coins', v: '200B' }, { t: 'petxp', v: '500K' }] },
          { goal: '15.48T', rewards: [{ t: 'spins', v: '18.5K' }, { t: 'bigSeasonal' }, { t: 'goldenHammers' }] },
          { goal: '8.78T', wheel: true, rewards: [{ t: 'goldCard' }, { t: 'spins', v: '5K' }, { t: 'petxp', v: '1.7M' }, { t: 'coinCraze', p: '200%' }] },
          { goal: '32.53T', rewards: [{ t: 'spins', v: '60K' }, { t: 'regularChest' }] }
        ]
      },
      {
        id: '20k', prize: '20K', label: 'tierToken', cards: 1, note: 'noteVk20',
        bars: [
          { goal: '2.12T', rewards: [{ t: 'spins', v: '2K' }, { t: 'coins', v: '55B' }, { t: 'petxp', v: '280K' }, { t: 'setBlast', m: 30, p: '30%' }] },
          { goal: '740B', rewards: [{ t: 'coins', v: '15B' }, { t: 'petxp', v: '225K' }, { t: 'magicalChest' }] },
          { goal: '3.82T', rewards: [{ t: 'spins', v: '2K' }, { t: 'coins', v: '65B' }, { t: 'petxp', v: '425K' }, { t: 'blueChest', about: '2.5K' }] },
          { goal: '725B', wheel: true, rewards: [{ t: 'coins', v: '35B' }, { t: 'petxp', v: '275K' }, { t: 'smallSeasonal' }] },
          { goal: '4.2T', rewards: [{ t: 'spins', v: '4.6K' }, { t: 'coins', v: '85B' }, { t: 'pinata' }] },
          { goal: '7.85T', wheel: true, rewards: [{ t: 'tokens', v: '2' }, { t: 'pinata' }, { t: 'petxp', v: '800K' }] },
          { goal: '13.6T', rewards: [{ t: 'coins', v: '200B' }, { t: 'petxp', v: '500K' }] },
          { goal: '25.68T', rewards: [{ t: 'spins', v: '18.5K' }, { t: 'bigSeasonal' }, { t: 'goldenHammers' }] },
          { goal: '13.26T', wheel: true, rewards: [{ t: 'goldCard' }, { t: 'spins', v: '5K' }, { t: 'petxp', v: '1.7M' }, { t: 'coinCraze', p: '200%' }] },
          { goal: '52.92T', rewards: [{ t: 'spins', v: '20K' }, { t: 'tokens', v: '3' }, { t: 'tokenBox' }, { t: 'gems', v: '1K' }, { t: 'redHammers' }] }
        ]
      }
    ]
  },
  {
    id: 'tribal',
    title: 'Wednesday Viking Quest',
    theme: 'tribal',  // 淡綠色主題（週三維京）
    node: 'crate',    // 關卡地圖用叢林箱
    name: {
      'zh-TW': '週三維京',
      en: 'Wednesday Viking Quest',
      ja: '水曜バイキング',
      ko: '수요일 바이킹 퀘스트',
      th: 'ภารกิจไวกิ้งวันพุธ',
      vi: 'Nhiệm vụ Viking thứ Tư',
      id: 'Quest Viking Rabu',
      es: 'Misión vikinga del miércoles',
      pt: 'Missão viking de quarta-feira'
    },
    colors: ['#7FB24A', '#9CCB5B', '#5FAE6E', '#C99B4A', '#4E79C9',
             '#45B8B8', '#A9A196', '#D3B84E', '#E07A3F', '#3FA37A'],
    sequence: {
      // 順序 1 = 金幣較多、順序 2 = 金幣較少
      bars: {
        1: { kind: 'choice', options: [
          { when: 'seqMore', rule: { kind: 'auto', bet: 5 } },
          { when: 'seqLess', rule: { kind: 'auto', bet: 4 } }
        ] },
        2: { kind: 'choice', options: [
          { when: 'seqMore', rule: { kind: 'max', auto: true } },
          { when: 'seqLess', rule: { kind: 'max', auto: true } }
        ] },
        3: { kind: 'choice', options: [
          { when: 'seqMore', rule: { kind: 'max', auto: true } },
          { when: 'seqLess', rule: { kind: 'max', auto: true } }
        ] },
        4: { kind: 'choice', options: [
          { when: 'seqMore', rule: { kind: 'max', auto: true } },
          { when: 'seqLess', rule: { kind: 'ladder', steps: [[2, 10], [3, 10], [4, 10]], more: true } }
        ] },
        5: { kind: 'choice', options: [
          { when: 'seqMore', rule: { kind: 'max', auto: true } },
          { when: 'seqLess', rule: { kind: 'ladder', steps: [[2, 10], [3, 10], [4, 10]], more: true } }
        ] },
        6: { kind: 'choice', options: [
          { when: 'seqMore', rule: { kind: 'ladder', steps: [[2, 15], [3, 15], [4, 15]], more: true } },
          { when: 'seqLess', rule: { kind: 'ladder', steps: [[1, 15], [2, 15], [3, 15], [4, 15]], loop: true } }
        ] },
        7: { kind: 'choice', options: [
          { when: 'seqMore', rule: { kind: 'ladder', steps: [[2, 20], [3, 20], [4, 20]], more: true } },
          { when: 'seqLess', rule: { kind: 'ladder', steps: [[1, 20], [2, 20], [3, 20]], loop: true } }
        ] },
        8: { kind: 'choice', options: [
          { when: 'seqMore', rule: { kind: 'ladder', steps: [[1, 10], [2, 10], [3, 10]], more: true } },
          { when: 'seqLess', rule: { kind: 'ladder', steps: [[1, 20], [2, 20], [3, 20], [4, 20]], loop: true } }
        ] },
        9: { kind: 'choice', options: [
          { when: 'seqMore', rule: { kind: 'ladder', steps: [[1, 20], [2, 20], [3, 20]], loop: true } },
          { when: 'seqLess', rule: { kind: 'auto' } }
        ] },
        10: { kind: 'choice', options: [
          { when: 'seqMore', rule: { kind: 'ladder', steps: [[2, 20], [3, 20], [4, 20]], loop: true } },
          { when: 'seqLess', rule: { kind: 'auto' } }
        ] }
      }
    },
    tiers: [
      {
        id: '45k', prize: '45K', label: 'grandPrize', note: 'noteTribal',
        bars: [
          { goal: '930B', rewards: [{ t: 'coins', v: '65B' }, { t: 'spins', v: '1.5K' }, { t: 'petxp', v: '250K' }] },
          { goal: '450B', rewards: [{ t: 'coins', v: '18B' }, { t: 'petxp', v: '175K' }, { t: 'magicalChest' }] },
          { goal: '2.8T', rewards: [{ t: 'coins', v: '75B' }, { t: 'spins', v: '2.5K' }, { t: 'petxp', v: '300K' }, { t: 'regularChest' }] },
          { goal: '510B', wheel: true, rewards: [{ t: 'coins', v: '42B' }, { t: 'regularChest' }, { t: 'petxp', v: '200K' }] },
          { goal: '3.1T', rewards: [{ t: 'coins', v: '100B' }, { t: 'spins', v: '3.5K' }] },
          { goal: '8.7T', rewards: [{ t: 'spins', v: '8K' }, { t: 'magicalChest' }, { t: 'petxp', v: '600K' }] },
          { goal: '2.4T', wheel: true, rewards: [{ t: 'coins', v: '240B' }, { t: 'petxp', v: '400K' }] },
          { goal: '10T', rewards: [{ t: 'coins', v: '150B' }, { t: 'spins', v: '10K' }, { t: 'regularChest' }] },
          { goal: '5.8T', wheel: true, rewards: [{ t: 'spins', v: '3.5K' }, { t: 'petxp', v: '900K' }] },
          { goal: '19.7T', rewards: [{ t: 'coins', v: '250B' }, { t: 'spins', v: '45K' }, { t: 'petxp', v: '2.3M' }, { t: 'regularChest' }, { t: 'newCard' }] }
        ]
      }
    ]
  },
  {
    id: 'sunday',
    title: 'Sunday Viking Quest',
    theme: 'tribal',  // 與週三維京相同的淡綠配色
    node: 'gift',
    name: {
      'zh-TW': '週日維京',
      en: 'Sunday Viking Quest',
      ja: '日曜バイキング',
      ko: '일요일 바이킹 퀘스트',
      th: 'ภารกิจไวกิ้งวันอาทิตย์',
      vi: 'Nhiệm vụ Viking Chủ nhật',
      id: 'Quest Viking Minggu',
      es: 'Misión vikinga del domingo',
      pt: 'Missão viking de domingo'
    },
    colors: ['#E8823A', '#3FB5A8', '#C04FB8', '#7A5BD6', '#4AA35A',
             '#9B4FD0', '#E05A4A', '#E2A93A', '#D9534F', '#4E8FD9'],
    sequence: {
      // 順序 1 = 金幣較多、順序 2 = 金幣較少
      bars: {
        1: { kind: 'choice', options: [
          { when: 'seqMore', rule: { kind: 'auto', bet: 5 } },
          { when: 'seqLess', rule: { kind: 'auto', bet: 4 } }
        ] },
        2: { kind: 'choice', options: [
          { when: 'seqMore', rule: { kind: 'max', auto: true } },
          { when: 'seqLess', rule: { kind: 'max', auto: true } }
        ] },
        3: { kind: 'choice', options: [
          { when: 'seqMore', rule: { kind: 'auto', bet: 6 } },
          { when: 'seqLess', rule: { kind: 'ladder', steps: [[2, 20], [3, 20], [4, 20], [5, 20], [6, 20]], loop: true } }
        ] },
        4: { kind: 'choice', options: [
          { when: 'seqMore', rule: { kind: 'max', auto: true } },
          { when: 'seqLess', rule: { kind: 'ladder', steps: [[1, 20], [2, 20], [3, 20]], more: true } }
        ] },
        5: { kind: 'choice', options: [
          { when: 'seqMore', rule: { kind: 'ladder', steps: [[2, 20], [3, 20], [4, 20]], loop: true } },
          { when: 'seqLess', rule: { kind: 'range', from: 1, to: 3 } }
        ] },
        6: { kind: 'choice', options: [
          { when: 'seqMore', rule: { kind: 'ladder', steps: [[1, 25], [2, 25], [3, 25]], more: true } },
          { when: 'seqLess', rule: { kind: 'range', from: 1, to: 3 } }
        ] },
        7: { kind: 'choice', options: [
          { when: 'seqMore', rule: { kind: 'ladder', steps: [[2, 20], [3, 20], [4, 20]], loop: true } },
          { when: 'seqLess', rule: { kind: 'ladder', steps: [[1, 25], [2, 25], [3, 25]], loop: true } }
        ] },
        8: { kind: 'choice', options: [
          { when: 'seqMore', rule: { kind: 'auto', bet: 2 } },
          { when: 'seqLess', rule: { kind: 'auto' } }
        ] },
        9: { kind: 'choice', options: [
          { when: 'seqMore', rule: { kind: 'auto', bet: 3 } },
          { when: 'seqLess', rule: { kind: 'auto' } }
        ] },
        10: { kind: 'choice', options: [
          { when: 'seqMore', rule: { kind: 'ladder', steps: [[1, 20], [2, 20], [3, 20]], loop: true } },
          { when: 'seqLess', rule: { kind: 'ladder', steps: [[1, 25], [2, 25]], loop: true } }
        ] }
      }
    },
    tiers: [
      { id: '13k', prize: '13K', bars: null },
      { id: '23k', prize: '23K', cards: 1, bars: null },
      {
        id: '60k', prize: '60K', cards: 2, note: 'noteSunday', default: true,
        bars: [
          { goal: '1.9T', rewards: [{ t: 'coins', v: '55B' }, { t: 'spins', v: '2K' }, { t: 'petxp', v: '280K' }, { t: 'setBlast', m: 30 }] },
          { goal: '675B', rewards: [{ t: 'coins', v: '15B' }, { t: 'petxp', v: '225K' }, { t: 'magicalChest' }] },
          { goal: '3.4T', rewards: [{ t: 'coins', v: '65B' }, { t: 'spins', v: '2K' }, { t: 'regularChest' }, { t: 'blueChest' }] },
          { goal: '655B', wheel: true, rewards: [{ t: 'coins', v: '35B' }, { t: 'smallSeasonal' }, { t: 'petxp', v: '275K' }] },
          { goal: '3.8T', rewards: [{ t: 'coins', v: '85B' }, { t: 'spins', v: '4.6K' }, { t: 'pinata' }] },
          { goal: '4.5T', wheel: true, rewards: [{ t: 'spins', v: '11.5K' }, { t: 'pinata' }, { t: 'petxp', v: '800K' }] },
          { goal: '6.4T', rewards: [{ t: 'coins', v: '200B' }, { t: 'petxp', v: '500K' }, { t: 'goldCard' }] },
          { goal: '11.6T', rewards: [{ t: 'spins', v: '18.5K' }, { t: 'bigSeasonal' }, { t: 'goldenHammers', m: 10 }, { t: 'regularChest' }] },
          { goal: '6.8T', wheel: true, rewards: [{ t: 'spins', v: '5K' }, { t: 'coinCraze', p: '200%' }, { t: 'petxp', v: '1.7M' }, { t: 'goldCard' }] },
          { goal: '24.6T', rewards: [{ t: 'spins', v: '60K' }, { t: 'diamondSeasonal' }, { t: 'blueChest' }, { t: 'newCard' }, { t: 'regularChest' }] }
        ]
      }
    ]
  }
];
