import type React from "react"

interface ChartPayloadItem {
  name: string;
  value: number | string;
  [key: string]: unknown;
}

export const ChartContainer = ({ children }: { children: React.ReactNode }) => {
  return <div className="rounded-md border bg-card text-card-foreground shadow-sm">{children}</div>
}

export const ChartTitle = ({ children }: { children: React.ReactNode }) => {
  return <h3 className="px-4 py-2 font-semibold">{children}</h3>
}

export const ChartTooltip = ({ active, payload, label }: { active?: boolean; payload?: ChartPayloadItem[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border rounded-md p-2 shadow-md">
        <p className="font-semibold">{`${label}`}</p>
        <p className="text-gray-700">{`${payload[0].name}: ${payload[0].value}`}</p>
      </div>
    )
  }

  return null
}

export const ChartLegend = ({ children }: { children: React.ReactNode }) => {
  return <div className="p-4">{children}</div>
}
