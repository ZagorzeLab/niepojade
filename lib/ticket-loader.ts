import type { TicketType, Discount } from "@/lib/types/bus-schedule"

let ticketTypesCache: TicketType[] | null = null
let discountsCache: Discount[] | null = null

export async function loadTicketTypes(): Promise<TicketType[]> {
    if (ticketTypesCache) {
        return ticketTypesCache
    }

    const res = await fetch("/data/config/ticket-types.json")
    if (!res.ok) {
        throw new Error("Failed to load ticket types")
    }

    const data: TicketType[] = await res.json()
    ticketTypesCache = data
    return data
}

export async function loadDiscounts(): Promise<Discount[]> {
    if (discountsCache) {
        return discountsCache
    }

    const res = await fetch("/data/config/discounts.json")
    if (!res.ok) {
        throw new Error("Failed to load discounts")
    }

    const data: Discount[] = await res.json()
    discountsCache = data
    return data
}

export async function loadTicketsData() {
    const [ticketTypes, discounts] = await Promise.all([
        loadTicketTypes(),
        loadDiscounts(),
    ])

    return { ticketTypes, discounts }
}
