<script setup>
import { computed } from "vue";
import { useEventRegistration } from "../composables/useEventRegistration.js";
import NitraTicketCard from "../components/NitraTicketCard.vue";
import NitraTextField from "../components/NitraTextField.vue";

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
      <h2 class="text-subtitle1 text-neutral">Select Ticket Type</h2>
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
      <h2 class="text-h3 text-neutral">Attendee Information</h2>

      <!-- Row 1: Full Name + Email -->
      <div class="grid grid-cols-2 gap-6">
        <NitraTextField
          v-model="state.attendeeInfo.fullName"
          label="Full Name"
          placeholder="Enter your full name"
          required
          :error="showErrors && !!e.fullName"
          :error-message="e.fullName"
        />
        <NitraTextField
          v-model="state.attendeeInfo.email"
          label="Email"
          type="email"
          placeholder="Enter your email address"
          required
          :error="showErrors && !!e.email"
          :error-message="e.email"
        />
      </div>

      <!-- Row 2: Phone + Company -->
      <div class="grid grid-cols-2 gap-6">
        <NitraTextField
          v-model="state.attendeeInfo.phone"
          label="Phone"
          type="tel"
          placeholder="Enter your phone number"
          required
          :error="showErrors && !!e.phone"
          :error-message="e.phone"
        />
        <NitraTextField
          v-model="state.attendeeInfo.company"
          label="Company"
          placeholder="Enter your company name"
          required
          :error="showErrors && !!e.company"
          :error-message="e.company"
        />
      </div>

      <!-- Job Title -->
      <NitraTextField
        v-model="state.attendeeInfo.jobTitle"
        label="Job Title"
        placeholder="Enter your job title"
        required
        :error="showErrors && !!e.jobTitle"
        :error-message="e.jobTitle"
      />

      <!-- Shipping Address — required when merchandise is in the cart -->
      <NitraTextField
        v-model="state.attendeeInfo.shippingAddress"
        :label="hasMerchandise ? 'Shipping Address' : 'Shipping Address (Optional)'"
        placeholder="Enter your shipping address"
        :required="hasMerchandise"
        :error="showErrors && !!e.shippingAddress"
        :error-message="e.shippingAddress"
      />
    </section>
  </div>
</template>
