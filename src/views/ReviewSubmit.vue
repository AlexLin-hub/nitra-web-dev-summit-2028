<script setup>
import { computed } from "vue";
import { addons } from "../mocks/addons.js";
import { useEventRegistration } from "../composables/useEventRegistration.js";
import NitraAlert from "../components/NitraAlert.vue";
import NitraReviewSection from "../components/NitraReviewSection.vue";

const {
  state,
  selectedSessions,
  orderItems,
  formattedTotal,
  validationErrors,
  stepsWithErrors,
  hasMerchandise,
  goToStep,
  ticketTypes,
} = useEventRegistration();

// ── Helpers ───────────────────────────────────────────────────────────

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatSessionDateTime(isoDate) {
  const d = new Date(isoDate);
  const date = d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
  const time = d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  });
  return `${date}, ${time}`;
}

// ── Error banner ──────────────────────────────────────────────────────

const hasErrors = computed(() => stepsWithErrors.value.length > 0);

const allErrorMessages = computed(() => {
  const msgs = [];
  const { step1, step2, step3 } = validationErrors.value;
  for (const msg of Object.values(step1)) msgs.push(msg);
  for (const msg of step2) msgs.push(msg);
  for (const msg of step3) msgs.push(msg);
  return msgs;
});

// ── Attendee Information ──────────────────────────────────────────────

const step1Errors = computed(() => validationErrors.value.step1);
const hasStep1Error = computed(() => Object.keys(step1Errors.value).length > 0);

const ticketLabel = computed(() => {
  const t = ticketTypes.find((t) => t.id === state.value.attendeeInfo.ticketType);
  return t ? `${t.name} ($${t.price})` : "—";
});

const attendeeItems = computed(() => {
  const info = state.value.attendeeInfo;
  const e = step1Errors.value;
  const items = [
    {
      label: "Name",
      value: info.fullName || "— (required)",
      danger: !!e.fullName,
    },
    {
      label: "Email",
      value: info.email || "— (required)",
      danger: !!e.email,
    },
    {
      label: "Phone",
      value: info.phone || "— (required)",
      danger: !!e.phone,
    },
    {
      label: "Company",
      value: info.company || "— (required)",
      danger: !!e.company,
    },
    {
      label: "Job Title",
      value: info.jobTitle || "— (required)",
      danger: !!e.jobTitle,
    },
    {
      label: "Ticket Type",
      value: ticketLabel.value,
      danger: !!e.ticketType,
    },
  ];

  if (hasMerchandise.value || info.shippingAddress) {
    items.push({
      label: "Shipping Address",
      value: info.shippingAddress || "— (required for merchandise)",
      danger: !!e.shippingAddress,
    });
  }

  return items;
});

// ── Selected Sessions ─────────────────────────────────────────────────

const sessionItems = computed(() =>
  selectedSessions.value.map((s) => ({
    label: formatSessionDateTime(s.date),
    value: s.title,
  }))
);

// ── Add-ons ───────────────────────────────────────────────────────────

const CATEGORY_LABEL = {
  workshop: "Workshop",
  meal: "Meal",
  merchandise: "Merchandise",
};

const addonItems = computed(() => {
  const items = [];
  for (const [addonId, opts] of Object.entries(state.value.selectedAddons)) {
    const addon = addons.find((a) => a.id === addonId);
    if (!addon) continue;
    const qty = opts.quantity ?? 1;
    const name = addon.name + (opts.size ? ` (${opts.size})` : "");
    const value =
      qty > 1
        ? `${name} × ${qty} ($${addon.price * qty})`
        : `${name} ($${addon.price})`;
    items.push({ label: CATEGORY_LABEL[addon.category] ?? addon.category, value });
  }
  return items;
});

// ── Pricing Summary ───────────────────────────────────────────────────

const pricingItems = computed(() => {
  const items = [];

  for (const item of orderItems.value) {
    const addon =
      item.id !== "ticket" ? addons.find((a) => a.id === item.id) : null;

    if (item.discountNote && addon) {
      const fullSubtotal = addon.price * item.quantity;
      items.push({
        label: item.label,
        value: formatCurrency(fullSubtotal),
        valueMuted: true,
      });
      const discountAmt = fullSubtotal - item.subtotal;
      items.push({
        label: "Workshop discount (VIP 10%)",
        value: `-${formatCurrency(discountAmt)}`,
        discount: true,
      });
    } else {
      items.push({
        label: item.label,
        value: formatCurrency(item.subtotal),
        valueMuted: true,
      });
    }
  }

  items.push({ separator: true });
  items.push({ label: "Grand Total", value: formattedTotal.value, bold: true });

  return items;
});
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- Error banner -->
    <NitraAlert
      v-if="hasErrors"
      variant="danger"
      title="Please fix the following errors before submitting"
      :messages="allErrorMessages"
    />

    <h2 class="text-h3 text-neutral">Review Your Registration</h2>

    <!-- Attendee Information -->
    <NitraReviewSection
      title="Attendee Information"
      :step="1"
      :has-error="hasStep1Error"
      :items="attendeeItems"
      @edit="goToStep"
    />

    <!-- Selected Sessions -->
    <NitraReviewSection
      title="Selected Sessions"
      :step="2"
      :items="sessionItems"
      @edit="goToStep"
    />

    <!-- Add-ons -->
    <NitraReviewSection
      title="Add-ons"
      :step="3"
      :items="addonItems"
      @edit="goToStep"
    />

    <!-- Pricing Summary -->
    <NitraReviewSection
      title="Pricing Summary"
      :compact="true"
      :items="pricingItems"
    />
  </div>
</template>
