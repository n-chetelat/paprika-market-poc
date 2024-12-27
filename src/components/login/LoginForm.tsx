"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { login } from "@/actions/auth";

export default function LoginForm() {
  const [state, loginAction] = useActionState(login, undefined);
  return (
    <form action={loginAction}>
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Ready for paprika?</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="email-field">Email</Label>
          <Input name="email" type="email" id="email-field" />
          <p className="text-red-500">{state?.errors.email}</p>
          <Label htmlFor="password-field">Password</Label>
          <Input name="password" type="password" id="password-field" />
          <p className="text-red-500">{state?.errors.password}</p>
        </CardContent>
        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </Card>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="w-full"
      disabled={pending}
      aria-disabled={pending}
    >
      Log in
    </Button>
  );
}
