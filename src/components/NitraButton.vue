<script setup>
defineProps({
  label: {
    type: String,
    default: "",
  },
  /**
   * 'primary'   — orange accent fill, white text
   * 'secondary' — neutral subtle fill, neutral text
   */
  variant: {
    type: String,
    default: "primary",
    validator: (v) => ["primary", "secondary"].includes(v),
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
      '!rounded-xl !text-subtitle2',
      variant === 'primary'
        ? [
            'bg-accent-emphasis-rest text-inverse',
            !disabled && 'hover:bg-accent-emphasis-hover active:bg-accent-emphasis-active',
          ]
        : [
            'bg-neutral-subtle-rest text-neutral',
            !disabled && 'hover:bg-neutral-subtle-hover active:bg-neutral-subtle-active',
          ],
      disabled && '!opacity-40 !cursor-not-allowed',
    ]"
    @click="emit('click', $event)"
  />
</template>
