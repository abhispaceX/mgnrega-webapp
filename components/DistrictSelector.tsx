"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface District {
  id: number;
  name: string;
  state_name: string;
}

export default function DistrictSelector() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDistrict, setSelectedDistrict] = useState("");

  useEffect(() => {
    async function fetchDistricts() {
      try {
        const res = await fetch("/api/districts");
        const data = await res.json();
        setDistricts(data.districts || []);
      } catch (error) {
        console.error("Failed to fetch districts:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDistricts();
  }, []);

  const handleDistrictChange = (districtName: string) => {
    if (!districtName) return;
    setSelectedDistrict(districtName);
    // Navigate to district page
    router.push(`/${locale}/district/${encodeURIComponent(districtName)}`);
  };

  if (loading) {
    return (
      <button
        disabled
        className="inline-flex items-center gap-2 rounded-full bg-gray-300 px-5 py-3 text-sm font-semibold text-gray-600 shadow cursor-not-allowed"
      >
        Loading...
      </button>
    );
  }

  return (
    <div className="relative inline-block">
      <select
        value={selectedDistrict}
        onChange={(e) => handleDistrictChange(e.target.value)}
        className="inline-flex items-center gap-2 rounded-full bg-orange-400 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2 cursor-pointer appearance-none pr-10"
        aria-label="Select district"
      >
        <option value="" className="bg-white text-gray-900">
          Select District
        </option>
        {districts.map((district) => (
          <option
            key={district.id}
            value={district.name}
            className="bg-white text-gray-900"
          >
            {district.name}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-lg text-white">
        ▼
      </span>
    </div>
  );
}
