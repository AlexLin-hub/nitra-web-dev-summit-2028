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
  <div role="tablist" aria-label="Steps" class="flex w-full items-center">
    <template v-for="(step, index) in steps" :key="index">
      <!-- Step: circle + label side by side -->
      <div class="flex shrink-0 items-center gap-2.5">
        <button
          role="tab"
          :aria-selected="modelValue === index + 1"
          :aria-label="`Step ${index + 1}${step ? ': ' + step : ''}`"
          :disabled="!clickable"
          :tabindex="clickable ? 0 : -1"
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full outline-none transition-all duration-150 focus-visible:ring-2 focus-visible:ring-brand-emphasis"
          :class="{
            'bg-brand-emphasis-rest text-inverse cursor-default':
              getStepState(index) === 'active' ||
              getStepState(index) === 'completed',
            'bg-danger-emphasis-rest text-inverse':
              getStepState(index) === 'error',
            'bg-surface-l2 text-neutral-quiet cursor-default':
              getStepState(index) === 'pending',
            'cursor-pointer hover:bg-brand-muted-rest':
              clickable && getStepState(index) === 'pending',
          }"
          @click="handleStepClick(index)"
        >
          <q-icon
            v-if="getStepState(index) === 'completed'"
            name="check"
            size="16px"
          />
          <q-icon
            v-else-if="getStepState(index) === 'error'"
            name="priority_high"
            size="16px"
          />
          <span
            v-else
            class="text-[length:var(--font-size-md)] font-semibold leading-none"
          >
            {{ index + 1 }}
          </span>
        </button>

        <!-- Label to the right of the circle -->
        <span
          class="whitespace-nowrap text-[13px] leading-none transition-colors duration-150"
          :class="{
            'text-neutral font-semibold': getStepState(index) === 'active',
            'text-neutral font-medium': getStepState(index) === 'completed',
            'text-danger font-semibold': getStepState(index) === 'error',
            'text-neutral-quiet font-regular':
              getStepState(index) === 'pending',
          }"
        >
          {{ step }}
        </span>
      </div>

      <!-- Connector line between label and next step -->
      <div
        v-if="index < stepCount - 1"
        class="mx-4 h-0.5 flex-1 rounded-[1px] transition-colors duration-150"
        :class="
          getStepState(index) === 'completed'
            ? 'bg-brand-emphasis-rest'
            : 'bg-surface-l2'
        "
      />
    </template>
  </div>
</template>
