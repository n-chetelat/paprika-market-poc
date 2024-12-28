"use client";

import LogoutButton from "@/components/navbar/LogoutButton";
import { User } from "@/lib/types";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type AvatarMenuProps = {
  user: User;
};

export default function AvatarMenu({ user }: AvatarMenuProps) {
  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger className="rounded-full focus:outline-primary">
          <Avatar>
            <AvatarImage src={user.avatarUrl} alt={`${fullName} avatar`} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {fullName.slice(0, 1)}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" forceMount>
          <DropdownMenuLabel>
            <p>{fullName}</p>
            <p className="text-muted-foreground text-xs">{user.email}</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <LogoutButton />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
