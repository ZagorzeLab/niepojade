"use client"

import { useState, useEffect, useCallback } from "react"
import dynamic from "next/dynamic"

// UI
import { FullScreenLoader } from "@/components/SpinnerLoader"
import { Alerts } from "@/components/bus-schedule/Alerts"
import Header from "@/components/bus-schedule/Header"

// Icons
import { MapIcon, Route, Ticket, ClockIcon } from "lucide-react"

// Types & loaders
import type {
  BusLine,
  AlertData,
  Stop,
  TicketType,
  Discount,
} from "@/lib/types/bus-schedule"
import { loadAllBusLines, type LineId } from "@/lib/bus-data-loader"
import { loadTicketsData } from "@/lib/ticket-loader"
import { loadAlerts } from "@/lib/alert-loader"
import { loadStops } from "@/lib/stops-loader"

import { useClock } from "@/hooks/useClock"

type ViewType = "timetable" | "map" | "planner" | "tickets"

/* ============================= */
/* ===== DYNAMIC IMPORTS ======= */
/* ============================= */

const TimetableView = dynamic(
  () => import("@/components/TimetableView").then((m) => m.TimetableView),
  { loading: () => <FullScreenLoader /> }
)

const MapView = dynamic(
  () => import("@/components/MapView").then((m) => m.MapView),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-purple-600 border-t-transparent rounded-full" />
      </div>
    ),
  }
)

const PlannerView = dynamic(
  () => import("@/components/PlannerView").then((m) => m.PlannerView),
  { loading: () => <FullScreenLoader /> }
)

import { TicketsView } from "@/components/TicketsView"

/* ============================= */
/* ===== NAV CONFIG ============ */
/* ============================= */

const NAV_ITEMS = [
  { view: "timetable", icon: ClockIcon, label: "Rozkład" },
  { view: "map", icon: MapIcon, label: "Mapa" },
  { view: "planner", icon: Route, label: "Planer" },
  { view: "tickets", icon: Ticket, label: "Bilety" },
] as const

/* ============================= */
/* ===== HELPERS =============== */
/* ============================= */

async function loadHolidays(): Promise<Set<string>> {
  try {
    const res = await fetch("/data/config/holidays.json")
    const data = await res.json()
    return new Set(data.holidays || [])
  } catch {
    return new Set()
  }
}

/* ============================= */
/* ===== MAIN COMPONENT ======== */
/* ============================= */

function BusScheduleContent() {
  const now = useClock()

  const [busData, setBusData] = useState<Record<LineId, BusLine> | null>(null)
  const [holidays, setHolidays] = useState<Set<string>>(new Set())
  const [tickets, setTickets] = useState<{
    ticketTypes: TicketType[]
    discounts: Discount[]
  } | null>(null)
  const [alerts, setAlerts] = useState<AlertData[]>([])
  const [stops, setStops] = useState<Stop[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // ✅ persist view (UX upgrade)
  const [currentView, setCurrentView] = useState<ViewType>(() => {
    if (typeof window === "undefined") return "timetable"
    return (localStorage.getItem("view") as ViewType) || "timetable"
  })

  const [selectedStop, setSelectedStop] = useState<{
    stopId: string
    lineId: string
  } | null>(null)

  useEffect(() => {
    localStorage.setItem("view", currentView)
  }, [currentView])

  /* ============================= */
  /* ===== HANDLE STOP CLICK ===== */
  /* ============================= */

  const handleStopClick = useCallback((stopId: string, lineId: string) => {
    setSelectedStop((prev) =>
      prev?.stopId === stopId && prev?.lineId === lineId
        ? prev
        : { stopId, lineId }
    )
    setCurrentView("timetable")
  }, [])

  /* ============================= */
  /* ===== LOAD DATA ============= */
  /* ============================= */

  useEffect(() => {
    let mounted = true

    async function loadData() {
      try {
        const [
          lines,
          holidaySet,
          ticketsData,
          alertData,
          stopsData,
        ] = await Promise.all([
          loadAllBusLines(),
          loadHolidays(),
          loadTicketsData(),
          loadAlerts(),
          loadStops(),
        ])

        if (!mounted) return

        setBusData(lines)
        setHolidays(holidaySet)
        setTickets(ticketsData)
        setAlerts(alertData)
        setStops(stopsData)
      } catch (err) {
        console.error("Load error:", err)
        setError("Nie udało się załadować danych")
      } finally {
        if (mounted) setIsLoading(false)
      }
    }

    loadData()
    return () => {
      mounted = false
    }
  }, [])

  /* ============================= */
  /* ===== STATES =============== */
  /* ============================= */

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    )
  }

  if (isLoading || !busData || !tickets) {
    return <FullScreenLoader />
  }

  /* ============================= */
  /* ===== RENDER =============== */
  /* ============================= */

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-24">
      <Header currentTime={now} />

      <Alerts
        alerts={alerts}
        onDismiss={(id) =>
          setAlerts((prev) => prev.filter((a) => a.id !== id))
        }
      />

      <main className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6 pb-8">
        {currentView === "timetable" &&
          busData &&
          Object.keys(busData).length > 0 && (
            <TimetableView
              busData={busData}
              holidays={holidays}
              currentTime={now}
              selectedFromMap={selectedStop}
            />
          )}

        {currentView === "map" && busData && (
          <MapView
            busData={busData}
            stops={stops}
            onStopClick={handleStopClick}
          />
        )}

        {currentView === "planner" && <PlannerView />}

        {currentView === "tickets" && tickets && (
          <TicketsView
            tickets={tickets.ticketTypes}
            discounts={tickets.discounts}
          />
        )}
      </main>

      {/* BOTTOM NAV */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg">
        <div className="max-w-5xl mx-auto px-2 sm:px-4">
          <div className="grid grid-cols-4 gap-1 py-2 pb-safe">
            {NAV_ITEMS.map((btn) => (
              <button
                key={btn.view}
                onClick={() => setCurrentView(btn.view as ViewType)}
                className={`flex flex-col items-center justify-center gap-1 px-3 py-2.5 rounded-lg transition-all ${
                  currentView === btn.view
                    ? "bg-purple-600 text-white"
                    : "text-slate-600 hover:bg-slate-100 active:scale-95"
                }`}
              >
                <btn.icon className="w-5 h-5" />
                <span className="text-[10px] sm:text-xs font-medium">
                  {btn.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  )
}

export default function Page() {
  return <BusScheduleContent />
}