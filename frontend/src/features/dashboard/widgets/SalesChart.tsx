"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useTranslation } from "react-i18next";

export function SalesChart() {
  const { t, i18n } = useTranslation();

  const data = [
    { month: "Jan", sales: 12500 },
    { month: "Feb", sales: 9800 },
    { month: "Mar", sales: 14500 },
    { month: "Apr", sales: 16200 },
    { month: "May", sales: 18900 },
    { month: "Jun", sales: 21500 },
  ];

  // تحويل أسماء الشهور حسب اللغة
  const months =
    i18n.language === "ar"
      ? ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو"]
      : ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

  const localizedData = data.map((item, i) => ({
    ...item,
    month: months[i],
  }));

  return (
    <section className="p-6 border shadow-sm bg-card-light dark:bg-card-dark border-border-light dark:border-border-dark rounded-xl">
      <h2 className="mb-4 text-lg font-semibold text-text-light dark:text-text-dark">
        {t("dashboard.salesChartTitle")}
      </h2>

      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={localizedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
            <XAxis dataKey="month" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(0,0,0,0.8)",
                borderRadius: "6px",
                border: "none",
              }}
              labelStyle={{ color: "#fff" }}
              itemStyle={{ color: "#fff" }}
            />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#22c55e"
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
