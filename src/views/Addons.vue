<script setup>
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useEventRegistration } from "../composables/useEventRegistration.js";
import NitraTabBar from "../components/NitraTabBar.vue";
import NitraAddonCard from "../components/NitraAddonCard.vue";
import NitraAlert from "../components/NitraAlert.vue";
import NitraReviewSection from "../components/NitraReviewSection.vue";

const { t } = useI18n();
const {
  state,
  addons,
  addonsByCategory,
  workshopConflictIds,
  hasMerchandise,
  lunchIncluded,
  currentTicketName,
  updateAddon,
  removeAddon,
  formattedTotal,
  orderItems,
  formatCurrency,
} = useEventRegistration();

// ── Category tabs ─────────────────────────────────────────────────────

const CATEGORY_TABS = computed(() => [
  { value: "workshop", label: t("addons.tabs.workshop") },
  { value: "meal", label: t("addons.tabs.meal") },
  { value: "merchandise", label: t("addons.tabs.merchandise") },
]);

const activeCategory = ref("workshop");

const currentAddons = computed(
  () => addonsByCategory.value.get(activeCategory.value) ?? [],
);

// ── Conflict alert logic ─────────────────────────────────────────────

const workshopAddons = computed(
  () => addonsByCategory.value.get("workshop") ?? [],
);

const noWorkshopsAvailable = computed(() => {
  if (workshopAddons.value.length === 0) return false;
  return workshopAddons.value.every((addon) => isAddonDisabled(addon));
});

// ── Disabled logic ────────────────────────────────────────────────────

function isAddonDisabled(addon) {
  if (addon.capacity != null && addon.registered >= addon.capacity) return true;
  if (addon.category === "workshop" && workshopConflictIds.value.has(addon.id))
    return true;
  return false;
}

// ── Addon interaction ─────────────────────────────────────────────────

function handleAddonUpdate(addonId, newValue) {
  if (!newValue || newValue.quantity === 0) {
    removeAddon(addonId);
  } else {
    updateAddon(addonId, newValue);
  }
}

// ── Order summary ─────────────────────────────────────────────────────

const summaryItems = computed(() => {
  const items = [];

  for (const item of orderItems.value) {
    const addon =
      item.id !== "ticket" ? addons.value.find((a) => a.id === item.id) : null;

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
  items.push({
    label: t("addons.total"),
    value: formattedTotal.value,
    bold: true,
  });

  return items;
});
</script>

<template>
  <div class="flex flex-col lg:flex-row gap-8 items-start">
    <!-- ── Add-ons list ─────────────────────────────── -->
    <div class="flex flex-col gap-6 flex-1 min-w-0 w-full">
      <h2 class="text-h3 text-neutral">{{ t("addons.title") }}</h2>

      <NitraTabBar
        :model-value="activeCategory"
        :tabs="CATEGORY_TABS"
        @update:model-value="activeCategory = $event"
      />

      <!-- Shipping info banner — shown whenever merch is in the cart -->
      <NitraAlert
        v-if="activeCategory === 'merchandise' && hasMerchandise"
        variant="info"
        :title="t('addons.shippingNoticeTitle')"
        :message="t('addons.shippingNoticeMsg')"
      />

      <!-- Lunch-included notice (meal packages only, for General & VIP tickets) -->
      <NitraAlert
        v-if="activeCategory === 'meal' && lunchIncluded"
        variant="info"
        :title="t('addons.lunchIncludedTitle')"
        :message="t('addons.lunchIncludedMsg', { ticketName: currentTicketName })"
      />

      <!-- Workshop conflict notice (when all workshops are blocked by session selections or sold out) -->
      <NitraAlert
        v-if="activeCategory === 'workshop' && noWorkshopsAvailable"
        variant="info"
        :title="t('addons.workshopConflictTitle')"
        :message="t('addons.workshopConflictMsg')"
      />

      <!-- Addon cards -->
      <NitraAddonCard
        v-for="addon in currentAddons"
        :key="addon.id"
        :addon="addon"
        :model-value="state.selectedAddons[addon.id] ?? null"
        :disabled="isAddonDisabled(addon)"
        @update:model-value="handleAddonUpdate(addon.id, $event)"
      />
    </div>

    <!-- ── Order summary sidebar ──────────────────────── -->
    <div class="lg:sticky lg:top-10 shrink-0 w-full lg:w-[380px]">
      <NitraReviewSection
        :title="t('addons.orderSummary')"
        :compact="true"
        :items="summaryItems"
      />
    </div>
  </div>
</template>
