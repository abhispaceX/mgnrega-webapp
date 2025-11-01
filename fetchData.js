import { PrismaClient } from "@prisma/client";
import axios from "axios";
import dotenv from "dotenv";

// Load environment variables from a .env file if present.
// Make sure to run: npm install dotenv --save
dotenv.config();

const prisma = new PrismaClient();

const API_URL = "https://api.data.gov.in/resource/ee03643a-ee4c-48c2-ac30-9f2ff26ab722";
const API_KEY = process.env.DATA_GOV_API_KEY;

// Fail fast if API key is not provided.
if (!API_KEY) {
  console.error("\nERROR: DATA_GOV_API_KEY is not set.\n\nPlease add your API key to your environment before running this script.\nOptions:\n  1) Create a `.env` file in the project root with: DATA_GOV_API_KEY=your_api_key\n  2) Export the variable in your shell: export DATA_GOV_API_KEY=your_api_key\n  3) Pass it inline when running: DATA_GOV_API_KEY=your_api_key node fetchData.js\n\nAfter that, re-run the script.\n");
  process.exit(1);
}

const FIN_YEARS = [
  "2018-2019",
  "2019-2020",
  "2020-2021",
  "2021-2022",
  "2022-2023",
  "2023-2024",
  "2024-2025",
  "2025-2026",
];

// ---- Helpers ----
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function retryRequest(fn, retries = 5, delay = 2000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const isRateLimited = err.response?.status === 429;
      const waitTime = delay * attempt;
      console.warn(`⚠️ Attempt ${attempt} failed: ${err.message}. Retrying in ${waitTime / 1000}s...`);
      if (attempt === retries) throw err;
      await sleep(isRateLimited ? waitTime * 2 : waitTime);
    }
  }
}

const getFirstDefined = (obj, keys) => {
  for (const k of keys) {
    if (obj[k] !== undefined && obj[k] !== null && obj[k] !== "") return obj[k];
  }
  return undefined;
};

const toNumber = (val) => {
  if (val === undefined || val === null || val === "") return null;
  const n = Number(String(val).replace(/,/g, ""));
  return Number.isFinite(n) ? n : null;
};

// ---- Main fetch logic ----
async function fetchDataForYear(finYear) {
  console.log(`📦 Fetching data for Andhra Pradesh - ${finYear}`);

  try {
    const res = await retryRequest(() =>
      axios.get(API_URL, {
        params: {
          "api-key": API_KEY,
          format: "json",
          limit: 5000, // safer upper limit
          "filters[state_name]": "ANDHRA PRADESH",
          "filters[fin_year]": finYear,
        },
        timeout: 30000,
      })
    );

    const records = res.data.records || [];
    console.log(`✅ Received ${records.length} records for ${finYear}`);

    for (const r of records) {
      const districtName = r.district_name?.trim();
      const stateName = r.state_name?.trim();
      const month = r.month?.trim();

      if (!districtName || !month) continue;

      const district = await prisma.district.upsert({
        where: { name: districtName },
        update: {},
        create: {
          name: districtName,
          state_name: stateName,
        },
      });

      await prisma.mgnregaPerformance.upsert({
        where: {
          districtId_fin_year_month: {
            districtId: district.id,
            fin_year: finYear,
            month,
          },
        },
        update: mapPerformanceData(r, finYear, month, district.id),
        create: mapPerformanceData(r, finYear, month, district.id),
      });
    }

    console.log(`✅ ${finYear} inserted successfully (${records.length} records)`);
  } catch (error) {
    console.error(`❌ Error fetching data for ${finYear}:`, error.message);
  }
}

function mapPerformanceData(r, finYear, month, districtId) {
  return {
    districtId,
    fin_year: finYear,
    month,

    Approved_Labour_Budget: toNumber(getFirstDefined(r, ["Approved_Labour_Budget", "approved_labour_budget"])),
    Average_Wage_rate_per_day_per_person: toNumber(getFirstDefined(r, ["Average_Wage_rate_per_day_per_person", "average_wage_rate_per_day_per_person"])),
    Average_days_of_employment_provided_per_Household: toNumber(getFirstDefined(r, ["Average_days_of_employment_provided_per_Household", "average_days_of_employment_provided_per_household"])),
    Differently_abled_persons_worked: (() => {
      const v = getFirstDefined(r, ["Differently_abled_persons_worked", "differently_abled_persons_worked"]);
      const n = toNumber(v);
      return n !== null ? Math.trunc(n) : null;
    })(),
    Material_and_skilled_Wages: toNumber(getFirstDefined(r, ["Material_and_skilled_Wages", "material_and_skilled_wages"])),
    Number_of_Completed_Works: (() => {
      const v = getFirstDefined(r, ["Number_of_Completed_Works", "number_of_completed_works"]);
      const n = toNumber(v);
      return n !== null ? Math.trunc(n) : null;
    })(),
    Number_of_GPs_with_NIL_exp: (() => {
      const v = getFirstDefined(r, ["Number_of_GPs_with_NIL_exp", "number_of_gps_with_nil_exp"]);
      const n = toNumber(v);
      return n !== null ? Math.trunc(n) : null;
    })(),
    Number_of_Ongoing_Works: (() => {
      const v = getFirstDefined(r, ["Number_of_Ongoing_Works", "number_of_ongoing_works"]);
      const n = toNumber(v);
      return n !== null ? Math.trunc(n) : null;
    })(),
    Persondays_of_Central_Liability_so_far: toNumber(getFirstDefined(r, ["Persondays_of_Central_Liability_so_far", "persondays_of_central_liability_so_far"])),
    SC_persondays: toNumber(getFirstDefined(r, ["SC_persondays", "sc_persondays"])),
    ST_persondays: toNumber(getFirstDefined(r, ["ST_persondays", "st_persondays"])),
    Total_Exp: toNumber(getFirstDefined(r, ["Total_Exp", "total_exp"])),
    Total_Households_Worked: (() => {
      const v = getFirstDefined(r, ["Total_Households_Worked", "total_households_worked"]);
      const n = toNumber(v);
      return n !== null ? Math.trunc(n) : null;
    })(),
    Total_Individuals_Worked: (() => {
      const v = getFirstDefined(r, ["Total_Individuals_Worked", "total_individuals_worked"]);
      const n = toNumber(v);
      return n !== null ? Math.trunc(n) : null;
    })(),
    Wages: toNumber(getFirstDefined(r, ["Wages", "wages"])),
    Women_Persondays: toNumber(getFirstDefined(r, ["Women_Persondays", "women_persondays"])),
    Remarks: getFirstDefined(r, ["Remarks", "remarks"]) ?? null,
  };
}

// ---- Runner ----
async function main() {
  console.log("🧹 Clearing old data...");
//   await prisma.mgnregaPerformance.deleteMany({});
//   await prisma.district.deleteMany({});
  console.log("✅ Existing data cleared!\n");

  for (const year of FIN_YEARS) {
    await fetchDataForYear(year);
    await sleep(3000); // small delay to avoid rate limiting
  }

  console.log("🎉 All Andhra Pradesh data imported successfully!");
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error("❌ Fatal Error:", err);
  prisma.$disconnect();
  process.exit(1);
});
