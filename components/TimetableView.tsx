"use client"

import React, { useState, useEffect, useMemo, useCallback } from "react"

import { Card } from "@/components/ui/card"
import LineSelector from "@/components/bus-schedule/LineSelector"
import DirectionSelector from "@/components/bus-schedule/DirectionSelector"
import StopSelector from "@/components/bus-schedule/StopSelector"
import DaySelector from "@/components/bus-schedule/DaySelector"
import Departures from "@/components/bus-schedule/Departures"
import { FavoritesBar } from "@/components/bus-schedule/FavoritesBar"

import { ArrowRight, Star } from "lucide-react"

import type { BusLine } from "@/lib/types/bus-schedule"
import type { LineId } from "@/lib/bus-data-loader"
import { useFavorites, type FavoriteStop } from "@/hooks/useFavorites"

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
  const lineIds = useMemo(() => Object.keys(busData) as LineId[], [busData])
  const { favorites, lastUsed, toggleFavorite, isFavorite, saveLastUsed } =
    useFavorites()

  // ✅ FIX 1 — bezpieczny selectedLine
  const [selectedLine, setSelectedLine] = useState<LineId | null>(
    lineIds[0] ?? null
  )

  const [selectedDirectionIndex, setSelectedDirectionIndex] = useState(0)
  const [selectedStopIndex, setSelectedStopIndex] = useState(0)
  const [selectedDay, setSelectedDay] = useState<DayType | null>(null)
  const [hasRestoredLastUsed, setHasRestoredLastUsed] = useState(false)

  const [stopSearch, setStopSearch] = useState("")

  const lineData = selectedLine ? busData[selectedLine] : null

  // ✅ FIX 2 — ?? zamiast ||
  const directions = lineData?.directions ?? []
  const directionData = directions[selectedDirectionIndex]
  const stops = directionData?.stops ?? []
  const selectedStop = stops[selectedStopIndex] ?? null

  const handleLineChange = useCallback((line: LineId) => {
    setSelectedLine(line)
    setSelectedDirectionIndex(0)
    setSelectedStopIndex(0)
  }, [])

  const handleDirectionChange = useCallback((index: number) => {
    setSelectedDirectionIndex(index)
    setSelectedStopIndex(0)
  }, [])

  useEffect(() => {
    if (!selectedFromMap) return

    const { stopId, lineId } = selectedFromMap
    const line = busData[lineId]
    if (!line) return

    const directionIndex = line.directions.findIndex((dir) =>
      dir.stops.some((s) => s.id === stopId)
    )
    if (directionIndex === -1) return

    const stopIndex = line.directions[directionIndex].stops.findIndex(
      (s) => s.id === stopId
    )
    if (stopIndex === -1) return

    setSelectedLine(lineId)
    setSelectedDirectionIndex(directionIndex)
    setSelectedStopIndex(stopIndex)
  }, [selectedFromMap, busData])

  useEffect(() => {
    if (hasRestoredLastUsed || selectedFromMap) return
    if (!lastUsed) {
      setHasRestoredLastUsed(true)
      return
    }

    const line = busData[lastUsed.lineId]
    if (!line) return

    const dir = line.directions[lastUsed.directionIndex]
    if (!dir) return

    const stopIdx = dir.stops.findIndex((s) => s.id === lastUsed.stopId)
    if (stopIdx === -1) return

    setSelectedLine(lastUsed.lineId as LineId)
    setSelectedDirectionIndex(lastUsed.directionIndex)
    setSelectedStopIndex(stopIdx)
    setHasRestoredLastUsed(true)
  }, [lastUsed, hasRestoredLastUsed, busData, selectedFromMap])

  useEffect(() => {
    if (!selectedStop) return
    saveLastUsed({
      stopId: selectedStop.id,
      stopName: selectedStop.name,
      lineId: selectedLine!,
      directionIndex: selectedDirectionIndex,
      stopIndex: selectedStopIndex,
    })
  }, [
    selectedStop,
    selectedLine,
    selectedDirectionIndex,
    selectedStopIndex,
    saveLastUsed,
  ])

  const handleFavoriteSelect = useCallback(
    (fav: FavoriteStop) => {
      const line = busData[fav.lineId]
      if (!line) return

      const dir = line.directions[fav.directionIndex]
      if (!dir) return

      const stopIdx = dir.stops.findIndex((s) => s.id === fav.stopId)
      if (stopIdx === -1) return

      setSelectedLine(fav.lineId as LineId)
      setSelectedDirectionIndex(fav.directionIndex)
      setSelectedStopIndex(stopIdx)
    },
    [busData]
  )

  const handleToggleFavorite = useCallback(() => {
    if (!selectedStop || !selectedLine) return
    toggleFavorite({
      stopId: selectedStop.id,
      stopName: selectedStop.name,
      lineId: selectedLine,
      directionIndex: selectedDirectionIndex,
    })
  }, [selectedStop, selectedLine, selectedDirectionIndex, toggleFavorite])

  const isCurrentFavorite = selectedStop
    ? isFavorite(selectedStop.id, selectedLine!)
    : false

  const todayType = useMemo<DayType>(() => {
    const iso = currentTime.toISOString().split("T")[0]
    const day = currentTime.getDay()

    if (holidays.has(iso) || day === 0) return "sunday"
    if (day === 6) return "saturday"
    return "weekday"
  }, [currentTime, holidays])

  // ✅ FIX 3 — prostszy useEffect
  useEffect(() => {
    setSelectedDay((prev) => prev ?? todayType)
  }, [todayType])

  const departures = selectedDay
    ? selectedStop?.times[selectedDay] ?? []
    : []

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

  if (!lineData || !selectedDay) return null

  return (
    <>
      {favorites.length > 0 && (
        <Card className="p-3 sm:p-4 bg-white shadow-sm">
          <h2 className="text-xs sm:text-sm font-semibold text-slate-700 uppercase tracking-wide flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            Ulubione przystanki
          </h2>

          <FavoritesBar
            favorites={favorites}
            onSelect={handleFavoriteSelect}
            activeStopId={selectedStop?.id}
            activeLineId={selectedLine ?? undefined}
          />
        </Card>
      )}

      <LineSelector
        busData={busData}
        selectedLine={selectedLine as LineId}
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
        isFavorite={isCurrentFavorite}
        onToggleFavorite={handleToggleFavorite}
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