<script setup>
/**
 * NitraReviewSection — Step 4 review card component.
 *
 * Covers three visual variants through props:
 *   1. Basic review section   — title + edit link + key/value rows
 *   2. Error review section   — hasError adds red border and danger title
 *   3. Order summary          — showTotal separates the last item with a divider
 *
 * items shape: Array<{
 *   label:      string
 *   value:      string
 *   danger?:    boolean   // renders value in danger color (e.g. "— (required)")
 *   bold?:      boolean   // renders label + value in bold (used for Total row)
 *   separator?: boolean   // renders a divider line before this item
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
   * Activates the error state: red border + danger-colored title.
   */
  hasError: {
    type: Boolean,
    default: false,
  },
  items: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["edit"]);
</script>

<template>
  <div
    :class="[
      'rounded-xl border-2 bg-surface-l1 p-5 flex flex-col gap-4',
      hasError ? 'border-danger-emphasis' : 'border-neutral-quiet',
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
        class="shrink-0 text-[length:var(--font-size-sm)] text-brand font-medium hover:underline focus:outline-none focus-visible:underline"
        @click="emit('edit', step)"
      >
        Edit → Step {{ step }}
      </button>
    </div>

    <!-- Row list -->
    <div class="flex flex-col">
      <template v-for="(item, index) in items" :key="index">
        <!-- Optional divider before this row -->
        <div v-if="item.separator" class="divider-default border-t my-3" />

        <div class="flex items-baseline justify-between gap-4 py-1.5">
          <span
            class="text-[length:var(--font-size-sm)] shrink-0"
            :class="[
              item.bold ? 'text-neutral font-semibold' : 'text-neutral-muted',
            ]"
          >
            {{ item.label }}
          </span>
          <span
            class="text-[length:var(--font-size-sm)] text-right"
            :class="[
              item.danger
                ? 'text-danger'
                : item.bold
                  ? 'text-neutral font-semibold'
                  : 'text-neutral',
            ]"
          >
            {{ item.value }}
          </span>
        </div>
      </template>
    </div>
  </div>
</template>
