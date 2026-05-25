<script setup>
import { ref, computed } from "vue";
import { sessions } from "../mocks/sessions.js";
import { useEventRegistration } from "../composables/useEventRegistration.js";
import NitraTabBar from "../components/NitraTabBar.vue";
import NitraSessionCard from "../components/NitraSessionCard.vue";

const { state, toggleSession, sessionsByDate, selectedSessions } =
  useEventRegistration();

// ── Date tabs ─────────────────────────────────────────────────────

const dateKeys = computed(() => [...sessionsByDate.value.keys()]);

function formatDateTab(isoDate) {
  return new Date(isoDate + "T00:00:00Z").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

const tabs = computed(() =>
  dateKeys.value.map((d) => ({ value: d, label: formatDateTab(d) })),
);

const activeDate = ref(null);
const activeDateKey = computed(() => activeDate.value ?? dateKeys.value[0] ?? null);

// ── Sessions for active date ──────────────────────────────────────

const currentSessions = computed(
  () => sessionsByDate.value.get(activeDateKey.value) ?? [],
);

// ── Disabled logic ───────────────────────────────────────────────

function overlaps(a, b) {
  return new Date(a.date) < new Date(b.endDate) && new Date(b.date) < new Date(a.endDate);
}

function isDisabled(session) {
  const soldOut = session.registered >= session.capacity;
  const selected = state.value.selectedSessionIds.includes(session.id);
  if (soldOut && !selected) return true;
  // Block unselected sessions that conflict with an already-selected one
  return !selected && selectedSessions.value.some(
    (sel) => sel.id !== session.id && overlaps(session, sel),
  );
}

// ── Count ─────────────────────────────────────────────────────────

const selectedCount = computed(() => state.value.selectedSessionIds.length);
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- Title -->
    <h2 class="text-h3 text-neutral">Select Sessions</h2>

    <!-- Date tab bar -->
    <NitraTabBar
      :model-value="activeDateKey"
      :tabs="tabs"
      @update:model-value="activeDate = $event"
    />

    <!-- Selection count -->
    <p
      v-if="selectedCount > 0"
      class="text-[length:var(--font-size-sm)] text-neutral-muted"
    >
      {{ selectedCount }} session{{ selectedCount === 1 ? "" : "s" }} selected
    </p>

    <!-- Session grid -->
    <div class="grid grid-cols-2 gap-4">
      <NitraSessionCard
        v-for="session in currentSessions"
        :key="session.id"
        :model-value="state.selectedSessionIds"
        :session="session"
        :disabled="isDisabled(session)"
        @update:model-value="() => toggleSession(session.id)"
      />
    </div>

    <!-- Empty state -->
    <p
      v-if="currentSessions.length === 0"
      class="text-neutral-muted text-center py-8"
    >
      No sessions available for this date.
    </p>
  </div>
</template>
