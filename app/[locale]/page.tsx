"use client"

import "@/i18n"

import { Suspense, useEffect, useRef, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"

import DistrictSelector from "@/components/DistrictSelector"
import GovernmentHeader from "@/components/GovernmentHeader"
import type { JSX } from "react"
import LanguageSwitcher from "@/components/LanguageSwitcher"
import Link from "next/link"
import { useTranslation } from "react-i18next"

const heroSlides = [
  {
    titleKey: "hero.slide1Title",
    captionKey: "hero.slide1Caption",
    district: "Tumkur",
    imageUrl:
      "https://m9d2qsz3ow.ufs.sh/f/ng82ClvdlCBOu8JgbRWJBjfGeLpaAY8SMz1gs4iOyIvxCPWK",
  },
  {
    titleKey: "hero.slide2Title",
    captionKey: "hero.slide2Caption",
    district: "Chittoor",
    imageUrl:
      "https://m9d2qsz3ow.ufs.sh/f/ng82ClvdlCBOgk09gu1cGnaLfQE1N2O4Vj8TptrIce7YRdqF",
  },
  {
    titleKey: "hero.slide3Title",
    captionKey: "hero.slide3Caption",
    district: "Kurnool",
    imageUrl:
      "https://m9d2qsz3ow.ufs.sh/f/ng82ClvdlCBOAcsU4ppBGTbdq0Mmj1WH8h9xkvygasfzDop5",
  },
]

interface DistrictSummary {
  district: string
  state: string
  activeWorkers: number
  households: number
  persondays: number
  womenPersondays: number
  assetsCompleted: number
  totalExpenditure: number
  avgWageRate: number
}

interface StateSummary {
  state: string
  activeWorkers: number
  persondays: number
  assetsCompleted: number
  totalExpenditure: number
}

const formatNumber = (value: number) => new Intl.NumberFormat("en-IN").format(Math.round(value))

// Helper to get district name translation or fallback to original
const getDistrictNameHelper = (t: (key: string) => string, districtName: string) => {
  const translated = t(`districts.${districtName}`)
  // If translation returns the key itself (not found), use original name
  if (translated === `districts.${districtName}`) {
    return districtName
  }
  return translated
}

interface PerformanceData {
  data: Array<{
    district: { name: string }
    month: string
    Average_Wage_rate_per_day_per_person: number | null
  }>
  summary: {
    totalHouseholds: number
    averageWageRate: number
    womenParticipationPercent: number
    totalExpenditure: number
  }
  districtSummaries?: DistrictSummary[]
  stateSummaries?: StateSummary[]
}

function PeopleIcon() {
  return (
    <svg className="h-12 w-12" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  )
}

function HomeFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <span className="text-sm font-medium text-gray-500">Loading dashboard…</span>
    </div>
  )
}

export default function Home() {
  return (
    <Suspense fallback={<HomeFallback />}>
      <HomeContent />
    </Suspense>
  )
}

function HomeIcon() {
  return (
    <svg className="h-12 w-12" fill="currentColor" viewBox="0 0 24 24">
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </svg>
  )
}

function WomenIcon() {
  return (
    <svg className="h-12 w-12" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z" />
    </svg>
  )
}

function MetricCard({
  label,
  value,
  icon: Icon,
  color = "blue",
}: {
  label: string
  value: string
  icon: () => JSX.Element
  color?: "blue" | "orange" | "purple"
}) {
  const colorClasses = {
    blue: "bg-linear-to-br from-blue-500 to-blue-600",
    orange: "bg-linear-to-br from-orange-400 to-orange-500",
    purple: "bg-linear-to-br from-purple-500 to-purple-600",
  }

  return (
    <div className={`${colorClasses[color]} rounded-2xl p-8 text-white shadow-lg transition-transform hover:scale-105`}>
      <div className="mb-4 flex justify-start">
        <Icon />
      </div>
      <div className="text-base font-semibold opacity-90">{label}</div>
      <div className="mt-3 text-5xl font-bold">{value}</div>
    </div>
  )
}

