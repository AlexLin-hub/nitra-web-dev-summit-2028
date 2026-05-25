<script setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    default: null,
  },
  value: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  perks: {
    type: Array,
    default: () => [],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

const isSelected = computed(() => props.modelValue === props.value);

function select() {
  if (!props.disabled) {
    emit("update:modelValue", props.value);
  }
}

const formattedPrice = computed(
  () => `$${props.price.toLocaleString("en-US")}`,
);
</script>

<template>
  <div
    role="radio"
    :aria-checked="isSelected"
    :aria-disabled="disabled"
    :tabindex="disabled ? -1 : 0"
    @click="select"
    @keydown.enter.prevent="select"
    @keydown.space.prevent="select"
    :class="[
      'flex flex-col gap-3 rounded-xl border-2 p-5 transition-all duration-150 outline-none',
      isSelected
        ? 'border-brand-emphasis bg-brand-subtle-rest cursor-pointer'
        : disabled
          ? 'border-neutral-muted bg-disable cursor-not-allowed opacity-50'
          : 'border-neutral-muted bg-surface-l0 cursor-pointer hover:border-brand-muted hover:bg-brand-subtle-hover',
      !disabled && !isSelected && 'focus-visible:border-brand-emphasis',
    ]"
  >
    <!-- Header: name + price on same row -->
    <div class="flex items-center justify-between gap-2">
      <span class="text-subtitle1 text-neutral">{{ name }}</span>
      <span class="text-subtitle1 text-neutral">{{ formattedPrice }}</span>
    </div>

    <!-- Description -->
    <p
      v-if="description"
      class="text-[length:var(--font-size-sm)] text-neutral-muted"
    >
      {{ description }}
    </p>

    <!-- Perks list -->
    <ul v-if="perks.length" class="flex flex-col gap-2">
      <li
        v-for="perk in perks"
        :key="perk"
        class="flex items-center gap-2 text-[length:var(--font-size-sm)] text-neutral"
      >
        <q-icon name="check_circle" size="16px" class="text-brand shrink-0" />
        {{ perk }}
      </li>
    </ul>

    <!-- Selected badge -->
    <div v-if="isSelected" class="mt-1">
      <span
        class="inline-flex items-center gap-1 rounded-full bg-brand-emphasis-rest px-3 py-1 text-[length:var(--font-size-sm)] text-inverse font-semibold"
      >
        <q-icon name="check" size="12px" />
        Selected
      </span>
    </div>
  </div>
</template>
