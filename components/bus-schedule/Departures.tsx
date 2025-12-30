import React from "react"
import { Card } from "@/components/ui/card"
import { Clock } from "lucide-react"

type Props = {
    selectedStop?: { name: string }
    currentTime: string
    departures: string[]
    nextDepartureIndex: number
    dayLabel: string
    defaultLineClass: string
    defaultRingClass: string
}

function Departures({ selectedStop, currentTime, departures, nextDepartureIndex, dayLabel, defaultLineClass, defaultRingClass }: Props) {
    return (
        <Card className="p-6 bg-white shadow-md">
            {selectedStop && (
                <header className="mb-6 p-4 bg-slate-50 rounded-lg shadow-inner">
                    {/* Nazwa przystanku */}
                    <h2 className="text-2xl font-bold text-slate-900 mb-3">{selectedStop.name}</h2>

                    {/* Jedna linia: godzina + dzień w stonowanych pigułkach */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="inline-flex items-center px-3 py-1 bg-slate-200 text-slate-800 text-sm font-semibold rounded-full">
                            Teraz jest: {currentTime}
                        </span>
                        <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">
                            Odjazdy dla: {dayLabel}
                        </span>
                    </div>
                </header>
            )}

            {departures.length > 0 ? (
                <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                        {departures.map((time, index) => (
                            <div
                                key={index}
                                className={`inline-flex items-center justify-center px-4 py-3 rounded-full text-lg font-semibold transition-all ${index === nextDepartureIndex
                                    ? `${defaultLineClass} ring-4 ring-offset-2 ${defaultRingClass} scale-110`
                                    : index < nextDepartureIndex
                                        ? "bg-slate-200 text-slate-400 line-through"
                                        : "bg-slate-100 text-slate-700"
                                    }`}
                            >
                                {time}
                            </div>
                        ))}
                    </div>
                    {nextDepartureIndex !== -1 && (
                        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm font-semibold text-blue-900 mb-1">Następny odjazd</p>
                            <p className="text-3xl font-bold text-blue-600">{departures[nextDepartureIndex]}</p>
                        </div>
                    )}
                </div>
            ) : (
                <p className="text-slate-500 text-center py-8">Brak odjazdów w wybranym dniu</p>
            )}
        </Card>
    )
}

export default React.memo(Departures)
