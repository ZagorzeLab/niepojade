"use client"

import React, { useEffect, useRef, useState, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { MapPin, Search, Star } from "lucide-react"
import { useDropdown } from "@/hooks/useDropdown"

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
    isFavorite?: boolean
    onToggleFavorite?: () => void
}

function StopSelectorInner({
    stops,
    selectedStopIndex,
    setSelectedStopIndex,
    stopSearch,
    setStopSearch,
    isFavorite = false,
    onToggleFavorite,
}: Props) {
    // 🔥 dropdown hook
    const {
        isOpen: isStopDropdownOpen,
        toggle: toggleDropdown,
        close: closeDropdown,
        ref: stopDropdownRef,
    } = useDropdown()

    const stopIdToIndex = useMemo(() => {
        const map = new Map<string, number>()
        stops.forEach((s, i) => map.set(s.id, i))
        return map
    }, [stops])

    // 🔥 debounce search
    const [rawSearch, setRawSearch] = useState("")

    useEffect(() => {
        const t = setTimeout(() => setStopSearch(rawSearch), 150)
        return () => clearTimeout(t)
    }, [rawSearch, setStopSearch])

    // 🔥 memo filter
    const filteredStops = useMemo(() => {
        if (!stopSearch) return stops
        return stops.filter((s) =>
            s.name.toLowerCase().includes(stopSearch.toLowerCase())
        )
    }, [stops, stopSearch])

    const searchInputRef = useRef<HTMLInputElement | null>(null)
    const toggleButtonRef = useRef<HTMLButtonElement | null>(null)
    const itemsRef = useRef<Array<HTMLButtonElement | null>>([])
    const [activeIndex, setActiveIndex] = useState<number>(-1)

    // focus fix
    useEffect(() => {
        if (isStopDropdownOpen) {
            requestAnimationFrame(() => {
                searchInputRef.current?.focus()
            })
            setActiveIndex(-1)
        } else {
            toggleButtonRef.current?.focus()
            setActiveIndex(-1)
        }
    }, [isStopDropdownOpen])

    useEffect(() => {
        setActiveIndex(-1)
        itemsRef.current = []
    }, [stopSearch])

    return (
        <Card className="p-4 bg-white shadow-sm">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Wybierz przystanek
                </h2>

                {onToggleFavorite && stops[selectedStopIndex] && (
                    <button
                        onClick={onToggleFavorite}
                        aria-label={isFavorite ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
                        className={`p-2 rounded-lg transition-all duration-200 active:scale-95 ${isFavorite
                            ? "bg-amber-50 dark:bg-amber-900/30 text-amber-500"
                            : "bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 hover:text-amber-500 dark:hover:text-amber-400"
                            }`}
                    >
                        <Star className={`w-5 h-5 ${isFavorite ? "fill-amber-400" : ""}`} />
                    </button>
                )}
            </div>

            {/* 🔥 wrapper z refem */}
            <div
                ref={stopDropdownRef}
                className="relative"
                onKeyDown={(e) => {
                    if (!isStopDropdownOpen) return

                    if (e.key === "ArrowDown") {
                        e.preventDefault()
                        const next =
                            activeIndex < filteredStops.length - 1 ? activeIndex + 1 : 0
                        setActiveIndex(next)
                        itemsRef.current[next]?.focus()
                    } else if (e.key === "ArrowUp") {
                        e.preventDefault()
                        const prev =
                            activeIndex > 0 ? activeIndex - 1 : filteredStops.length - 1
                        setActiveIndex(prev)
                        itemsRef.current[prev]?.focus()
                    } else if (e.key === "Enter") {
                        if (activeIndex >= 0) {
                            const targetStop = filteredStops[activeIndex]
                            const realIndex = stopIdToIndex.get(targetStop.id)
                            if (realIndex !== undefined) {
                                setSelectedStopIndex(realIndex)
                                closeDropdown()
                                setStopSearch("")
                                setRawSearch("")
                            }
                        }
                    } else if (e.key === "Escape") {
                        closeDropdown()
                    }
                }}
            >
                {/* button */}
                <button
                    ref={toggleButtonRef}
                    aria-expanded={isStopDropdownOpen}
                    onClick={toggleDropdown}
                    className="w-full px-4 py-4 bg-slate-50 hover:bg-slate-100 rounded-lg text-left flex items-center justify-between transition-colors border-2 border-slate-200 hover:border-slate-300"
                >
                    <span className="text-base font-medium text-slate-900">
                        {stops[selectedStopIndex]?.name || "Wybierz przystanek"}
                    </span>
                    <svg
                        className={`w-5 h-5 text-slate-500 transition-transform ${isStopDropdownOpen ? "rotate-180" : ""
                            }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </button>

                {/* dropdown */}
                {isStopDropdownOpen && (
                    <div className="absolute z-50 w-full mt-0 bg-white rounded-lg shadow-xl border border-slate-200 max-h-[400px] overflow-hidden">
                        <div className="p-3 border-b border-slate-200 sticky top-0 bg-white">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    placeholder="Szukaj przystanku..."
                                    value={rawSearch}
                                    onChange={(e) => setRawSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="overflow-y-auto max-h-[320px]">
                            {filteredStops.length > 0 ? (
                                filteredStops.map((stop, idx) => {
                                    const stopIndex = stopIdToIndex.get(stop.id) ?? -1

                                    return (
                                        <button
                                            key={stop.id}
                                            ref={(el) => {
                                                itemsRef.current[idx] = el
                                            }}
                                            onClick={() => {
                                                setSelectedStopIndex(stopIndex)
                                                closeDropdown()
                                                setStopSearch("")
                                                setRawSearch("")
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" || e.key === " ") {
                                                    e.preventDefault()
                                                    setSelectedStopIndex(stopIndex)
                                                    closeDropdown()
                                                    setStopSearch("")
                                                    setRawSearch("")
                                                }
                                            }}
                                            className={`w-full text-left px-4 py-3 transition-colors ${selectedStopIndex === stopIndex
                                                ? "bg-blue-50 text-blue-900 font-semibold"
                                                : "text-slate-700 hover:bg-slate-50"
                                                }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-slate-400" />
                                                <span className="text-base">{stop.name}</span>
                                            </div>
                                        </button>
                                    )
                                })
                            ) : (
                                <div className="px-4 py-8 text-center text-slate-500">
                                    <p className="text-sm">Nie znaleziono przystanku</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-3 text-xs text-slate-500 flex items-center gap-1">
                <Search className="w-3 h-3" />
                <span>Liczba przystanków na tej trasie: {stops.length}</span>
            </div>
        </Card>
    )
}

const StopSelector = React.memo(StopSelectorInner)
export default StopSelector