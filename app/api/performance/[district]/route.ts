import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ district: string }> }
) {
  try {
    const { district } = await params;
    const { searchParams } = new URL(req.url);
    const fin_year = searchParams.get("year") || "2023-2024";

    const decodedDistrict = decodeURIComponent(district);

    const records = await prisma.mgnregaPerformance.findMany({
      where: {
        district: { name: decodedDistrict },
        fin_year,
      },
      include: { district: true },
      orderBy: { month: "asc" },
    });

    if (records.length === 0) {
      return NextResponse.json(
        { error: "District not found" },
        { status: 404 }
      );
    }

    // Since data is cumulative, use the latest month's values for summary
    // Month order for sorting (financial year: April to March)
    const monthOrder: Record<string, number> = {
      April: 1,
      May: 2,
      June: 3,
      July: 4,
      Aug: 5,
      August: 5,
      Sep: 6,
      Sept: 6,
      September: 6,
      Oct: 7,
      October: 7,
      Nov: 8,
      November: 8,
      Dec: 9,
      December: 9,
      Jan: 10,
      January: 10,
      Feb: 11,
      February: 11,
      March: 12,
    };

    // Find the latest month's record (highest cumulative values)
    let latestRecord = records[0];
    let maxMonthRank = monthOrder[records[0]?.month || ""] || 0;

    records.forEach((record) => {
      const monthRank = monthOrder[record.month] || 0;
      if (monthRank > maxMonthRank) {
        maxMonthRank = monthRank;
        latestRecord = record;
      }
    });

    // Calculate average wage rate from all months (average of averages)
    const wageRates = records
      .map((r) => r.Average_Wage_rate_per_day_per_person || 0)
      .filter((r) => r > 0);
    const avgWage =
      wageRates.length > 0
        ? wageRates.reduce((a, b) => a + b, 0) / wageRates.length
        : 0;

    // Use latest month's cumulative values for summary
    // Convert from lakhs to rupees (1 lakh = 100,000)
    const aggregated = {
      totalHouseholds: latestRecord.Total_Households_Worked || 0,
      totalExpenditure: (latestRecord.Total_Exp || 0) * 100000,
      totalWages: (latestRecord.Wages || 0) * 100000,
      totalCompletedWorks: latestRecord.Number_of_Completed_Works || 0,
      totalOngoingWorks: latestRecord.Number_of_Ongoing_Works || 0,
    };

    return NextResponse.json({
      district: decodedDistrict,
      fin_year,
      records,
      summary: {
        averageWageRate: Math.round(avgWage * 100) / 100,
        totalHouseholds: aggregated.totalHouseholds,
        totalExpenditure: aggregated.totalExpenditure,
        totalWages: aggregated.totalWages,
        totalCompletedWorks: aggregated.totalCompletedWorks,
        totalOngoingWorks: aggregated.totalOngoingWorks,
      },
    });
  } catch (error) {
    console.error("Error fetching district data:", error);
    return NextResponse.json(
      { error: "Failed to fetch district data" },
      { status: 500 }
    );
  }
}

