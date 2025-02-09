# React Weather App

使用react + vite作為基礎架構，

利用中央氣象局提供的api獲取全台各地的氣象資料並且呈現。
隨當下天氣改變的背景圖片讓人對於今日陰晴一目了然。

## TODO
- [x] 初始化邏輯
- [x] 實作氣象背景與卡片icon
  - [x] 整理所需圖片清單(利用天氣代碼，每個代碼至少一張圖)
  - [x] 蒐集圖片
  - [x] 寫邏輯依照天氣代碼套用圖片
  - [x] 蒐集背景圖片
  - [x] 邏輯套用背景圖片
- [x] review fetch預報資料的程式碼
  - [x] review結果：可以改寫成先將data裡面三個array合併在一起然後再進行處理，但前提是必須保證三個array的Time是一樣的，推測，可以稍微提升效率，但目前優先度低
- [x] 解決背景圖片載入過慢
  - [ ] 設計背景圖片的transition，backgroundImage沒辦法直接套用transition，需要設計一個轉場。目前觀察下來，在某些瀏覽器中bgImg是可以使用transition的(google, edge)
- [x] 將桌面板也限制在手機大小
- [x] 修正高度過高時tab content位置問題，justify-content: safe center好用
- [x] 找一些其他可放入tabs的項目，因為預報最遠就到七天後
  - [x] 考慮使用當日綜合天氣觀測報告(**O-A0003-001**)
  - [x] 重寫countryNames.ts的邏輯以讓氣象觀測站站號可以被查找
- [x] 當天綜合天氣觀測報告
  - [x] 取得當天綜合天氣觀測
  - [x] 呈現資料
- [ ] params query用來做初始化邏輯的參數? **否決**，改成使用local儲存最後查詢的location
  - [ ] local儲存最後查詢的location
- [x] 改寫取得氣象資料的邏輯，讓觀測資料可以不用每次切換地點就重新fetch
  - [x] 存入localStorage並記錄時間(expireTime)
  - [x] 時間過期才重新fetch
- [ ] 考慮設計地區選擇排序邏輯
- [x] 修改localStorage裡面key的名稱，都改成使用英文地名(countryName.ts 裡面 **enum** 使用的名稱)
- [ ] 利用環境變數將大部分console.log改成只在開發環境下執行
- [ ] 綜合天氣觀測排版美化

## 常用連結
### [API測試](https://opendata.cwa.gov.tw/dist/opendata-swagger.html)
目前使用了以下項目：
- 臺灣各鄉鎮市區預報資料-臺灣各鄉鎮市區未來1週天氣預報: **F-D0047-091**
- 現在天氣觀測報告-有人氣象站資料(配合下方清單內的有人氣象站站號(名)使用): **O-A0003-001**
### [氣象代碼](https://www.cwa.gov.tw/V8/assets/pdf/Weather_Icon.pdf)
### [氣象站清單](https://e-service.cwa.gov.tw/wdps/obs/state.htm#description)
### [Icons](https://fonts.google.com/icons?icon.query=weather&icon.size=24&icon.color=%23e8eaed)

## React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
