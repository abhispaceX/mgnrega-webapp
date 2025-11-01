import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const fin_year = searchParams.get("year") || "2023-2024";

    const data = await prisma.mgnregaPerformance.findMany({
      where: { fin_year },
      include: { district: true },
      orderBy: [
        { district: { name: "asc" } },
        { month: "asc" },
      ],
    });

    // Since data is cumulative, we need to get the latest month's data for each district
    // Group by district and get the latest month's cumulative values
    const districtLatestData = new Map<
      string,
      {
        totalHouseholds: number;
        totalExpenditure: number;
        totalWomenPersondays: number;
        totalPersondays: number;
        avgWageRate: number;
        totalIndividuals: number;
        avgDaysPerHousehold: number;
        month: string;
        completedWorks: number;
        state: string;
      }
    >();

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

    // Process data to get latest month's cumulative values per district
    data.forEach((record: typeof data[0]) => {
      const districtName = record.district.name;
      const monthRank = monthOrder[record.month] || 0;

      const existing = districtLatestData.get(districtName);
      if (!existing || monthRank > monthOrder[existing.month || ""] || 0) {
        // Calculate persondays more accurately:
        // Option 1: Use the sum of category-wise persondays if available
        // Option 2: Use Total_Individuals × Average_days (but per individual, not per household)
        // For now, we'll use a reasonable estimation based on individuals and average days
        const scPersondays = record.SC_persondays || 0;
        const stPersondays = record.ST_persondays || 0;
        const womenPersondays = record.Women_Persondays || 0;
        
        // Total persondays should be close to: Total Individuals × Average Days per Person
        // But Average_days_of_employment_provided_per_Household is per HOUSEHOLD, not per person
        // So we need a different approach. Let's use the maximum of the category persondays as a proxy
        const totalPersondays = (() => {
          const reported = record.Persondays_of_Central_Liability_so_far || 0;
          if (reported > 0) {
            return reported;
          }

          const categorySum = scPersondays + stPersondays + womenPersondays;
          if (categorySum > 0) {
            return categorySum;
          }

          const totalIndividuals = record.Total_Individuals_Worked || 0;
          const avgDaysPerHousehold = record.Average_days_of_employment_provided_per_Household || 0;
          return totalIndividuals * avgDaysPerHousehold;
        })();

        districtLatestData.set(districtName, {
          totalHouseholds: record.Total_Households_Worked || 0,
          // Convert from lakhs to rupees (1 lakh = 100,000)
          totalExpenditure: (record.Total_Exp || 0) * 100000,
          totalWomenPersondays: record.Women_Persondays || 0,
          totalPersondays,
          avgWageRate: record.Average_Wage_rate_per_day_per_person || 0,
          totalIndividuals: record.Total_Individuals_Worked || 0,
          avgDaysPerHousehold:
            record.Average_days_of_employment_provided_per_Household || 0,
          completedWorks: record.Number_of_Completed_Works || 0,
          state: record.district.state_name,
          month: record.month,
        });
      }
    });

    const districtSummaries = Array.from(districtLatestData.entries()).map(
      ([districtName, districtData]) => ({
        district: districtName,
        state: districtData.state,
        activeWorkers: districtData.totalIndividuals,
        households: districtData.totalHouseholds,
        persondays: Math.round(districtData.totalPersondays),
        womenPersondays: districtData.totalWomenPersondays,
        assetsCompleted: districtData.completedWorks,
        totalExpenditure: districtData.totalExpenditure,
        avgWageRate: districtData.avgWageRate,
      })
    );

    // Sum latest cumulative values across all districts for state totals
    const aggregated = districtSummaries.reduce(
      (acc, districtData) => {
        acc.totalHouseholds += districtData.households;
        acc.totalExpenditure += districtData.totalExpenditure;
        acc.totalWomenPersondays += districtData.womenPersondays;
        acc.totalPersondays += districtData.persondays;
        acc.wageRates.push(districtData.avgWageRate);
        acc.totalIndividuals += districtData.activeWorkers;
        acc.districtCount += 1;
        return acc;
      },
      {
        totalHouseholds: 0,
        totalExpenditure: 0,
        totalWomenPersondays: 0,
        totalPersondays: 0,
        wageRates: [] as number[],
        totalIndividuals: 0,
        districtCount: 0,
      }
    );

    // Calculate weighted average wage rate
    const avgWage =
      aggregated.wageRates.length > 0
        ? aggregated.wageRates.reduce((a: number, b: number) => a + b, 0) / aggregated.wageRates.length
        : 0;

    // Calculate women participation percentage
    const womenPercent =
      aggregated.totalPersondays > 0
        ? (aggregated.totalWomenPersondays / aggregated.totalPersondays) * 100
        : 0;

    const stateAggregates = districtSummaries.reduce((acc, districtData) => {
      const state = districtData.state;
      if (!acc.has(state)) {
        acc.set(state, {
          activeWorkers: 0,
          persondays: 0,
          assetsCompleted: 0,
          totalExpenditure: 0,
        });
      }

      const stateData = acc.get(state)!;
      stateData.activeWorkers += districtData.activeWorkers;
      stateData.persondays += districtData.persondays;
      stateData.assetsCompleted += districtData.assetsCompleted;
      stateData.totalExpenditure += districtData.totalExpenditure;
      return acc;
    }, new Map<string, { activeWorkers: number; persondays: number; assetsCompleted: number; totalExpenditure: number }>());

    const stateSummaries = Array.from(stateAggregates.entries()).map(([state, values]: [string, { activeWorkers: number; persondays: number; assetsCompleted: number; totalExpenditure: number }]) => ({
      state,
      ...values,
    }));

    return NextResponse.json({
      data,
      summary: {
        totalHouseholds: aggregated.totalHouseholds,
        averageWageRate: Math.round(avgWage * 100) / 100,
        womenParticipationPercent: Math.round(womenPercent * 100) / 100,
        totalExpenditure: aggregated.totalExpenditure,
      },
      districtSummaries,
      stateSummaries,
    });
  } catch (error) {
    console.error("Error fetching performance data:", error);
    return NextResponse.json(
      { error: "Failed to fetch performance data" },
      { status: 500 }
    );
  }
}

