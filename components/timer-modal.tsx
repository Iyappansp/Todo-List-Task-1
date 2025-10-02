"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useTimer } from "@/hooks/use-timer"

function format(seconds: number) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0")
  const s = (seconds % 60).toString().padStart(2, "0")
  return `${m}:${s}`
}

export function TimerModal() {
  const t = useTimer()
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Timer</Button>
      </DialogTrigger>
      <DialogContent className="bg-card/80 backdrop-blur">
        <DialogHeader>
          <DialogTitle>Pomodoro Timer</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <p className="text-sm text-muted-foreground">Mode: {t.mode}</p>
          <div className="text-4xl font-mono text-center">{format(t.seconds)}</div>
          <div className="flex gap-2 justify-center">
            {!t.running ? <Button onClick={t.start}>Start</Button> : <Button onClick={t.pause}>Pause</Button>}
            <Button variant="secondary" onClick={t.reset}>
              Reset
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
