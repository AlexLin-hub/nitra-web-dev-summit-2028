<script setup>
import { ref, computed } from "vue";
import { addons } from "../mocks/addons.js";
import { useEventRegistration } from "../composables/useEventRegistration.js";
import NitraTabBar from "../components/NitraTabBar.vue";
import NitraAddonCard from "../components/NitraAddonCard.vue";
import NitraAlert from "../components/NitraAlert.vue";
import NitraReviewSection from "../components/NitraReviewSection.vue";

const {
  state,
  addonsByCategory,
  workshopConflictIds,
  isVip,
  updateAddon,
  removeAddon,
  formattedTotal,
  orderItems,
} = useEventRegistration();

// ── Category tabs ─────────────────────────────────────────────────────

const CATEGORY_TABS = [
  { value: "workshop", label: "Workshops" },
  { value: "meal", label: "Meal Packages" },
  { value: "merchandise", label: "Merchandise" },
];

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

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

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
  items.push({ label: "Total", value: formattedTotal.value, bold: true });

  return items;
});
</script>

<template>
  <div class="flex gap-8 items-start">
    <!-- ── Add-ons list ─────────────────────────────── -->
    <div class="flex flex-col gap-6 flex-1 min-w-0">
      <h2 class="text-h3 text-neutral">Select Add-ons</h2>

      <NitraTabBar
        :model-value="activeCategory"
        :tabs="CATEGORY_TABS"
        @update:model-value="activeCategory = $event"
      />

      <!-- Shipping info banner (merchandise only) -->
      <NitraAlert
        v-if="activeCategory === 'merchandise'"
        variant="info"
        title="Shipping Information"
        message="Merchandise items will be shipped to your address one week before the conference. Please ensure your shipping address in Step 1 is correct."
      />

      <!-- VIP lunch-included notice (meal packages only) -->
      <NitraAlert
        v-if="activeCategory === 'meal' && isVip"
        variant="info"
        title="Lunch Already Included"
        message="Your VIP ticket includes lunch on both conference days. You may still add the Premium Dinner or other meal options below."
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
        title="Order Summary"
        :compact="true"
        :items="summaryItems"
      />
    </div>
  </div>
</template>
