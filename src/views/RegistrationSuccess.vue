<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useEventRegistration } from "../composables/useEventRegistration.js";
import NitraButton from "../components/NitraButton.vue";

const { t } = useI18n();
const { state, event, reset, ticketTypes } = useEventRegistration();

const firstName = computed(() => {
  const name = state.value.attendeeInfo.fullName.trim();
  return name.split(" ")[0] || name;
});

const ticketName = computed(() => {
  const ticket = ticketTypes.value.find(
    (t) => t.id === state.value.attendeeInfo.ticketType,
  );
  return ticket?.name ?? "";
});
</script>

<template>
  <div class="flex flex-col items-center gap-4 text-center">
    <!-- Success icon -->
    <div
      class="w-20 h-20 rounded-full bg-success-bold-rest flex items-center justify-center shrink-0"
    >
      <q-icon name="check" size="40px" class="text-inverse" />
    </div>

    <!-- Title -->
    <p class="text-h2 text-success whitespace-nowrap">
      {{ t("success.title") }}
    </p>

    <!-- Confirmation number -->
    <p class="text-[length:var(--font-size-lg)] leading-[24px] text-neutral">
      {{ t("success.confirmation", { id: state.orderId }) }}
    </p>

    <!-- Thank you message -->
    <div
      class="text-[length:var(--font-size-sm)] leading-[16px] text-neutral-muted"
    >
      <p>
        {{
          t("success.thankYou", {
            name: firstName,
            ticket: ticketName,
            event: event.name,
          })
        }}
      </p>
      <p>
        {{ t("success.emailNotice", { email: state.attendeeInfo.email }) }}
      </p>
    </div>

    <!-- Back to Home -->
    <NitraButton
      :label="t('success.backHome')"
      variant="primary"
      size="md"
      @click="reset"
    />
  </div>
</template>
