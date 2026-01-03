"use client"

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react"

import { Card } from "@/components/ui/card"
import LineSelector from "@/components/bus-schedule/LineSelector"
import DirectionSelector from "@/components/bus-schedule/DirectionSelector"
import StopSelector from "@/components/bus-schedule/StopSelector"
import DaySelector from "@/components/bus-schedule/DaySelector"
import Departures from "@/components/bus-schedule/Departures"

import { ArrowRight } from "lucide-react"

import type { BusLine } from "@/lib/types/bus-schedule"
import type { LineId } from "@/lib/bus-data-loader"

const DEFAULT_LINE_COLOR = "bg-[#7c3aed] text-white shadow-md hover:bg-[#7c3aed]"
const DEFAULT_RING_COLOR = "ring-purple-200"

type DayType = "weekday" | "saturday" | "sunday"

const dayLabels: Record<DayType, string> = {
  weekday: "Dzień roboczy",
  saturday: "Sobota",
  sunday: "Niedziela i Święta",
}

interface TimetableViewProps {
  busData: Record<LineId, BusLine>
  holidays: Set<string>
  currentTime: Date
  selectedFromMap?: { stopId: string; lineId: string } | null
}

function TimetableViewComponent({
  busData,
  holidays,
  currentTime,
  selectedFromMap,
}: TimetableViewProps) {
  /* ============================= */
  /* ===== INITIAL STATE ========= */
  /* ============================= */
  const lineIds = useMemo(() => Object.keys(busData) as LineId[], [busData])

  const [selectedLine, setSelectedLine] = useState<LineId>(lineIds[0])
  const [selectedDirectionIndex, setSelectedDirectionIndex] = useState(0)
  const [selectedStopIndex, setSelectedStopIndex] = useState(0)
  const [selectedDay, setSelectedDay] = useState<DayType | null>(null)

  const [stopSearch, setStopSearch] = useState("")
  const [isStopDropdownOpen, setIsStopDropdownOpen] = useState(false)
  const stopDropdownRef = useRef<HTMLDivElement | null>(null)

  /* ============================= */
  /* ===== DERIVED DATA ========= */
  /* ============================= */
  const lineData = busData[selectedLine]
  const directions = lineData?.directions || []
  const directionData = directions[selectedDirectionIndex]
  const stops = directionData?.stops || []
  const selectedStop = stops[selectedStopIndex] ?? null

  /* ============================= */
  /* ===== HANDLERS ============== */
  /* ============================= */
  const handleLineChange = useCallback((line: LineId) => {
    setSelectedLine(line)
    setSelectedDirectionIndex(0)
    setSelectedStopIndex(0)
  }, [])

  const handleDirectionChange = useCallback((index: number) => {
    setSelectedDirectionIndex(index)
    setSelectedStopIndex(0)
  }, [])

  /* ============================= */
  /* ===== MAP AUTO SELECTION ==== */
  /* ============================= */
  useEffect(() => {
    if (!selectedFromMap) return

    const { stopId, lineId } = selectedFromMap
    const line = busData[lineId]
    if (!line) return

    const directionIndex = line.directions.findIndex((dir) =>
      dir.stops.some((s) => s.id === stopId)
    )
    if (directionIndex === -1) return

    const stopIndex = line.directions[directionIndex].stops.findIndex((s) => s.id === stopId)
    if (stopIndex === -1) return

    setSelectedLine(lineId)
    setSelectedDirectionIndex(directionIndex)
    setSelectedStopIndex(stopIndex)
  }, [selectedFromMap, busData])

  /* ============================= */
  /* ===== DAY DETECTION ========= */
  /* ============================= */
  const todayType = useMemo<DayType>(() => {
    const iso = currentTime.toISOString().split("T")[0]
    const day = currentTime.getDay()

    if (holidays.has(iso) || day === 0) return "sunday"
    if (day === 6) return "saturday"
    return "weekday"
  }, [currentTime, holidays])

  useEffect(() => {
    if (selectedDay === null) {
      setSelectedDay(todayType)
    }
  }, [todayType, selectedDay])

  /* ============================= */
  /* ===== NEXT DEPARTURE ======== */
  /* ============================= */
  const departures = selectedDay ? selectedStop?.times[selectedDay] || [] : []

  const nextDepartureIndex = useMemo(() => {
    if (!currentTime || !selectedStop || !selectedDay) return -1
    if (selectedDay !== todayType) return -1

    const curMinutes =
      currentTime.getHours() * 60 + currentTime.getMinutes()

    return departures.findIndex((t) => {
      const [th, tm] = t.split(":").map(Number)
      return th * 60 + tm >= curMinutes
    })
  }, [currentTime, departures, selectedDay, todayType, selectedStop])

  /* ============================= */
  /* ===== CLICK OUTSIDE DROPDOWN */
  /* ============================= */
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (stopDropdownRef.current && !stopDropdownRef.current.contains(event.target as Node)) {
        setIsStopDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  /* ============================= */
  /* ========== RENDER =========== */
  /* ============================= */
  if (!lineData || !selectedDay) return null

  return (
    <>
      <LineSelector
        busData={busData}
        selectedLine={selectedLine}
        setSelectedLine={handleLineChange}
        defaultLineClass={DEFAULT_LINE_COLOR}
      />

      <Card className="p-3 sm:p-4 bg-white shadow-sm">
        <h2 className="text-xs sm:text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide flex items-center gap-2">
          <ArrowRight className="w-4 h-4" /> Wybierz kierunek
        </h2>

        <DirectionSelector
          lineData={lineData}
          selectedDirectionIndex={selectedDirectionIndex}
          setSelectedDirectionIndex={handleDirectionChange}
          defaultLineClass={DEFAULT_LINE_COLOR}
        />
      </Card>

      <StopSelector
        stops={stops}
        selectedStopIndex={selectedStopIndex}
        setSelectedStopIndex={setSelectedStopIndex}
        stopSearch={stopSearch}
        setStopSearch={setStopSearch}
        isStopDropdownOpen={isStopDropdownOpen}
        setIsStopDropdownOpen={setIsStopDropdownOpen}
        stopDropdownWrapperRef={stopDropdownRef}
      />

      <DaySelector
        selectedDay={selectedDay}
        setSelectedDay={setSelectedDay}
        defaultLineClass={DEFAULT_LINE_COLOR}
      />

      <Departures
        selectedStop={selectedStop}
        departures={departures}
        nextDepartureIndex={nextDepartureIndex}
        dayLabel={dayLabels[selectedDay]}
        defaultLineClass={DEFAULT_LINE_COLOR}
        defaultRingClass={DEFAULT_RING_COLOR}
      />
    </>
  )
}

export const TimetableView = React.memo(TimetableViewComponent)
