'use client'

import { useApp } from '@/components/app-provider'
import Box from '@mui/material/Box';
import { LineChart } from '@mui/x-charts/LineChart'
import type { HistoricalDataPoint } from '@/lib/infrastructure/historical-data.dto'
import useSWR from 'swr'
import { Loader2, AlertCircle, Thermometer, Droplets, Wind, Gauge, CloudRain } from 'lucide-react'

interface HistoricalResponse {
    data: HistoricalDataPoint[]
    meta: {
        date: string
        totalPoints: number
        fetchedAt: string
    }
}

const fetcher = async (url: string): Promise<HistoricalResponse> => {
    const res = await fetch(url)
    if (!res.ok) throw new Error('Failed to fetch')
    return res.json()
}

function ChartCard({
    title,
    icon: Icon,
    children
}: {
    title: string
    icon: React.ElementType
    children: React.ReactNode
}) {

    return (
        <div className='p-4 sm:p-6' >

            <Box sx={{ width: '100%', height: 300 }}>
                <div className="flex items-center gap-2 mb-4">
                    <div className="rounded-lg bg-primary/10 p-2">
                        <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                </div>
                {children}
            </Box>
        </div>
    )
}

export function HistoricalCharts() {
    const { t, isMetric, isDark } = useApp()

    const { data: response, error, isLoading } = useSWR<HistoricalResponse>(
        '/api/weather/historical',
        fetcher,
        {
            refreshInterval: 900000, // 15 minutes
            revalidateOnFocus: false,
        }
    )

    // MUI chart colors based on theme
    const chartColors = {
        primary: isDark ? '#818cf8' : '#6366f1',
        secondary: isDark ? '#34d399' : '#10b981',
        tertiary: isDark ? '#f472b6' : '#ec4899',
        grid: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        text: isDark ? '#a1a1aa' : '#52525b',
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-100 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin mb-4" />
                <p>{t.charts.loading}</p>
            </div>
        )
    }

    if (error || !response?.data) {
        return (
            <div className="flex flex-col items-center justify-center min-h-100 text-muted-foreground">
                <AlertCircle className="h-8 w-8 mb-4 text-destructive" />
                <p>{t.charts.error}</p>
            </div>
        )
    }

    const data = response.data

    if (data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-100 text-muted-foreground">
                <AlertCircle className="h-8 w-8 mb-4" />
                <p>{t.charts.noData}</p>
            </div>
        )
    }

    // Get units from the first data point (CSV provides units)
    const firstPoint = data[0]
    const csvTempUnit = firstPoint.units.temp // "C" or "F"
    const csvWindUnit = firstPoint.units.wind // "km/h" or "mph"
    const csvBarUnit = firstPoint.units.bar   // "mm" (actually hPa) or "inHg"
    const csvRainUnit = firstPoint.units.rain // "mm" or "in"

    // Prepare data for charts - sample every nth point if too many
    const sampledData = data.length > 96
        ? data.filter((_, i) => i % Math.ceil(data.length / 96) === 0)
        : data

    const timeLabels = sampledData.map(d => d.time)

    // Temperature conversion (CSV is in Celsius, convert based on user preference)
    const convertTemp = (temp: number | null): number | null => {
        if (temp === null) return null
        // CSV data is already in Celsius (from the file)
        if (!isMetric) {
            // Convert to Fahrenheit
            return (temp * 9 / 5) + 32
        }
        return temp
    }

    // Speed conversion (CSV is in km/h, convert based on user preference)
    const convertSpeed = (speed: number | null): number | null => {
        if (speed === null) return null
        // CSV data is already in km/h
        if (!isMetric) {
            // Convert to mph
            return speed / 1.60934
        }
        return speed
    }

    // Pressure conversion (CSV appears to be in hPa/mbar)
    const convertPressure = (pressure: number | null): number | null => {
        if (pressure === null) return null
        // CSV data is in hPa (mbar)
        if (!isMetric) {
            // Convert to inHg
            return pressure / 33.8639
        }
        return pressure
    }

    // Rain conversion (CSV is in mm)
    const convertRain = (rain: number | null): number | null => {
        if (rain === null) return null
        // CSV data is in mm
        if (!isMetric) {
            // Convert to inches
            return rain / 25.4
        }
        return rain
    }

    // Chart data arrays with conversions
    const outdoorTemps = sampledData.map(d => convertTemp(d.outdoor.temperature))
    const indoorTemps = sampledData.map(d => convertTemp(d.indoor.temperature))
    const outdoorHumidity = sampledData.map(d => d.outdoor.humidity)
    const indoorHumidity = sampledData.map(d => d.indoor.humidity)
    const windSpeeds = sampledData.map(d => convertSpeed(d.wind.speed))
    const windGusts = sampledData.map(d => convertSpeed(d.wind.highSpeed))
    const pressures = sampledData.map(d => convertPressure(d.barometer.pressure))
    const rainRates = sampledData.map(d => convertRain(d.rain.rate))

    // Display units based on user preference
    const tempUnit = isMetric ? '°C' : '°F'
    const speedUnit = isMetric ? 'km/h' : 'mph'
    const pressureUnit = isMetric ? 'hPa' : 'inHg'
    const rainUnit = isMetric ? 'mm' : 'in'

    // Common chart props
    const chartProps = {
        height: 280,
        margin: { top: 20, right: 20, bottom: 30, left: 60 },
        sx: {
            '& .MuiChartsLegend-label': { color: `${chartColors.text} !important` },
            '& .MuiChartsAxisHighlight-root': { stroke: `${chartColors.text} !important` },
            '& .MuiChartsAxis-line': { stroke: `${chartColors.text} !important` },
            '& .MuiChartsAxis-tick': { stroke: `${chartColors.text} !important` },
            '.MuiChartsAxis-tickLabel': { fill: chartColors.text },
            '.MuiLineChart-mark': { fill: chartColors.grid },
            '.MuiChartsAxis-line': { stroke: chartColors.grid },
            '.MuiChartsAxis-tick': { stroke: chartColors.grid },
            '.MuiChartsGrid-line': { stroke: chartColors.grid },
        },
        grid: { horizontal: true },
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-semibold text-foreground">{t.charts.title}</h2>
                <p className="text-muted-foreground mt-1">{t.charts.subtitle}</p>
                {response.meta && (
                    <p className="text-xs text-muted-foreground mt-2">
                        {t.charts.dateTime} : {response.meta.date}
                    </p>
                )}
            </div>

            {/* Temperature Chart */}
            <ChartCard title={t.charts.temperatureChart} icon={Thermometer}>
                <LineChart
                    {...chartProps}

                    height={280}
                    xAxis={[{
                        scaleType: 'point',
                        data: timeLabels,
                        tickLabelStyle: { fill: chartColors.text, fontSize: 10 },
                    }]}
                    yAxis={[{
                        label: tempUnit,
                        labelStyle: { fill: chartColors.text },
                    }]}
                    series={[
                        {
                            data: outdoorTemps,
                            label: t.charts.outdoorTemp,
                            color: chartColors.primary,
                            showMark: false,
                            curve: 'monotoneX',
                        },
                        {
                            data: indoorTemps,
                            label: t.charts.indoorTemp,
                            color: chartColors.secondary,
                            showMark: false,
                            curve: 'monotoneX',
                        },
                    ]}
                />
            </ChartCard>

            {/* Humidity Chart */}
            <ChartCard title={t.charts.humidityChart} icon={Droplets}>
                <LineChart
                    {...chartProps}
                    xAxis={[{
                        scaleType: 'point',
                        data: timeLabels,
                        tickLabelStyle: { fill: chartColors.text, fontSize: 10 },
                    }]}
                    yAxis={[{
                        label: '%',
                        min: 0,
                        max: 100,
                        labelStyle: { fill: chartColors.text },
                    }]}
                    series={[
                        {
                            data: outdoorHumidity,
                            label: t.charts.outdoorHumidity,
                            color: chartColors.primary,
                            showMark: false,
                            curve: 'monotoneX',
                        },
                        {
                            data: indoorHumidity,
                            label: t.charts.indoorHumidity,
                            color: chartColors.secondary,
                            showMark: false,
                            curve: 'monotoneX',
                        },
                    ]}
                />
            </ChartCard>

            {/* Wind Chart */}
            <ChartCard title={t.charts.windChart} icon={Wind}>
                <LineChart
                    {...chartProps}
                    xAxis={[{
                        scaleType: 'point',
                        data: timeLabels,
                        tickLabelStyle: { fill: chartColors.text, fontSize: 10 },
                    }]}
                    yAxis={[{
                        label: speedUnit,
                        min: 0,
                        labelStyle: { fill: chartColors.text },
                    }]}
                    series={[
                        {
                            data: windSpeeds,
                            label: t.charts.windSpeed,
                            color: chartColors.primary,
                            showMark: false,
                            curve: 'monotoneX',
                        },
                        {
                            data: windGusts,
                            label: t.charts.windGust,
                            color: chartColors.tertiary,
                            showMark: false,
                            curve: 'monotoneX',
                        },
                    ]}
                />
            </ChartCard>

            {/* Pressure Chart */}
            <ChartCard title={t.charts.pressureChart} icon={Gauge}>
                <LineChart
                    {...chartProps}
                    xAxis={[{
                        scaleType: 'point',
                        data: timeLabels,
                        tickLabelStyle: { fill: chartColors.text, fontSize: 10 },
                    }]}
                    yAxis={[{
                        label: pressureUnit,
                        labelStyle: { fill: chartColors.text },
                    }]}
                    series={[
                        {
                            data: pressures,
                            label: t.charts.pressure,
                            color: chartColors.primary,
                            showMark: false,
                            curve: 'monotoneX',
                            area: true,
                        },
                    ]}
                />
            </ChartCard>

            {/* Rain Chart */}
            <ChartCard title={t.charts.rainChart} icon={CloudRain}>
                <LineChart
                    {...chartProps}
                    xAxis={[{
                        scaleType: 'point',
                        data: timeLabels,
                        tickLabelStyle: { fill: chartColors.text, fontSize: 10 },
                    }]}
                    yAxis={[{
                        label: rainUnit,
                        min: 0,
                        labelStyle: { fill: chartColors.text },
                    }]}
                    series={[
                        {
                            data: rainRates,
                            label: t.charts.rainRate,
                            color: chartColors.primary,
                            showMark: false,
                            curve: 'stepAfter',
                            area: true,
                        },
                    ]}
                />
            </ChartCard>
        </div>
    )
}
