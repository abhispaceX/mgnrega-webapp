"use client"

import { useRouter, usePathname, useParams } from "next/navigation"
import { useTranslation } from "react-i18next"
import Link from "next/link"
import Image from "next/image"

const navigationItems = [
  { label: "About the Ministry", href: "#about-ministry", icon: "❓" },
  { label: "About the Scheme", href: "#about-scheme", icon: "📄" },
  { label: "Key Features", href: "#key-features", icon: "⭐" },
  { label: "Scheme Components", href: "#scheme-components", icon: "🧩" },
  { label: "Convergence", href: "#convergence", icon: "🌐" },
  { label: "International Cooperation", href: "#international", icon: "🤝" },
  { label: "Mobile Apps", href: "#mobile-apps", icon: "📱" },
  { label: "Login", href: "#login", icon: "🔐" },
  { label: "What's New", href: "#whats-new", icon: "✨" },
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
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-2 text-xs sm:flex-row sm:items-center sm:justify-between sm:text-sm">
          <div className="flex items-center gap-3">
            <span className="hidden text-2xl sm:inline">🇮🇳</span>
            <div className="leading-tight">
              <p className="font-semibold tracking-wide">Government of India</p>
              <p className="text-[0.75rem] opacity-90">Ministry of Rural Development</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <a href="#main-content" className="whitespace-nowrap font-semibold hover:text-orange-200">
              Skip to Main Content
            </a>
            <div className="hidden items-center rounded-full bg-white/10 px-3 py-1 sm:flex">
              <input
                type="text"
                placeholder="Search"
                className="w-28 bg-transparent text-xs outline-none placeholder:text-white/70 sm:w-36"
              />
              <button className="ml-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#0f4c81] hover:bg-orange-100">
                Search
              </button>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#0f4c81]">
              <span className="hidden sm:inline">Language</span>
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
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex w-full flex-col items-center gap-6 md:flex-row md:items-center md:gap-8">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center">
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Ministry_of_Rural_Development.png/960px-Ministry_of_Rural_Development.png"
                  alt="Ministry of Rural Development"
                  width={160}
                  height={120}
                  priority
                />
              </div>
              
            </div>
            <div className="hidden h-16 w-px bg-blue-100 md:block" />
            <div className="max-w-3xl text-center md:text-left">
              <h1 className="text-xl font-semibold uppercase text-center leading-snug text-blue-900 md:text-3xl">
                {t("common.title") || "Mahatma Gandhi National Rural Employment Guarantee Scheme"}
              </h1>
             
            </div>
          </div>
          <div className="hidden h-16 w-px bg-blue-100 sm:block" />
              <div className="flex items-center justify-center">
                <Image
                  src="https://vajiraoias.com/wp-content/uploads/2023/12/01-3.jpg"
                  alt="MGNREGA Emblem"
                  width={110}
                  height={120}
                />
              </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="bg-linear-to-r from-[#0f4c81] to-[#0a3a63] text-white">
        <div className="mx-auto flex max-w-7xl items-center gap-6 overflow-x-auto px-4 py-3 text-xs font-semibold uppercase tracking-wide sm:text-sm">
          <Link href={`/${locale}`} className="flex items-center gap-2 whitespace-nowrap rounded-full bg-white/10 px-4 py-2 hover:bg-orange-400/80">
            <span>🏠</span>
            <span>Dashboard</span>
          </Link>
          {navigationItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 hover:bg-white/10"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </div>
      </nav>
    </header>
  )
}
