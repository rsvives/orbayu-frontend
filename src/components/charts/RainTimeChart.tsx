import { Label, PolarGrid, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"
import { ChartContainer, type ChartConfig } from "../ui/chart"

export const RainTimeChart = ({ data, config }: { data: { hours: number }[], config: ChartConfig }) => {

    // const avg = data.reduce((acc, item) => acc + item.hours, 0) / data.length

    return (
        <>
            <ChartContainer config={config} className="min-h-[80px] w-full max-h-[130px] aspect-square mx-auto">
                <RadialBarChart
                    data={data}
                    startAngle={0}
                    endAngle={data[0].hours / 24 * 360}
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
                    <RadialBar dataKey="hours" background cornerRadius={10} />
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
                                                className="fill-foreground text-2xl font-bold"
                                            >
                                                {((data[0].hours / 24) * 100).toFixed(1)}%
                                            </tspan>
                                            <tspan
                                                x={viewBox.cx}
                                                y={(viewBox.cy || 0) + 20}
                                                className="fill-muted-foreground"
                                            >
                                                {data[0].hours.toFixed(1)} of 24
                                            </tspan>
                                            <tspan
                                                x={viewBox.cx}
                                                y={(viewBox.cy || 0) + 36}
                                                className="fill-muted-foreground"
                                            >
                                                hours/day
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
