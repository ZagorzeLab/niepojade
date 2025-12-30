import React from "react"
import { Button } from "@/components/ui/button"
import type { BusLine } from "@/lib/types/bus-schedule"

type Props = {
    lineData?: BusLine
    selectedDirectionIndex: number
    setSelectedDirectionIndex: (i: number) => void
    defaultLineClass: string
}

function DirectionSelector({ lineData, selectedDirectionIndex, setSelectedDirectionIndex, defaultLineClass }: Props) {
    return (
        <div className="flex flex-col gap-2">
            {lineData?.directions.map((direction, index) => (
                <Button
                    key={direction.id}
                    onClick={() => setSelectedDirectionIndex(index)}
                    variant={selectedDirectionIndex === index ? "default" : "ghost"}
                    className={`text-base font-medium h-14 justify-start ${selectedDirectionIndex === index ? `${defaultLineClass}` : "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 border-slate-300"}`}
                >
                    <span className="truncate">{direction.label}</span>
                </Button>
            ))}
        </div>
    )
}

export default React.memo(DirectionSelector)
