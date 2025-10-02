import { NextResponse } from "next/server"

const AI_ENABLED = process.env.AI_SUGGESTIONS_ENABLED === "true"

function heuristicSuggest(prompt: string) {
  const p = prompt.toLowerCase()

  // very light heuristics
  const category: "work" | "personal" | "health" | "learning" | "misc" =
    p.includes("work") || p.includes("meeting") || p.includes("email")
      ? "work"
      : p.includes("gym") || p.includes("run") || p.includes("doctor")
        ? "health"
        : p.includes("study") || p.includes("learn") || p.includes("course")
          ? "learning"
          : p.includes("family") || p.includes("home") || p.includes("call mom")
            ? "personal"
            : "misc"

  const priority: "low" | "medium" | "high" =
    p.includes("urgent") || p.includes("asap") || p.includes("today")
      ? "high"
      : p.includes("soon") || p.includes("this week")
        ? "medium"
        : "low"

  // parse a very naive due date: "today", "tomorrow", "in 2 days"
  let dueDate: string | null = null
  const now = new Date()
  if (p.includes("today")) {
    dueDate = new Date(now).toISOString()
  } else if (p.includes("tomorrow")) {
    const d = new Date(now)
    d.setDate(d.getDate() + 1)
    dueDate = d.toISOString()
  } else {
    const m = p.match(/in\s+(\d+)\s+day/)
    if (m) {
      const days = Number.parseInt(m[1], 10)
      const d = new Date(now)
      d.setDate(d.getDate() + days)
      dueDate = d.toISOString()
    }
  }

  // title: take the first sentence or cap length
  const title =
    prompt
      .split(/[.!?\n]/)[0]
      .trim()
      .slice(0, 80) || "New task"

  return {
    title,
    category,
    priority,
    dueDate,
  }
}

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 })
    }
    // Always return heuristic suggestion to avoid optional AI dependency during build
    return NextResponse.json({
      suggestion: heuristicSuggest(prompt),
      note: AI_ENABLED
        ? "AI_SUGGESTIONS_ENABLED=true was set, but the AI module is not bundled in this build. Returning heuristic suggestion."
        : "AI disabled. Set AI_SUGGESTIONS_ENABLED=true and add an AI provider if you want model suggestions.",
    })
  } catch (err: any) {
    const statusText = typeof err?.message === "string" ? err.message : "unknown_error"
    return NextResponse.json(
      {
        suggestion: heuristicSuggest(""),
        note:
          "Returned heuristic suggestion due to AI error. " +
          "If you want model-powered suggestions, set AI_SUGGESTIONS_ENABLED=true and ensure billing/API access is available. " +
          `Error: ${statusText}`,
      },
      { status: 200 },
    )
  }
}
