"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

export const description = "An interactive bar chart";

type ChartAreaInteractiveProps = {
  data: {
    date: string;
    enrollments: number;
  }[];
  totalEnrollmentsLast30Days: number;
};

const chartConfig = {
  views: {
    label: "Enrollments",
  },
  enrollments: {
    label: "enrollments",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

const formatChartDate = (
  value: string,
  options: Intl.DateTimeFormatOptions,
) => {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", options);
};

export function ChartAreaInteractive({
  data,
  totalEnrollmentsLast30Days,
}: ChartAreaInteractiveProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Total Enrollments
        </CardTitle>
        <CardDescription className="text-base">
          Total enrollments for the last 30 days: {totalEnrollmentsLast30Days}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto">
          <ChartContainer
            config={chartConfig}
            className="h-[400px] w-full min-w-300"
          >
            <BarChart
              accessibilityLayer
              data={data}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  return formatChartDate(String(value), {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-[150px]"
                    nameKey="views"
                    labelFormatter={(value) => {
                      return formatChartDate(String(value), {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });
                    }}
                  />
                }
              />
              <Bar
                dataKey="enrollments"
                fill="var(--color-enrollments)"
                radius={1}
              />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
