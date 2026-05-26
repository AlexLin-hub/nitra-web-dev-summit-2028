<script setup>
import { computed, onMounted, onBeforeUnmount } from "vue";
import { event } from "./mocks/event.js";
import { useEventRegistration } from "./composables/useEventRegistration.js";
import logoUrl from "./assets/images/logo.svg";

import NitraStepper from "./components/NitraStepper.vue";
import NitraButton from "./components/NitraButton.vue";

import AttendeeInfo from "./views/AttendeeInfo.vue";
import Sessions from "./views/Sessions.vue";
import Addons from "./views/Addons.vue";
import ReviewSubmit from "./views/ReviewSubmit.vue";
import RegistrationSuccess from "./views/RegistrationSuccess.vue";

const STEP_LABELS = ["Attendee Info", "Sessions", "Add-ons", "Review"];

const NEXT_LABELS = {
  1: "Next: Session Selection",
  2: "Next: Add-ons",
  3: "Next: Review",
  4: "Submit Registration",
};

const STEP_VIEWS = {
  1: AttendeeInfo,
  2: Sessions,
  3: Addons,
  4: ReviewSubmit,
};

const {
  state,
  nextStep,
  prevStep,
  goToStep,
  touchStep,
  stepsWithErrors,
  isFormValid,
  submit,
} = useEventRegistration();

// Only flag a step as errored once the user has moved past it.
const stepErrors = computed(() =>
  [1, 2, 3, 4].map(
    (s) => state.value.currentStep > s && stepsWithErrors.value.includes(s),
  ),
);

const currentView = computed(
  () => STEP_VIEWS[state.value.currentStep] ?? AttendeeInfo,
);
const nextLabel = computed(
  () => NEXT_LABELS[state.value.currentStep] ?? "Next",
);
const hasPrev = computed(() => state.value.currentStep > 1);

const isStep4 = computed(() => state.value.currentStep === 4);

const isSubmitDisabled = computed(
  () => isStep4.value && (!isFormValid.value || state.value.isSubmitted),
);

function handleNext() {
  // Mark the current step as touched so field-level errors become visible.
  touchStep(state.value.currentStep);
  if (isStep4.value) {
    submit();
  } else {
    nextStep();
  }
}

// Warn the user before closing/refreshing to prevent data loss.
function handleBeforeUnload(e) {
  e.preventDefault();
  e.returnValue = "";
}

onMounted(() => window.addEventListener("beforeunload", handleBeforeUnload));
onBeforeUnmount(() =>
  window.removeEventListener("beforeunload", handleBeforeUnload),
);
</script>

<template>
  <div class="h-screen bg-surface-l0 flex flex-col overflow-hidden">
    <!-- ── Sticky Header ────────────────────────────────────── -->
    <header
      class="shrink-0 border-b border-[var(--divider-default)] px-12 py-4 bg-surface-l0 z-20"
    >
      <div class="flex items-center gap-3">
        <img :src="logoUrl" alt="Logo" class="w-10 h-10 rounded-lg" />
        <span class="text-h4 text-neutral">{{ event.name }}</span>
      </div>
    </header>

    <!-- ── Success State ────────────────────────────────────── -->
    <template v-if="state.isSubmitted">
      <main
        class="flex-1 min-h-0 overflow-y-auto flex items-center justify-center py-[60px]"
      >
        <RegistrationSuccess />
      </main>
    </template>

    <!-- ── Normal Flow ───────────────────────────────────────── -->
    <template v-else>
      <!-- Sticky Stepper -->
      <div
        class="border-solid shrink-0 border-b border-[var(--divider-default)] px-[120px] py-6 bg-surface-l0 z-10"
      >
        <NitraStepper
          v-model="state.currentStep"
          :steps="STEP_LABELS"
          :errors="stepErrors"
          :clickable="true"
        />
      </div>

      <!-- Scrollable Content -->
      <main class="flex-1 min-h-0 overflow-y-auto">
        <div class="px-[120px] py-10">
          <component :is="currentView" />
        </div>
      </main>

      <!-- Sticky Footer -->
      <footer
        class="border-solid shrink-0 border-t border-[var(--divider-default)] px-[120px] py-4 bg-surface-l0 flex justify-between items-center z-20"
      >
        <NitraButton
          v-if="hasPrev"
          label="Back"
          variant="secondary"
          @click="prevStep"
        />
        <span v-else />
        <NitraButton
          :label="nextLabel"
          variant="primary"
          :disabled="isSubmitDisabled"
          @click="handleNext"
        />
      </footer>
    </template>
  </div>
</template>
