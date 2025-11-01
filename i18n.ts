// Simplified i18n setup using react-i18next
"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslations from "@/messages/en.json";
import hiTranslations from "@/messages/hi.json";
import teTranslations from "@/messages/te.json";

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources: {
        en: { translation: enTranslations },
        hi: { translation: hiTranslations },
        te: { translation: teTranslations },
      },
      lng: typeof window !== "undefined" ? window.location.pathname.split("/")[1] || "en" : "en",
      fallbackLng: "en",
      interpolation: {
        escapeValue: false,
      },
    });
}

export default i18n;
