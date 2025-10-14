import { Isotype } from "./Isotype"
import { LogoLettering } from "./LogoLettering"

export const Logo = () => {
    return (
        <div className="flex items-center gap-2">
            <Isotype />
            <LogoLettering />
        </div>
    )
}