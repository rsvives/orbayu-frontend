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
import React from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner";
import { Toggle } from "./ui/toggle";
import { formatDate } from "@/lib/dates";



export const DatesSection = ({ handleCheckWeatherMutation, mutationPending }: { handleCheckWeatherMutation: (date: Date | undefined) => void, mutationPending: boolean }) => {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("December 2026")
    const [date, setDate] = React.useState<Date | undefined>(
        parseDate(value) || undefined
    )
    const [daysRange, setDaysRange] = React.useState("0")
    const [month, setMonth] = React.useState<Date | undefined>(date)

    const handlFeatureNotAvailable = () => {
        toast('Feature not available yet', {
            duration: 5000,
            dismissible: true,
            action: { label: 'Close', onClick: () => toast.dismiss() }
        })
    }



    return (
        // <div className='w-auto z-50 absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-8 rounded-lg'>
        <div>
            <Card >

                <CardContent className='flex flex-col gap-4 text-sm'>
                    <div className="grid sm:flex-row flex-col gap-4">
                        <div className="flex flex-row gap-2 w-full">
                            <div className="flex flex-col gap-2 w-full">
                                <Label htmlFor="date" className="px-1">
                                    Check Date
                                </Label>
                                <div className="relative flex gap-2 ">
                                    <Input
                                        id="date"
                                        value={value}
                                        placeholder="December 2026"
                                        className="bg-background pr-10 w-full"
                                        onChange={(e) => {
                                            setValue(e.target.value)
                                            const date = parseDate(e.target.value)
                                            if (date) {
                                                setDate(date)
                                                setMonth(date)
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
                                                mode="single"
                                                // min={1}
                                                // max={30}
                                                selected={date}
                                                captionLayout="dropdown"
                                                month={month}
                                                toYear={new Date().getFullYear() + 10}
                                                onMonthChange={setMonth}
                                                onSelect={(date) => {
                                                    setDate(date)
                                                    setValue(formatDate(date))
                                                    setOpen(false)
                                                }}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                            </div>
                            <div className="flex flex-col gap-2 w-full">
                                <Label>Time period</Label>
                                <div className="flex gap-2 w-full">
                                    <Select onValueChange={(value) => setDaysRange(value)} defaultValue="0" >
                                        <SelectTrigger className="w-full" defaultValue="0" >
                                            <SelectValue placeholder="Select a time period" />
                                        </SelectTrigger>
                                        <SelectContent className="w-full">
                                            <SelectGroup className="w-full">
                                                {/* <SelectLabel>Fruits</SelectLabel> */}
                                                <SelectItem value="0" className="w-full" >Day</SelectItem>
                                                <SelectItem value="7" className="w-full">Week</SelectItem>
                                                <SelectItem value="30" className="w-full">Month</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label>Weather</Label>
                            {/* <ToggleGroup type="multiple" variant="outline" > */}
                            <div className="flex gap-2 flex-wrap">
                                <Toggle variant={'outline'} defaultPressed value="rain" aria-label="Toggle rain">
                                    <CloudRain size={32} /> Rain
                                </Toggle>
                                <Toggle variant={'outline'} defaultPressed value="temperature" aria-label="Toggle temperature">
                                    <ThermometerSun size={32} /> Temperature
                                </Toggle>
                                <Toggle variant={'outline'} className="cursor-not-allowed opacity-50 text-accent-foreground" value="snow" pressed={false} aria-label="Toggle snow" onClick={handlFeatureNotAvailable}>
                                    <Snowflake size={32} /> Snow
                                </Toggle>
                                <Toggle variant={'outline'} className="cursor-not-allowed opacity-50 text-accent-foreground" value="wind" pressed={false} aria-label="Toggle wind" onClick={handlFeatureNotAvailable}>
                                    <Wind size={32} /> Wind
                                </Toggle>

                            </div>
                            {/* </ToggleGroup> */}
                        </div>

                    </div>

                    <div className="text-muted-foreground  px-1 text-sm flex items-center justify-between gap-4 flex-wrap ">
                        <p>You will check the weather on {" "}
                            <span className="font-medium">{formatDate(date)}</span>.
                            {+daysRange > 0 && ` for ${daysRange} days`}</p>

                        <Button disabled={mutationPending} className="ml-auto" onClick={() => handleCheckWeatherMutation(date)}>  {mutationPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Check Weather!'}</Button>
                    </div>
                </CardContent>

            </Card >
        </div>
    )
}