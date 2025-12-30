"use client"

import { useState, useEffect, useMemo, useRef, useCallback, Suspense } from "react"
import { Card } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import Header from "@/components/bus-schedule/Header"
import LineSelector from "@/components/bus-schedule/LineSelector"
import DirectionSelector from "@/components/bus-schedule/DirectionSelector"
import StopSelector from "@/components/bus-schedule/StopSelector"
import DaySelector from "@/components/bus-schedule/DaySelector"
import Departures from "@/components/bus-schedule/Departures"
import type { BusLine } from "@/lib/types/bus-schedule"
import { loadAllBusLines, type LineId } from "@/lib/bus-data-loader"

const DEFAULT_LINE_COLOR = "bg-[#7c3aed] text-white shadow-md hover:bg-[#7c3aed]"
const DEFAULT_RING_COLOR = "ring-purple-200"

type DayType = "weekday" | "saturday" | "sunday"

async function loadHolidays(): Promise<string[]> {
  try {
    const response = await fetch("/data/config/holidays.json")
    const data = await response.json()
    return data.holidays || []
  } catch {
    return []
  }
}

function isHoliday(date: Date, holidays: string[]) {
  return holidays.includes(date.toISOString().split("T")[0])
}

function getDefaultDayType(holidays: string[]): DayType {
  const today = new Date()
  const dayOfWeek = today.getDay()

  if (isHoliday(today, holidays) || dayOfWeek === 0) return "sunday"
  if (dayOfWeek === 6) return "saturday"
  return "weekday"
}

