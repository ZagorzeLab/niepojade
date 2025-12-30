import React from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"

type DayType = "weekday" | "saturday" | "sunday"

type Props = {
    selectedDay: DayType
    setSelectedDay: (d: DayType) => void
    defaultLineClass: string
}

function DaySelector({ selectedDay, setSelectedDay, defaultLineClass }: Props) {
    return (
        <Card className="p-4 bg-white shadow-sm">
            <h2 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Wybierz dzień
            </h2>
            <div className="flex flex-wrap gap-2">
                <Button
                    onClick={() => setSelectedDay("weekday")}
                    variant={selectedDay === "weekday" ? "default" : "ghost"}
                    className={`text-base font-semibold h-12 flex-1 min-w-0 ${selectedDay === "weekday" ? defaultLineClass : "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 border-slate-300"}`}
                >
                    Roboczy
                </Button>

                <Button
                    onClick={() => setSelectedDay("saturday")}
                    variant={selectedDay === "saturday" ? "default" : "ghost"}
                    className={`text-base font-semibold h-12 flex-1 min-w-0 ${selectedDay === "saturday" ? defaultLineClass : "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 border-slate-300"}`}
                >
                    Sobota
                </Button>

                <Button
                    onClick={() => setSelectedDay("sunday")}
                    variant={selectedDay === "sunday" ? "default" : "ghost"}
                    className={`text-base font-semibold h-12 flex-1 min-w-0 ${selectedDay === "sunday" ? defaultLineClass : "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 border-slate-300"}`}
                >
                    Niedziela
                </Button>
            </div>
        </Card>
    )
}

export default React.memo(DaySelector)