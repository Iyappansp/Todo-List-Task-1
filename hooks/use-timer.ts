"use client"

import { useEffect, useRef, useState } from "react"

export type TimerMode = "focus" | "break"
type Session = { mode: TimerMode; startedAt: number; endedAt?: number }

export function useTimer() {
  const [seconds, setSeconds] = useState(25 * 60)
  const [mode, setMode] = useState<TimerMode>("focus")
  const [running, setRunning] = useState(false)
  const [history, setHistory] = useState<Session[]>([])
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    if (!running) return
    intervalRef.current = window.setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0))
    }, 1000)
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current)
    }
  }, [running])

  useEffect(() => {
    if (seconds === 0) {
      setRunning(false)
      setHistory((h) => [...h, { mode, startedAt: Date.now(), endedAt: Date.now() }])
      // auto-switch
      if (mode === "focus") {
        setMode("break")
        setSeconds(5 * 60)
      } else {
        setMode("focus")
        setSeconds(25 * 60)
      }
    }
  }, [seconds, mode])

  function start() {
    setRunning(true)
    setHistory((h) => [...h, { mode, startedAt: Date.now() }])
  }
  function pause() {
    setRunning(false)
  }
  function reset() {
    setRunning(false)
    setSeconds(mode === "focus" ? 25 * 60 : 5 * 60)
  }
  function setCustom(minutes: number) {
    setSeconds(minutes * 60)
  }

  return { seconds, mode, running, start, pause, reset, setCustom, setMode, history }
}
