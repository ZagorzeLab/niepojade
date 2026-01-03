import type { AlertData } from "@/lib/types/bus-schedule"
// cache
let alertCache: AlertData[] | null = null

export async function loadAlerts(): Promise<AlertData[]> {
    if (alertCache) return alertCache

    try {
        const res = await fetch("/data/config/alerts.json")
        if (!res.ok) throw new Error("Failed to load alerts")
        const data: { alerts: AlertData[] } = await res.json()

        // filtruj alerty wg daty (jeśli są podane)
        const today = new Date()
        alertCache = (data.alerts || []).filter(a => {
            const start = a.startDate ? new Date(a.startDate) : null
            const end = a.endDate ? new Date(a.endDate) : null
            if (start && today < start) return false
            if (end && today > end) return false
            return true
        })

        return alertCache
    } catch (e) {
        console.error(e)
        return []
    }
}