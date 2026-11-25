import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(1, "Full name is required").min(2, "Name must be at least 2 characters"),
    email: z.string().min(1, "Email address is required").email("Please enter a valid email address"),
    password: z.string().min(1, "Password is required").min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

export type RegisterFieldErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

export function getPasswordStrength(pwd: string): { score: number; label: string; color: string } {
  if (!pwd) return { score: 0, label: "", color: "#E5D4DA" };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;

  if (score <= 1) return { score: 1, label: "Weak", color: "#E11D48" };
  if (score <= 2) return { score: 2, label: "Fair", color: "#F59E0B" };
  if (score <= 3) return { score: 3, label: "Good", color: "#3B82F6" };
  return { score: 4, label: "Strong", color: "#10B981" };
}
