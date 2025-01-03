"use server";

import { createSession, deleteSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { z } from "zod";
import { compareSync, hashSync, genSaltSync } from "bcrypt-ts";
import prisma from "@/lib/prisma";
import { createCustomer } from "@/actions/lib/stripe";

const signupSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email({ message: "Invalid email address" }).trim(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .trim(),
});

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }).trim(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .trim(),
});

export async function signup(prevState: any, formData: FormData) {
  const result = signupSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { firstName, lastName, email, password } = result.data;
  const hashedPassword = hashSync(password, genSaltSync());
  let user = await prisma.user.create({
    data: { firstName, lastName, email, hashedPassword },
  });

  if (user === null) {
    return {
      errors: {
        email: ["There was a problem creating the user account"],
      },
    };
  }

  const customer = await createCustomer(user);

  user = await prisma.user.update({
    where: { id: user.id },
    data: { stripeCustomerId: customer.id },
  });

  await createSession(user.id);
  redirect("/");
}

export async function login(prevState: any, formData: FormData) {
  const result = loginSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { email, password } = result.data;
  const user = await prisma.user.findFirst({
    where: { email },
  });

  const passwordValid = compareSync(password, user?.hashedPassword || "");

  if (user === null || !passwordValid) {
    return {
      errors: {
        email: ["Invalid email or password"],
      },
    };
  }

  await createSession(user.id);
  redirect("/");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
