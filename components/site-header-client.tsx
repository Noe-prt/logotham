"use client";

import { FeedbackDialog } from "@/components/feedback-dialog";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetDescription,
  SheetHeader,
  SheetPopup,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { UserMenu } from "@/components/user-menu";
import type { CurrentSession } from "@/types/session";
import { ExternalLink, MenuIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const MENU_LINKS = [
  { href: "/templates", label: "Templates" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/changelog", label: "Changelog" },
];

const CONTACT_LINK = {
  href: "https://x.com/mathaegon",
  label: "Contact me",
};

type SiteHeaderClientProps = {
  session: CurrentSession;
};

export function SiteHeaderClient({ session }: SiteHeaderClientProps) {
  return (
    <header className="border-b bg-card/80 px-4 lg:px-8 py-3 backdrop-blur">
      <div className="flex h-12 items-center justify-between gap-3">
        <LogoLink />
        <div className="flex items-center gap-2">
          <DesktopNav session={session} />
          <div className="md:hidden flex items-center gap-2">
            <UserMenu session={session} variant="icon" />
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}

function LogoLink() {
  return (
    <div className="flex flex-col gap-1">
      <Link
        href="/"
        className="flex items-center gap-3 hover:opacity-90 transition-opacity"
      >
        <Image
          src="/logotham_icon.png"
          alt="Logotham logo"
          width={32}
          height={32}
          className="h-8 w-8"
        />
        <span className="font-bold tracking-tight hidden sm:inline-block">
          Logotham
        </span>
      </Link>
      <p className="text-[11px] text-muted-foreground leading-tight max-w-[300px]">
        Logo-maker with 24k free icons
      </p>
    </div>
  );
}

function DesktopNav({ session }: { session: CurrentSession }) {
  return (
    <div className="hidden md:flex items-center gap-4 text-sm font-medium text-muted-foreground">
      {MENU_LINKS.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className="hover:text-foreground transition-colors"
        >
          {label}
        </Link>
      ))}
      <FeedbackDialog
        trigger={
          <button className="hover:text-foreground cursor-pointer transition-colors">
            Feedback
          </button>
        }
      />
      <Link
        href={CONTACT_LINK.href}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-1 hover:text-foreground transition-colors"
      >
        {CONTACT_LINK.label}
        <ExternalLink className="h-3 w-3 opacity-50" />
      </Link>
      <div className="h-5 w-px bg-border" aria-hidden="true" />
      <ModeToggle />
      <UserMenu session={session} />
    </div>
  );
}

function MobileMenu() {
  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            aria-label="Open menu"
          >
            <MenuIcon className="h-5 w-5" aria-hidden="true" />
          </Button>
        }
      />
      <SheetPopup side="right" className="w-72 p-0">
        <SheetHeader className="border-b px-4 py-3 text-left">
          <SheetTitle>Navigation</SheetTitle>
          <SheetDescription>Quick links and actions</SheetDescription>
        </SheetHeader>
        <div className="p-4 flex flex-col gap-4 text-sm font-medium">
          <div className="space-y-1">
            {MENU_LINKS.map(({ href, label }) => (
              <SheetClose
                key={href}
                nativeButton={false}
                render={
                  <Link
                    href={href}
                    className="block rounded-md px-3 py-2 hover:bg-muted text-foreground"
                  >
                    {label}
                  </Link>
                }
              />
            ))}
          </div>
          <FeedbackDialog
            trigger={
              <Button
                variant="ghost"
                className="justify-start cursor-pointer px-3"
              >
                Feedback
              </Button>
            }
          />
          <SheetClose
            nativeButton={false}
            render={
              <Link
                href={CONTACT_LINK.href}
                target="_blank"
                rel="noreferrer"
                className="block rounded-md px-3 py-2 hover:bg-muted text-foreground"
              >
                <span className="flex items-center justify-between gap-2">
                  {CONTACT_LINK.label}
                  <ExternalLink className="h-3 w-3 opacity-70" />
                </span>
              </Link>
            }
          />
          <div className="border-t pt-4 flex items-center justify-between">
            <ModeToggle />
          </div>
        </div>
      </SheetPopup>
    </Sheet>
  );
}
