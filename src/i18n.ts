// src/i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./Lang/en.json";
import zh from "./Lang/zh.json";
import vietnam from "./Lang/vietnam.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    zh: { translation: zh },
    vietnam: { translation: vietnam },
  },
  lng: window.localStorage.getItem("lang") ?? "en", // 设置默认语言
  fallbackLng: "en", // 找不到语言时回退用中文
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
