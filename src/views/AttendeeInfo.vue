<script setup>
import { useEventRegistration } from "../composables/useEventRegistration.js";
import NitraTicketCard from "../components/NitraTicketCard.vue";
import NitraTextField from "../components/NitraTextField.vue";

const { state, selectTicket, ticketTypes } = useEventRegistration();
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
        />
        <NitraTextField
          v-model="state.attendeeInfo.email"
          label="Email"
          type="email"
          placeholder="Enter your email address"
          required
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
        />
        <NitraTextField
          v-model="state.attendeeInfo.company"
          label="Company"
          placeholder="Enter your company name"
          required
        />
      </div>

      <!-- Job Title -->
      <NitraTextField
        v-model="state.attendeeInfo.jobTitle"
        label="Job Title"
        placeholder="Enter your job title"
        required
      />

      <!-- Shipping Address (Optional) -->
      <NitraTextField
        v-model="state.attendeeInfo.shippingAddress"
        label="Shipping Address (Optional)"
        placeholder="Enter your shipping address"
      />
    </section>
  </div>
</template>
