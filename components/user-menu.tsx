"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/menu";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import type { CurrentSession } from "@/types/session";
import {
  CreditCard,
  Loader2,
  LogInIcon,
  LogOutIcon,
  Settings2,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

type UserMenuVariant = "default" | "icon";

type UserMenuProps = {
  session: CurrentSession;
  variant?: UserMenuVariant;
};

export function UserMenu({ session, variant = "default" }: UserMenuProps) {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = React.useState(false);
  const user = session?.user;

  const initials = React.useMemo(() => {
    if (user?.name) {
      return user.name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("");
    }

    return user?.email?.[0]?.toUpperCase() ?? "?";
  }, [user]);

  const triggerLabel = user?.name ?? user?.email ?? "Account";

  if (!user) {
    return (
      <Link
        href="/login"
        className={cn(
          buttonVariants({
            variant: "outline",
            size: variant === "icon" ? "icon" : "sm",
          }),
          "gap-2 rounded-full border-border/80 bg-background/80 backdrop-blur px-3 py-1",
          variant === "icon" ? "h-9 w-9" : "ps-1 pe-3 text-sm font-medium"
        )}
        aria-label={variant === "icon" ? "Sign in" : undefined}
      >
        <LogInIcon className="h-4 w-4" />
        {variant === "default" ? <span>Sign in</span> : null}
      </Link>
    );
  }

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      const { error } = await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.refresh();
          },
        },
      });

      if (error) {
        toast.error(error.message ?? "Unable to sign out.");
        return;
      }

      toast.success("Signed out successfully.");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while signing out.");
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            buttonVariants({
              variant: "outline",
              size: variant === "icon" ? "icon" : "sm",
            }),
            "gap-2 rounded-full border-border/80 bg-background/80 backdrop-blur",
            variant === "icon" ? "h-9 w-9 p-0" : "ps-1 pe-3 text-sm font-medium"
          )}
          aria-label="Open account menu"
        >
          <Avatar className={variant === "icon" ? "size-7" : "size-8"}>
            {user?.image ? (
              <AvatarImage src={user.image} alt={user.name ?? ""} />
            ) : null}
            <AvatarFallback>
              {user ? initials : <UserRound className="h-4 w-4" />}
            </AvatarFallback>
          </Avatar>
          {variant === "default" && (
            <span className="max-w-[8.5rem] truncate text-left">
              {triggerLabel}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium leading-tight">
            {user.name ?? "Logged in"}
          </p>
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/settings" className="flex items-center gap-2">
            <Settings2 className="h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/billing" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Billing
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleSignOut}
          variant="destructive"
          className="cursor-pointer"
          disabled={isSigningOut}
        >
          {isSigningOut ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LogOutIcon className="h-4 w-4" />
          )}
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
