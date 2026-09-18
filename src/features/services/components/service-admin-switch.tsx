import { cn } from "@/shared/lib/cn";

type ServiceAdminSwitchProps = {
  checked: boolean;
  disabled?: boolean;
  label: string;
  onChange: (checked: boolean) => void;
};

export function ServiceAdminSwitch({
  checked,
  disabled,
  label,
  onChange,
}: ServiceAdminSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      className={cn(
        "relative h-5 w-9 shrink-0 rounded-full transition-colors",
        checked ? "bg-[var(--brand)]" : "bg-[var(--border)]",
        disabled && "opacity-60",
      )}
      onClick={() => onChange(!checked)}
    >
      <span
        className={cn(
          "absolute top-0.5 size-4 rounded-full bg-white transition-[left]",
          checked ? "left-[1.125rem]" : "left-0.5",
        )}
      />
    </button>
  );
}
