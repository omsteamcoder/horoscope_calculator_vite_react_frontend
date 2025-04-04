"use client"

import * as React from "react"
import { createContext, useContext, useState } from "react"

const TooltipContext = createContext(null)

export function TooltipProvider({ children }) {
  const [tooltip, setTooltip] = useState(null)

  return (
    <TooltipContext.Provider value={{ tooltip, setTooltip }}>
      {children}
      {tooltip && (
        <div
          className="absolute z-50 px-2 py-1 text-xs font-medium text-white rounded shadow-sm pointer-events-none"
          style={{
            top: tooltip.y + 10,
            left: tooltip.x,
            transform: "translateX(-50%)",
          }}
        >
          {tooltip.content}
        </div>
      )}
    </TooltipContext.Provider>
  )
}

export function Tooltip({ children }) {
  return <>{children}</>
}

export function TooltipTrigger({ children, asChild }) {
  const { setTooltip } = useContext(TooltipContext)

  const handleMouseEnter = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const tooltipX = rect.left + rect.width / 2
    const tooltipY = rect.top + window.scrollY
    setTooltip({
      x: tooltipX,
      y: tooltipY,
      content: e.currentTarget.__tooltipContent,
    })
  }

  const handleMouseLeave = () => {
    setTooltip(null)
  }

  if (asChild) {
    return React.cloneElement(children, {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
    })
  }

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {children}
    </div>
  )
}

export function TooltipContent({ children }) {
  const triggerRef = React.useRef(null)

  React.useEffect(() => {
    const trigger = triggerRef.current?.parentElement?.previousElementSibling
    if (trigger) {
      trigger.__tooltipContent = children
    }
  }, [children])

  return (
    <div ref={triggerRef} className="hidden">
      {children}
    </div>
  )
}

