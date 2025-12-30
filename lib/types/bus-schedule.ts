// TypeScript interfaces for bus schedule data structure

export interface StopSchedule {
  id: string // Stable identifier in snake_case (e.g., "niepolomice_rynek")
  name: string // Human-readable name (e.g., "Niepołomice Rynek")
  times: {
    weekday: string[]
    saturday: string[]
    sunday: string[]
  }
  // Future-proof fields:
  coordinates?: {
    lat: number
    lng: number
  }
  zone?: string
  accessible?: boolean
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
