# CLAUDE.md

Coin Master 維京活動攻略，純靜態單頁網站（無框架、無建置、無套件），由 GitHub Pages 從 `main` 發布。使用者說明見 [README.md](README.md)。

## 執行與驗證

- 本機預覽：`python3 -m http.server 8791`，開 http://localhost:8791（8765 常被其他專案佔用；`file://` 預覽不會執行 JS）
- 沒有測試框架；改完 JS 至少跑 `node --check js/app.js && node --check js/i18n.js && node --check js/quests.js`
- UI 改動要在瀏覽器實際切換維京、主獎、關卡、語言確認

## 檔案職責

- `js/quests.js`：`window.VIKING_QUESTS` 資料。欄位格式以檔案開頭註解為準，改資料格式時同步更新那段註解
- `js/i18n.js`：`window.I18N_LANGS` 與 `window.I18N`，9 種語言（zh-TW、en、ja、ko、th、vi、id、es、pt）
- `js/app.js`：IIFE，`render()` 依序呼叫 `renderStatic / renderQuestTabs / renderHero / renderPath / renderDetail / renderTable`
- `css/style.css`：主題用 `body[data-theme=…]`，淺色主題另加 `tone-light`
- `index.html`：SVG sprite（`i-*` 圖示、`bottle` / `gift` / `crate` 節點）與頁面骨架

## 慣例

- 下注規則與獎勵用資料描述，文字由 `i18n.js` 的模板產生，不要在 `quests.js` 寫死句子
- 新的 i18n key 必須 9 種語言都加；zh-TW 是主要語言，用語以它為準（例如「獎勵轉盤」；維京名稱不加「任務」）
- 網址 hash 格式 `#quest/tier/bar`；舊連結別名放在 `readHash()` 的 `alias`
- 關卡地圖進場動畫（路徑描線 + 節點依序彈出）在載入與每次切換維京時播放；點關卡、換主獎、換語言不重播（`renderPath()` 以 `shownQuest` 判斷，其餘加 `no-anim`）
- 動畫一律包在 `@media (prefers-reduced-motion: no-preference)` 內
- `localStorage` 只存語言偏好（`cslviking:lang`），存取要包 try/catch
- 程式碼註解用繁體中文
- 頁尾版權為「大佬群CSL製作」；不要加資料來源或第三方社群名稱

## Git

- 直接在 `main` 開發；使用者通常要求改完直接 push
- commit 訊息用英文，一句話描述變更
