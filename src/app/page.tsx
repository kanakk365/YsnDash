"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

import { AppSidebar } from "@/components/app-sidebar"
import { DashboardTabs } from "@/components/dashboard-tabs"
import { SiteHeader } from "@/components/site-header"
import { DashboardProvider } from "@/contexts/dashboard-context"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default function Home() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push("/login")
      } else if (user?.role === "coach") {
        router.push("/dashboard/coach")
      }
    }
  }, [isAuthenticated, loading, user, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  // Only show super admin dashboard
  if (user?.role !== "super_admin") {
    return null
  }

  return (
    <DashboardProvider>
      <div className="h-screen">
        <SidebarProvider
          className="flex h-full"
          style={
            {
              "--sidebar-width": "calc(var(--spacing) * 72)",
              "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties
          }
        >
          <div className="flex h-full w-full">
            <AppSidebar variant="inset" />
            <SidebarInset className="flex-1 h-full flex flex-col overflow-hidden">
              <SiteHeader />
              <div className="flex-1 overflow-auto">
                <div className="@container/main">
                  <div className="px-4 lg:px-6 py-4">
                    <DashboardTabs />
                  </div>
                </div>
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </DashboardProvider>
  );
}
