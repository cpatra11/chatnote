"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import logo from "@/assets/logo.png";
import { UserButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import AddNoteButton from "./AddEditNoteDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import AddEditNoteDialog from "./AddEditNoteDialog";
import ThemeToggleButton from "./ThemeToggleButton";

import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import AIChatButton from "./AIChatButton";
const NavBar = () => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false); // State to manage dialog visibility
  const [showAddNoteDialog, setShowAddNoteDialog] = useState(false);
  return (
    <>
      <div className="p-4 shadow">
        <div className="m-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <Link href="/notes" className="flex items-center gap-1">
            <Image src={logo} alt="Chatnote Logo" width={40} height={40} />
            <span className="font-bold">Chatnote</span>
          </Link>
          <div className="flex items-center gap-2">
            <UserButton
              appearance={{
                baseTheme: theme === "dark" ? dark : undefined,
                elements: {
                  avatarBox: {
                    width: "2.5rem",
                    height: "2.5rem",
                    borderRadius: "full",
                  },
                },
              }}
            />
            <ThemeToggleButton />
            <Button onClick={() => setShowAddNoteDialog(true)}>
              <Plus size={20} className="mr-2" />
              Add Note
            </Button>
            <AIChatButton />
          </div>
        </div>
      </div>
      <AddEditNoteDialog
        open={showAddNoteDialog}
        setOpen={setShowAddNoteDialog}
      />
    </>
  );
};

export default NavBar;
