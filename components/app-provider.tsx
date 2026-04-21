'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { translations, type Language, type Translations } from '@/lib/language/translations'

type View = 'dashboard' | 'charts'

interface AppContextType {
    // Language
    language: Language
    setLanguage: (lang: Language) => void
    t: Translations
    // Units
    isMetric: boolean
    setIsMetric: (value: boolean) => void
    // Theme
    isDark: boolean
    setIsDark: (value: boolean) => void
    // Navigation
    currentView: View
    setCurrentView: (view: View) => void
    // Sidebar
    sidebarOpen: boolean
    setSidebarOpen: (open: boolean) => void
    sidebarCollapsed: boolean
    setSidebarCollapsed: (collapsed: boolean) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>('es')
    const [isMetric, setIsMetric] = useState(true)
    const [isDark, setIsDark] = useState(true)
    const [currentView, setCurrentView] = useState<View>('dashboard')
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [sidebarCollapsed, setSidebarCollapsed] = useState(true)

    // Apply dark mode to document
    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, [isDark])

    // Update html lang attribute
    useEffect(() => {
        document.documentElement.lang = language
    }, [language])

    const t = translations[language]

    return (
        <AppContext.Provider
            value={{
                language,
                setLanguage,
                t,
                isMetric,
                setIsMetric,
                isDark,
                setIsDark,
                currentView,
                setCurrentView,
                sidebarOpen,
                setSidebarOpen,
                sidebarCollapsed,
                setSidebarCollapsed,
            }}
        >
            {children}
        </AppContext.Provider>
    )
}

export function useApp() {
    const context = useContext(AppContext)
    if (!context) {
        throw new Error('useApp must be used within an AppProvider')
    }
    return context
}
