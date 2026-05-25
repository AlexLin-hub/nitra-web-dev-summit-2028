<script setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: {
    type: Number,
    required: true,
  },
  steps: {
    type: Array,
    default: () => [],
  },
  /**
   * Per-step error flags. Pass an array of booleans matching steps length.
   * e.g. [false, true, false, false] marks step 2 as error.
   */
  errors: {
    type: Array,
    default: () => [],
  },
  clickable: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

function getStepState(index) {
  const step = index + 1;
  if (props.errors[index]) return "error";
  if (step < props.modelValue) return "completed";
  if (step === props.modelValue) return "active";
  return "pending";
}

function handleStepClick(index) {
  if (props.clickable) {
    emit("update:modelValue", index + 1);
  }
}

const stepCount = computed(() => props.steps.length);
</script>

<template>
  <div role="tablist" aria-label="Steps" class="flex items-center w-full">
    <template v-for="(step, index) in steps" :key="index">
      <!-- Step: circle + label side by side -->
      <div class="flex items-center gap-2 shrink-0">
        <button
          role="tab"
          :aria-selected="modelValue === index + 1"
          :aria-label="`Step ${index + 1}${step ? ': ' + step : ''}`"
          :disabled="!clickable"
          :tabindex="clickable ? 0 : -1"
          class="flex items-center justify-center shrink-0 w-8 h-8 rounded-full border-2 transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-brand-emphasis"
          :class="{
            'bg-brand-emphasis-rest border-brand-emphasis text-inverse cursor-default':
              getStepState(index) === 'active',
            'bg-brand-emphasis-rest border-brand-emphasis text-inverse':
              getStepState(index) === 'completed',
            'bg-danger-emphasis-rest border-danger-emphasis text-inverse':
              getStepState(index) === 'error',
            'bg-surface-l0 border-neutral-muted text-neutral-muted cursor-default':
              getStepState(index) === 'pending',
            'cursor-pointer hover:border-brand-muted':
              clickable && getStepState(index) === 'pending',
          }"
          @click="handleStepClick(index)"
        >
          <q-icon
            v-if="getStepState(index) === 'completed'"
            name="check"
            size="14px"
          />
          <q-icon
            v-else-if="getStepState(index) === 'error'"
            name="priority_high"
            size="14px"
          />
          <span
            v-else
            class="text-[length:var(--font-size-sm)] font-semibold leading-none"
          >
            {{ index + 1 }}
          </span>
        </button>

        <!-- Label to the right of the circle -->
        <span
          class="text-[length:var(--font-size-sm)] whitespace-nowrap transition-colors duration-150"
          :class="{
            'text-neutral font-semibold':
              getStepState(index) === 'active' ||
              getStepState(index) === 'completed',
            'text-danger font-semibold': getStepState(index) === 'error',
            'text-neutral-muted': getStepState(index) === 'pending',
          }"
        >
          {{ step }}
        </span>
      </div>

      <!-- Connector line between label and next step -->
      <div
        v-if="index < stepCount - 1"
        class="flex-1 h-px mx-3 transition-colors duration-150"
        :class="
          getStepState(index) === 'completed'
            ? 'bg-brand-emphasis-rest'
            : 'bg-[var(--divider-default)]'
        "
      />
    </template>
  </div>
</template>
