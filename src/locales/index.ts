import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import zh from "./zh-CN.json";
import en from "./en-US.json";

i18n
    .use(LanguageDetector) // 嗅探当前浏览器语言 zh-CN
    .use(initReactI18next) // 将 i18n 向下传递给 react-i18next
    // 初始化 i18next
    .init({
        resources: {
            "en-US": { translation: en },
            "zh-CN": { translation: zh },
        },
        fallbackLng: "en-US", // 默认当前环境的语言
        debug: false,
        interpolation: { escapeValue: false },
    });

export default i18n;