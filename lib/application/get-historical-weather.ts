import Papa from 'papaparse'
import { HistoricalCsvRow } from '@/lib/infrastructure/historical-data.dto'
import { mapCsvDataToDataPoints } from '@/lib/infrastructure/historical-data.mapper'

export const parseCsvText = (csvText: string) => {
  const cleanedCsv = csvText
    .replace(/^\uFEFF/, '') // Remove BOM if present
    .split('\n')
    .filter(line => line.trim().length > 0)
    .join('\n')
    .trim()
 
  const parseResult = Papa.parse<HistoricalCsvRow>(cleanedCsv, {
    header: true,
    skipEmptyLines: 'greedy',
    transformHeader: (header) => header.trim(),
    transform: (value) => value.trim(),
  })
 
  if (parseResult.errors.length > 0) {
    console.error('[historical] CSV parsing errors:', parseResult.errors.slice(0, 5))
  }
 
  const validRows = parseResult.data.filter(row =>
    row.Date && row.Time && row['Temp Out']
  )
 
  return mapCsvDataToDataPoints(validRows)
}