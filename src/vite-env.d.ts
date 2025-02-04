/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    readonly VITE_API_AUTH: string;
    // 如果有更多環境變數，在這裡繼續添加
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}