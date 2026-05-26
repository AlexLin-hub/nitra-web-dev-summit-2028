<script setup>
import { computed } from "vue";

const props = defineProps({
  label: {
    type: String,
    default: "",
  },
  /**
   * 'primary'   — accent (orange) fill, white text — CTA
   * 'secondary' — neutral muted fill, neutral-muted text
   */
  variant: {
    type: String,
    default: "primary",
    validator: (v) => ["primary", "secondary"].includes(v),
  },
  /**
   * 'md' — 14px/20px label, 10px radius (default for secondary)
   * 'lg' — 16px/24px label, 12px radius (default for primary)
   */
  size: {
    type: String,
    default: null,
    validator: (v) => v === null || ["md", "lg"].includes(v),
  },
  type: {
    type: String,
    default: "button",
  },
  loading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["click"]);

const resolvedSize = computed(
  () => props.size ?? (props.variant === "primary" ? "lg" : "md")
);

const sizeClasses = computed(() =>
  resolvedSize.value === "lg"
    ? "!rounded-xl px-5 py-3 text-[length:var(--font-size-lg)] leading-[24px]"
    : "!rounded-[10px] px-4 py-2.5 text-[length:var(--font-size-md)] leading-[20px]"
);

const variantClasses = computed(() =>
  props.variant === "primary"
    ? [
        "bg-accent-emphasis-rest text-inverse font-semibold",
        !props.disabled &&
          "hover:bg-accent-emphasis-hover active:bg-accent-emphasis-active",
      ]
    : [
        "bg-neutral-muted-rest text-neutral-muted font-semibold",
        !props.disabled &&
          "hover:bg-neutral-muted-hover active:bg-neutral-muted-active",
      ]
);
</script>

<template>
  <q-btn
    :label="label"
    :type="type"
    :loading="loading"
    :disable="disabled"
    unelevated
    no-caps
    :class="[
      sizeClasses,
      variantClasses,
      disabled && '!opacity-50 !cursor-not-allowed',
    ]"
    @click="emit('click', $event)"
  />
</template>
