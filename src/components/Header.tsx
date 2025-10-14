import { Logo } from "./logo/Logo.tsx"

export const Header = () => {
    return (
        <header className="p-4 flex items-center justify-center">
            <Logo />
        </header>
    )
}