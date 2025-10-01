"use client"

import { forwardRef, useRef } from "react"
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"
import { DatabaseIcon, FileOutput, Settings, Zap } from "lucide-react";
import { AnimatedBeam } from "../ui/animated-beam";

interface CircleProps {
    className?: string;
    children: ReactNode;
    isMain?: boolean;
}

const Circle = forwardRef<HTMLDivElement, CircleProps>(({ className, children, isMain = false }, ref) => {
    return (
        <div
            ref={ref}
            className={cn(
                "z-10 flex size-12 items-center justify-center rounded-full border-2 bg-background p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
                isMain && "p-0",
                className
            )}
        >
            {children}
        </div>
    )
})

Circle.displayName = "Circle"

export function AnimatedDashboard() {
    const containerRef = useRef<HTMLDivElement>(null)
    const apiRef = useRef<HTMLDivElement>(null)
    const triggerRef = useRef<HTMLDivElement>(null)
    const mainRef = useRef<HTMLDivElement>(null)
    const databaseRef = useRef<HTMLDivElement>(null)
    const outputRef = useRef<HTMLDivElement>(null)

    return (
        <div
            className="relative flex w-full items-center justify-center overflow-hidden border rounded p-5"
            ref={containerRef}
        >
            <div className="flex size-full max-w-lg flex-col items-stretch justify-between gap-10 dark:invert">
                <div className="flex flex-row items-center justify-between">
                    <Circle ref={triggerRef}>
                        <Zap />
                    </Circle>
                </div>
                <div className="flex flex-row items-center justify-between">
                    <Circle ref={databaseRef}>
                        <DatabaseIcon />
                    </Circle>
                    <Circle ref={mainRef} className="size-16" isMain={true}>
                        <img src="/logo/logo.svg" alt="aonami" className="invert dark:invert-0" />
                    </Circle>
                    <Circle ref={outputRef}>
                        <FileOutput />
                    </Circle>
                </div>
                <div className="flex flex-row items-center justify-between">
                    <Circle ref={apiRef}>
                        <Settings className="animate-spin" />
                    </Circle>
                </div>
            </div>

            <AnimatedBeam
                containerRef={containerRef}
                className='z-[5]'
                fromRef={triggerRef}
                toRef={mainRef}
                curvature={-75}
                endYOffset={-10}
            />
            <AnimatedBeam
                className='z-[5]'
                containerRef={containerRef}
                fromRef={databaseRef}
                toRef={mainRef}
                />
            <AnimatedBeam
                className='z-[5]'
                containerRef={containerRef}
                fromRef={apiRef}
                toRef={mainRef}
                curvature={75}
                endYOffset={10}
            />
            <AnimatedBeam
                className='z-[5]'
                containerRef={containerRef}
                fromRef={mainRef}
                toRef={outputRef}
            />
           
        </div>
    )
}
