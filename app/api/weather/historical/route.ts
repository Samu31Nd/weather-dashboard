import { NextResponse } from 'next/server'
import http from 'http'
import fs from 'fs'
import path from 'path'
import Papa from 'papaparse'
import { HistoricalCsvRow } from '@/lib/infrastructure/historical-data.dto'
import { mapCsvDataToDataPoints } from '@/lib/infrastructure/historical-data.mapper'

const API_BASE_URL = process.env.API_URL! + 'webdl.php'
const MOCK_CSV_PATH = path.join(process.cwd(), 'public', 'mock', 'historical-data.csv')

async function fetchCsvData(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const req = http.get(
      url,
      {
        insecureHTTPParser: true,
        timeout: 30000,
      },
      (res) => {
        let data = ''
        res.setEncoding('utf8')
        res.on('data', (chunk) => { data += chunk })
        res.on('end', () => { resolve(data) })
        res.on('error', (err) => { reject(err) })
      }
    )
    req.on('error', (err) => { reject(err) })
    req.on('timeout', () => {
      req.destroy()
      reject(new Error('Request timeout'))
    })
  })
}

function parseCsvText(csvText: string) {
  const cleanedCsv = csvText
    .replace(/^\uFEFF/, '')
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

function serveMock(dateStr: string) {
  console.log('[historical] Mock path:', MOCK_CSV_PATH)
  console.log('[historical] Mock exists:', fs.existsSync(MOCK_CSV_PATH))

  if (!fs.existsSync(MOCK_CSV_PATH)) {
    return null
  }

  const csvText = fs.readFileSync(MOCK_CSV_PATH, 'utf8')
  const dataPoints = parseCsvText(csvText)
  console.warn('[historical] Serving mock data, points:', dataPoints.length)

  return NextResponse.json({
    data: dataPoints,
    meta: {
      date: dateStr,
      totalPoints: dataPoints.length,
      fetchedAt: new Date().toISOString(),
      source: 'mock',
    },
  })
}

export async function GET() {
  const dateStr = new Date().toISOString().split('T')[0]

  console.log('[historical] GET called, date:', dateStr)

  try {
    const url = `${API_BASE_URL}?action=text&date=${dateStr}`
    console.log('[historical] Fetching:', url)

    const csvText = await fetchCsvData(url)

    if (!csvText || typeof csvText !== 'string') {
      throw new Error('Empty or invalid response from weather API')
    }

    console.log('[historical] Live data received, length:', csvText.length)

    const dataPoints = parseCsvText(csvText)

    return NextResponse.json({
      data: dataPoints,
      meta: {
        date: dateStr,
        totalPoints: dataPoints.length,
        fetchedAt: new Date().toISOString(),
        source: 'live',
      },
    })

  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error)
    console.error('[historical] Live fetch failed:', errMsg)

    const mockResponse = serveMock(dateStr)
    if (mockResponse) return mockResponse

    return NextResponse.json(
      { error: 'Failed to fetch historical weather data', details: errMsg },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'