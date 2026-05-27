<script setup>
import { computed } from "vue";
import { useEventRegistration } from "../composables/useEventRegistration.js";

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

const { formatCurrency } = useEventRegistration();

const isSelected = computed(() => props.modelValue === props.value);

function select() {
  if (!props.disabled) {
    emit("update:modelValue", props.value);
  }
}

const formattedPrice = computed(() => formatCurrency(props.price));
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
      'flex border-solid flex-col gap-3 rounded-md p-5 transition-all duration-150 outline-none w-full',
      'shadow-[0px_4px_16px_0px_rgba(0,0,0,0.08),0px_1px_3px_0px_rgba(0,0,0,0.04)]',
      isSelected
        ? 'border-2 border-brand-emphasis bg-brand-muted-rest cursor-pointer'
        : disabled
          ? 'border border-neutral-muted bg-disable cursor-not-allowed opacity-50'
          : 'border border-neutral-muted bg-surface-l1 cursor-pointer hover:border-brand-muted hover:bg-brand-subtle-hover',
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
      class="text-[length:var(--font-size-sm)] leading-[16px] text-neutral-muted w-full m-0"
    >
      {{ description }}
    </p>

    <!-- Perks list -->
    <ul v-if="perks.length" class="flex flex-col gap-2 p-0 m-0">
      <li
        v-for="perk in perks"
        :key="perk"
        class="flex items-center gap-2 text-[length:var(--font-size-sm)] leading-[16px] text-neutral-muted"
      >
        <q-icon name="check_circle" size="14px" class="text-neutral shrink-0" />
        {{ perk }}
      </li>
    </ul>

    <!-- Selected badge -->
    <span
      v-if="isSelected"
      class="self-start inline-flex items-center rounded-full bg-success-bold-rest px-[9px] py-[3px] text-[11px] leading-[14px] text-inverse font-medium"
    >
      <q-icon name="check" size="14px" class="mr-1" />
      Selected
    </span>
  </div>
</template>
