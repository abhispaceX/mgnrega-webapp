"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    // Extract locale from pathname
    const pathLocale = pathname.split("/")[1];
    if (["en", "hi", "te"].includes(pathLocale) && i18n.language !== pathLocale) {
      i18n.changeLanguage(pathLocale);
    }
  }, [pathname, i18n]);

  const languages = [
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "hi", label: "हिंदी", flag: "🇮🇳" },
    { code: "te", label: "తెలుగు", flag: "🇮🇳" },
  ];

  const switchLanguage = async (newLocale: string) => {
    if (isChanging || i18n.language === newLocale) return;
    
    setIsChanging(true);
    
    // Change i18n language - this will trigger re-renders in all components using useTranslation
    await i18n.changeLanguage(newLocale);
    
    setIsChanging(false);
    
    // Don't navigate - just update the language in-place
    // The URL locale is just for initial load, not for switching
  };

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {t("common.selectLanguage") || "Language"}:
      </label>
      <select
        value={i18n.language}
        onChange={(e) => switchLanguage(e.target.value)}
        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
        aria-label="Select language"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
}
