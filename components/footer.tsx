"use client"

// import { Badge } from "@/components/ui/badge"
// import { motion } from "framer-motion"

export function Footer() {
  return (
    <footer className="glass-card mt-10 p-6 text-center">
      <p className="text-sm text-pretty">
        Built by iyaps <br /> GitHub: <a href="https://github.com/Iyappansp/Todo-List-Task-1">https://github.com/Iyappansp/Todo-List-Task-1</a> <br /> LinkedIn: <a href="https://www.linkedin.com/in/iyappansp">www.linkedin.com/in/iyappansp</a>

      </p>
      <div className="mt-3">
        <a
          href="/image.png"
          download
          className="inline-block px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors duration-200"
          aria-label="Download resume PDF"
        >
          Download Resume
        </a>
      </div>
     
    </footer>
  )
}
