<script setup>
import { computed } from "vue";
import { event } from "../mocks/event.js";
import { useEventRegistration } from "../composables/useEventRegistration.js";
import NitraButton from "../components/NitraButton.vue";

const { state, reset, ticketTypes } = useEventRegistration();

const firstName = computed(() => {
  const name = state.value.attendeeInfo.fullName.trim();
  return name.split(" ")[0] || name;
});

const ticketName = computed(() => {
  const t = ticketTypes.find(
    (t) => t.id === state.value.attendeeInfo.ticketType,
  );
  return t?.name ?? "";
});
</script>

<template>
  <div class="flex flex-col items-center gap-4 text-center">
    <!-- Success icon -->
    <div
      class="w-20 h-20 rounded-full bg-[#11925c] flex items-center justify-center shrink-0"
    >
      <q-icon name="check" size="40px" class="text-inverse" />
    </div>

    <!-- Title -->
    <p class="text-h2 text-success whitespace-nowrap">Registration Complete!</p>

    <!-- Confirmation number -->
    <p class="text-[length:var(--font-size-lg)] leading-[24px] text-neutral">
      Confirmation #{{ state.orderId }}
    </p>

    <!-- Thank you message -->
    <div
      class="text-[length:var(--font-size-sm)] leading-[16px] text-neutral-muted"
    >
      <p>
        Thank you, {{ firstName }}! Your {{ ticketName }} registration for
        {{ event.name }} is confirmed.
      </p>
      <p>
        You will receive a confirmation email at
        {{ state.attendeeInfo.email }}.
      </p>
    </div>

    <!-- Back to Home -->
    <NitraButton
      label="Back to Home"
      variant="primary"
      size="md"
      @click="reset"
    />
  </div>
</template>