function BusScheduleContent() {
  const [busData, setBusData] = useState<Record<LineId, BusLine> | null>(null)
  const [holidays, setHolidays] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [selectedLine, setSelectedLine] = useState<LineId>("T1")
  const [selectedDirectionIndex, setSelectedDirectionIndex] = useState(0)
  const [selectedStopIndex, setSelectedStopIndex] = useState(0)
  const [selectedDay, setSelectedDay] = useState<DayType>("weekday")
  const [stopSearch, setStopSearch] = useState("")
  const [isStopDropdownOpen, setIsStopDropdownOpen] = useState(false)

  const [currentTime, setCurrentTime] = useState("")
  const [currentDate, setCurrentDate] = useState("")

  const stopDropdownRef = useRef<HTMLDivElement | null>(null)

  // Load bus data + holidays
  useEffect(() => {
    Promise.all([loadAllBusLines(), loadHolidays()])
      .then(([lines, holidayList]) => {
        setBusData(lines)
        setHolidays(holidayList)
        setSelectedDay(getDefaultDayType(holidayList))
      })
      .finally(() => setIsLoading(false))
  }, [])

  // Reset indices when line changes
  useEffect(() => setSelectedDirectionIndex(0), [selectedLine])
  useEffect(() => setSelectedStopIndex(0), [selectedLine, selectedDirectionIndex])

  // Clamp indices if data changes
  const lineData = busData?.[selectedLine]
  const directionData = lineData?.directions?.[selectedDirectionIndex]
  const stops = directionData?.stops || []
  const selectedStop = stops[selectedStopIndex]

  useEffect(() => {
    if (!busData) return
    if (!busData[selectedLine]) {
      const firstKey = Object.keys(busData)[0] as LineId
      setSelectedLine(firstKey)
    }
  }, [busData, selectedLine])

  useEffect(() => {
    if (selectedDirectionIndex >= (lineData?.directions?.length ?? 0)) {
      setSelectedDirectionIndex(Math.max(0, (lineData?.directions?.length ?? 1) - 1))
    }
  }, [lineData?.directions?.length, selectedDirectionIndex])

  useEffect(() => {
    if (selectedStopIndex >= stops.length) {
      setSelectedStopIndex(Math.max(0, stops.length - 1))
    }
  }, [stops.length, selectedStopIndex])

  // Update clock
  useEffect(() => {
    const update = () => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" })
      )
      setCurrentDate(
        now.toLocaleDateString("pl-PL", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      )
    }
    update()
    const interval = setInterval(update, 60000)
    return () => clearInterval(interval)
  }, [])

  // Filtered stops
  const filteredStops = useMemo(() => {
    if (!stopSearch) return stops
    return stops.filter((s) => s.name.toLowerCase().includes(stopSearch.toLowerCase()))
  }, [stops, stopSearch])

  // Handle outside clicks
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (stopDropdownRef.current && !stopDropdownRef.current.contains(event.target as Node)) {
        setIsStopDropdownOpen(false)
      }
    }
    function handleEsc(event: KeyboardEvent) {
      if (event.key === "Escape") setIsStopDropdownOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("touchstart", handleClickOutside)
    document.addEventListener("keydown", handleEsc)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("touchstart", handleClickOutside)
      document.removeEventListener("keydown", handleEsc)
    }
  }, [])

  const departures = selectedStop?.times[selectedDay] || []

  const dayLabels: Record<DayType, string> = {
    weekday: "Dzień roboczy",
    saturday: "Sobota",
    sunday: "Niedziela i Święta",
  }

  // Next departure index
  const nextDepartureIndex = useMemo(() => {
    if (!currentTime) return -1

    const now = new Date()
    const isHolidayToday = isHoliday(now, holidays)
    let activeDay: DayType = "weekday"
    if (isHolidayToday || now.getDay() === 0) activeDay = "sunday"
    else if (now.getDay() === 6) activeDay = "saturday"
    if (selectedDay !== activeDay) return -1

    const [curHour, curMin] = currentTime.split(":").map(Number)
    const curMinutes = curHour * 60 + curMin

    return departures.findIndex((t) => {
      const [h, m] = t.split(":").map(Number)
      return h * 60 + m >= curMinutes
    })
  }, [currentTime, departures, selectedDay, holidays])

  // Handlers
  const setLine = useCallback((id: LineId) => setSelectedLine(id), [])
  const setDirection = useCallback((i: number) => setSelectedDirectionIndex(i), [])
  const setStop = useCallback((i: number) => setSelectedStopIndex(i), [])
  const setDay = useCallback((d: DayType) => setSelectedDay(d), [])
  const setSearch = useCallback((s: string) => setStopSearch(s), [])
  const toggleDropdown = useCallback((b: boolean) => setIsStopDropdownOpen(b), [])

  if (isLoading || !busData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-slate-600">Ładowanie rozkładu jazdy...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header selectedLine={selectedLine} directionLabel={directionData?.label} currentTime={currentTime} currentDate={currentDate} />

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <LineSelector busData={busData} selectedLine={selectedLine} setSelectedLine={setLine} defaultLineClass={DEFAULT_LINE_COLOR} />

        <Card className="p-4 bg-white shadow-sm">
          <h2 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide flex items-center gap-2">
            <ArrowRight className="w-4 h-4" />
            Wybierz kierunek
          </h2>
          <DirectionSelector lineData={lineData} selectedDirectionIndex={selectedDirectionIndex} setSelectedDirectionIndex={setDirection} defaultLineClass={DEFAULT_LINE_COLOR} />
        </Card>

        <StopSelector
          stops={stops}
          selectedStopIndex={selectedStopIndex}
          setSelectedStopIndex={setStop}
          stopSearch={stopSearch}
          setStopSearch={setSearch}
          isStopDropdownOpen={isStopDropdownOpen}
          setIsStopDropdownOpen={toggleDropdown}
          stopDropdownWrapperRef={stopDropdownRef}
        />

        <DaySelector selectedDay={selectedDay} setSelectedDay={setDay} defaultLineClass={DEFAULT_LINE_COLOR} />

        <Departures
          selectedStop={selectedStop}
          currentTime={currentTime}
          departures={departures}
          nextDepartureIndex={nextDepartureIndex}
          dayLabel={dayLabels[selectedDay]}
          defaultLineClass={DEFAULT_LINE_COLOR}
          defaultRingClass={DEFAULT_RING_COLOR}
        />
      </main>

      <footer className="max-w-5xl mx-auto px-4 py-8 text-center text-sm text-slate-500 space-y-2">
        <p>
          Nieoficjalna strona z rozkładem jazdy autobusów T1-T5 •{' '}
          <a href="https://facebook.com/ZgorskaGrupaTechniczna" target="_blank" rel="noopener noreferrer" className="inline-block">
            <span className="bg-slate-100 text-blue-600 hover:underline px-2 py-0.5 rounded font-mono text-sm">Zagórze 2026</span>
          </a>
        </p>
        <p>
          Sugestie / błędy:{' '}
          <a
            href={`mailto:${['niepojade', '@', 'proton.me'].join('')}`}
            className="underline"
          >
            {'niepojade' + '@' + 'proton.me'}
          </a>
        </p>
      </footer>
    </div>
  )
}

export default function BusSchedulePage() {
  return (
    <Suspense fallback={null}>
      <BusScheduleContent />
    </Suspense>
  )
}