function DistrictCard({
  district,
  wage,
  year,
  locale,
  t,
}: {
  district: string
  wage: number
  year: string
  locale: string
  t: (key: string) => string
}) {
  return (
    <Link
      href={`/${locale}/district/${encodeURIComponent(district)}?year=${year}`}
      className="group block rounded-2xl bg-white p-8 shadow-md transition-all hover:shadow-2xl"
    >
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900">{district}</h3>
      </div>
      <div className="space-y-4">
        <div>
          <div className="text-sm font-medium text-gray-600">{t("home.dailyWageRate")}</div>
          <div className="mt-1 text-4xl font-bold text-blue-600">₹{wage.toFixed(0)}</div>
        </div>
      </div>
      <div className="mt-6 flex items-center text-blue-600 font-semibold group-hover:gap-2 transition-all gap-0">
        {t("common.viewDetails")}
        <span className="ml-2 text-xl group-hover:translate-x-1 transition-transform">→</span>
      </div>
    </Link>
  )
}

function AndhraDistrictCard({
  summary,
  locale,
  year,
  t,
}: {
  summary: DistrictSummary
  locale: string
  year: string
  t: (key: string) => string
}) {
  const initials = summary.district
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 3)
    .toUpperCase()

  return (
    <div className="relative flex w-72 shrink-0 flex-col rounded-3xl bg-white/95 shadow-lg ring-1 ring-black/5">
      <div className="absolute -top-2 left-6 h-2 w-12 rounded-full bg-orange-400" />
      <div className="space-y-2 px-6 pt-6">
        <div className="rounded-xl bg-orange-400/90 px-4 py-2 text-sm font-semibold text-white shadow-inner">
          {t("home.individualsWorked")}: {formatNumber(summary.activeWorkers)}
        </div>
        <div className="rounded-xl bg-orange-400/80 px-4 py-2 text-sm font-semibold text-white shadow-inner">
          {t("home.persondaysWorked")}: {formatNumber(summary.persondays)}
        </div>
        <div className="rounded-xl bg-orange-400/70 px-4 py-2 text-sm font-semibold text-white shadow-inner">
          {t("home.completedWorks")}: {formatNumber(summary.assetsCompleted)}
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-between px-6 pb-6 pt-6">
        <div className="flex items-center justify-center rounded-2xl bg-blue-50 py-8">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-500/20 text-3xl font-bold text-blue-700">
            {initials || "AP"}
          </div>
        </div>
        <div className="mt-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{getDistrictNameHelper(t, summary.district)}</h3>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{summary.state}</p>
          </div>
          <Link
            href={`/${locale}/district/${encodeURIComponent(summary.district)}?year=${year}`}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-white shadow hover:bg-green-600"
            aria-label={`View details for ${summary.district}`}
          >
            →
          </Link>
        </div>
      </div>
    </div>
  )
}

