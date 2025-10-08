import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "../ui/chart"

export const RainQuantityChart = ({ data, config }: { data: { year: number, quantity: number }[], config: ChartConfig }) => {
    return (
        <>
            <ChartContainer config={config} className="min-h-[140px] w-full max-h-[200px]">
                <BarChart
                    accessibilityLayer
                    data={data}
                    margin={{
                        top: 20,
                    }}
                >
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="year"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}

                    />
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent formatter={(value) => (Number(value) * 100000).toFixed(1)} hideLabel />}
                    />
                    <Bar dataKey="quantity" fill="var(--color-desktop)" radius={8}>
                        <LabelList
                            position="top"
                            offset={12}
                            className="fill-foreground"
                            fontSize={12}
                            formatter={(value: number) => Number(value * 100000).toFixed(1)}
                        />
                    </Bar>
                </BarChart>
            </ChartContainer>
        </>
    )
}