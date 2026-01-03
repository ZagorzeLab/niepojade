"use client"

import { FC } from "react"
import { Bell, X } from "lucide-react"
import type { AlertData } from "@/lib/types/bus-schedule"

interface AlertsProps {
    alerts: AlertData[]
    onDismiss: (id: string) => void
}

export const Alerts: FC<AlertsProps> = ({ alerts, onDismiss }) => {
    return (
        <>
            {alerts.map(alert => (
                <div key={alert.id} className="max-w-5xl mx-auto px-3 sm:px-4 pt-4">
                    <div className={`border rounded-lg p-3 sm:p-4 flex items-start gap-3 ${alert.type === "warning" ? "bg-amber-50 border-amber-200" : "bg-blue-50 border-blue-200"}`}>
                        <Bell className={`w-5 h-5 flex-shrink-0 mt-0.5 ${alert.type === "warning" ? "text-amber-600" : "text-blue-600"}`} />
                        <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium ${alert.type === "warning" ? "text-amber-900" : "text-blue-900"}`}>{alert.title}</p>
                            <p className={`text-xs mt-1 ${alert.type === "warning" ? "text-amber-800" : "text-blue-800"}`}>{alert.message}</p>
                        </div>
                        <button
                            onClick={() => onDismiss(alert.id)}
                            className="flex items-center gap-1 flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors"
                            aria-label="Zamknij komunikat"
                        >
                            <span className="text-xs">zamknij</span>
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            ))}
        </>
    )
}
