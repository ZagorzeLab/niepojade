// TypeScript interfaces for bus schedule data structure

export interface StopSchedule {
  id: string // Stable identifier in snake_case (e.g., "niepolomice_rynek")
  name: string // Human-readable name (e.g., "Niepołomice Rynek")
  times: {
    weekday: string[]
    saturday: string[]
    sunday: string[]
  }
}

export interface Direction {
  id: string // Stable identifier (e.g., "niepolomice_chobot")
  label: string // Human-readable label (e.g., "Niepołomice ➜ Chobot")
  stops: StopSchedule[] // ORDERED array of stops
}

export interface BusLine {
  id: string // Line ID (e.g., "T1")
  name: string // Human-readable name (e.g., "Linia T1")
  color: string // Hex color code
  directions: Direction[]
}

export interface TicketType {
  id: string
  type: string
  price: string
  description: string
}

export interface Discount {
  id: string
  category: string
  document: string
  discount: string
}

export type AlertType = "info" | "warning"

export interface AlertData {
  id: string
  type: AlertType
  title: string
  message: string
  startDate?: string // opcjonalnie: YYYY-MM-DD
  endDate?: string   // opcjonalnie: YYYY-MM-DD
}

export type Stop = {
  id: string
  name: string
  lat: number
  lng: number
  lines: string[]
}