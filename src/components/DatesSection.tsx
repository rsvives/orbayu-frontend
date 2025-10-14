import { Card, CardContent } from "./ui/card";
import { parseDate } from "chrono-node"
import { CalendarIcon, CloudRain, Loader2, Snowflake, ThermometerSun, Wind } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner";
import { Toggle } from "./ui/toggle";
import { formatDate } from "@/lib/dates";
import { useState } from "react";
import { useDatesStore } from "@/store/datesStore";
import type { QueryObserverResult } from "@tanstack/react-query";
import { useAppStateStore } from "@/store/appStateStore";
import { useLocationStore } from "@/store/locationStore";

//TODO fix any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const DatesSection = ({ handleCheckWeatherQuery, dataPending }: { handleCheckWeatherQuery: () => void | Promise<QueryObserverResult<any, Error>>, dataPending: boolean }) => {
    const [open, setOpen] = useState(false)

    const { location } = useLocationStore()
    const { startDate, endDate, setStartDate, setEndDate, updateEndDate, range } = useDatesStore()
    const { error } = useAppStateStore()

    //TODO move this to a general file
    const maxSelectionDays = () => {
        if (range === 'day') {
            return 1
        }
        if (range === 'week') {
            return 7
        }
        if (range === 'range') {
            return 20
        }
        if (range === 'month') {
            return 30
        }
    }

    const clickFunction = () => {
        if (!location) {
            throw new Error('Please select a location')
        }

        return handleCheckWeatherQuery

    }
    return (
        <div>
            <Card className="shadow-none" >
                <CardContent className='flex flex-col gap-4 text-sm shadow-none'>
                    <div className="flex sm:flex-row flex-col gap-4">
                        <div className="flex  flex-row gap-2 w-full">
                            <div className="flex flex-col gap-2 w-full">
                                <Label htmlFor="date" className="px-1">
                                    Date
                                </Label>
                                <div className="relative flex gap-2 ">
                                    <Input
                                        id="date"
                                        value={range !== 'day' ? `${formatDate(startDate)} - ${formatDate(endDate)}` : formatDate(startDate)}
                                        placeholder={formatDate(startDate)}
                                        onClick={() => {
                                            setOpen(true)
                                        }}
                                        className="bg-background pr-10 w-full"
                                        onChange={(e) => {
                                            const date = parseDate(e.target.value)
                                            if (date) {
                                                setStartDate(new Date(date))
                                                // setMonth(date)
                                            }
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === "ArrowDown") {
                                                e.preventDefault()
                                                setOpen(true)
                                            }
                                        }}
                                    />
                                    <Popover open={open} onOpenChange={setOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                id="date-picker"
                                                variant="ghost"
                                                className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                                            >
                                                <CalendarIcon className="size-3.5" />
                                                <span className="sr-only">Select date</span>
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto overflow-hidden p-0" align="end">
                                            <Calendar
                                                mode="range"
                                                min={1}
                                                max={maxSelectionDays()}
                                                selected={{ from: startDate, to: endDate }}
                                                captionLayout="label"
                                                month={startDate}
                                                components={{
                                                    CaptionLabel: ((date) => {
                                                        // console.log({ date })
                                                        return (
                                                            <div className="w-full items-center flex justify-between gap-2">
                                                                <span className="flex-1">{typeof (date?.children) === 'string' && date?.children?.split(' ')[0]}</span>
                                                                <TimePeriod />
                                                            </div>
                                                        )
                                                    })
                                                }}
                                                onSelect={(date) => {
                                                    if (date?.from) {
                                                        setStartDate(new Date(date.from))
                                                        if (range === 'range' && date?.to) {
                                                            setEndDate(new Date(date.to))
                                                        } else {
                                                            updateEndDate()
                                                        }
                                                    }
                                                    // console.log(date)
                                                }}

                                                onMonthChange={(date) => {
                                                    setStartDate(date)
                                                    updateEndDate()
                                                }}

                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                            </div>

                        </div>


                    </div>
                    <WeatherSelector />

                    <div className="text-muted-foreground  px-1 text-sm flex items-center justify-between gap-4 flex-wrap ">
                        {range === 'day' ?
                            (<p>You will check the weather on {" "}
                                <span className="font-medium">{formatDate(startDate).split(',')[0]}</span>.
                            </p>
                            ) :
                            (<p>You will check the weather from {" "}
                                <span className="font-medium">{formatDate(startDate).split(',')[0]} </span>
                                to <span className="font-medium">{formatDate(endDate).split(',')[0]}</span>.
                            </p>
                            )
                        }

                        <Button disabled={dataPending || !location || error !== null} className="ml-auto" onClick={() => clickFunction()}>  {dataPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Check Weather!'}</Button>
                    </div>
                </CardContent>

            </Card >
        </div >
    )
}

const TimePeriod = () => {

    const { range, setRange, updateEndDate } = useDatesStore()
    return (
        < div className="flex flex-col gap-2 z-[2]" >
            {/* <Label>Time period</Label> */}
            <div className="flex gap-2 w-full">
                <Select onValueChange={(value: 'day' | 'week' | 'range' | 'month') => {
                    setRange(value)
                    updateEndDate()
                }} defaultValue="day" value={range} >
                    <SelectTrigger className="w-full" defaultValue={range} >
                        <SelectValue placeholder="Select a time period" />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                        <SelectGroup className="w-full">
                            <SelectItem value="day" className="w-full" >Day</SelectItem>
                            <SelectItem value="week" className="w-full">Week</SelectItem>
                            <SelectItem value="range" className="w-full">Custom Range</SelectItem>
                            <SelectItem value="month" className="w-full">Month</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
        </div >
    )
}

const WeatherSelector = () => {
    const handlFeatureNotAvailable = () => {
        toast('Feature not available yet', {
            duration: 5000,
            dismissible: true,
            action: { label: 'Close', onClick: () => toast.dismiss() }
        })
    }
    return (
        <div className="flex flex-col gap-2 w-full">
            <Label>Weather</Label>
            <div className="flex gap-2 flex-wrap">
                <Toggle variant={'outline'} defaultPressed value="rain" aria-label="Toggle rain" pressed>
                    <CloudRain size={32} /> Rain
                </Toggle>
                <Toggle variant={'outline'} value="temperature" aria-label="Toggle temperature">
                    <ThermometerSun size={32} /> Temperature
                </Toggle>
                <Toggle variant={'outline'} className="cursor-not-allowed opacity-50 text-accent-foreground" value="snow" pressed={false} aria-label="Toggle snow" onClick={handlFeatureNotAvailable}>
                    <Snowflake size={32} /> Snow
                </Toggle>
                <Toggle variant={'outline'} className="cursor-not-allowed opacity-50 text-accent-foreground" value="wind" pressed={false} aria-label="Toggle wind" onClick={handlFeatureNotAvailable}>
                    <Wind size={32} /> Wind
                </Toggle>

            </div>
        </div>
    )
}