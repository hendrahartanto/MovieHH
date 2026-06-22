import * as React from "react"
import { cn } from "@/lib/utils"

interface AvatarProps extends React.ComponentProps<"div"> {
  name: string
  size?: "sm" | "md" | "lg" | "xl"
}

function Avatar({
  className,
  name,
  size = "md",
  ...props
}: AvatarProps) {
  const initials = name ? name.substring(0, 2).toUpperCase() : ""

  const sizeClasses = {
    sm: "w-9 h-9 text-sm font-semibold border border-primary/40",
    md: "w-12 h-12 text-base font-semibold border border-primary/40",
    lg: "w-16 h-16 text-2xl font-bold border-2 border-primary/50",
    xl: "w-24 h-24 text-3xl font-bold border-2 border-primary/50",
  }

  return (
    <div
      data-slot="avatar"
      className={cn(
        "rounded-full bg-linear-to-tr from-primary to-purple-600 flex items-center justify-center text-white overflow-hidden shadow-md transition-colors",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {initials}
    </div>
  )
}

export { Avatar }
