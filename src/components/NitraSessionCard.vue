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
const fillPercent = computed(() =>
  Math.min((props.session.registered / props.session.capacity) * 100, 100),
);
const remainingRatio = computed(() => spotsLeft.value / props.session.capacity);

const spotsColorClass = computed(() => {
  if (props.disabled) return "text-neutral-muted";
  if (remainingRatio.value <= 0.25) return "text-accent";
  if (remainingRatio.value <= 0.5) return "text-warning";
  return "text-success";
});

// Quasar color names for q-linear-progress (closest match to Nitra tokens)
const barQuasarColor = computed(() => {
  if (props.disabled) return "grey-4";
  if (remainingRatio.value <= 0.25) return "deep-orange";
  if (remainingRatio.value <= 0.5) return "yellow-9";
  return "teal";
});

// ── Track badge ───────────────────────────────────────────────────
const trackStyleMap = {
  main: { bg: "bg-neutral-subtle-rest", text: "text-neutral" },
  frontend: { bg: "bg-brand-subtle-rest", text: "text-brand" },
  backend: { bg: "bg-info-subtle-rest", text: "text-info" },
  devops: { bg: "bg-accent-subtle-rest", text: "text-accent" },
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
      'flex flex-col gap-2 rounded-xl border-2 p-4 transition-all duration-150 outline-none',
      isSelected
        ? 'bg-brand-subtle-rest border-brand-emphasis cursor-pointer'
        : disabled
          ? 'bg-surface-l2 border-neutral-muted cursor-not-allowed'
          : 'bg-surface-l0 border-neutral-muted cursor-pointer hover:border-brand-muted hover:bg-brand-subtle-hover',
      !disabled && 'focus-visible:border-brand-emphasis',
    ]"
  >
    <!-- Top row: track badge + checkbox -->
    <div class="flex items-start justify-between gap-3">
      <span
        :class="[
          trackStyle.bg,
          trackStyle.text,
          'inline-block rounded-full px-2.5 py-0.5 text-[length:var(--font-size-sm)] font-semibold uppercase tracking-wide',
        ]"
      >
        {{ session.track }}
      </span>

      <!-- Custom checkbox (hidden when disabled) -->
      <div
        v-if="!disabled"
        :class="[
          'shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors',
          isSelected
            ? 'bg-brand-emphasis-rest border-brand-emphasis'
            : 'bg-surface-l0 border-neutral-muted',
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
      :class="disabled ? 'text-neutral-muted' : 'text-neutral'"
    >
      {{ session.title }}
    </h3>

    <!-- Speaker -->
    <p
      class="text-[length:var(--font-size-sm)]"
      :class="disabled ? 'text-neutral-muted' : 'text-neutral-muted'"
    >
      {{ session.speaker }}, {{ session.speakerTitle }}
    </p>

    <!-- Time range -->
    <p
      class="text-[length:var(--font-size-sm)]"
      :class="disabled ? 'text-neutral-muted' : 'text-neutral-quiet'"
    >
      {{ timeRange }}
    </p>

    <!-- Capacity progress bar -->
    <q-linear-progress
      :value="fillPercent / 100"
      :color="barQuasarColor"
      track-color="grey-2"
      rounded
      size="6px"
    />

    <!-- Spots left -->
    <p
      class="text-[length:var(--font-size-sm)] font-semibold"
      :class="spotsColorClass"
    >
      {{ spotsLeft }} spots left
    </p>
  </div>
</template>
