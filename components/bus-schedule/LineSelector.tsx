import React from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bus } from "lucide-react"
import type { BusLine } from "@/lib/types/bus-schedule"
import type { LineId } from "@/lib/bus-data-loader"

type Props = {
    busData?: Record<LineId, BusLine> | null
    selectedLine: LineId
    setSelectedLine: (id: LineId) => void
    defaultLineClass: string
}

function LineSelector({ busData, selectedLine, setSelectedLine, defaultLineClass }: Props) {
    return (
        <Card className="p-4 bg-white shadow-sm">
            <h2 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide flex items-center gap-2">
                <Bus className="w-4 h-4" />
                Wybierz linię
            </h2>
            <div className="flex flex-wrap gap-2">
                {Object.keys(busData || {}).map((lineId) => (
                    <Button
                        key={lineId}
                        onClick={() => setSelectedLine(lineId as LineId)}
                        variant={selectedLine === lineId ? "default" : "ghost"}
                        className={`text-base font-semibold min-w-[80px] h-12 ${selectedLine === lineId ? defaultLineClass : "bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200 hover:text-slate-900"}`}
                    >
                        {lineId}
                    </Button>
                ))}
            </div>
        </Card>
    )
}

export default React.memo(LineSelector)
