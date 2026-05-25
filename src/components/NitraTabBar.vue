<script setup>
defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  /**
   * Array of tab definitions.
   * Shape: { label: string, value: string }
   */
  tabs: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue"]);
</script>

<template>
  <div
    role="tablist"
    class="inline-flex items-center gap-1 rounded-full bg-surface-l2 p-1"
  >
    <button
      v-for="tab in tabs"
      :key="tab.value"
      role="tab"
      :aria-selected="modelValue === tab.value"
      :tabindex="modelValue === tab.value ? 0 : -1"
      class="rounded-full px-4 py-1.5 text-[length:var(--font-size-sm)] transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-brand-emphasis"
      :class="
        modelValue === tab.value
          ? 'bg-brand-emphasis-rest text-inverse font-semibold cursor-default'
          : 'text-neutral-muted hover:text-neutral cursor-pointer'
      "
      @click="emit('update:modelValue', tab.value)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>
