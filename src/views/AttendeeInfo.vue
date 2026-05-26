<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useEventRegistration } from "../composables/useEventRegistration.js";
import NitraTicketCard from "../components/NitraTicketCard.vue";
import NitraTextField from "../components/NitraTextField.vue";

const { t } = useI18n();
const { state, selectTicket, ticketTypes, validationErrors, touchedSteps, hasMerchandise } =
  useEventRegistration();

// Field-level errors only become visible after the user has clicked "Next" on step 1.
const showErrors = computed(() => touchedSteps.value.has(1));
const e = computed(() => validationErrors.value.step1);
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- Ticket Type selection -->
    <section class="flex flex-col gap-4">
      <h2 class="text-subtitle1 text-neutral">{{ t('attendee.selectTicket') }}</h2>
      <div class="grid grid-cols-3 gap-4">
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
      <div class="grid grid-cols-2 gap-6">
        <NitraTextField
          v-model="state.attendeeInfo.fullName"
          :label="t('attendee.fullName')"
          :placeholder="t('attendee.fullNamePlaceholder')"
          required
          :error="showErrors && !!e.fullName"
          :error-message="e.fullName"
        />
        <NitraTextField
          v-model="state.attendeeInfo.email"
          :label="t('attendee.email')"
          type="email"
          :placeholder="t('attendee.emailPlaceholder')"
          required
          :error="showErrors && !!e.email"
          :error-message="e.email"
        />
      </div>

      <!-- Row 2: Phone + Company -->
      <div class="grid grid-cols-2 gap-6">
        <NitraTextField
          v-model="state.attendeeInfo.phone"
          :label="t('attendee.phone')"
          type="tel"
          :placeholder="t('attendee.phonePlaceholder')"
          required
          :error="showErrors && !!e.phone"
          :error-message="e.phone"
        />
        <NitraTextField
          v-model="state.attendeeInfo.company"
          :label="t('attendee.company')"
          :placeholder="t('attendee.companyPlaceholder')"
          required
          :error="showErrors && !!e.company"
          :error-message="e.company"
        />
      </div>

      <!-- Job Title -->
      <NitraTextField
        v-model="state.attendeeInfo.jobTitle"
        :label="t('attendee.jobTitle')"
        :placeholder="t('attendee.jobTitlePlaceholder')"
        required
        :error="showErrors && !!e.jobTitle"
        :error-message="e.jobTitle"
      />

      <!-- Shipping Address — required when merchandise is in the cart -->
      <NitraTextField
        v-model="state.attendeeInfo.shippingAddress"
        :label="hasMerchandise ? t('attendee.shippingAddressRequired') : t('attendee.shippingAddressOptional')"
        :placeholder="t('attendee.shippingAddressPlaceholder')"
        :required="hasMerchandise"
        :error="showErrors && !!e.shippingAddress"
        :error-message="e.shippingAddress"
      />
    </section>
  </div>
</template>
