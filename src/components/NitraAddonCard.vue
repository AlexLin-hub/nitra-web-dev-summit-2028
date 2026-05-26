<script setup>
import { computed } from "vue";

/**
 * modelValue shape:
 *   - workshop / meal:   { quantity: 0 | 1 }
 *   - merchandise:       { quantity: 0–maxQuantity, size: string | null }
 *   - null means "not yet interacted" (treated as quantity 0)
 */
const props = defineProps({
  addon: {
    type: Object,
    required: true,
  },
  modelValue: {
    type: Object,
    default: null,
  },
  /**
   * Marks the card as unavailable (workshop conflict or full capacity).
   * Parent is responsible for computing this.
   */
  disabled: {
    type: Boolean,
    default: false,
  },
  /**
   * VIP discount applies 10% off workshop prices.
   */
  vipDiscount: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

// ── Helpers ───────────────────────────────────────────────────────
const isMerchandise = computed(() => props.addon.category === "merchandise");
const isWorkshopOrMeal = computed(() => !isMerchandise.value);

const quantity = computed(() => props.modelValue?.quantity ?? 0);
const selectedSize = computed(() => props.modelValue?.size ?? null);
const isAdded = computed(() => quantity.value > 0);

// ── Display name ──────────────────────────────────────────────────
// For addons with sizes, strip any parenthesised default from the name
// and replace it with the currently selected size.
const displayName = computed(() => {
  if (!props.addon.sizes?.length) return props.addon.name;
  const baseName = props.addon.name.replace(/\s*\([^)]*\)$/, "").trim();
  return selectedSize.value ? `${baseName} (${selectedSize.value})` : baseName;
});

// ── Price ─────────────────────────────────────────────────────────
const effectivePrice = computed(() => {
  if (props.vipDiscount && props.addon.category === "workshop") {
    return props.addon.price * 0.9;
  }
  return props.addon.price;
});

const formattedPrice = computed(
  () => `$${effectivePrice.value.toLocaleString("en-US")}`,
);

// ── Workshop capacity ─────────────────────────────────────────────
const spotsLeft = computed(() => {
  if (props.addon.capacity == null) return null;
  return props.addon.capacity - props.addon.registered;
});

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  });
}

const timeRange = computed(() => {
  if (!props.addon.date) return null;
  const d = new Date(props.addon.date);
  const month = d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
  return `${month}, ${formatTime(props.addon.date)} – ${formatTime(props.addon.endDate)}`;
});

// ── Interactions ──────────────────────────────────────────────────
function toggleCard() {
  if (props.disabled || isMerchandise.value) return;
  const next = isAdded.value ? 0 : 1;
  emit("update:modelValue", { quantity: next });
}

function setSize(size) {
  emit("update:modelValue", { quantity: Math.max(quantity.value, 1), size });
}

function setQuantity(delta) {
  const max = props.addon.maxQuantity ?? 99;
  const next = Math.min(Math.max(quantity.value + delta, 0), max);
  const size =
    next > 0 && props.addon.sizes?.length && selectedSize.value === null
      ? props.addon.sizes[0]
      : selectedSize.value;
  emit("update:modelValue", { quantity: next, size });
}
</script>

