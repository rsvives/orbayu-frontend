
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"
import { Loader2 } from "lucide-react"
import { Skeleton } from "./ui/skeleton"
import { useEffect, useState } from "react"
import { ChartsSection } from "./charts/ChartsSection"



export const DrawerDialog = ({ open, setOpen, data, fetchingData }: { open: boolean, setOpen: (open: boolean) => void, data: BasicWeatherData | null, fetchingData: boolean }) => {


    const loadingTexts = [
        "Summoning the weather gods...",
        "Convincing the meteorological council...",
        "Crunching some serious numbers...",
        "Channeling the spirits of forecasting...",
        "Weaving a tapestry of data...",
    ]
    const [loadingText, setLoadingText] = useState(loadingTexts[0])
    const isDesktop = useMediaQuery("(min-width: 768px)")

    useEffect(() => {
        const interval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * loadingTexts.length)
            setLoadingText(loadingTexts[randomIndex])
        }, 2500)
        return () => clearInterval(interval)
    }, [])

    if (isDesktop) {
        return (
            <div className="flex flex-1 w-full">
                <Dialog open={open} onOpenChange={setOpen} >
                    <DialogContent className="w-[100%] min-w-[720px] max-w-[800px]" aria-label="Weather prediction">
                        <DialogHeader>
                            <DialogTitle>Weather prediction</DialogTitle >
                            <DialogDescription className=" py-3" aria-describedby="weather data">
                            </DialogDescription>
                            {
                                // TODO get data from store/ or use the mutation
                                data === null || fetchingData ? (
                                    <Skeleton className="h-64 w-full flex flex-col items-center justify-center gap-4" >
                                        <Loader2 className="h-8 w-8 animate-spin" />   <span className="text-sm text-center animate-pulse"> {loadingText}</span>
                                    </Skeleton>) : (<ChartsSection />)
                            }
                        </DialogHeader>

                        <DialogFooter>
                            <DialogClose asChild onClick={() => setOpen(false)}>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>

                </Dialog>
            </div>
        )
    }
    return (

        < Drawer open={open} onOpenChange={setOpen}  >
            <DrawerContent className="p-4 pt-0 h-[90%]" aria-describedby="weather data">
                <DrawerHeader className="w-full pb-1">
                    <DrawerTitle className="pb-1">Weather prediction</DrawerTitle>
                    {/* <DrawerDescription className="py-3">
                    </DrawerDescription> */}
                    {
                        data === null ? (
                            <Skeleton className="h-64 w-full flex flex-col items-center justify-center gap-4" >
                                <Loader2 className="h-8 w-8 animate-spin" />   <span className="text-sm text-center animate-pulse"> {loadingText}</span>
                            </Skeleton>) : (<ChartsSection />)
                    }
                </DrawerHeader>
                <DrawerFooter >
                    <DrawerClose asChild>
                        <Button variant="outline" className="w-full">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer >
    )
}

