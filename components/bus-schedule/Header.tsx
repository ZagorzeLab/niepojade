import React from "react"
import { Clock } from "lucide-react"

type Props = {
    selectedLine: string
    directionLabel?: string
    currentTime: string
    currentDate: string
}

function Header({ selectedLine, directionLabel, currentTime, currentDate }: Props) {
    return (
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm sticky top-0 z-50">
            <div className="max-w-5xl mx-auto px-4 py-3">
                <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                        <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2.5 rounded-xl shadow-md">
                            <img src="/images/niepolomice-logo.png" alt="Niepołomice" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
                        </div>
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="flex-shrink-0">
                                <div className="bg-gradient-to-br from-purple-600 to-purple-700 text-white px-2.5 py-1 rounded-lg shadow-md">
                                    <span className="text-lg font-bold tracking-tight">{selectedLine}</span>
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-slate-900 font-semibold text-base sm:text-lg truncate">
                                    {directionLabel || "Niepołomice - Wieliczka"}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 text-slate-600 text-sm">
                            <div className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4" />
                                <span className="font-semibold">{currentTime}</span>
                            </div>
                            <span className="text-slate-400">•</span>
                            <span className="capitalize">{currentDate}</span>
                        </div>
                    </div>

                    <div className="flex-shrink-0 hidden sm:flex items-center">
                        <img src="/images/niepojade-logo.png" alt="Niepojade" className="h-24 w-auto object-contain" />
                    </div>
                </div>
            </div>
        </header>
    )
}

export default React.memo(Header)
