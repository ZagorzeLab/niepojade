import React, { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { MapPin, Search } from "lucide-react"

type Stop = {
    id: string
    name: string
    times?: Record<string, string[]>
}

type Props = {
    stops: Stop[]
    selectedStopIndex: number
    setSelectedStopIndex: (i: number) => void
    stopSearch: string
    setStopSearch: (s: string) => void
    isStopDropdownOpen: boolean
    setIsStopDropdownOpen: (b: boolean) => void
    stopDropdownWrapperRef: React.RefObject<HTMLDivElement | null>
}

export default function StopSelector({ stops, selectedStopIndex, setSelectedStopIndex, stopSearch, setStopSearch, isStopDropdownOpen, setIsStopDropdownOpen, stopDropdownWrapperRef }: Props) {
    const filteredStops = stopSearch ? stops.filter((s) => s.name.toLowerCase().includes(stopSearch.toLowerCase())) : stops
    const searchInputRef = useRef<HTMLInputElement | null>(null)
    const toggleButtonRef = useRef<HTMLButtonElement | null>(null)
    const itemsRef = useRef<Array<HTMLButtonElement | null>>([])
    const [activeIndex, setActiveIndex] = useState<number>(-1)
    const dropdownId = "stop-dropdown"

    useEffect(() => {
        if (isStopDropdownOpen) {
            // focus search input when opening
            setTimeout(() => searchInputRef.current?.focus(), 0)
            setActiveIndex(-1)
        } else {
            // restore focus to toggle when closing
            toggleButtonRef.current?.focus()
            setActiveIndex(-1)
        }
    }, [isStopDropdownOpen])

    useEffect(() => {
        // reset active index when filtered list changes
        setActiveIndex(-1)
        itemsRef.current = []
    }, [stopSearch])

    return (
        <Card className="p-4 bg-white shadow-sm">
            <h2 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Wybierz przystanek
            </h2>

            <div className="relative" onKeyDown={(e) => {
                if (!isStopDropdownOpen) return
                if (e.key === "ArrowDown") {
                    e.preventDefault()
                    const next = activeIndex < filteredStops.length - 1 ? activeIndex + 1 : 0
                    setActiveIndex(next)
                    itemsRef.current[next]?.focus()
                } else if (e.key === "ArrowUp") {
                    e.preventDefault()
                    const prev = activeIndex > 0 ? activeIndex - 1 : filteredStops.length - 1
                    setActiveIndex(prev)
                    itemsRef.current[prev]?.focus()
                } else if (e.key === "Enter") {
                    if (activeIndex >= 0) {
                        const targetStop = filteredStops[activeIndex]
                        const realIndex = stops.findIndex((s) => s.id === targetStop.id)
                        if (realIndex >= 0) {
                            setSelectedStopIndex(realIndex)
                            setIsStopDropdownOpen(false)
                            setStopSearch("")
                        }
                    }
                } else if (e.key === "Escape") {
                    setIsStopDropdownOpen(false)
                }
            }}>
                <button
                    ref={toggleButtonRef}
                    aria-expanded={isStopDropdownOpen}
                    aria-controls={dropdownId}
                    onClick={() => setIsStopDropdownOpen(!isStopDropdownOpen)}
                    className="w-full px-4 py-4 bg-slate-50 hover:bg-slate-100 rounded-lg text-left flex items-center justify-between transition-colors border-2 border-slate-200 hover:border-slate-300"
                >
                    <span className="text-base font-medium text-slate-900">{stops[selectedStopIndex]?.name || "Wybierz przystanek"}</span>
                    <svg className={`w-5 h-5 text-slate-500 transition-transform ${isStopDropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                <div id={dropdownId} ref={stopDropdownWrapperRef} role="listbox" aria-hidden={!isStopDropdownOpen} className={`absolute z-50 w-full mt-0 bg-white rounded-lg shadow-xl border border-slate-200 max-h-[400px] overflow-hidden transition-all duration-300 origin-top dropdown-panel ${isStopDropdownOpen ? "open" : "closed"}`}>
                    <div className="p-3 border-b border-slate-200 sticky top-0 bg-white">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input ref={searchInputRef} type="text" placeholder="Szukaj przystanku..." value={stopSearch} onChange={(e) => setStopSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                        </div>
                    </div>

                    <div className="overflow-y-auto max-h-[320px]">
                        {filteredStops.length > 0 ? (
                            filteredStops.map((stop) => {
                                const stopIndex = stops.findIndex((s) => s.id === stop.id)
                                const idx = filteredStops.indexOf(stop)
                                return (
                                    <button
                                        key={stop.id}
                                        ref={(el) => { itemsRef.current[idx] = el }}
                                        role="option"
                                        aria-selected={selectedStopIndex === stopIndex}
                                        onClick={() => { setSelectedStopIndex(stopIndex); setIsStopDropdownOpen(false); setStopSearch("") }}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" || e.key === " ") {
                                                e.preventDefault()
                                                setSelectedStopIndex(stopIndex)
                                                setIsStopDropdownOpen(false)
                                                setStopSearch("")
                                            }
                                        }}
                                        className={`w-full text-left px-4 py-3 transition-colors ${selectedStopIndex === stopIndex ? "bg-blue-50 text-blue-900 font-semibold" : "text-slate-700 hover:bg-slate-50"}`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <MapPin className={`w-4 h-4 ${selectedStopIndex === stopIndex ? "text-blue-600" : "text-slate-400"}`} />
                                            <span className="text-base">{stop.name}</span>
                                        </div>
                                    </button>
                                )
                            })
                        ) : (
                            <div className="px-4 py-8 text-center text-slate-500"><p className="text-sm">Nie znaleziono przystanku</p></div>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-3 text-xs text-slate-500 flex items-center gap-1">
                <Search className="w-3 h-3" />
                <span>Liczba przystanków na tej trasie: {stops.length}</span>
            </div>
        </Card>
    )
}
