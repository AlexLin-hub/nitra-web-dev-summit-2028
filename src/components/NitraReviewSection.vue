<script setup>
import { useI18n } from "vue-i18n";

/**
 * NitraReviewSection — Step 4 review card component.
 *
 * Covers three visual variants through props:
 *   1. Basic review section   — title + edit link + key/value rows
 *   2. Error review section   — hasError adds red border and danger title
 *   3. Pricing summary        — valueMuted rows + discount row + total (bold + separator)
 *
 * items shape: Array<{
 *   label:       string
 *   value:       string
 *   danger?:     boolean   // renders value in danger color (e.g. "— (required)")
 *   bold?:       boolean   // renders label + value in medium weight + neutral (used for Total)
 *   separator?:  boolean   // renders a divider line before this item
 *   discount?:   boolean   // renders the row in 11px text-brand-emphasis (VIP discount)
 *   valueMuted?: boolean   // renders the value in neutral-muted (used in pricing line items)
 * }>
 */
defineProps({
  title: {
    type: String,
    required: true,
  },
  /**
   * When provided, shows "Edit → Step {step}" link in the header.
   */
  step: {
    type: Number,
    default: null,
  },
  /**
   * Activates the error state: 2px danger border + danger-colored title.
   */
  hasError: {
    type: Boolean,
    default: false,
  },
  /**
   * Switches the inter-row gap (12px for review sections, 8px for pricing summary).
   */
  compact: {
    type: Boolean,
    default: false,
  },
  items: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["edit"]);
const { t } = useI18n();
</script>

<template>
  <div
    :class="[
      'border-solid flex flex-col rounded-md bg-surface-l1 p-5',
      compact ? 'gap-2' : 'gap-3',
      hasError
        ? 'border-2 border-danger-emphasis'
        : 'border border-neutral-muted',
    ]"
  >
    <!-- Header: title + optional edit link -->
    <div class="flex items-center justify-between gap-4">
      <h3
        class="text-subtitle1"
        :class="hasError ? 'text-danger' : 'text-neutral'"
      >
        {{ title }}
      </h3>

      <button
        v-if="step != null"
        class="shrink-0 text-[length:var(--font-size-sm)] leading-[16px] font-semibold text-brand underline outline-none hover:no-underline focus-visible:no-underline"
        @click="emit('edit', step)"
      >
        {{ t("review.edit", { step }) }}
      </button>
    </div>

    <!-- Row list -->
    <div
      v-if="items.length === 0"
      class="text-[length:var(--font-size-sm)] leading-[16px] text-neutral-muted"
    >
      -
    </div>
    <template v-else v-for="(item, index) in items" :key="index">
      <!-- Optional divider before this row -->
      <div
        v-if="item.separator"
        class="border-t border-0 border-solid divider-muted"
      />

      <!-- Discount row (11px text-brand-emphasis) -->
      <div
        v-if="item.discount"
        class="flex items-start justify-between gap-4 text-[11px] leading-[14px] text-brand-emphasis"
      >
        <span>{{ item.label }}</span>
        <span>{{ item.value }}</span>
      </div>

      <!-- Standard row -->
      <div
        v-else
        class="flex items-start justify-between gap-4 text-[length:var(--font-size-sm)] leading-[16px]"
      >
        <span
          :class="item.bold ? 'text-neutral font-medium' : 'text-neutral-muted'"
        >
          {{ item.label }}
        </span>
        <span
          class="text-right"
          :class="[
            item.danger
              ? 'text-danger'
              : item.bold
                ? 'text-neutral font-medium'
                : item.valueMuted
                  ? 'text-neutral-muted'
                  : 'text-neutral',
          ]"
        >
          {{ item.value }}
        </span>
      </div>
    </template>
  </div>
</template>
<style scoped>
h3 {
  padding: 0;
  margin: 0;
}
button {
  outline: none;
  border: none;
  background: none;
  cursor: pointer;
}
</style>
