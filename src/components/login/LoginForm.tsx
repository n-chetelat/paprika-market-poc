"use client";

import { useActionState } from "react";
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
  const [state, loginAction, pending] = useActionState(login, undefined);
  return (
    <form action={loginAction}>
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Ready for paprika?</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="email-field">Email</Label>
          <Input name="email" type="email" id="email-field" />
          <Label htmlFor="password-field">Password</Label>
          <Input name="password" type="password" id="password-field" />
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            Log in
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
