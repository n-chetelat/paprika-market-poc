import { Button } from "@/components/ui/button";
import { logout } from "@/actions/auth";

export default function LogoutButton() {
  return (
    <form action={logout}>
      <Button type="submit" variant="link">
        Logout
      </Button>
    </form>
  );
}
