"use client";

import { useTranslation } from "react-i18next";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import SummaryCard from "@/components/SummaryCard";
import "@/i18n";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import Link from "next/link";
import GovernmentHeader from "@/components/GovernmentHeader";

interface DistrictData {
  district: string;
  fin_year: string;
  records: Array<{
    month: string;
    Average_Wage_rate_per_day_per_person: number | null;
    Total_Exp: number | null;
    Wages: number | null;
    Number_of_Completed_Works: number | null;
  }>;
  summary: {
    averageWageRate: number;
    totalHouseholds: number;
    totalExpenditure: number;
    totalWages: number;
    totalCompletedWorks: number;
    totalOngoingWorks: number;
  };
}

export default function DistrictPage({
  params,
}: {
  params: Promise<{ district: string; locale: string }>;
}) {
  const [district, setDistrict] = useState<string>("");
  const [locale, setLocale] = useState<string>("en");
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedYear, setSelectedYear] = useState(searchParams.get("year") || "2023-2024");
  const [data, setData] = useState<DistrictData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    async function resolveParams() {
      const resolved = await params;
      setDistrict(resolved.district);
      setLocale(resolved.locale);
    }
    resolveParams();
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis;
    }
  }, [params]);

  useEffect(() => {
    if (district) {
      fetchData(district, selectedYear);
    }
  }, [district, selectedYear]);

  const fetchData = async (dist: string, year: string) => {
    setLoading(true);
    setError(null);
    try {
      const decodedDistrict = decodeURIComponent(dist);
      const res = await fetch(`/api/performance/${encodeURIComponent(decodedDistrict)}?year=${year}`);
      if (!res.ok) throw new Error("Failed to fetch data");
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceSummary = () => {
    if (!data || !synthRef.current) return;

    if (isSpeaking) {
      synthRef.current.cancel();
      setIsSpeaking(false);
      return;
    }

    const plainText = t("district.plainLanguageTextFull", {
      district: data.district,
      year: data.fin_year,
      households: data.summary.totalHouseholds.toLocaleString(),
      wage: data.summary.averageWageRate.toFixed(2),
      expenditure: (data.summary.totalExpenditure / 10000000).toFixed(2),
      completedWorks: data.summary.totalCompletedWorks.toLocaleString(),
      ongoingWorks: data.summary.totalOngoingWorks.toLocaleString(),
    });

    const utterance = new SpeechSynthesisUtterance(plainText);
    utterance.lang = locale === "hi" ? "hi-IN" : locale === "te" ? "te-IN" : "en-IN";
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
    setIsSpeaking(true);
  };

  const chartData =
    data?.records.map((record) => ({
      month: record.month,
      wage: record.Average_Wage_rate_per_day_per_person || 0,
      // Convert from lakhs to rupees, then to crores for display (1 lakh = 100,000, 1 crore = 10,000,000)
      expenditure: ((record.Total_Exp || 0) * 100000) / 10000000, // lakhs -> rupees -> crores
      wages: ((record.Wages || 0) * 100000) / 10000000, // lakhs -> rupees -> crores
      completedWorks: record.Number_of_Completed_Works || 0,
    })) || [];

  const readableDistrict = data?.district || (district ? decodeURIComponent(district) : "");
  const currentFinYear = data?.fin_year || selectedYear;

  return (
    <div className="min-h-screen bg-gray-50">
      <GovernmentHeader />

      <section className="border-b border-blue-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
            <Link href={`/${locale}`} className="inline-flex items-center gap-2 text-blue-700 hover:text-orange-500">
              <span className="text-xl">←</span>
              <span className="text-sm font-semibold uppercase tracking-wide">{t("common.back")}</span>
            </Link>
            <div className="md:border-l md:border-blue-100 md:pl-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">{t("district.title")}</p>
              <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">{readableDistrict}</h1>
              <p className="text-sm font-medium text-gray-600">
                {t("district.fin_year")}: {currentFinYear}
              </p>
            </div>
          </div>
          {data && (
            <div className="flex flex-wrap items-center gap-3 text-sm text-blue-700">
              <button
                onClick={handleVoiceSummary}
                className="inline-flex items-center gap-2 rounded-full border border-blue-200 px-4 py-2 font-semibold text-blue-700 transition-colors hover:bg-blue-50"
                aria-label={isSpeaking ? t("district.stopVoice") : t("district.playVoice")}
              >
                {isSpeaking ? "⏹️" : "🔊"} {isSpeaking ? t("district.stopVoice") : t("district.playVoice")}
              </button>
            </div>
          )}
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-10">
        {error && !loading ? (
          <div className="mx-auto max-w-2xl rounded-2xl border border-red-200 bg-red-50 p-10 text-center">
            <div className="text-4xl">❌</div>
            <p className="mt-4 text-lg font-semibold text-red-700">
              {error || t("district.notFound", { defaultValue: "District not found" })}
            </p>
            <Link
              href={`/${locale}`}
              className="mt-6 inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              ← {t("common.back")}
            </Link>
          </div>
        ) : (
          <>
            {loading && !data && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <div key={idx} className="h-32 rounded-2xl bg-blue-100/40 animate-pulse" />
                  ))}
                </div>
                <div className="h-48 rounded-2xl bg-white shadow-inner">
                  <div className="h-full w-full animate-pulse rounded-2xl bg-blue-50/60" />
                </div>
              </div>
            )}

            {data && (
              <>
                <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  <SummaryCard
                    title={t("district.statistics.averageWage")}
                    value={`₹${data.summary.averageWageRate.toFixed(2)}`}
                    subtitle="per day per person"
                    icon="💰"
                    color="green"
                  />
                  <SummaryCard
                    title={t("district.statistics.totalHouseholds")}
                    value={data.summary.totalHouseholds.toLocaleString()}
                    icon="👥"
                    color="blue"
                  />
                  <SummaryCard
                    title={t("district.statistics.totalExpenditure")}
                    value={`₹${(data.summary.totalExpenditure / 10000000).toFixed(2)} Cr`}
                    subtitle="Crores"
                    icon="📊"
                    color="blue"
                  />
                  <SummaryCard
                    title={t("district.statistics.completedWorks")}
                    value={data.summary.totalCompletedWorks.toLocaleString()}
                    icon="✅"
                    color="green"
                  />
                  <SummaryCard
                    title={t("district.statistics.ongoingWorks")}
                    value={data.summary.totalOngoingWorks.toLocaleString()}
                    icon="🔨"
                    color="yellow"
                  />
                  <SummaryCard
                    title={t("district.statistics.wagesPaid")}
                    value={`₹${(data.summary.totalWages / 10000000).toFixed(2)} Cr`}
                    subtitle="Crores"
                    icon="💵"
                    color="green"
                  />
                </div>

                <div className="mb-10 rounded-2xl bg-white p-8 shadow-md">
                  <h3 className="mb-4 text-xl font-semibold text-gray-900">{t("district.plainLanguage")}</h3>
                  <p className="text-lg leading-relaxed text-gray-700">
                    {t("district.plainLanguageTextFull", {
                      district: data.district,
                      year: data.fin_year,
                      households: data.summary.totalHouseholds.toLocaleString(),
                      wage: data.summary.averageWageRate.toFixed(2),
                      expenditure: (data.summary.totalExpenditure / 10000000).toFixed(2),
                      completedWorks: data.summary.totalCompletedWorks.toLocaleString(),
                      ongoingWorks: data.summary.totalOngoingWorks.toLocaleString(),
                    })}
                  </p>
                </div>

                {chartData.length > 0 && (
                  <div className="mb-10 rounded-2xl bg-white p-8 shadow-md">
                    <h3 className="mb-4 text-xl font-semibold text-gray-900">{t("district.charts")}</h3>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" angle={-45} textAnchor="end" height={100} tick={{ fontSize: 12 }} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="wage" fill="#3b82f6" name="Wage Rate (₹)" />
                        <Bar dataKey="expenditure" fill="#10b981" name="Expenditure (₹ Cr)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}

