<script setup>
import { computed, watch } from "vue";

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

// ── Price ─────────────────────────────────────────────────────────
const effectivePrice = computed(() => {
  if (props.vipDiscount && props.addon.category === "workshop") {
    return props.addon.price * 0.9;
  }
  return props.addon.price;
});

const formattedPrice = computed(() =>
  `$${effectivePrice.value.toLocaleString("en-US")}`
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
  const month = d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
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
  emit("update:modelValue", {
    quantity: next,
    size: selectedSize.value,
  });
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
      'flex flex-col gap-2 rounded-xl border-2 p-4 transition-all duration-150 outline-none',
      isAdded
        ? 'bg-brand-subtle-rest border-brand-emphasis'
        : disabled
          ? 'bg-surface-l2 border-neutral-muted opacity-60'
          : 'bg-surface-l0 border-neutral-muted',
      isWorkshopOrMeal && !disabled && 'cursor-pointer hover:border-brand-muted hover:bg-brand-subtle-hover',
      isWorkshopOrMeal && !disabled && 'focus-visible:border-brand-emphasis',
    ]"
  >
    <!-- Header: name + price -->
    <div class="flex items-start justify-between gap-3">
      <span class="text-subtitle1 text-neutral">{{ addon.name }}</span>
      <span class="text-subtitle1 text-neutral shrink-0">{{ formattedPrice }}</span>
    </div>

    <!-- Description -->
    <p class="text-[length:var(--font-size-sm)] text-neutral-muted">
      {{ addon.description }}
    </p>

    <!-- Workshop: time + spots -->
    <template v-if="addon.category === 'workshop'">
      <p v-if="timeRange" class="text-[length:var(--font-size-sm)] text-neutral-quiet">
        {{ timeRange }}
      </p>
      <p v-if="spotsLeft != null" class="text-[length:var(--font-size-sm)] text-neutral-muted">
        {{ spotsLeft }} spots remaining
      </p>
    </template>

    <!-- Merchandise: size selector + qty stepper -->
    <template v-if="isMerchandise">
      <div class="flex items-center gap-4 flex-wrap" @click.stop>
        <!-- Size selector (only when addon has sizes) -->
        <div v-if="addon.sizes?.length" class="flex items-center gap-2">
          <span class="text-[length:var(--font-size-sm)] text-neutral-muted">Size:</span>
          <q-select
            :model-value="selectedSize"
            :options="addon.sizes"
            placeholder="Select"
            dense
            outlined
            :disable="disabled"
            style="min-width: 80px"
            class="text-[length:var(--font-size-sm)]"
            @update:model-value="setSize"
          />
        </div>

        <!-- Qty stepper -->
        <div class="flex items-center gap-2">
          <span class="text-[length:var(--font-size-sm)] text-neutral-muted">Qty:</span>
          <button
            :disabled="disabled || quantity <= 0"
            class="w-7 h-7 rounded-md bg-surface-l2 flex items-center justify-center text-neutral transition-colors hover:bg-surface-l3 disabled:opacity-40 disabled:cursor-not-allowed"
            @click.stop="setQuantity(-1)"
          >
            <q-icon name="remove" size="14px" />
          </button>
          <span class="text-[length:var(--font-size-sm)] text-neutral w-4 text-center">
            {{ quantity }}
          </span>
          <button
            :disabled="disabled || quantity >= (addon.maxQuantity ?? 99)"
            class="w-7 h-7 rounded-md bg-surface-l2 flex items-center justify-center text-neutral transition-colors hover:bg-surface-l3 disabled:opacity-40 disabled:cursor-not-allowed"
            @click.stop="setQuantity(1)"
          >
            <q-icon name="add" size="14px" />
          </button>
          <span class="text-[length:var(--font-size-sm)] text-neutral-quiet">
            max {{ addon.maxQuantity }}
          </span>
        </div>
      </div>
    </template>

    <!-- "Added to order" badge -->
    <div v-if="isAdded" class="mt-1">
      <span class="inline-flex items-center gap-1 text-[length:var(--font-size-sm)] text-brand font-semibold">
        <q-icon name="check" size="14px" />
        Added to order
      </span>
    </div>
  </div>
</template>
