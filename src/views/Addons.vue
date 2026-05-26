<script setup>
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { addons } from "../mocks/addons.js";
import { useEventRegistration } from "../composables/useEventRegistration.js";
import NitraTabBar from "../components/NitraTabBar.vue";
import NitraAddonCard from "../components/NitraAddonCard.vue";
import NitraAlert from "../components/NitraAlert.vue";
import NitraReviewSection from "../components/NitraReviewSection.vue";

const { t } = useI18n();
const {
  state,
  addonsByCategory,
  workshopConflictIds,
  isVip,
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
  items.push({ label: t("addons.total"), value: formattedTotal.value, bold: true });

  return items;
});
</script>

<template>
  <div class="flex gap-8 items-start">
    <!-- ── Add-ons list ─────────────────────────────── -->
    <div class="flex flex-col gap-6 flex-1 min-w-0">
      <h2 class="text-h3 text-neutral">{{ t('addons.title') }}</h2>

      <NitraTabBar
        :model-value="activeCategory"
        :tabs="CATEGORY_TABS"
        @update:model-value="activeCategory = $event"
      />

      <!-- Shipping info banner (merchandise only) -->
      <NitraAlert
        v-if="activeCategory === 'merchandise'"
        variant="info"
        :title="t('addons.shippingNoticeTitle')"
        :message="t('addons.shippingNoticeMsg')"
      />

      <!-- VIP lunch-included notice (meal packages only) -->
      <NitraAlert
        v-if="activeCategory === 'meal' && isVip"
        variant="info"
        :title="t('addons.vipLunchTitle')"
        :message="t('addons.vipLunchMsg')"
      />

      <!-- Addon cards -->
      <NitraAddonCard
        v-for="addon in currentAddons"
        :key="addon.id"
        :addon="addon"
        :model-value="state.selectedAddons[addon.id] ?? null"
        :disabled="isAddonDisabled(addon)"
        :vip-discount="isVip"
        @update:model-value="handleAddonUpdate(addon.id, $event)"
      />
    </div>

    <!-- ── Order summary sidebar ──────────────────────── -->
    <div class="shrink-0 w-[380px]">
      <NitraReviewSection
        :title="t('addons.orderSummary')"
        :compact="true"
        :items="summaryItems"
      />
    </div>
  </div>
</template>
