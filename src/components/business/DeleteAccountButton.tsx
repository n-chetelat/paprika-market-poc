import { Button } from "@/components/ui/button";
import { deleteStripeAccount } from "@/actions/stripe";

export default function DeleteAccountButton() {
  return (
    <form action={deleteStripeAccount}>
      <Button>Delete that account</Button>
    </form>
  );
}
