import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const districts = await prisma.district.findMany({
      orderBy: { name: "asc" },
      include: {
        performances: {
          select: { fin_year: true },
          distinct: ["fin_year"],
        },
      },
    });

    const availableYears = await prisma.mgnregaPerformance.findMany({
      select: { fin_year: true },
      distinct: ["fin_year"],
      orderBy: { fin_year: "desc" },
    });

    return NextResponse.json({
      districts,
      availableYears: availableYears.map((y) => y.fin_year),
    });
  } catch (error) {
    console.error("Error fetching districts:", error);
    return NextResponse.json(
      { error: "Failed to fetch districts" },
      { status: 500 }
    );
  }
}

