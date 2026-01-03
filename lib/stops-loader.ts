import type { Stop } from "@/lib/types/bus-schedule"

export async function loadStops(): Promise<Stop[]> {
    const res = await fetch("/data/stops/stops.json")
    if (!res.ok) throw new Error("Nie udało się załadować przystanków")
    return res.json()
}
