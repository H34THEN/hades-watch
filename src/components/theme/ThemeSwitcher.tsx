"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "@/components/theme/ThemeProvider";

interface ThemeSwitcherProps {
  className?: string;
  value?: string;
  onThemeChange?: (id: string) => void;
}

export function ThemeSwitcher({
  className,
  value,
  onThemeChange,
}: ThemeSwitcherProps) {
  const { themeId: contextThemeId, setThemeId, themes } = useTheme();
  const themeId = value ?? contextThemeId;

  function handleChange(id: string | null) {
    if (!id) return;
    if (onThemeChange) {
      onThemeChange(id);
    } else {
      setThemeId(id);
    }
  }

  return (
    <Select value={themeId} onValueChange={handleChange}>
      <SelectTrigger className={className} aria-label="Select theme">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        {themes.map((t) => (
          <SelectItem key={t.id} value={t.id}>
            {t.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
