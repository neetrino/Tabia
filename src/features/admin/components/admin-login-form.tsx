"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { loginAction, type LoginState } from "@/features/auth/client";

const initialState: LoginState = {};

export function AdminLoginForm() {
  const t = useTranslations("admin");
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-medium">
          {t("login.email")}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full rounded-[15px] border border-[var(--border)] px-3 py-2"
        />
      </div>
      <div className="space-y-1">
        <label htmlFor="password" className="text-sm font-medium">
          {t("login.password")}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          className="w-full rounded-[15px] border border-[var(--border)] px-3 py-2"
        />
      </div>
      {state.errorKey ? (
        <p className="text-sm text-red-700">{t(`login.errors.${state.errorKey}`)}</p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-[15px] bg-[var(--brand)] px-4 py-2.5 text-sm font-medium text-white transition-transform duration-200 ease-out hover:scale-[1.02] disabled:opacity-60 motion-reduce:transition-none motion-reduce:hover:scale-100"
      >
        {pending ? t("login.pending") : t("login.submit")}
      </button>
    </form>
  );
}
