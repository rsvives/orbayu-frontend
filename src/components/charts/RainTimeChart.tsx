import { Label, PolarGrid, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"
import { ChartContainer, type ChartConfig } from "../ui/chart"
import { getRainIntensity } from "@/lib/precipitation"

export const RainTimeChart = ({ data, config }: { data: number, config: ChartConfig }) => {

    // const avg = data.reduce((acc, item) => acc + item.hours, 0) / data.length
    const { interval, rainIntensityIntervals } = getRainIntensity(data)

    const keys = Object.entries(rainIntensityIntervals).sort((a, b) => a[1] - b[1]).map(([k]) => k)
    // const actualKey = 5
    const actualKey = keys.findIndex(i => i === interval)
    return (
        <>
            <ChartContainer config={config} className="min-h-[80px] w-full max-h-[150px] aspect-square mx-auto">
                <RadialBarChart
                    data={[{ data: actualKey }]}
                    startAngle={270}
                    endAngle={270 - ((actualKey) / keys.length) * 360}
                    innerRadius={60}
                    outerRadius={75}

                >
                    <PolarGrid
                        gridType="circle"
                        radialLines={false}
                        stroke="none"
                        className="first:fill-muted last:fill-background"
                        polarRadius={[63, 56]}
                    />
                    <RadialBar dataKey="data" background cornerRadius={10} />
                    <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                        <Label
                            content={({ viewBox }) => {
                                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                    return (
                                        <text
                                            x={viewBox.cx}
                                            y={viewBox.cy}
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                        >
                                            <tspan
                                                x={viewBox.cx}
                                                y={(viewBox.cy || 0) - 4}
                                                className="fill-foreground text-2xl font-medium"
                                            >
                                                {interval}
                                            </tspan>
                                            <tspan
                                                x={viewBox.cx}
                                                y={(viewBox.cy || 0) + 20}
                                                className="fill-muted-foreground"
                                            >

                                            </tspan>
                                            <tspan
                                                x={viewBox.cx}
                                                y={(viewBox.cy || 0) + 36}
                                                className="fill-muted-foreground"
                                            >
                                            </tspan>
                                        </text>
                                    )
                                }
                            }}
                        />
                    </PolarRadiusAxis>
                </RadialBarChart>
            </ChartContainer >
        </>
    )
}
