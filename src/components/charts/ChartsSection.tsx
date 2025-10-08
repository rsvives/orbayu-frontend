import { useWeatherDataStore } from "@/store/weatherDataStore"
import type { ChartConfig } from "../ui/chart"
import { TemperatureMaxMinChart } from "./TemperatureMaxMinChart"
import { TemperatureMeanChart } from "./TemperatureMeanChart"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { ScrollArea } from "@radix-ui/react-scroll-area"
import { CloudRain, ThermometerSun } from "lucide-react"
import { RainTimeChart } from "./RainTimeChart"
import { RainQuantityChart } from "./RainQuantityChart"

export const ChartsSection = () => {
    const { weatherData } = useWeatherDataStore()

    const chartConfig: ChartConfig = {

        meanTemp: {
            label: 'Avg Temp(ºC)',
            color: "#000000",
        },
        maxTemp: {
            label: 'Max Temp(ºC)',
            color: "var(--foreground)",
        },
        minTemp: {
            label: 'Min Temp(ºC)',
            color: "#AAAAAA",
        }

    } satisfies ChartConfig


    const chartData = weatherData?.temps.map((t) => ({
        year: t.year,
        maxTemp: t.max_temps.reduce((a, b) => a + b) / t.max_temps.length,
        minTemp: t.min_temps.reduce((a, b) => a + b) / t.min_temps.length,
        meanTemp: t.mean_temps.reduce((a, b) => a + b) / t.mean_temps.length
    }))

    const rainData = weatherData?.rain.map((r) => ({
        year: r.year,
        hours: r.hours.reduce((a, b) => a + b) / r.hours.length,
        quantity: r.quantity.reduce((a, b) => a + b) / r.quantity.length
    }))
    // console.log({ rainData })
    const rainQuantityData = rainData?.map((r) => ({ year: r.year, quantity: r.quantity }))

    // console.log(rainHoursData)
    if (chartData && rainData && rainQuantityData) {
        const avgHours = rainData?.map((r) => r.hours).reduce((a, b) => a + b, 0) / (rainData?.length || 1)
        const rainHoursData = [{ hours: avgHours }]
        return (
            <div className="w-full">
                <ScrollArea className=" overflow-y-scroll flex flex-col gap-1 max-h-[59vh] w-full" type="auto">


                    <div className="flex flex-col gap-3">
                        <h3 className="text-md font-semibold flex gap-2">
                            <CloudRain size={24} />Rain
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            <Card className="shadow-none p-2">
                                <CardContent className="p-2">
                                    <h3>53%</h3>
                                    <span className="text-sm"> possibilities</span>
                                </CardContent>
                            </Card>
                            <Card className="shadow-none p-2">
                                <CardContent className="p-2">
                                    <h3>42l/m^3</h3>
                                    <span className="text-sm"> precipitation</span>
                                </CardContent>
                            </Card>
                        </div>
                        <ScrollArea className="h-[220px] overflow-x-scroll" >
                            <div className="flex gap-3 w-full">

                                <Card className="shadow-none p-4 flex-1">
                                    <CardHeader>
                                        <CardTitle>Rain Hours</CardTitle>
                                    </CardHeader>
                                    <CardContent className="px-4">
                                        <RainTimeChart data={rainHoursData} config={chartConfig} />
                                    </CardContent>
                                </Card>
                                <Card className="shadow-none p-4 flex-1">
                                    <CardHeader>
                                        <CardTitle>Rain Intensity</CardTitle>
                                    </CardHeader>
                                    <CardContent className="px-4">
                                        <RainQuantityChart data={rainQuantityData} config={chartConfig} />
                                    </CardContent>
                                </Card>

                            </div>
                        </ScrollArea>
                    </div>


                    <div className="flex flex-col gap-3">

                        <h3 className="text-lg font-semibold flex gap-2">
                            <ThermometerSun size={24} />Temperature
                        </h3>
                        <div className="grid grid-cols-3 gap-3">
                            <Card className="shadow-none p-2">
                                <CardContent className="p-2 flex flex-col gap-2">
                                    <h3 className="text-lg font-medium">27ºC</h3>
                                    <span className="text-sm leading-0.5 text-accent-foreground"> max</span>
                                    <span className="text-[9px] sm:text-sm"> historic</span>
                                </CardContent>
                            </Card>
                            <Card className="shadow-none p-2">
                                <CardContent className="p-2 flex flex-col gap-2">
                                    <h3 className="text-lg font-medium">9ºC</h3>
                                    <span className="text-sm leading-0.5 text-accent-foreground"> min</span>
                                    <span className="text-[9px] sm:text-sm"> historic</span>
                                </CardContent>
                            </Card>
                            <Card className="shadow-none p-2">
                                <CardContent className="p-2">
                                    <h3 className="text-lg font-medium">17ºC</h3>
                                    <span className="text-sm leading-0.5 text-accent-foreground"> mean</span>
                                </CardContent>
                            </Card>
                        </div>
                        <ScrollArea className="min-h-[220px] overflow-x-scroll" >
                            <div className="flex gap-3 w-full">
                                <Card className="shadow-none p-4 min-w-[280px] flex-1">
                                    <CardHeader>
                                        <CardTitle>Max/Min</CardTitle>
                                    </CardHeader>
                                    <CardContent className="px-4 ">
                                        <TemperatureMaxMinChart data={chartData} config={chartConfig} />
                                    </CardContent>
                                </Card>
                                <Card className="shadow-none p-4 min-w-[280px] flex-1">
                                    <CardHeader>
                                        <CardTitle>Average Temp</CardTitle>
                                    </CardHeader>
                                    <CardContent className="px-4">
                                        <TemperatureMeanChart data={chartData} config={chartConfig} />
                                    </CardContent>
                                </Card>


                            </div>
                        </ScrollArea>
                    </div>
                </ScrollArea >
            </div >
        )
    }
}