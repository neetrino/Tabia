"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { loginAction, type LoginState } from "@/features/auth/client";

const initialState: LoginState = {};

const fieldClassName =
  "mt-1 w-full rounded-[15px] border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[#171717] outline-none transition-colors focus:border-[var(--brand)] focus:bg-white";

export function AdminLoginForm() {
  const t = useTranslations("admin");
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <label className="block" htmlFor="email">
        <span className="text-sm font-medium text-[#171717]">{t("login.email")}</span>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className={fieldClassName}
        />
      </label>
      <label className="block" htmlFor="password">
        <span className="text-sm font-medium text-[#171717]">
          {t("login.password")}
        </span>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="current-password"
          className={fieldClassName}
        />
      </label>
      {state.errorKey ? (
        <p className="text-sm font-medium text-red-700">
          {t(`login.errors.${state.errorKey}`)}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="mt-2 flex h-12 w-full items-center justify-center rounded-full bg-[var(--brand)] px-8 text-base font-semibold tracking-[0.3px] text-[var(--cream)] transition-colors hover:bg-[var(--brand-deep)] disabled:opacity-60"
      >
        {pending ? t("login.pending") : t("login.submit")}
      </button>
    </form>
  );
}
