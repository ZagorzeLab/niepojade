"use client"

import { Card } from "@/components/ui/card"
import { Route } from "lucide-react"

export function PlannerView() {
    return (
        <Card className="p-4 sm:p-6 bg-white shadow-md">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Route className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                Planer podróży
            </h2>

            <div className="space-y-4">
                <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                        Skąd
                    </label>
                    <input
                        type="text"
                        placeholder="Wybierz przystanek początkowy"
                        className="w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl
              text-slate-900 placeholder-slate-500
              focus:outline-none focus:ring-2 focus:ring-purple-500
              focus:border-transparent text-sm sm:text-base"
                    />
                </div>

                <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                        Dokąd
                    </label>
                    <input
                        type="text"
                        placeholder="Wybierz przystanek docelowy"
                        className="w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl
              text-slate-900 placeholder-slate-500
              focus:outline-none focus:ring-2 focus:ring-purple-500
              focus:border-transparent text-sm sm:text-base"
                    />
                </div>

                <button className="w-full bg-gradient-to-br from-purple-600 to-purple-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-98 text-sm sm:text-base">
                    Znajdź połączenie
                </button>

                <div className="mt-4 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <p className="text-xs sm:text-sm text-blue-900">
                        <strong>Funkcja w budowie:</strong> Wkrótce będziesz mógł planować swoją
                        podróż z przesiadkami między liniami T1–T5.
                    </p>
                </div>
            </div>
        </Card>
    )
}
