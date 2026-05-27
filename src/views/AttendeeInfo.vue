<script setup>
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useEventRegistration } from "../composables/useEventRegistration.js";
import NitraTicketCard from "../components/NitraTicketCard.vue";
import NitraTextField from "../components/NitraTextField.vue";

const { t } = useI18n();
const { state, selectTicket, ticketTypes, validationErrors, touchedSteps, hasMerchandise } =
  useEventRegistration();

const e = computed(() => validationErrors.value.step1);

// True when the user has left step 1 entirely (clicked Next or navigated away).
const stepLeft = computed(() => state.value.currentStep !== 1 || touchedSteps.value.has(1));

// Track which individual fields have been blurred at least once.
const blurred = ref({});
function markBlurred(field) {
  blurred.value[field] = true;
}

// A field shows its error when the step is no longer active OR the field has been blurred.
function showError(field) {
  return (stepLeft.value || !!blurred.value[field]) && !!e.value[field];
}
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- Ticket Type selection -->
    <section class="flex flex-col gap-4">
      <h2 class="text-subtitle1 text-neutral">{{ t('attendee.selectTicket') }}</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <NitraTicketCard
          v-for="ticket in ticketTypes"
          :key="ticket.id"
          :model-value="state.attendeeInfo.ticketType"
          :value="ticket.id"
          :name="ticket.name"
          :price="ticket.price"
          :description="ticket.description"
          :perks="ticket.perks"
          @update:model-value="selectTicket"
        />
      </div>
    </section>

    <!-- Attendee Information form -->
    <section class="flex flex-col gap-5">
      <h2 class="text-h3 text-neutral">{{ t('attendee.title') }}</h2>

      <!-- Row 1: Full Name + Email -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <NitraTextField
          v-model="state.attendeeInfo.fullName"
          :label="t('attendee.fullName')"
          :placeholder="t('attendee.fullNamePlaceholder')"
          required
          :error="showError('fullName')"
          :error-message="e.fullName"
          @blur="markBlurred('fullName')"
        />
        <NitraTextField
          v-model="state.attendeeInfo.email"
          :label="t('attendee.email')"
          type="email"
          :placeholder="t('attendee.emailPlaceholder')"
          required
          :error="showError('email')"
          :error-message="e.email"
          @blur="markBlurred('email')"
        />
      </div>

      <!-- Row 2: Phone + Company -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <NitraTextField
          v-model="state.attendeeInfo.phone"
          :label="t('attendee.phone')"
          type="tel"
          :placeholder="t('attendee.phonePlaceholder')"
          required
          :error="showError('phone')"
          :error-message="e.phone"
          @blur="markBlurred('phone')"
        />
        <NitraTextField
          v-model="state.attendeeInfo.company"
          :label="t('attendee.company')"
          :placeholder="t('attendee.companyPlaceholder')"
          required
          :error="showError('company')"
          :error-message="e.company"
          @blur="markBlurred('company')"
        />
      </div>

      <!-- Job Title -->
      <NitraTextField
        v-model="state.attendeeInfo.jobTitle"
        :label="t('attendee.jobTitle')"
        :placeholder="t('attendee.jobTitlePlaceholder')"
        required
        :error="showError('jobTitle')"
        :error-message="e.jobTitle"
        @blur="markBlurred('jobTitle')"
      />

      <!-- Shipping Address — required when merchandise is in the cart -->
      <NitraTextField
        v-model="state.attendeeInfo.shippingAddress"
        :label="hasMerchandise ? t('attendee.shippingAddressRequired') : t('attendee.shippingAddressOptional')"
        :placeholder="t('attendee.shippingAddressPlaceholder')"
        :required="hasMerchandise"
        :error="showError('shippingAddress')"
        :error-message="e.shippingAddress"
        @blur="markBlurred('shippingAddress')"
      />
    </section>
  </div>
</template>
