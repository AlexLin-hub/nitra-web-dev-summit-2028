<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { addons } from "../mocks/addons.js";
import { useEventRegistration } from "../composables/useEventRegistration.js";
import NitraAlert from "../components/NitraAlert.vue";
import NitraReviewSection from "../components/NitraReviewSection.vue";

const { t, locale } = useI18n();
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
  formatCurrency,
} = useEventRegistration();

// ── Helpers ───────────────────────────────────────────────────────────

function formatSessionDateTime(isoDate) {
  const d = new Date(isoDate);
  const date = d.toLocaleDateString(locale.value, {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
  const time = d.toLocaleTimeString(locale.value, {
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
  const tType = state.value.attendeeInfo.ticketType;
  const ticket = ticketTypes.find((t) => t.id === tType);
  return ticket ? `${ticket.name} (${formatCurrency(ticket.price)})` : "—";
});

const attendeeItems = computed(() => {
  const info = state.value.attendeeInfo;
  const e = step1Errors.value;
  const items = [
    {
      label: t("attendee.fullName"),
      value: info.fullName || `— ${t('common.required')}`,
      danger: !!e.fullName,
    },
    {
      label: t("attendee.email"),
      value: info.email || `— ${t('common.required')}`,
      danger: !!e.email,
    },
    {
      label: t("attendee.phone"),
      value: info.phone || `— ${t('common.required')}`,
      danger: !!e.phone,
    },
    {
      label: t("attendee.company"),
      value: info.company || `— ${t('common.required')}`,
      danger: !!e.company,
    },
    {
      label: t("attendee.jobTitle"),
      value: info.jobTitle || `— ${t('common.required')}`,
      danger: !!e.jobTitle,
    },
    {
      label: t("attendee.selectTicket"),
      value: ticketLabel.value,
      danger: !!e.ticketType,
    },
  ];

  if (hasMerchandise.value || info.shippingAddress) {
    items.push({
      label: t("attendee.shippingAddress"),
      value: info.shippingAddress || `— ${t('errors.shippingRequired')}`,
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

const categoryLabels = computed(() => ({
  workshop: t("addons.tabs.workshop"),
  meal: t("addons.tabs.meal"),
  merchandise: t("addons.tabs.merchandise"),
}));

const addonItems = computed(() => {
  const items = [];
  for (const [addonId, opts] of Object.entries(state.value.selectedAddons)) {
    const addon = addons.find((a) => a.id === addonId);
    if (!addon) continue;
    const qty = opts.quantity ?? 1;
    const name = addon.name + (opts.size ? ` (${opts.size})` : "");
    const value =
      qty > 1
        ? `${name} × ${qty} (${formatCurrency(addon.price * qty)})`
        : `${name} (${formatCurrency(addon.price)})`;
    items.push({ label: categoryLabels.value[addon.category] ?? addon.category, value });
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
        label: t("addons.workshopDiscount"),
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
  items.push({ label: t("review.grandTotal"), value: formattedTotal.value, bold: true });

  return items;
});
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- Error banner -->
    <NitraAlert
      v-if="hasErrors"
      variant="danger"
      :title="t('errors.fixErrors')"
      :messages="allErrorMessages"
    />

    <h2 class="text-h3 text-neutral">{{ t('review.title') }}</h2>

    <!-- Attendee Information -->
    <NitraReviewSection
      :title="t('attendee.title')"
      :step="1"
      :has-error="hasStep1Error"
      :items="attendeeItems"
      @edit="goToStep"
    />

    <!-- Selected Sessions -->
    <NitraReviewSection
      :title="t('stepper.sessions')"
      :step="2"
      :items="sessionItems"
      @edit="goToStep"
    />

    <!-- Add-ons -->
    <NitraReviewSection
      :title="t('stepper.addons')"
      :step="3"
      :items="addonItems"
      @edit="goToStep"
    />

    <!-- Pricing Summary -->
    <NitraReviewSection
      :title="t('review.pricingSummary')"
      :compact="true"
      :items="pricingItems"
    />
  </div>
</template>
