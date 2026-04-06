"use client"

import React from "react"
import { Star } from "lucide-react"
import type { FavoriteStop } from "@/hooks/useFavorites"

interface FavoritesBarProps {
    favorites: FavoriteStop[]
    onSelect: (fav: FavoriteStop) => void
    activeStopId?: string
    activeLineId?: string
}

// 🔥 split: pierwsze słowo + reszta
function splitStopName(name: string) {
    const parts = name.split(" ")

    if (parts.length <= 2) {
        return { first: name, second: "" }
    }

    return {
        first: parts.slice(0, 2).join(" "),
        second: parts.slice(2).join(" "),
    }
}

function FavoritesBarInner({
    favorites,
    onSelect,
    activeStopId,
    activeLineId,
}: FavoritesBarProps) {
    if (favorites.length === 0) return null

    return (
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-4">
            {favorites.map((fav) => {
                const isActive =
                    fav.stopId === activeStopId &&
                    fav.lineId === activeLineId

                const { first, second } = splitStopName(fav.stopName)

                return (
                    <button
                        key={`${fav.lineId}-${fav.stopId}`}
                        onClick={() => onSelect(fav)}
                        className={`flex-shrink-0 flex items-center justify-between gap-1.5 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-[150px]
              ${isActive
                                ? "bg-[#7c3aed] text-white shadow-md"
                                : "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                            }`}
                    >
                        {/* ⭐ */}
                        <Star className="w-3.5 h-3.5 flex-shrink-0 text-amber-400 fill-amber-400" />

                        {/* 🧠 ŚRODEK */}
                        <div className="flex flex-col items-center text-center leading-tight flex-1 mx-1">
                            <span className={`text-sm font-medium ${isActive ? "text-white" : ""
                                }`}>
                                {first}
                            </span>

                            {second && (
                                <span className={`text-[11px] ${isActive ? "text-white/80" : "text-slate-500"
                                    }`}>
                                    {second}
                                </span>
                            )}
                        </div>

                        {/* 🔵 LINIA */}
                        <span
                            className={`text-[9px] font-bold px-1 py-[2px] rounded flex-shrink-0 ${isActive
                                    ? "bg-white text-[#7c3aed]"
                                    : "bg-purple-600 text-white"
                                }`}
                        >
                            {fav.lineId}
                        </span>
                    </button>
                )
            })}
        </div>
    )
}

export const FavoritesBar = React.memo(FavoritesBarInner)