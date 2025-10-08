
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { type ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"


export const TemperatureMaxMinChart = ({ data, config }: { data: { year: number, minTemp: number, maxTemp: number }[], config: ChartConfig }) => {


    // console.log(data)
    return (
        <>

            <ChartContainer config={config} className="min-h-[140px] w-full max-h-[200px]">
                {/* <div className="min-h-[200px]"> */}
                <AreaChart accessibilityLayer data={data} >
                    <CartesianGrid vertical={false} />

                    <XAxis dataKey='year'
                        tickLine={false}
                        tickMargin={16}
                        axisLine={false}
                    />
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                    />
                    <Area
                        dataKey="maxTemp"
                        fill="var(--color-maxTemp)"
                        stroke="var(--color-maxTemp)"
                        fillOpacity={0.7}
                        stackId={'a'}
                        type="natural"
                    >
                        {/* <LabelList
                            position="top"
                            offset={12}
                            className="fill-foreground"
                            fontSize={12}
                            formatter={(value: number | string) => Number(value).toFixed(1)}
                        /> */}

                    </Area>
                    <Area
                        dataKey="minTemp"
                        fill="var(--color-minTemp)"
                        stroke="var(--color-minTemp)"
                        fillOpacity={0.4}
                        stackId={'b'}
                        type="natural"

                    >
                        {/* 
                        <LabelList
                            position="bottom"
                            offset={4}
                            className="fill-foreground"
                            fontSize={12}
                            formatter={(value: number | string) => Number(value).toFixed(1)}
                        /> */}
                    </Area>
                    <ChartLegend content={<ChartLegendContent />} />



                </AreaChart>

            </ChartContainer>
        </>
    )
}