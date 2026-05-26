<script setup>
import { computed } from "vue";

const props = defineProps({
  /**
   * Array of selected session IDs (v-model for multi-select).
   */
  modelValue: {
    type: Array,
    default: () => [],
  },
  session: {
    type: Object,
    required: true,
  },
  /**
   * Marks the card as unavailable (full capacity or time conflict).
   * Parent is responsible for computing this.
   */
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

const isSelected = computed(() => props.modelValue.includes(props.session.id));

function toggle() {
  if (props.disabled) return;
  const next = isSelected.value
    ? props.modelValue.filter((id) => id !== props.session.id)
    : [...props.modelValue, props.session.id];
  emit("update:modelValue", next);
}

// ── Time formatting ───────────────────────────────────────────────
function formatTime(iso) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  });
}

const timeRange = computed(
  () =>
    `${formatTime(props.session.date)} – ${formatTime(props.session.endDate)}`,
);

// ── Capacity ──────────────────────────────────────────────────────
const spotsLeft = computed(
  () => props.session.capacity - props.session.registered,
);
const isSoldOut = computed(() => spotsLeft.value <= 0);
const fillPercent = computed(() =>
  Math.min((props.session.registered / props.session.capacity) * 100, 100),
);
const remainingRatio = computed(() => spotsLeft.value / props.session.capacity);

/**
 * Returns the design-token color class shared between the capacity bar fill
 * and the "X spots left" label.
 *   sold out         → danger
 *   ≤ 25% remaining  → accent (orange)
 *   ≤ 50% remaining  → warning (yellow)
 *   > 50% remaining  → brand-emphasis (teal)
 */
const capacityToken = computed(() => {
  if (isSoldOut.value) {
    return { fill: "bg-danger-emphasis-rest", text: "text-danger-emphasis" };
  }
  if (props.disabled) {
    return { fill: "bg-warning-emphasis-rest", text: "text-warning" };
  }
  if (remainingRatio.value <= 0.25) {
    return { fill: "bg-accent-bold-rest", text: "text-accent-emphasis" };
  }
  if (remainingRatio.value <= 0.5) {
    return { fill: "bg-warning-emphasis-rest", text: "text-warning" };
  }
  return { fill: "bg-brand-emphasis-rest", text: "text-brand-emphasis" };
});

// ── Track badge ───────────────────────────────────────────────────
const trackStyleMap = {
  main: { bg: "bg-neutral-subtle-rest", text: "text-neutral-muted" },
  frontend: { bg: "bg-accent-muted-rest", text: "text-accent-emphasis" },
  backend: { bg: "bg-info-muted-rest", text: "text-info-emphasis" },
  devops: { bg: "bg-warning-muted-rest", text: "text-warning-emphasis" },
};

const trackStyle = computed(
  () => trackStyleMap[props.session.track] ?? trackStyleMap.main,
);
</script>

<template>
  <div
    role="checkbox"
    :aria-checked="isSelected"
    :aria-disabled="disabled"
    :tabindex="disabled ? -1 : 0"
    @click="toggle"
    @keydown.space.prevent="toggle"
    @keydown.enter.prevent="toggle"
    :class="[
      'flex flex-col gap-2 rounded-md p-4 outline-none transition-all duration-150',
      'shadow-[0px_4px_16px_0px_rgba(0,0,0,0.08),0px_1px_3px_0px_rgba(0,0,0,0.04)]',
      isSelected
        ? 'border-2 border-brand-emphasis bg-brand-muted-rest cursor-pointer'
        : disabled
          ? 'border border-neutral-muted bg-surface-l2 cursor-not-allowed'
          : 'border border-neutral-muted bg-surface-l0 cursor-pointer hover:border-brand-muted hover:bg-brand-subtle-hover',
      !disabled && 'focus-visible:border-brand-emphasis',
    ]"
  >
    <!-- Top row: track badge + checkbox -->
    <div class="flex items-center justify-between gap-3">
      <span
        :class="[
          trackStyle.bg,
          trackStyle.text,
          'inline-flex items-center rounded-full px-[9px] py-[3px] text-[11px] font-medium leading-[14px] uppercase tracking-wide',
        ]"
      >
        {{ session.track }}
      </span>

      <!-- Custom checkbox (hidden when disabled) -->
      <div
        v-if="!disabled"
        :class="[
          'flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border transition-colors',
          isSelected
            ? 'border-brand-emphasis bg-brand-emphasis-rest'
            : 'border-neutral-emphasis bg-surface-l0',
        ]"
      >
        <q-icon
          v-if="isSelected"
          name="check"
          size="12px"
          class="text-inverse"
        />
      </div>
    </div>

    <!-- Title -->
    <h3
      class="text-subtitle1"
      :class="disabled ? 'text-neutral-disabled' : 'text-neutral'"
    >
      {{ session.title }}
    </h3>

    <!-- Speaker -->
    <p
      class="text-[length:var(--font-size-sm)] leading-[16px]"
      :class="disabled ? 'text-neutral-disabled' : 'text-neutral-muted'"
    >
      {{ session.speaker }}, {{ session.speakerTitle }}
    </p>

    <!-- Time range -->
    <p
      class="text-[11px] leading-[14px]"
      :class="disabled ? 'text-neutral-disabled' : 'text-neutral-quiet'"
    >
      {{ timeRange }}
    </p>

    <!-- Capacity progress bar -->
    <div class="h-1.5 w-full overflow-hidden rounded-[3px] bg-surface-l2">
      <div
        class="h-full rounded-[3px] transition-all duration-150"
        :class="capacityToken.fill"
        :style="{ width: `${fillPercent}%` }"
      />
    </div>

    <!-- Spots left / Sold out -->
    <p
      class="text-[11px] leading-[14px]"
      :class="[
        capacityToken.text,
        isSoldOut ? 'font-semibold' : 'font-medium',
      ]"
    >
      {{ isSoldOut ? "Sold Out" : `${spotsLeft} spots left` }}
    </p>
  </div>
</template>
