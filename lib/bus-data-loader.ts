import type { BusLine } from "./types/bus-schedule"

export type LineId = string

// Cache for loaded bus lines
const busLineCache = new Map<string, BusLine>()

/**
 * Load a single bus line from JSON file
 */
export async function loadBusLine(lineId: LineId): Promise<BusLine> {
  // Return from cache if available
  if (busLineCache.has(lineId)) {
    return busLineCache.get(lineId)!
  }

  // Fetch from JSON file
  const response = await fetch(`/data/lines/${lineId}.json`)
  if (!response.ok) {
    throw new Error(`Failed to load bus line ${lineId}`)
  }

  const data: BusLine = await response.json()
  busLineCache.set(lineId, data)
  return data
}

const AVAILABLE_LINES = ["T1", "T2", "T3", "T4", "T5"] as const

/**
 * Load all bus lines
 */
export async function loadAllBusLines(): Promise<Record<LineId, BusLine>> {
  const results = await Promise.allSettled(AVAILABLE_LINES.map((id) => loadBusLine(id)))

  const loadedLines: Record<LineId, BusLine> = {}

  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      const line = result.value
      loadedLines[line.id] = line
    }
  })

  return loadedLines
}

/**
 * Get all available line IDs from loaded data
 */
export function getAllLineIds(busData: Record<LineId, BusLine>): LineId[] {
  return Object.keys(busData)
}
