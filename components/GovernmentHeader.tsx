"use client"

import { useParams, usePathname, useRouter } from "next/navigation"

import Image from "next/image"
import Link from "next/link"
import { useTranslation } from "react-i18next"

const navigationItems = [
  { label: "header.aboutMinistry", href: "#about-ministry", icon: "❓" },
  { label: "header.aboutScheme", href: "#about-scheme", icon: "📄" },
  { label: "header.keyFeatures", href: "#key-features", icon: "⭐" },
  { label: "header.schemeComponents", href: "#scheme-components", icon: "🧩" },
  { label: "header.convergence", href: "#convergence", icon: "🌐" },
  { label: "header.internationalCooperation", href: "#international", icon: "🤝" },
  { label: "header.mobileApps", href: "#mobile-apps", icon: "📱" },
  { label: "header.login", href: "#login", icon: "🔐" },
  { label: "header.whatsNew", href: "#whats-new", icon: "✨" },
]

export default function GovernmentHeader() {
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams()
  const locale = (params?.locale as string) || "en"
  const { i18n, t } = useTranslation()

  const languages = [
    { code: "en", label: "English" },
    { code: "hi", label: "हिंदी" },
    { code: "te", label: "తెలుగు" },
  ]

  const switchLanguage = (newLocale: string) => {
    i18n.changeLanguage(newLocale)
    const newPath = pathname.replace(/^\/(en|hi|te)/, `/${newLocale}`)
    router.push(newPath)
  }

  return (
    <header className="shadow-sm">
      {/* Government Utility Bar */}
      <div className="bg-linear-to-r from-[#0f4c81] to-[#0a3a63] text-white">
        <div className="mx-auto flex max-w-7xl flex-row items-center justify-between gap-2 px-4 py-2 text-xs sm:text-sm">
          <div className="flex items-center gap-3">
            <span className="hidden text-2xl sm:inline">🇮🇳</span>
            <div className="leading-tight">
              <p className="font-semibold tracking-wide">{t("common.governmentOfIndia")}</p>
              <p className="text-[0.75rem] opacity-90">{t("common.ministryOfRuralDevelopment")}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <a href="#main-content" className="whitespace-nowrap font-semibold hover:text-orange-200">
              {t("common.skipToMainContent")}
            </a>
            <div className="hidden items-center rounded-full bg-white/10 px-3 py-1 sm:flex">
              <input
                type="text"
                placeholder={t("common.search")}
                className="w-28 bg-transparent text-xs outline-none placeholder:text-white/70 sm:w-36"
              />
              <button className="ml-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#0f4c81] hover:bg-orange-100">
                {t("common.search")}
              </button>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#0f4c81]">
              <span className="hidden sm:inline">{t("common.selectLanguage")}</span>
              <select
                value={locale}
                onChange={(e) => switchLanguage(e.target.value)}
                className="bg-transparent text-[#0f4c81] focus:outline-none"
                aria-label="Select language"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-1">
              <button className="rounded-full border border-white/40 px-2 py-1 font-semibold hover:bg-white/10">A</button>
              <button className="rounded-full border border-white/40 px-2 py-1 font-semibold hover:bg-white/10">A+</button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="border-b-4 border-orange-400 bg-white">
        <div className="mx-auto flex max-w-7xl flex-row items-center justify-between gap-4 px-4 py-4">
          <div className="flex flex-row items-center gap-6 flex-1">
            <div className="flex items-center gap-4 shrink-0">
              <div className="flex items-center justify-center">
                <Image
                  src="https://m9d2qsz3ow.ufs.sh/f/ng82ClvdlCBO7tl98CHx5JFLsQk2XSORgM1jhDoU4mWZ6dKT"
                  alt="Ministry of Rural Development"
                  width={180}
                  height={140}
                  priority
                />
              </div>
            </div>
            <div className="h-16 w-px bg-blue-100 hidden sm:block" />
            <div className="max-w-3xl text-left flex-1">
              <h1 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-semibold uppercase leading-snug text-blue-900">
                {t("common.title") || "Mahatma Gandhi National Rural Employment Guarantee Scheme"}
              </h1>
            </div>
          </div>
          <div className="h-16 w-px bg-blue-100 hidden sm:block shrink-0" />
          <div className="flex items-center justify-center shrink-0">
            <Image
              src="https://m9d2qsz3ow.ufs.sh/f/ng82ClvdlCBOZ7jw0NX4kadP5yW7h0pu9A6HSKotx8enDCYs"
              alt="MGNREGA Emblem"
              width={130}
              height={140}
            />
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="bg-linear-to-r from-[#0f4c81] to-[#0a3a63] text-white">
        <div className="mx-auto flex max-w-7xl items-center gap-6 overflow-x-auto px-4 py-3 text-xs font-semibold uppercase tracking-wide sm:text-sm">
          <Link href={`/${locale}`} className="flex items-center gap-2 whitespace-nowrap rounded-full bg-white/10 px-4 py-2 hover:bg-orange-400/80">
            <span>🏠</span>
            <span>{t("common.dashboard")}</span>
          </Link>
          {navigationItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 hover:bg-white/10"
            >
              <span>{item.icon}</span>
              <span>{t(item.label)}</span>
            </a>
          ))}
        </div>
      </nav>
    </header>
  )
}
