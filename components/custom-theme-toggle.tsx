"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function CustomThemeToggle() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="relative overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={false}
        animate={{ y: theme === "light" ? 0 : -30 }}
        transition={{ duration: 0.2 }}
      >
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      </motion.div>
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={false}
        animate={{ y: theme === "light" ? 30 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      </motion.div>
    </Button>
  )
}

