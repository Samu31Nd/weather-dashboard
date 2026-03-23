'use client'

import { useState, useEffect } from 'react'
import { useWeather } from './weather-provider'
import { Sun, Moon, Radio, RefreshCw, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function DashboardHeader() {
  const { data, isMetric, setIsMetric, isDark, setIsDark, refresh, isLoading, lastUpdated } = useWeather()
  const [displayTime, setDisplayTime] = useState<string | null>(null)

  // Update display time only on client to avoid hydration mismatch
  useEffect(() => {
    if (lastUpdated) {
      setDisplayTime(lastUpdated.toLocaleTimeString())
    }
  }, [lastUpdated])

  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
      <div>
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <Radio className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">
            {'Weather Station'}
          </h1>
          {isLoading && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>
        <p className="text-muted-foreground text-sm mt-1 ml-11">
          {displayTime
            ? `Last updated: ${displayTime}`
            : 'Connecting...'}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Refresh Button */}
        <button
          onClick={refresh}
          disabled={isLoading}
          className={cn(
            'rounded-lg bg-secondary p-2.5 text-muted-foreground hover:text-foreground transition-colors',
            isLoading && 'opacity-50 cursor-not-allowed'
          )}
          aria-label="Refresh data"
        >
          <RefreshCw className={cn('h-5 w-5', isLoading && 'animate-spin')} />
        </button>
        <button
          onClick={() => setIsDark(!isDark)}
          className="rounded-lg bg-secondary p-2.5 text-muted-foreground hover:text-foreground transition-colors"
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </div>
    </header>
  )
}
