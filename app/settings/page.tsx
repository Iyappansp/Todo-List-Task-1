"use client"

import { useTheme } from "@/hooks/use-theme"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"

export default function SettingsPage() {
  const { theme, set, toggle } = useTheme()
  const [syncEnabled, setSyncEnabled] = useState(false)

  return (
    <main className="container mx-auto max-w-2xl p-4">
      <h1 className="text-2xl font-semibold mb-4">Settings</h1>
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Theme</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <Button variant="outline" onClick={() => set("light")} aria-pressed={theme === "light"}>
              Light
            </Button>
            <Button variant="outline" onClick={() => set("dark")} aria-pressed={theme === "dark"}>
              Dark
            </Button>
            <Button onClick={toggle}>Toggle</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sync</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <span>Enable Offline Sync (placeholder)</span>
            <Switch checked={syncEnabled} onCheckedChange={setSyncEnabled} aria-label="Enable Sync" />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

