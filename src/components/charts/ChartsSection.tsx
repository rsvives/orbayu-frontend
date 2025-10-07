import { useWeatherDataStore } from "@/store/weatherDataStore"
import type { ChartConfig } from "../ui/chart"
import { TemperatureMaxMinChart } from "./TemperatureMaxMinChart"
import { TemperatureMeanChart } from "./TemperatureMeanChart"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { ScrollArea } from "@radix-ui/react-scroll-area"
import { CloudRain, ThermometerSun } from "lucide-react"

export const ChartsSection = () => {
    const { weatherData } = useWeatherDataStore()

    const chartConfig: ChartConfig = {

        meanTemp: {
            label: 'Mean Temp (ºC)',
            color: "#000000",
        },
        maxTemp: {
            label: 'Max Temp (ºC)',
            color: "var(--foreground)",
        },
        minTemp: {
            label: 'Min Temp (ºC)',
            color: "#AAAAAA",
        }

    } satisfies ChartConfig


    const chartData = weatherData?.temps.map((t) => ({
        year: t.year,
        maxTemp: t.max_temps.reduce((a, b) => a + b) / t.max_temps.length,
        minTemp: t.min_temps.reduce((a, b) => a + b) / t.min_temps.length,
        meanTemp: t.mean_temps.reduce((a, b) => a + b) / t.mean_temps.length
    }))

    if (chartData) {

        return (
            <div className="">
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
                                    {/* <RainChart data={chartData} config={chartConfig} /> */}
                                </CardContent>
                            </Card>
                            <Card className="shadow-none p-2">
                                <CardContent className="p-2">
                                    <h3>42l/m^3</h3>
                                    <span className="text-sm"> precipitation</span>
                                    {/* <RainChart data={chartData} config={chartConfig} /> */}
                                </CardContent>
                            </Card>
                        </div>
                        <ScrollArea className="h-[215px] overflow-x-scroll" >
                            <div className="flex gap-3 ">

                                <Card className="shadow-none p-4">
                                    <CardHeader>
                                        <CardTitle>Rain Hours</CardTitle>
                                    </CardHeader>
                                    <CardContent className="px-4">
                                        <TemperatureMaxMinChart data={chartData} config={chartConfig} />
                                    </CardContent>
                                </Card>
                                <Card className="shadow-none p-4">
                                    <CardHeader>
                                        <CardTitle>Rain Intensity</CardTitle>
                                    </CardHeader>
                                    <CardContent className="px-4">
                                        <TemperatureMeanChart data={chartData} config={chartConfig} />
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
                                    {/* <RainChart data={chartData} config={chartConfig} /> */}
                                </CardContent>
                            </Card>
                            <Card className="shadow-none p-2">
                                <CardContent className="p-2 flex flex-col gap-2">
                                    <h3 className="text-lg font-medium">9ºC</h3>
                                    <span className="text-sm leading-0.5 text-accent-foreground"> min</span>
                                    <span className="text-[9px] sm:text-sm"> historic</span>
                                    {/* <RainChart data={chartData} config={chartConfig} /> */}
                                </CardContent>
                            </Card>
                            <Card className="shadow-none p-2">
                                <CardContent className="p-2">
                                    <h3 className="text-lg font-medium">17ºC</h3>
                                    <span className="text-sm leading-0.5 text-accent-foreground"> mean</span>
                                    {/* <RainChart data={chartData} config={chartConfig} /> */}
                                </CardContent>
                            </Card>
                        </div>
                        <ScrollArea className="h-[215px] overflow-x-scroll" >
                            <div className="flex gap-3 ">

                                <Card className="shadow-none p-4">
                                    <CardHeader>
                                        <CardTitle>Max/Min</CardTitle>
                                    </CardHeader>
                                    <CardContent className="px-4">
                                        <TemperatureMaxMinChart data={chartData} config={chartConfig} />
                                    </CardContent>
                                </Card>
                                <Card className="shadow-none p-4">
                                    <CardHeader>
                                        <CardTitle>Mean</CardTitle>
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