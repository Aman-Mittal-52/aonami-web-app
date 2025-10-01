import { Button } from "./button";
import { SunIcon } from "lucide-react";
import { MoonIcon } from "lucide-react";
import { useState } from "react";

export function ModeToggle() {
    const [dark, setDark] = useState(document.body.classList.contains("dark"));

    return (
        <Button variant="ghost" size="icon" onClick={() => {
            document.body.classList.toggle("dark");
            setDark(!dark);
        }}>
            {dark ? <SunIcon /> : <MoonIcon />}
        </Button>
    );
}