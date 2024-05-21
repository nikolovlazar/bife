'use client'

import { useTheme } from 'next-themes'

import {
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu'

export function ThemeSwitcher() {
  const { themes, theme, setTheme } = useTheme()
  return (
    <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
      {themes.map((themeName) => (
        <DropdownMenuRadioItem
          key={themeName}
          value={themeName}
          className="capitalize"
        >
          {themeName}
        </DropdownMenuRadioItem>
      ))}
    </DropdownMenuRadioGroup>
  )
}
