"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { FC } from "react";
import { Button } from "./ui/button";

interface ThemeToggleProps {}

const ThemeToggle: FC<ThemeToggleProps> = ({}) => {
  const { theme, setTheme } = useTheme();

  return (
    <>
      {/* <div className='text-indigo-200 border-indigo-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-blue-900'> */}

      <Button
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        variant="ghost"
        className="h-12 w-12 rounded-full ring-transparent"
      >
        {theme === "dark" ? (
          <Moon className="h-10 w-10 rotate-0 scale-100 transition-all hover:text-slate-400 group-hover:text-slate-400 dark:-rotate-90" />
        ) : (
          <Sun className="h-10 w-10 rotate-0 scale-100 transition-all hover:text-zinc-100 dark:-rotate-90 dark:group-hover:text-zinc-300" />
        )}
      </Button>
    </>
  );
};

export default ThemeToggle;
