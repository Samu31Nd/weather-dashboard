'use client'

import { useState } from 'react'
import { useApp } from '@/components/app-provider'
import { Calendar, Clock, Hash, Search, Trash2, ChevronDown, ChevronUp, Settings2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { HistoricalView, QueryMode } from '@/lib/domain/historical-weather.entity'

interface QueryControlsProps {
    selectedViews: HistoricalView[]
    setSelectedViews: (views: HistoricalView[]) => void
    mode: QueryMode
    setMode: (mode: QueryMode) => void
    specificDate: string
    setSpecificDate: (date: string) => void
    dateStart: string
    setDateStart: (date: string) => void
    dateEnd: string
    setDateEnd: (date: string) => void
    days: number
    setDays: (days: number) => void
    onFetch: () => void
    onClearCache: () => void
    isLoading: boolean
    isCached: boolean
}

export function ChartQueryControls({
    selectedViews,
    setSelectedViews,
    mode,
    setMode,
    specificDate,
    setSpecificDate,
    dateStart,
    setDateStart,
    dateEnd,
    setDateEnd,
    days,
    setDays,
    onFetch,
    onClearCache,
    isLoading,
    isCached,
}: QueryControlsProps) {
    const { t, isDark } = useApp()
    const [isCollapsed, setIsCollapsed] = useState(false)

    const views: { id: HistoricalView; label: string }[] = [
        { id: 'vw_temperatura', label: t.charts.temperature },
        { id: 'vw_viento', label: t.charts.wind },
        { id: 'vw_lluvia', label: t.charts.rain },
        { id: 'vw_presion', label: t.charts.barometer },
    ]

    const modes: { id: QueryMode; label: string; icon: React.ElementType }[] = [
        { id: 'specific_date', label: t.charts.specificDate, icon: Calendar },
        { id: 'date_range', label: t.charts.dateRange, icon: Clock },
        { id: 'last_n_days', label: t.charts.lastNDays, icon: Hash },
    ]

    // Toggle view selection
    const toggleView = (viewId: HistoricalView) => {
        if (selectedViews.includes(viewId)) {
            // Don't allow deselecting if it's the only one selected
            if (selectedViews.length > 1) {
                setSelectedViews(selectedViews.filter(v => v !== viewId))
            }
        } else {
            setSelectedViews([...selectedViews, viewId])
        }
    }

    // Get yesterday's date as max date (API updates at 12:00 with previous day's data)
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const maxDate = yesterday.toISOString().split('T')[0]

    // Get summary of selected views
    const selectedViewsLabel = selectedViews.map(v =>
        views.find(view => view.id === v)?.label
    ).join(', ')

    return (
        <Card className="border bg-card/50 backdrop-blur-md overflow-hidden">
            {/* Collapsible Header */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="w-full flex items-center justify-between p-4 sm:p-5 hover:bg-secondary/30 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                        <Settings2 className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-left">
                        <h3 className="font-semibold text-foreground">{t.charts.queryControls || 'Query Controls'}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            {selectedViewsLabel} | {modes.find(m => m.id === mode)?.label}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {isCached && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400">
                            {t.charts.cachedData}
                        </span>
                    )}
                    {isCollapsed ? (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    ) : (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    )}
                </div>
            </button>

            {/* Collapsible Content */}
            <div className={cn(
                'overflow-hidden transition-all duration-300 ease-in-out',
                isCollapsed ? 'max-h-0' : 'max-h-200'
            )}>
                <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0 border-t border-border/50">
                    <div className="space-y-6 pt-4">
                        {/* Data View Multi-Selection */}
                        <div>
                            <label className="text-sm font-medium text-muted-foreground mb-3 block">
                                {t.charts.dataView} ({t.charts.selectMultiple || 'Select multiple'})
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {views.map((v) => {
                                    const isSelected = selectedViews.includes(v.id)
                                    return (
                                        <button
                                            key={v.id}
                                            onClick={() => toggleView(v.id)}
                                            className={cn(
                                                'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border-2',
                                                isSelected
                                                    ? 'bg-primary text-primary-foreground border-primary shadow-md'
                                                    : 'bg-secondary/50 text-muted-foreground border-transparent hover:bg-secondary hover:text-foreground hover:border-secondary'
                                            )}
                                        >
                                            {v.label}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Query Mode Selection */}
                        <div>
                            <label className="text-sm font-medium text-muted-foreground mb-3 block">
                                {t.charts.queryMode}
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {modes.map((m) => {
                                    const Icon = m.icon
                                    return (
                                        <button
                                            key={m.id}
                                            onClick={() => setMode(m.id)}
                                            className={cn(
                                                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border',
                                                mode === m.id
                                                    ? 'bg-primary/10 border-primary text-primary'
                                                    : 'bg-secondary/30 border-transparent text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                                            )}
                                        >
                                            <Icon className="h-4 w-4" />
                                            {m.label}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Mode-specific inputs */}
                        <div className="bg-secondary/30 rounded-xl p-4">
                            {mode === 'specific_date' && (
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground mb-2 block">
                                        {t.charts.selectDate}
                                    </label>
                                    <input
                                        type="date"
                                        value={specificDate}
                                        onChange={(e) => setSpecificDate(e.target.value)}
                                        max={maxDate}
                                        className={cn(
                                            'w-full px-4 py-3 rounded-lg border bg-background text-foreground',
                                            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
                                            isDark && 'scheme-dark'
                                        )}
                                    />
                                </div>
                            )}

                            {mode === 'date_range' && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground mb-2 block">
                                            {t.charts.startDate}
                                        </label>
                                        <input
                                            type="datetime-local"
                                            value={dateStart}
                                            onChange={(e) => setDateStart(e.target.value)}
                                            max={dateEnd || maxDate + 'T23:59'}
                                            className={cn(
                                                'w-full px-4 py-3 rounded-lg border bg-background text-foreground',
                                                'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
                                                isDark && 'scheme-dark'
                                            )}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground mb-2 block">
                                            {t.charts.endDate}
                                        </label>
                                        <input
                                            type="datetime-local"
                                            value={dateEnd}
                                            onChange={(e) => setDateEnd(e.target.value)}
                                            min={dateStart}
                                            max={maxDate + 'T23:59'}
                                            className={cn(
                                                'w-full px-4 py-3 rounded-lg border bg-background text-foreground',
                                                'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
                                                isDark && 'scheme-dark'
                                            )}
                                        />
                                    </div>
                                </div>
                            )}

                            {mode === 'last_n_days' && (
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground mb-2 block">
                                        {t.charts.days}: {days}
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="range"
                                            min={1}
                                            max={30}
                                            value={days}
                                            onChange={(e) => setDays(parseInt(e.target.value, 10))}
                                            className="flex-1 h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                                        />
                                        <input
                                            type="number"
                                            min={1}
                                            max={365}
                                            value={days}
                                            onChange={(e) => setDays(Math.max(1, parseInt(e.target.value, 10) || 1))}
                                            className={cn(
                                                'w-20 px-3 py-2 rounded-lg border bg-background text-foreground text-center',
                                                'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
                                            )}
                                        />
                                    </div>
                                    <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                                        <span>1 {t.charts.days.toLowerCase()}</span>
                                        <span>30 {t.charts.days.toLowerCase()}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                onClick={() => {
                                    onFetch()
                                    setIsCollapsed(true) // Collapse after fetching
                                }}
                                disabled={isLoading}
                                className={cn(
                                    'flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200',
                                    'bg-primary text-primary-foreground hover:bg-primary/90',
                                    'disabled:opacity-50 disabled:cursor-not-allowed',
                                    'shadow-lg hover:shadow-xl'
                                )}
                            >
                                <Search className={cn('h-4 w-4', isLoading && 'animate-spin')} />
                                {t.charts.fetchData}
                            </button>

                            <button
                                onClick={onClearCache}
                                className={cn(
                                    'flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200',
                                    'bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground'
                                )}
                            >
                                <Trash2 className="h-4 w-4" />
                                {t.charts.clearCache}
                            </button>
                        </div>
                    </div>
                </CardContent>
            </div>
        </Card>
    )
}
