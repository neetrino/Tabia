"use client";

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  type SortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/shared/lib/cn";

type AdminSortableRootProps = {
  items: string[];
  disabled?: boolean;
  strategy?: SortingStrategy;
  onReorder: (activeId: string, overId: string) => void;
  children: ReactNode;
};

type AdminSortableGripProps = {
  label: string;
  disabled?: boolean;
  attributes: ReturnType<typeof useSortable>["attributes"];
  listeners: ReturnType<typeof useSortable>["listeners"];
};

type UseAdminSortableItemResult = {
  setNodeRef: (node: HTMLElement | null) => void;
  style: CSSProperties;
  isDragging: boolean;
  attributes: ReturnType<typeof useSortable>["attributes"];
  listeners: ReturnType<typeof useSortable>["listeners"];
};

const POINTER_ACTIVATION_DISTANCE_PX = 6;

export function AdminSortableRoot({
  items,
  disabled = false,
  strategy = verticalListSortingStrategy,
  onReorder,
  children,
}: AdminSortableRootProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: POINTER_ACTIVATION_DISTANCE_PX },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent): void {
    const { active, over } = event;
    if (disabled || !over || active.id === over.id) {
      return;
    }
    onReorder(String(active.id), String(over.id));
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={strategy} disabled={disabled}>
        {children}
      </SortableContext>
    </DndContext>
  );
}

export function AdminSortableGrip({
  label,
  disabled = false,
  attributes,
  listeners,
}: AdminSortableGripProps) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      className={cn(
        "touch-none shrink-0 text-[var(--muted)]",
        disabled
          ? "cursor-not-allowed opacity-40"
          : "cursor-grab hover:text-[var(--foreground)] active:cursor-grabbing",
      )}
      {...attributes}
      {...listeners}
    >
      <GripVertical className="size-4" strokeWidth={1.75} aria-hidden />
    </button>
  );
}

export function useAdminSortableItem(
  id: string,
  disabled = false,
): UseAdminSortableItemResult {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });

  return {
    setNodeRef,
    style: {
      transform: CSS.Transform.toString(transform),
      transition,
    },
    isDragging,
    attributes,
    listeners,
  };
}

/** Moves an item identified by `id` to the position of `overId`. */
export function moveItemById<T extends { id: string }>(
  items: T[],
  activeId: string,
  overId: string,
): T[] {
  const from = items.findIndex((item) => item.id === activeId);
  const to = items.findIndex((item) => item.id === overId);
  if (from < 0 || to < 0 || from === to) {
    return items;
  }
  return arrayMove(items, from, to);
}
