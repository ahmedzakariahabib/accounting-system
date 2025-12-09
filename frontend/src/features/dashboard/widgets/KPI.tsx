import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

export function KPI() {
  const { t } = useTranslation();

  const cards = [
    {
      key: "totalSales",
      total: "$125,670",
      pars: 5.2,
    },
    {
      key: "totalPurchases",
      total: "$65,230",
      pars: 2.1,
    },
    {
      key: "grossProfit",
      total: "$60,440",
      pars: 8.3,
    },
    {
      key: "inventoryValue",
      total: "$210,980",
      pars: -1.5,
    },
  ];

  return (
    <section aria-label={t("dashboard.kpi.title") || "Key Performance Indicators"}>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const isPositive = card.pars >= 0;
          return (
            <div
              key={card.key}
              className="flex flex-col gap-2 p-6 border shadow-sm bg-card-light dark:bg-card-dark border-border-light dark:border-border-dark rounded-xl"
            >
              <p className="text-base font-medium text-muted-light dark:text-muted-dark">
                {t(`dashboard.kpi.${card.key}`)}
              </p>

              <p className="text-3xl font-bold tracking-tight text-text-light dark:text-text-dark">
                {card.total}
              </p>

              <p
                className={`text-sm font-medium flex items-center gap-1 ${
                  isPositive
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {isPositive && <Plus size={12} />}
                {card.pars}% {t("dashboard.kpi.vsLastMonth")}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
