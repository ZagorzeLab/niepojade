import React from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type Props = {
    selectedStop?: { name: string }
    departures: string[]
    nextDepartureIndex: number
    dayLabel: string
    defaultLineClass: string
    defaultRingClass: string
}

function Departures({
    selectedStop,
    departures,
    nextDepartureIndex,
    dayLabel,
    defaultLineClass,
    defaultRingClass,
}: Props) {
    return (
        <Card className="p-6 bg-white shadow-md">
            {selectedStop && (
                <header className="mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">
                        {selectedStop.name}
                    </h2>
                    <div className="text-sm text-slate-600">
                        Odjazdy dla: {dayLabel}
                    </div>
                </header>
            )}

            {departures.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                    {departures.map((time, index) => {
                        const isNext = index === nextDepartureIndex
                        const isPast = index < nextDepartureIndex

                        return (
                            <div key={index} className="relative">
                                {/* BADGE NAD KAFELKIEM – SMUKŁY */}
                                {isNext && (
                                    <Badge
                                        variant="default"
                                        className="absolute -top-2 left-1/2 -translate-x-1/2
                               text-[10px] leading-none px-1.5 py-0.5
                               font-medium"
                                    >
                                        Następny
                                    </Badge>
                                )}

                                {/* KAFELEK */}
                                <div
                                    className={`flex items-center justify-center rounded-lg px-4 py-3
                    text-lg font-semibold transition-all
                    ${isNext
                                            ? `ring-4 ring-offset-2 ${defaultRingClass} bg-slate-100 text-slate-900`
                                            : isPast
                                                ? "bg-slate-200 text-slate-400 opacity-50"
                                                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                        }`}
                                >
                                    <div className="text-2xl tabular-nums">{time}</div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <p className="text-slate-500 text-center py-8">
                    Brak odjazdów w wybranym dniu
                </p>
            )}
        </Card>
    )
}

export default React.memo(Departures)
