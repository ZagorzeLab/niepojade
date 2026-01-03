"use client"

import { useEffect, useRef, useState } from "react"
import type { Stop } from "@/lib/types/bus-schedule"
import React from "react"

interface LeafletMapProps {
    stops?: Stop[]  
    onStopClick?: (stopId: string, lineId: string) => void
    nearestStop?: Stop | null
}

// --- Funkcja do dynamicznego ładowania Leaflet z CDN ---
async function loadLeaflet(): Promise<any> {
    if ((window as any).L) return (window as any).L

    // Load CSS
    if (!document.querySelector('link[href*="leaflet"]')) {
        const link = document.createElement("link")
        link.rel = "stylesheet"
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        document.head.appendChild(link)
    }

    // Load JS
    return new Promise<any>((resolve, reject) => {
        const script = document.createElement("script")
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        script.onload = () => resolve((window as any).L)
        script.onerror = reject
        document.head.appendChild(script)
    })
}

function LeafletMapComponent({ stops = [], onStopClick, nearestStop }: LeafletMapProps) {
    const mapRef = useRef<HTMLDivElement>(null)
    const mapInstanceRef = useRef<any>(null)
    const markersRef = useRef<any[]>([])
    const [mapReady, setMapReady] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // --- Inicjalizacja mapy ---
    useEffect(() => {
        if (typeof window === "undefined") return

        async function initMap() {
            try {
                const L = await loadLeaflet()
                if (!mapRef.current) return

                if (mapInstanceRef.current) return

                const map = L.map(mapRef.current).setView([50.0347, 20.2122], 14)
                mapInstanceRef.current = map

                L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                    attribution: "© OpenStreetMap",
                    maxZoom: 19,
                }).addTo(map)

                setMapReady(true)
                setIsLoading(false)
            } catch (e) {
                console.error(e)
                setError("Nie udało się załadować mapy")
                setIsLoading(false)
            }
        }

        initMap()
    }, [])

    // --- Dodawanie markerów ---
    useEffect(() => {
        if (!mapReady || stops.length === 0) return
        const L = (window as any).L
        if (!L || !mapInstanceRef.current) return

        markersRef.current.forEach((m) => m.remove())
        markersRef.current = []

        stops.forEach((stop) => {
            const marker = L.marker([stop.lat, stop.lng]).addTo(mapInstanceRef.current)

            const lineButtons = stop.lines
                .map(
                    (lineId) =>
                        `<button class="block w-full text-xs bg-purple-600 text-white px-3 py-1 rounded-lg mb-1 hover:bg-purple-700"
              data-stop="${stop.id}" data-line="${lineId}">
              ${lineId} - Pokaż rozkład
            </button>`
                )
                .join("")

            marker.bindPopup(`
        <div class="p-2">
          <h3 class="font-bold text-sm mb-1">${stop.name}</h3>
          ${lineButtons}
        </div>
      `)

            markersRef.current.push(marker)
        })

        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            const stopId = target.getAttribute("data-stop")
            const lineId = target.getAttribute("data-line")
            if (stopId && lineId) {
                onStopClick?.(stopId, lineId)
            }
        }

        document.addEventListener("click", handleClick)
        return () => document.removeEventListener("click", handleClick)
    }, [mapReady, stops, onStopClick])

    // --- Centrowanie na najbliższym przystanku ---
    useEffect(() => {
        if (!mapReady || !nearestStop) return
        const L = (window as any).L
        if (!L || !mapInstanceRef.current) return

        mapInstanceRef.current.setView([nearestStop.lat, nearestStop.lng], 16, { animate: true })

        const marker = markersRef.current.find(m => {
            const latLng = m.getLatLng()
            return latLng.lat === nearestStop.lat && latLng.lng === nearestStop.lng
        })
        marker?.openPopup()
    }, [nearestStop, mapReady])

    if (error) {
        return (
            <div className="bg-red-100 p-8 text-center text-red-600 rounded-xl">
                {error}
            </div>
        )
    }

    return (
        <div className="relative">
            {isLoading && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded-xl">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-600 border-t-transparent"></div>
                        <p className="mt-2 text-sm text-slate-600">Ładowanie mapy...</p>
                    </div>
                </div>
            )}
            <div ref={mapRef} className="h-[400px] sm:h-[500px] rounded-xl overflow-hidden shadow-lg" />
        </div>
    )
}


export const LeafletMap = React.memo(LeafletMapComponent)