function HomeContent() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const { t, i18n } = useTranslation()

  const locale = (params?.locale as string) || "en"
  const [selectedYear, setSelectedYear] = useState(searchParams.get("year") || "2023-2024")
  const [data, setData] = useState<PerformanceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [availableYears, setAvailableYears] = useState<string[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [selectedDistrict, setSelectedDistrict] = useState<string>("All")
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null)
  
  // Force re-render when language changes
  const [, forceUpdate] = useState(0)
  
  useEffect(() => {
    // Listen to language change events
    const handleLanguageChange = () => {
      forceUpdate(prev => prev + 1)
    }
    
    i18n.on('languageChanged', handleLanguageChange)
    
    return () => {
      i18n.off('languageChanged', handleLanguageChange)
    }
  }, [i18n])

  const andhraDistrictSummaries =
    data?.districtSummaries?.filter((summary) => summary.state.toLowerCase() === "andhra pradesh") ?? []

  const sortedAndhraDistrictSummaries = [...andhraDistrictSummaries].sort((a, b) => b.activeWorkers - a.activeWorkers)

  // Filter districts based on selection
  const filteredDistrictSummaries = selectedDistrict === "All" 
    ? sortedAndhraDistrictSummaries 
    : sortedAndhraDistrictSummaries.filter(d => d.district === selectedDistrict)

  const andhraStateSummary =
    data?.stateSummaries?.find((summary) => summary.state.toLowerCase() === "andhra pradesh") || null

  // Helper to get district name translation or fallback to original
  const getDistrictName = (districtName: string) => getDistrictNameHelper(t, districtName)

  const andhraHighlightStats = andhraStateSummary
    ? [
        {
          label: t("home.individualsWorked"),
          value: formatNumber(andhraStateSummary.activeWorkers),
          description: t("home.individualsWorkedDesc"),
        },
        {
          label: t("home.persondaysWorked"),
          value: formatNumber(andhraStateSummary.persondays),
          description: t("home.persondaysWorkedDesc"),
        },
        {
          label: t("home.completedWorks"),
          value: formatNumber(andhraStateSummary.assetsCompleted),
          description: t("home.completedWorksDesc"),
        },
      ]
    : []

  useEffect(() => {
    fetchAvailableYears()
  }, [])

  useEffect(() => {
    fetchData(selectedYear)
  }, [selectedYear])

  const fetchAvailableYears = async () => {
    try {
      const res = await fetch("/api/districts")
      const json = await res.json()
      setAvailableYears(json.availableYears || [])
    } catch (err) {
      console.error("Error fetching years:", err)
    }
  }

  const fetchData = async (year: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/performance?year=${year}`)
      if (!res.ok) throw new Error("Failed to fetch data")
      const json = (await res.json()) as PerformanceData
      setData(json)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  const handleYearChange = (year: string) => {
    setSelectedYear(year)
    // Update URL without reloading
    window.history.replaceState(null, '', `?year=${year}`)
  }

  useEffect(() => {
    if (!heroSlides.length) return
    const timer = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 7000)

    return () => window.clearInterval(timer)
  }, [])

  // Auto-scroll for district cards
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer || filteredDistrictSummaries.length === 0) return

    // Start auto-scroll
    autoScrollIntervalRef.current = setInterval(() => {
      if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
        // Reset to start when reaching the end
        scrollContainer.scrollTo({ left: 0, behavior: 'smooth' })
      } else {
        // Scroll by one card width
        scrollContainer.scrollBy({ left: 300, behavior: 'smooth' })
      }
    }, 3000) // Scroll every 3 seconds

    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current)
      }
    }
  }, [filteredDistrictSummaries])

  // Pause auto-scroll on hover
  const handleMouseEnter = () => {
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current)
    }
  }

  const handleMouseLeave = () => {
    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer || filteredDistrictSummaries.length === 0) return

    autoScrollIntervalRef.current = setInterval(() => {
      if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
        scrollContainer.scrollTo({ left: 0, behavior: 'smooth' })
      } else {
        scrollContainer.scrollBy({ left: 300, behavior: 'smooth' })
      }
    }, 3000)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-blue-50 to-white">
        <div className="text-center">
          <div className="mb-6 h-16 w-16 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
          <p className="text-xl font-medium text-gray-700">{t("common.loading")}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-blue-50 to-white">
        <div className="text-center">
          <div className="mb-4 text-6xl">⚠️</div>
          <p className="text-xl font-semibold text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <GovernmentHeader />

      {heroSlides.length > 0 && (
        <section className="bg-linear-to-b from-white to-blue-50" aria-label="Programme success stories">
          <div className="mx-auto max-w-7xl px-4 py-10">
            <div className="relative overflow-hidden rounded-3xl shadow-xl">
              <div className="relative h-[360px] sm:h-[420px]">
                {heroSlides.map((slide, index) => (
                  <div
                    key={slide.titleKey}
                    className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                      index === currentSlide ? "opacity-100" : "pointer-events-none opacity-0"
                    }`}
                    aria-hidden={index !== currentSlide}
                  >
                    <img src={slide.imageUrl} alt={t(slide.titleKey)} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-transparent" />
                    <div className="absolute inset-0 flex flex-col justify-end gap-4 p-6 text-white sm:p-12">
                      <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest">
                        <span>{t("hero.districtLabel")}</span>
                        <span className="text-orange-200">{slide.district}</span>
                      </div>
                      <h2 className="text-2xl font-bold leading-tight sm:text-3xl md:text-4xl">{t(slide.titleKey)}</h2>
                      <p className="max-w-xl text-sm font-medium text-gray-100 sm:text-base">{t(slide.captionKey)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
                className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-3 text-lg font-bold text-blue-900 hover:bg-white"
                aria-label={t("hero.previousSlide")}
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
                className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-3 text-lg font-bold text-blue-900 hover:bg-white"
                aria-label={t("hero.nextSlide")}
              >
                ›
              </button>

              <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
                {heroSlides.map((slide, index) => (
                  <div
                    key={`${slide.titleKey}-indicator`}
                    className={`h-2 rounded-full transition-all duration-500 ${
                      index === currentSlide ? "w-8 bg-orange-400" : "w-2 bg-white/60"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {(andhraHighlightStats.length > 0 || andhraDistrictSummaries.length > 0) && (
        <section className="relative overflow-hidden px-4 py-16" id="andhra-pradesh">
          <div
            className="absolute inset-0 opacity-80"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(15,76,129,0.85), rgba(10,58,99,0.65)), url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1400&q=80')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="relative mx-auto max-w-7xl text-white">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-300">{t("home.stateSpotlight")}</p>
                <h2 className="text-3xl font-bold md:text-4xl">{t("home.apOverviewTitle")}</h2>
              </div>
              <div className="flex flex-row items-center gap-3">
                {/* District Selector */}
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="rounded-xl border-2 border-orange-300 bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm transition-all hover:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="All">{t("districts.All")}</option>
                  {sortedAndhraDistrictSummaries.map((district) => (
                    <option key={district.district} value={district.district}>
                      {getDistrictName(district.district)}
                    </option>
                  ))}
                </select>
                {/* Year Selector */}
                <select
                  value={selectedYear}
                  onChange={(e) => handleYearChange(e.target.value)}
                  className="rounded-xl border-2 border-orange-300 bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm transition-all hover:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {availableYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {andhraHighlightStats.length > 0 && (
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {andhraHighlightStats.map((item) => (
                  <div key={item.label} className="rounded-2xl bg-white/10 p-5 shadow-lg backdrop-blur">
                    <p className="text-sm font-semibold uppercase tracking-wide text-orange-200">{item.label}</p>
                    <p className="mt-2 text-2xl font-bold text-white">{item.value}</p>
                    <p className="mt-1 text-sm text-blue-100">{item.description}</p>
                  </div>
                ))}
              </div>
            )}

            {filteredDistrictSummaries.length > 0 && (
              <div 
                className="mt-12 overflow-x-auto pb-4 scrollbar-hide"
                ref={scrollContainerRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                <div className="flex min-w-full gap-6">
                  {filteredDistrictSummaries.map((summary) => (
                    <AndhraDistrictCard key={summary.district} summary={summary} locale={locale} year={selectedYear} t={t} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Main Content */}
      <main id="main-content" className="mx-auto max-w-7xl px-4 py-8">
        <section id="about-ministry" className="border-b border-blue-200 bg-white shadow-md">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-6 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col items-start gap-1">
              <h1 className="text-4xl font-bold text-blue-700">{t("common.title")}</h1>
              <p className="text-sm font-medium text-gray-600">{selectedYear}</p>
            </div>
            <div className="flex flex-col gap-3 text-sm text-gray-600 md:w-1/2">
              <p>
                {t("home.aboutMinistryDesc")}
              </p>
              <div className="flex items-center gap-4">
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">{t("home.nationalPortal")}</span>
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        </section>

        {/* Metrics Section */}
        {data && (
          <section id="key-features" className="px-6 py-16">
            <div className="mx-auto max-w-7xl">
              <h2 className="mb-2 text-3xl font-bold text-gray-900">{t("home.programOverview")}</h2>
              <p className="mb-10 text-gray-600 font-medium">{t("home.programOverviewDesc")}</p>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <MetricCard
                  label={t("home.summaryCards.totalHouseholds")}
                  value={`${(data.summary.totalHouseholds / 100000).toFixed(1)}L`}
                  icon={PeopleIcon}
                  color="blue"
                />
                <MetricCard
                  label={t("home.summaryCards.averageWage")}
                  value={`₹${Math.round(data.summary.averageWageRate)}`}
                  icon={HomeIcon}
                  color="orange"
                />
                <MetricCard
                  label={t("home.summaryCards.womenParticipation")}
                  value={`${data.summary.womenParticipationPercent.toFixed(0)}%`}
                  icon={WomenIcon}
                  color="purple"
                />
              </div>
            </div>
          </section>
        )}

        {/* Convergence Section */}
        <section id="convergence" className="px-6 py-16">
          <div className="mx-auto max-w-7xl rounded-2xl bg-white p-10 shadow-md">
            <h2 className="text-3xl font-bold text-gray-900">{t("home.convergenceTitle")}</h2>
            <p className="mt-3 text-gray-600">
              {t("home.convergenceDesc")}
            </p>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {[
                {
                  title: t("home.convergence1Title"),
                  description: t("home.convergence1Desc"),
                },
                {
                  title: t("home.convergence2Title"),
                  description: t("home.convergence2Desc"),
                },
                {
                  title: t("home.convergence3Title"),
                  description: t("home.convergence3Desc"),
                },
              ].map((item) => (
                <div key={item.title} className="rounded-xl border border-blue-100 bg-blue-50/60 p-6">
                  <h3 className="text-lg font-semibold text-blue-900">{item.title}</h3>
                  <p className="mt-3 text-sm text-gray-700">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* International Cooperation Section */}
        <section id="international" className="bg-linear-to-r from-blue-50 via-white to-orange-50 px-6 py-16">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-3xl font-bold text-gray-900">{t("home.internationalCoopTitle")}</h2>
            <p className="mt-3 max-w-3xl text-gray-600">
              {t("home.internationalCoopDesc")}
            </p>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl bg-white p-6 shadow">
                <h3 className="text-xl font-semibold text-blue-800">{t("home.globalNetworkTitle")}</h3>
                <p className="mt-3 text-sm text-gray-700">
                  {t("home.globalNetworkDesc")}
                </p>
              </div>
              <div className="rounded-2xl bg-white p-6 shadow">
                <h3 className="text-xl font-semibold text-blue-800">{t("home.bestPracticeTitle")}</h3>
                <p className="mt-3 text-sm text-gray-700">
                  {t("home.bestPracticeDesc")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mobile Apps Section */}
        <section id="mobile-apps" className="px-6 py-16">
          <div className="mx-auto max-w-7xl rounded-2xl border border-blue-100 bg-white p-10 shadow-sm">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl">
                <h2 className="text-3xl font-bold text-gray-900">{t("home.mobileAppsTitle")}</h2>
                <p className="mt-3 text-gray-600">
                  {t("home.mobileAppsDesc")}
                </p>
              </div>
              <div className="flex flex-col gap-3 text-sm text-blue-700">
                <a href="https://play.google.com" className="rounded-full border border-blue-600 px-5 py-2 font-semibold hover:bg-blue-50">
                  {t("home.downloadPlayStore")}
                </a>
                <a href="https://apps.apple.com" className="rounded-full border border-blue-600 px-5 py-2 font-semibold hover:bg-blue-50">
                  {t("home.downloadAppStore")}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Login Section */}
        <section id="login" className="bg-linear-to-r from-blue-800 to-blue-600 px-6 py-16 text-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-bold">{t("home.officialLoginTitle")}</h2>
              <p className="mt-3 max-w-xl text-sm text-blue-100">
                {t("home.officialLoginDesc")}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/login"
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-blue-700 transition-colors hover:bg-orange-100"
              >
                {t("home.proceedToLogin")}
              </Link>
              <a
                href="#"
                className="rounded-full border border-white px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                {t("home.forgotPassword")}
              </a>
            </div>
          </div>
        </section>

        {/* What's New Section */}
        <section id="whats-new" className="px-6 py-16">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-3xl font-bold text-gray-900">{t("home.whatsNewTitle")}</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {[
                {
                  title: t("home.whatsNew1Title"),
                  date: t("home.whatsNew1Date"),
                },
                {
                  title: t("home.whatsNew2Title"),
                  date: t("home.whatsNew2Date"),
                },
                {
                  title: t("home.whatsNew3Title"),
                  date: t("home.whatsNew3Date"),
                },
                {
                  title: t("home.whatsNew4Title"),
                  date: t("home.whatsNew4Date"),
                },
              ].map((item) => (
                <div key={item.title} className="rounded-xl border border-blue-100 bg-white p-6 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">{item.date}</p>
                  <h3 className="mt-2 text-lg font-semibold text-gray-900">{item.title}</h3>
                  <a href="#" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900">
                    {t("home.readMore")}
                    <span>→</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Information Section */}
        <section className="border-t border-blue-100 bg-white px-6 py-16">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-8 text-3xl font-bold text-gray-900">{t("home.whatIsProgram")}</h2>
            <div className="space-y-6">
              <div className="rounded-xl border-l-4 border-blue-500 bg-blue-50 p-6">
                <p className="text-lg font-medium leading-relaxed text-gray-800">
                  {t("home.programExplanation1")}
                </p>
              </div>
              <div className="rounded-xl border-l-4 border-orange-500 bg-orange-50 p-6">
                <p className="text-lg font-medium leading-relaxed text-gray-800">
                  {t("home.programExplanation2")}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-linear-to-b from-white to-gray-50 px-6 py-10">
        <div className="mx-auto max-w-7xl text-center">
          <h3 className="text-lg font-bold text-gray-900">{t("home.footerTitle")}</h3>
          <p className="mt-2 text-gray-600 font-medium">
            {t("home.footerDesc")}
          </p>
        </div>
      </footer>
    </div>
  )
}