<template>
  <div
    :role="isWorkshopOrMeal ? 'checkbox' : undefined"
    :aria-checked="isWorkshopOrMeal ? isAdded : undefined"
    :aria-disabled="disabled"
    :tabindex="isWorkshopOrMeal && !disabled ? 0 : -1"
    @click="toggleCard"
    @keydown.space.prevent="toggleCard"
    @keydown.enter.prevent="toggleCard"
    :class="[
      'border-solid flex flex-col gap-2 rounded-lg border p-4 outline-none transition-all duration-150',
      'shadow-[0px_4px_16px_0px_rgba(0,0,0,0.08),0px_1px_3px_0px_rgba(0,0,0,0.04)]',
      isAdded
        ? 'bg-brand-muted-rest border-brand-emphasis'
        : disabled
          ? 'bg-surface-l2 border-neutral-muted opacity-60'
          : 'bg-surface-l0 border-neutral-muted',
      isWorkshopOrMeal && isAdded && 'cursor-pointer',
      isWorkshopOrMeal &&
        !disabled &&
        !isAdded &&
        'cursor-pointer hover:border-brand-muted hover:bg-brand-subtle-hover',
      isWorkshopOrMeal &&
        !disabled &&
        !isAdded &&
        'focus-visible:border-brand-emphasis',
    ]"
  >
    <!-- Header: name + price -->
    <div class="flex items-center justify-between gap-3">
      <span class="text-subtitle1 text-neutral">{{ displayName }}</span>
      <span class="text-subtitle1 text-neutral shrink-0">{{
        formattedPrice
      }}</span>
    </div>

    <!-- Description -->
    <p
      class="text-[length:var(--font-size-sm)] leading-[16px] text-neutral-muted"
    >
      {{ addon.description }}
    </p>

    <!-- Workshop: time + spots -->
    <template v-if="addon.category === 'workshop'">
      <p
        v-if="timeRange"
        class="text-[length:var(--font-size-sm)] leading-[16px] text-neutral-quiet"
      >
        {{ timeRange }}
      </p>
      <p
        v-if="spotsLeft != null"
        class="text-[length:var(--font-size-sm)] leading-[16px] text-neutral-muted"
      >
        {{ spotsLeft }} spots remaining
      </p>
    </template>

    <!-- Merchandise: size selector + qty stepper -->
    <template v-if="isMerchandise">
      <div class="flex flex-wrap items-center gap-4" @click.stop>
        <!-- Size selector (only when addon has sizes) -->
        <div v-if="addon.sizes?.length" class="flex items-center gap-2">
          <span
            class="text-[length:var(--font-size-sm)] font-medium text-neutral-muted"
          >
            Size:
          </span>
          <q-select
            :model-value="selectedSize"
            :options="addon.sizes"
            :display-value="selectedSize ? undefined : 'Select'"
            dense
            outlined
            :disable="disabled"
            class="nitra-addon-size text-[length:var(--font-size-sm)]"
            @update:model-value="setSize"
          />
        </div>

        <!-- Qty stepper -->
        <div class="flex items-center gap-2">
          <span
            class="text-[length:var(--font-size-sm)] font-medium text-neutral-muted"
          >
            Qty:
          </span>
          <button
            :disabled="disabled || quantity <= 0"
            class="flex h-7 w-7 items-center justify-center rounded-md bg-surface-l2 text-neutral transition-colors hover:bg-surface-l3 disabled:cursor-not-allowed disabled:opacity-40"
            @click.stop="setQuantity(-1)"
          >
            <q-icon name="remove" size="14px" />
          </button>
          <span
            class="w-6 text-center text-[length:var(--font-size-md)] font-semibold leading-[14px] text-neutral"
          >
            {{ quantity }}
          </span>
          <button
            :disabled="disabled || quantity >= (addon.maxQuantity ?? 99)"
            class="flex h-7 w-7 items-center justify-center rounded-md bg-surface-l2 text-neutral transition-colors hover:bg-surface-l3 disabled:cursor-not-allowed disabled:opacity-40"
            @click.stop="setQuantity(1)"
          >
            <q-icon name="add" size="14px" />
          </button>
          <span class="text-[10px] leading-[14px] text-neutral-quiet">
            max {{ addon.maxQuantity }}
          </span>
        </div>
      </div>
    </template>

    <!-- "Added to order" badge -->
    <div v-if="isAdded" class="mt-1">
      <span
        class="inline-flex items-center gap-1 text-[11px] font-semibold leading-[14px] text-success"
      >
        <q-icon name="check" size="12px" />
        Added to order
      </span>
    </div>
  </div>
</template>

<style scoped>
/* Tighten Quasar's outlined select to match the 28px height in the Figma spec. */
.nitra-addon-size :deep(.q-field__control) {
  height: 28px;
  min-height: 28px;
  border-radius: 6px;
}
.nitra-addon-size :deep(.q-field__native) {
  min-height: 28px;
  padding: 0;
}
.nitra-addon-size :deep(.q-field__append) {
  font-size: 12px;
  height: auto;
}

p {
  padding: 0;
  margin: 0;
}

button {
  outline: none;
  border: none;
  cursor: pointer;
}
</style>
