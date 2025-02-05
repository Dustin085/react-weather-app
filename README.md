# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## TODO
- [ ] 初始化邏輯
- [ ] 實作氣象背景與卡片icon
  - [ ] 整理所需圖片清單(利用天氣代碼，每個代碼至少一張圖)
  - [ ] 蒐集圖片
  - [ ] 寫邏輯依照天氣代碼套用圖片
- [ ] review fetch預報資料的程式碼
- [ ] 找一些其他可放入tabs的項目，因為預報最遠就到七天後
- [ ] params query用來做初始化邏輯的參數?
- [ ] 改寫取得氣象資料的邏輯，讓觀測資料可以不用每次切換地點就重新fetch
 - [ ] 存入local並記錄時間?
 - [ ] 時間過期才重新fetch

## 氣象代碼
https://www.cwa.gov.tw/V8/assets/pdf/Weather_Icon.pdf

## API測試
https://opendata.cwa.gov.tw/dist/opendata-swagger.html

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
