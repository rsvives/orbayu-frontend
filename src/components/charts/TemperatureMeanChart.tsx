import { LineChart, XAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "../ui/chart"
import { Line } from "recharts"

export const TemperatureMeanChart = ({ data, config }: { data: { year: number, meanTemp: number }[], config: ChartConfig }) => {
    return (
        <>
            <ChartContainer config={config} className="min-h-[140px] w-full max-h-[200px]">
                <LineChart
                    accessibilityLayer
                    data={data}
                    margin={{
                        top: 32,
                        left: 12,
                        right: 12,
                        bottom: 0
                    }}


                >
                    <XAxis dataKey='year'
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                    />
                    <Line
                        dataKey="meanTemp"
                        type="natural"
                        stroke="var(--color-meanTemp)"
                        strokeWidth={2}
                        min={13}
                        max={27}
                        dot={{
                            fill: "var(--color-desktop)",
                        }}
                        activeDot={{
                            r: 6,
                        }}
                    >
                    </Line>
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                    />
                </LineChart>
            </ChartContainer>
        </>
    )
}