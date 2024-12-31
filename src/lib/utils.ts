import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(currency: number) {
  const CADformatter = new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  });

  return CADformatter.format(currency);
}

export function formatDate(date: Date) {
  const dateFormatter = new Intl.DateTimeFormat("en-CA", {
    day: "numeric",
    year: "numeric",
    month: "long",
  });

  return dateFormatter.format(date);
}
