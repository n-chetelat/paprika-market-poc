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
import { signup } from "@/actions/auth";

export default function SignupForm() {
  const [state, signupAction] = useActionState(signup, undefined);
  return (
    <form action={signupAction}>
      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            Sign up to Paprika Market
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="first-name-field">First Name</Label>
          <Input name="firstName" type="text" id="first-name-field" />
          <Label htmlFor="last-name-field">Last Name</Label>
          <Input name="lastName" type="text" id="last-name-field" />
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
      Sign up
    </Button>
  );
}
