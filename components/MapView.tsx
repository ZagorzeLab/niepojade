"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { Card } from "@/components/ui/card"
import { MapIcon, MapPin } from "lucide-react"

import type { Stop, BusLine } from "@/lib/types/bus-schedule"
import type { LineId } from "@/lib/bus-data-loader"
import React from "react"

const LeafletMap = dynamic(
    () => import("@/components/LeafletMap").then((mod) => mod.LeafletMap),
    {
        ssr: false,
        loading: () => (
            <div className="bg-slate-100 rounded-xl p-8 text-center min-h-[400px] flex items-center justify-center">
                <div>
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-600 border-t-transparent"></div>
                    <p className="mt-2 text-sm text-slate-600">Ładowanie mapy…</p>
                </div>
            </div>
        ),
    }
)

type MapViewProps = {
    busData: Record<LineId, BusLine>
    stops: Stop[]
    onStopClick: (stopId: string, lineId: string) => void
}

// --- Funkcja do liczenia odległości w metrach ---
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371e3 // promień Ziemi w metrach
    const φ1 = (lat1 * Math.PI) / 180
    const φ2 = (lat2 * Math.PI) / 180
    const Δφ = ((lat2 - lat1) * Math.PI) / 180
    const Δλ = ((lon2 - lon1) * Math.PI) / 180

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c
}

function MapViewComponent({ busData, stops, onStopClick }: MapViewProps) {
    const [nearestStop, setNearestStop] = useState<Stop | null>(null)


    const findNearestStop = () => {
        if (!stops || stops.length === 0) return

        if (!navigator.geolocation) {
            alert("Twoja przeglądarka nie wspiera geolokalizacji")
            return
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords

                let nearest: Stop | null = null
                let minDistance = Infinity

                stops.forEach((stop) => {
                    const distance = getDistance(latitude, longitude, stop.lat, stop.lng)
                    if (distance < minDistance) {
                        minDistance = distance
                        nearest = stop
                    }
                })

                if (nearest) {
                    setNearestStop(nearest)
                }
            },
            (error) => {
                console.error(error)
                alert("Nie udało się pobrać lokalizacji")
            },
            { enableHighAccuracy: true }
        )
    }

    return (
        <Card className="p-4 sm:p-6 bg-white shadow-md">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <MapIcon className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                Mapa przystanków
            </h2>

            <button
                onClick={findNearestStop}
                className="w-full bg-gradient-to-br from-purple-600 to-purple-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-98 flex items-center justify-center gap-3 mb-6"
            >
                <MapPin className="w-6 h-6" />
                <span>Znajdź najbliższy przystanek</span>
            </button>

            <div className="relative w-full h-[400px] sm:h-[500px] mb-6 z-0">
                <LeafletMap
                    stops={stops}
                    onStopClick={onStopClick}
                    nearestStop={nearestStop}
                />
            </div>
        </Card>
    )
}

export const MapView = React.memo(MapViewComponent)