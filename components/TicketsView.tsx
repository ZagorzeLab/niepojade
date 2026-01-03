"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Ticket, Info } from "lucide-react"
import type { TicketType, Discount } from "@/lib/types/bus-schedule"

const DEFAULT_LINE_COLOR = "bg-[#7c3aed] text-white shadow-md hover:bg-[#7c3aed']"

interface TicketsViewProps {
    tickets: TicketType[]
    discounts: Discount[]
}

export function TicketsView({ tickets, discounts }: TicketsViewProps) {
    return (
        <div className="space-y-6">
            {/* Header */}
            <Card className="p-4 bg-white shadow-sm border border-slate-200">
                <div className="flex items-center gap-3">
                    <div className={`${DEFAULT_LINE_COLOR} p-2 rounded-full`}>
                        <Ticket className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Informacje o biletach</h2>
                        <p className="text-sm text-slate-700 mt-1">Cennik i ulgi w transporcie gminnym</p>
                    </div>
                </div>
            </Card>

            {/* Ticket types */}
            <Card className="p-4 bg-white shadow-sm border border-slate-200">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Rodzaje biletów</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                    {tickets.map((t) => (
                        <div key={t.id} className="border border-slate-200 rounded-lg p-4 flex justify-between items-start bg-white">
                            <div>
                                <p className="font-medium text-slate-800">{t.type}</p>
                                <p className="text-sm text-slate-600 mt-1">{t.description}</p>
                            </div>
                            <Badge className={DEFAULT_LINE_COLOR}>{t.price}</Badge>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Purchase Info */}
            <Card className="p-4 bg-white shadow-sm border border-slate-200 space-y-3">
                <div className="flex items-center gap-3">
                    <Ticket className={`${DEFAULT_LINE_COLOR} w-6 h-6 p-1 rounded-full flex-shrink-0`} />
                    <h3 className="text-sm sm:text-base font-semibold text-slate-900">
                        Gdzie i jak kupić bilet?
                    </h3>
                </div>

                <div className="ml-9 space-y-2 text-sm text-slate-700">
                    <p>
                        <span className="font-semibold">Gdzie:</span> Bilet kupujemy bezpośrednio u kierowcy.
                    </p>
                    <p>
                        <span className="font-semibold">Jak:</span> Płatność gotówką możliwa jest we wszystkich pojazdach. Kartą można płacić tylko w pojazdach typu MIDI
                        <span className="text-slate-500"> (MIDI to mniejsze autobusy miejskie)</span>, w busach ten rodzaj płatności będzie dostępny wkrótce.
                    </p>
                </div>
            </Card>


            {/* Discounts */}
            <Card className="p-4 bg-white shadow-sm border border-slate-200">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Ulgi i uprawnienia</h3>
                <div className="space-y-3">
                    {discounts.map((d) => (
                        <div key={d.id} className="border border-slate-200 rounded-lg p-3 flex justify-between items-center bg-white">
                            <div className="flex items-start gap-3">
                                <Info className={`${DEFAULT_LINE_COLOR} w-5 h-5 p-1 rounded-full`} />
                                <div>
                                    <p className="font-medium text-slate-800">{d.category}</p>
                                    <p className="text-sm text-slate-600">{d.document}</p>
                                </div>
                            </div>
                            <Badge className={DEFAULT_LINE_COLOR}>{d.discount}</Badge>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    )
}
