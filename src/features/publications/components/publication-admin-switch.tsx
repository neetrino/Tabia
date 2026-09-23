import { cn } from "@/shared/lib/cn";

type PublicationAdminSwitchProps = {
  checked: boolean;
  disabled?: boolean;
  label: string;
  onChange: (checked: boolean) => void;
};

export function PublicationAdminSwitch({
  checked,
  disabled,
  label,
  onChange,
}: PublicationAdminSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      className={cn(
        "relative h-5 w-9 shrink-0 rounded-[15px] transition-colors",
        checked ? "bg-[var(--brand)]" : "bg-[var(--border)]",
        disabled && "opacity-60",
      )}
      onClick={() => onChange(!checked)}
    >
      <span
        className={cn(
          "absolute top-0.5 size-4 rounded-[15px] bg-white transition-[left]",
          checked ? "left-[1.125rem]" : "left-0.5",
        )}
      />
    </button>
  );
}
