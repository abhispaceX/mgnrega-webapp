"use client";

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

interface DistrictWageChartProps {
  data: Array<{
    district: string;
    wage: number;
  }>;
}

export default function DistrictWageChart({ data }: DistrictWageChartProps) {
  return (
    <div className="w-full rounded-xl bg-white p-6 shadow-md dark:bg-gray-800">
      <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
        District vs Average Wage Rate
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="district"
            angle={-45}
            textAnchor="end"
            height={100}
            interval={0}
            tick={{ fontSize: 12 }}
          />
          <YAxis />
          <Tooltip
            formatter={(value: number) => `₹${value.toFixed(2)}`}
            labelStyle={{ color: "#000" }}
          />
          <Legend />
          <Bar dataKey="wage" fill="#3b82f6" name="Average Wage Rate (₹)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

