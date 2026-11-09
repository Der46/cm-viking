# 維京任務攻略 | Viking Quest Guide

Coin Master 維京活動的單頁攻略：每一關的下注方式、目標金幣與過關獎勵，一頁看完。

- 4 種維京：魔法維京、活動維京、週三維京、週日維京
- 每種維京可切換主獎（例如 55K / 65K），關卡地圖、各關說明與總表會一起更新
- 支援 9 種語言：中文、English、Tiếng Việt、日本語、한국어、ไทย、Bahasa Indonesia、Español、Português
- 網址會記住目前位置（`#維京/主獎/關卡`，例如 `#event/60k/3`），可以直接分享

## 本機預覽

純靜態網站，沒有建置步驟，也不需要安裝套件：

```bash
python3 -m http.server 8791
```

然後打開 <http://localhost:8791>。

## 專案結構

```
index.html      頁面骨架、SVG 圖示與關卡節點（bottle / gift / crate）
css/style.css   樣式、各維京配色主題、進場動畫
js/quests.js    維京資料：下注規則、主獎、各關目標與獎勵
js/i18n.js      9 種語言的介面文字
js/app.js       讀取資料並畫出頁面
favicon.svg     網站圖示
```

## 更新資料

### 新增一種維京

在 `js/quests.js` 的 `VIKING_QUESTS` 陣列加一個物件，頁面會自動出現切換按鈕。欄位說明寫在檔案開頭的註解，重點：

- `name`：9 種語言的名稱
- `theme`：`enchanted`（淺紫）、`event`（淡黃）、`tribal`（淡綠），不填為深紫
- `node`：關卡地圖圖示，`bottle`（藥水瓶，預設）、`gift`（禮物盒）、`crate`（叢林箱）
- `colors`：10 個關卡節點的顏色
- `sequence.bars`：每關的下注規則，用資料描述（`max`、`auto`、`ladder`、`choice` …），文字會自動翻成 9 種語言
- `tiers`：主獎清單，每個主獎有 10 關的 `goal`（目標金幣）與 `rewards`（獎勵）；還沒有資料就把 `bars` 設為 `null`

### 修改文字或翻譯

介面文字都在 `js/i18n.js`，每種語言一個區塊。新增 key 時要 9 種語言都加。

## 部署

推到 `main` 後由 GitHub Pages 發布（`.nojekyll` 讓 Pages 直接提供原始檔）。

---

玩家自製攻略，與 Moon Active 無關；數值來自玩家回報，可能與遊戲內不同。

© 大佬群CSL製作
