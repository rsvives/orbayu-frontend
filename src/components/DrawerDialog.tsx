
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
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"
import { Loader2 } from "lucide-react"
import { Skeleton } from "./ui/skeleton"
import { useEffect, useState } from "react"

export const DrawerDialog = ({ open, setOpen, data }: { open: boolean, setOpen: (open: boolean) => void, data: any }) => {
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
            <Dialog open={open} onOpenChange={setOpen} modal={true} >
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Weather prediction</DialogTitle >
                        <DialogDescription className=" py-3">
                        </DialogDescription>
                        {
                            data === null ? (
                                <Skeleton className="h-64 w-full flex flex-col items-center justify-center gap-4" >
                                    <Loader2 className="h-8 w-8 animate-spin" />   <span className="text-sm text-center animate-pulse"> {loadingText}</span>
                                </Skeleton>) : (<p>{JSON.stringify(data)}</p>)
                        }
                    </DialogHeader>

                    <DialogFooter>
                        <DialogClose asChild onClick={() => setOpen(false)}>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )
    }
    return (

        < Drawer open={open} onOpenChange={setOpen} >
            <DrawerContent className="p-4 pt-0">
                <DrawerHeader className="w-full">
                    <DrawerTitle>Weather prediction</DrawerTitle>
                    <DrawerDescription className="py-3">
                    </DrawerDescription>
                    {
                        data === null ? (
                            <Skeleton className="h-64 w-full flex flex-col items-center justify-center gap-4" >
                                <Loader2 className="h-8 w-8 animate-spin" />   <span className="text-sm text-center animate-pulse"> {loadingText}</span>
                            </Skeleton>) : (<p>{JSON.stringify(data)}</p>)
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