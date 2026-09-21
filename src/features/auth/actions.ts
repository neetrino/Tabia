"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { LOGIN_RATE_LIMIT } from "@/shared/config/limits";
import { getClientIp } from "@/shared/lib/client-ip";
import { consumeRateLimit } from "@/shared/lib/rate-limit";
import {
  createAdminSession,
  destroyAdminSession,
  verifyAdminCredentials,
} from "./session";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type LoginState = {
  errorKey?: "invalidCredentials" | "rateLimited";
};

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const allowed = await consumeRateLimit({
    key: `rl:login:${await getClientIp()}`,
    maxAttempts: LOGIN_RATE_LIMIT.maxAttempts,
    windowSeconds: LOGIN_RATE_LIMIT.windowSeconds,
  });
  if (!allowed) {
    return { errorKey: "rateLimited" };
  }

  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { errorKey: "invalidCredentials" };
  }

  const user = await verifyAdminCredentials(
    parsed.data.email,
    parsed.data.password,
  );

  if (!user) {
    return { errorKey: "invalidCredentials" };
  }

  await createAdminSession(user.id);
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await destroyAdminSession();
  redirect("/admin/login");
}
