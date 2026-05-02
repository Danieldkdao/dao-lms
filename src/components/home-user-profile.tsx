"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth/auth-client";
import {
  BookOpenIcon,
  ChevronDownIcon,
  Grid2X2Icon,
  HomeIcon,
  LogOutIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type HomeUserProfileProps = {
  dashboardHref: string;
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
};

const getInitials = (name?: string | null) => {
  if (!name) return "U";

  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

export const HomeUserProfile = ({
  dashboardHref,
  user,
}: HomeUserProfileProps) => {
  const router = useRouter();

  const handleLogout = () => {
    authClient
      .signOut()
      .then(() => {
        toast.success("Logged out successfully.");
        router.refresh();
      })
      .catch(() => {
        toast.error("Failed to log out. Please try again.");
      });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center cursor-pointer gap-3 rounded-md outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
          aria-label="Open user menu"
        >
          <Avatar size="lg">
            <AvatarImage
              src={user.image ?? undefined}
              alt={user.name ?? "User"}
            />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <ChevronDownIcon className="size-4 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={12}
        className="w-72 rounded-lg border bg-popover p-2 text-popover-foreground shadow-md"
      >
        <DropdownMenuLabel className="text-base font-normal text-muted-foreground">
          {user.email}
        </DropdownMenuLabel>
        <DropdownMenuItem asChild className="gap-4 text-base">
          <Link href="/">
            <HomeIcon className="size-5 text-muted-foreground" />
            Home
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="gap-4 text-base">
          <Link href="/courses">
            <BookOpenIcon className="size-5 text-muted-foreground" />
            Courses
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="gap-4 text-base">
          <Link href={dashboardHref}>
            <Grid2X2Icon className="size-5 text-muted-foreground" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="my-2" />
        <DropdownMenuItem className="gap-4 text-base" onSelect={handleLogout}>
          <LogOutIcon className="size-5 text-muted-foreground" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
