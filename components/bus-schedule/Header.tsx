"use client"

import React, { useMemo } from "react"
import { Clock } from "lucide-react"

interface HeaderProps {
  currentTime: Date
}

function Header({ currentTime }: HeaderProps) {
  const formattedTime = useMemo(() => {
    return currentTime.toLocaleTimeString("pl-PL", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }, [currentTime])

  const formattedDate = useMemo(() => {
    return currentTime.toLocaleDateString("pl-PL", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }, [currentTime])

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          {/* LEFT: City logo */}
          <div className="flex-shrink-0">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2.5 rounded-xl shadow-md">
              <img
                src="/images/niepolomice-logo.png"
                alt="Niepołomice"
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
              />
            </div>
          </div>

          {/* CENTER: App title */}
          <div className="flex-1 min-w-0 flex flex-col">
            <div className="text-slate-900 font-bold text-base sm:text-lg leading-tight">
              NIEPOjade.pl
            </div>

            {/* Last update info */}
            <div className="text-slate-400 text-xs sm:text-sm mt-0.5">
              Ostatnia aktualizacja rozkładów: 6 kwietnia 2026
            </div>

            {/* Current time & date */}
            <div className="flex items-center gap-3 text-slate-600 text-xs sm:text-sm mt-1">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span className="font-semibold tabular-nums">
                  {formattedTime}
                </span>
              </div>
              <span className="text-slate-400">•</span>
              <span className="capitalize">{formattedDate}</span>
            </div>
          </div>

          {/* RIGHT: App logo */}
          <div className="flex-shrink-0 hidden sm:flex items-center">
            <img
              src="/images/niepojade-logo.png"
              alt="Niepojade"
              className="h-20 w-auto object-contain"
            />
          </div>
        </div>
      </div>
    </header>
  )
}

export default React.memo(Header)
