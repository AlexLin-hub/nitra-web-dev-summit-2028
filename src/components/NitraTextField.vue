<script setup>
import { ref } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "text",
  },
  /**
   * Shows an asterisk (*) next to the label.
   */
  required: {
    type: Boolean,
    default: false,
  },
  /**
   * Appends "(Optional)" to the label.
   */
  optional: {
    type: Boolean,
    default: false,
  },
  error: {
    type: Boolean,
    default: false,
  },
  errorMessage: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue", "blur"]);

const isFocused = ref(false);
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <!-- Label -->
    <label
      v-if="label"
      class="text-[length:var(--font-size-sm)] font-medium select-none"
      :class="error ? 'text-danger' : 'text-neutral'"
    >
      {{ label }}<span v-if="required" class="text-danger"> *</span
      ><span v-if="optional" class="font-regular"> (Optional)</span>
    </label>

    <!-- Input wrapper — border state handled here, q-input handles native behavior -->
    <div
      :class="[
        'rounded-md border border-solid bg-surface-l0 px-3 transition-colors duration-150',
        error
          ? 'border-danger-emphasis'
          : disabled
            ? 'border-neutral-muted bg-disable'
            : isFocused
              ? 'border-neutral-emphasis'
              : 'border-neutral-muted',
      ]"
    >
      <q-input
        :model-value="modelValue"
        :placeholder="placeholder"
        :type="type"
        :disable="disabled"
        borderless
        dense
        hide-bottom-space
        no-error-icon
        class="w-full"
        input-class="text-[length:var(--font-size-lg)] text-neutral placeholder:text-neutral-quiet py-2.5"
        @update:model-value="emit('update:modelValue', $event)"
        @focus="isFocused = true"
        @blur="() => { isFocused = false; emit('blur'); }"
      />
    </div>

    <!-- Error message -->
    <p
      v-if="error && errorMessage"
      class="text-[11px] leading-[14px] text-danger"
    >
      {{ errorMessage }}
    </p>
  </div>
</template>
