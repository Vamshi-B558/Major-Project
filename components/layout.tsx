"use client"

import type { ReactNode } from "react"

interface LayoutProps {
  children: ReactNode
  title?: string
}

export function Layout({ children, title }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fillRule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%239C92AC&quot; fillOpacity=&quot;0.1&quot;%3E%3Ccircle cx=&quot;30&quot; cy=&quot;30&quot; r=&quot;1&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      <div className="relative z-10">
        {title && (
          <header className="border-b border-cyan-500/20 bg-slate-900/50 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-4">
              <h1 className="text-2xl font-bold text-cyan-400">{title}</h1>
            </div>
          </header>
        )}
        {children}
      </div>
    </div>
  )
}
