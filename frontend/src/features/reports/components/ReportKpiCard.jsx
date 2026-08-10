import { Card } from "@tremor/react";

export default function ReportKpiCard({
  title,
  value,
  description,
  decorationColor = "blue",
}) {
  return (
    <Card decoration="top" decorationColor={decorationColor}>
      <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
        {title}
      </p>

      <p className="mt-2 text-tremor-metric font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
        {value}
      </p>

      {description && (
        <p className="mt-2 text-tremor-default text-tremor-content dark:text-dark-tremor-content">
          {description}
        </p>
      )}
    </Card>
  );
}
