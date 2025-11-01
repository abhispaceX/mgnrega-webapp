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
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-3 sm:px-4 py-2 text-[10px] xs:text-xs sm:text-sm">
          <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="hidden sm:inline text-lg sm:text-2xl">🇮🇳</span>
              <div className="leading-tight">
                <p className="font-semibold tracking-wide">{t("common.governmentOfIndia")}</p>
                <p className="text-[0.7rem] xs:text-[0.75rem] opacity-90">{t("common.ministryOfRuralDevelopment")}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 xs:gap-3 sm:gap-4">
              <a href="#main-content" className="whitespace-nowrap font-semibold hover:text-orange-200 text-[0.7rem] xs:text-xs">
                {t("common.skipToMainContent")}
              </a>
              <div className="hidden items-center rounded-full bg-white/10 px-2 sm:px-3 py-1 sm:flex">
                <input
                  type="text"
                  placeholder={t("common.search")}
                  className="w-20 xs:w-24 sm:w-28 md:w-36 bg-transparent text-[0.7rem] xs:text-xs outline-none placeholder:text-white/70"
                />
                <button className="ml-1 sm:ml-2 rounded-full bg-white px-2 sm:px-3 py-1 text-[0.7rem] xs:text-xs font-semibold text-[#0f4c81] hover:bg-orange-100">
                  {t("common.search")}
                </button>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 rounded-full bg-white px-2 sm:px-3 py-1 text-[0.7rem] xs:text-xs font-semibold text-[#0f4c81]">
                <span className="hidden sm:inline">{t("common.selectLanguage")}</span>
                <select
                  value={locale}
                  onChange={(e) => switchLanguage(e.target.value)}
                  className="bg-transparent text-[#0f4c81] focus:outline-none text-[0.7rem] xs:text-xs"
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
                <button className="rounded-full border border-white/40 px-1.5 sm:px-2 py-1 font-semibold hover:bg-white/10 text-[0.7rem] xs:text-xs">A</button>
                <button className="rounded-full border border-white/40 px-1.5 sm:px-2 py-1 font-semibold hover:bg-white/10 text-[0.7rem] xs:text-xs">A+</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="border-b-4 border-orange-400 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 sm:gap-6 px-3 sm:px-4 py-3 sm:py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex w-full flex-col items-center gap-4 sm:gap-6 md:flex-row md:items-center md:gap-8">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center justify-center">
                <Image
                  src="https://m9d2qsz3ow.ufs.sh/f/ng82ClvdlCBO7tl98CHx5JFLsQk2XSORgM1jhDoU4mWZ6dKT"
                  alt="Ministry of Rural Development"
                  width={180}
                  height={140}
                  priority
                  className="w-24 h-auto sm:w-32 md:w-40 lg:w-[180px]"
                />
              </div>
              
            </div>
            <div className="hidden h-12 sm:h-16 w-px bg-blue-100 md:block" />
            <div className="max-w-3xl text-center md:text-left px-2 sm:px-0">
              <h1 className="text-sm sm:text-base md:text-xl lg:text-2xl xl:text-3xl font-semibold uppercase text-center leading-snug text-blue-900 md:text-left">
                {t("common.title") || "Mahatma Gandhi National Rural Employment Guarantee Scheme"}
              </h1>
             
            </div>
          </div>
          <div className="hidden h-12 sm:h-16 w-px bg-blue-100 sm:block" />
              <div className="flex items-center justify-center">
                <Image
                  src="https://m9d2qsz3ow.ufs.sh/f/ng82ClvdlCBOZ7jw0NX4kadP5yW7h0pu9A6HSKotx8enDCYs"
                  alt="MGNREGA Emblem"
                  width={130}
                  height={140}
                  className="w-20 h-auto sm:w-24 md:w-28 lg:w-[130px]"
                />
              </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="bg-linear-to-r from-[#0f4c81] to-[#0a3a63] text-white">
        <div className="mx-auto flex max-w-7xl items-center gap-2 sm:gap-4 md:gap-6 overflow-x-auto px-3 sm:px-4 py-2 sm:py-3 text-[10px] xs:text-xs sm:text-sm font-semibold uppercase tracking-wide">
          <Link href={`/${locale}`} className="flex items-center gap-1 sm:gap-2 whitespace-nowrap rounded-full bg-white/10 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 hover:bg-orange-400/80">
            <span className="text-xs sm:text-sm">🏠</span>
            <span className="hidden xs:inline">{t("common.dashboard")}</span>
          </Link>
          {navigationItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="flex items-center gap-1 sm:gap-2 whitespace-nowrap rounded-full px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 hover:bg-white/10"
            >
              <span className="text-xs sm:text-sm">{item.icon}</span>
              <span className="hidden sm:inline">{t(item.label)}</span>
            </a>
          ))}
        </div>
      </nav>
    </header>
  )
}
