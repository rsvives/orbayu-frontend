
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
import React from "react"
import { Loader2 } from "lucide-react"
import { Skeleton } from "./ui/skeleton"

export const DrawerDialog = ({ open, setOpen }: { open: boolean, setOpen: (open: boolean) => void }) => {

    const loadingTexts = ["Gathering some information...", "Talking to the experts...", "Processing data...", "Analyzing data...", "Generating report..."]
    const [loadingText, setLoadingText] = React.useState(loadingTexts[0])
    const isDesktop = useMediaQuery("(min-width: 768px)")

    React.useEffect(() => {
        const interval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * loadingTexts.length)
            setLoadingText(loadingTexts[randomIndex])
        }, 2000)
        return () => clearInterval(interval)
        // eslint-disable-next-line 
    }, [])
    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen} modal={true} >
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Weather prediction</DialogTitle >
                        <DialogDescription className="flex items-center justify-center gap-2 py-3">
                            <Loader2 className="h-4 w-4 animate-spin" />   <p className="text-sm text-center animate-pulse"> {loadingText}</p>
                        </DialogDescription>
                    </DialogHeader>
                    <Skeleton className="h-48" />
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
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerContent className="p-8 pt-0">
                <DrawerHeader className="text-left">
                    <DrawerTitle>Weather prediction</DrawerTitle>
                    <DrawerDescription className="flex items-center justify-center gap-2 py-3">
                        <Loader2 className="h-4 w-4 animate-spin" /> <p className="text-sm text-center animate-pulse"> {loadingText}</p>
                    </DrawerDescription>
                </DrawerHeader>
                <Skeleton className="h-48" />
                <DrawerFooter className="p-0 mt-4">
                    <DrawerClose asChild>
                        <Button variant="outline" className="w-full">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}