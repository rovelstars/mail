"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Inbox, ShieldAlert, Settings, LogOut } from "lucide-react"
import type { ReactNode } from "react"
import type { EmailCategory } from "@/App"

type Props = {
  activeCategory: EmailCategory
  onSelectCategory: (c: EmailCategory) => void
  onOpenSettings: () => void
  onLogout?: () => void
  primaryCount?: number
  spamCount?: number
  outboxCount?: number
}

function NavItem({
  active,
  icon,
  label,
  count,
  onClick,
}: {
  active?: boolean
  icon: ReactNode
  label: string
  count?: number
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-between rounded-md px-3 py-2 text-sm",
        active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "hover:bg-sidebar-accent",
      )}
    >
      <span className="flex items-center gap-2">
        {icon}
        {label}
      </span>
      {typeof count === "number" && <span className="text-xs text-muted-foreground">{count || ""}</span>}
    </button>
  )
}

export function Sidebar({
  activeCategory,
  onSelectCategory,
  onOpenSettings,
  onLogout,
  primaryCount = 0,
  spamCount = 0,
  outboxCount = 0,
}: Props) {
  return (
    <aside className="w-60 bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col">
      <div className="px-3 py-4">
        <div className="text-sm font-medium mb-2 px-2">Folders</div>
        <div className="grid gap-1">
          <NavItem
            active={activeCategory === "primary"}
            icon={<Inbox className="size-4" aria-hidden="true" />}
            label="Primary"
            count={primaryCount}
            onClick={() => onSelectCategory("primary")}
          />
          <NavItem
            active={activeCategory === "spam"}
            icon={<ShieldAlert className="size-4" aria-hidden="true" />}
            label="Spam"
            count={spamCount}
            onClick={() => onSelectCategory("spam")}
          />
          <NavItem
            active={activeCategory === "outbox"}
            icon={<ShieldAlert className="size-4" aria-hidden="true" />}
            label="Outbox"
            count={outboxCount}
            onClick={() => onSelectCategory("outbox")}
          />
        </div>
      </div>

      <div className="mt-auto border-t border-sidebar-border px-2 py-2 flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={onOpenSettings} aria-label="Account settings">
          <Settings className="size-4" />
        </Button>
        {onLogout && (
          <Button variant="ghost" size="icon" onClick={onLogout} aria-label="Logout">
            <LogOut className="size-4" />
          </Button>
        )}
      </div>
    </aside>
  )
}
