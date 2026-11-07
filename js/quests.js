/*
 * 維京任務資料 / Viking quest data
 * ------------------------------------------------------------------
 * 新增其他維京任務：在 VIKING_QUESTS 陣列裡再加一個物件即可，頁面會自動出現切換按鈕。
 *
 * sequence.bars[n] 下注規則（文字會依語言自動產生，不用自己翻譯）：
 *   { kind: 'max' }                         使用最高下注
 *   { kind: 'auto' }                        最低注自動轉
 *   { kind: 'free' }                        只用前兩檔注自由切換
 *   { kind: 'ladder', steps: [[檔位, 次數], ...], cap: true, loop: true }
 *        檔位 1=最低注 2=第二檔 3=第三檔；次數 0 = 轉到出獎勵為止
 *        cap  = 顯示「不再往上加注」；loop = 顯示「輪流轉到出獎勵」
 *   { kind: 'choice', options: [{ when: 'lowCoins' | 'highCoins', rule: {...} }] }
 *
 * tiers[].bars[i] 每一關：
 *   goal:  目標金幣（字串，保留 K/B/T）
 *   wheel: true = 目標要在獎勵轉盤贏得
 *   rewards: [{ t: 類型, v: 數量, m: 分鐘, p: 百分比 }]
 *   類型：spins coins petxp setBlast magicalChest smallSeasonal bigSeasonal seasonalChest
 *         diamondSeasonal regularChest blueChest jokerChest joker pinata goldCard
 *         diamondCard goldenHammers coinCraze
 * 沒有資料的主獎，bars 設為 null。
 */
window.VIKING_QUESTS = [
  {
    id: 'enchanted',
    title: 'Enchanted Viking Quest',
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
          { goal: '12.39T', rewards: [{ t: 'spins', v: '11.5K' }, { t: 'blueChest', v: '2.5K' }, { t: 'petxp', v: '880K' }] },
          { goal: '3.36T', wheel: true, rewards: [{ t: 'goldCard' }, { t: 'coins', v: '280B' }, { t: 'petxp', v: '550K' }] },
          { goal: '14.54T', rewards: [{ t: 'spins', v: '20K' }, { t: 'bigSeasonal' }, { t: 'goldenHammers', m: 10 }] },
          { goal: '8.6T', wheel: true, rewards: [{ t: 'goldCard' }, { t: 'spins', v: '5.5K' }, { t: 'coinCraze', p: '200%' }, { t: 'petxp', v: '1.8M' }] },
          { goal: '29.56T', rewards: [{ t: 'spins', v: '65K' }, { t: 'diamondCard' }, { t: 'diamondSeasonal' }, { t: 'jokerChest' }, { t: 'joker' }] }
        ]
      }
    ]
  }
];
