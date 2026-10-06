"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import { cn } from "@/shared/lib/cn";

export type HeaderSearchItem = {
  title: string;
  href: string;
};

type HeaderSearchTone = "onDark" | "onLight";

type HeaderSearchProps = {
  label: string;
  placeholder: string;
  backLabel: string;
  items: HeaderSearchItem[];
  tone?: HeaderSearchTone;
};

export function HeaderSearch({
  label,
  placeholder,
  backLabel,
  items,
  tone = "onDark",
}: HeaderSearchProps) {
  const router = useRouter();
  const inputId = useId();
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const suggestions = useMemo(() => matchTitles(items, query), [items, query]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const close = () => setOpen(false);
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      }
    };
    const closeOnOutside = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node) || rootRef.current?.contains(target)) {
        return;
      }
      close();
    };

    window.addEventListener("keydown", closeOnEscape);
    window.addEventListener("scroll", close, { passive: true });
    document.addEventListener("pointerdown", closeOnOutside);
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("scroll", close);
      document.removeEventListener("pointerdown", closeOnOutside);
    };
  }, [open]);

  const openResult = (href: string) => {
    router.push(href);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className={cn(
          "flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full transition duration-300",
          tone === "onDark"
            ? "text-white hover:bg-white/10"
            : "text-[var(--ink)] hover:bg-black/5",
        )}
      >
        <SearchIcon />
      </button>
      {open ? (
        <SearchPanel
          inputId={inputId}
          listId={listId}
          label={label}
          placeholder={placeholder}
          backLabel={backLabel}
          query={query}
          suggestions={suggestions}
          onQueryChange={setQuery}
          onClose={() => setOpen(false)}
          onOpenResult={openResult}
          onSubmit={() => {
            const value = query.trim();
            if (value) {
              router.push(`/search?q=${encodeURIComponent(value)}`);
              setOpen(false);
            }
          }}
        />
      ) : null}
    </div>
  );
}

type SearchPanelProps = {
  inputId: string;
  listId: string;
  label: string;
  placeholder: string;
  backLabel: string;
  query: string;
  suggestions: HeaderSearchItem[];
  onQueryChange: (value: string) => void;
  onClose: () => void;
  onOpenResult: (href: string) => void;
  onSubmit: () => void;
};

function SearchPanel({
  inputId,
  listId,
  label,
  placeholder,
  backLabel,
  query,
  suggestions,
  onQueryChange,
  onClose,
  onOpenResult,
  onSubmit,
}: SearchPanelProps) {
  return (
    <div className="absolute right-0 top-full z-[80] mt-3 w-80 max-w-[calc(100vw-2.5rem)] rounded-2xl bg-white p-3 text-left shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <label htmlFor={inputId} className="sr-only">
          {label}
        </label>
        <input
          id={inputId}
          type="search"
          autoFocus
          value={query}
          placeholder={placeholder}
          role="combobox"
          aria-expanded={suggestions.length > 0}
          aria-controls={listId}
          aria-autocomplete="list"
          onChange={(event) => onQueryChange(event.target.value)}
          className="h-11 w-full rounded-full border border-black/10 px-4 text-sm text-[var(--ink)] outline-none placeholder:text-black/40"
        />
        <button type="button" className="sr-only" onClick={onClose}>
          {backLabel}
        </button>
      </form>
      <ul
        id={listId}
        role="listbox"
        style={{ maxHeight: 240, overflowY: "auto" }}
        className="mt-2 overscroll-contain"
      >
        {suggestions.map((item) => (
          <li key={item.href} role="option" aria-selected={false}>
            <Link
              href={item.href}
              onClick={(event) => {
                event.preventDefault();
                onOpenResult(item.href);
              }}
              className="block border-b border-black/8 py-4 text-base text-[var(--ink)] hover:text-[var(--brand)]"
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function matchTitles(items: HeaderSearchItem[], query: string): HeaderSearchItem[] {
  const needle = query.trim().toLocaleLowerCase();
  if (!needle) {
    return [];
  }

  return items.filter((item) => item.title.toLocaleLowerCase().includes(needle));
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="5.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 12.5L15.5 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
