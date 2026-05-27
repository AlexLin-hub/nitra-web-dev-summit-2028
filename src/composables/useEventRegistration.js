import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { event as rawEvent } from "src/mocks/event";
import { sessions as rawSessions } from "src/mocks/sessions";
import { addons as rawAddons } from "src/mocks/addons";

// ── Constants ────────────────────────────────────────────────────────────────

const TOTAL_STEPS = 4;
const VIP_WORKSHOP_DISCOUNT = 0.1;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Allows +, digits, spaces, dashes, dots, parens — 7–20 chars
const PHONE_RE = /^\+?[\d\s\-().]{7,20}$/;

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Returns true when two time ranges overlap (exclusive boundary check).
 * @param {number} aStart @param {number} aEnd
 * @param {number} bStart @param {number} bEnd
 */
function hasTimeOverlap(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && bStart < aEnd;
}

/**
 * Recursively localizes an object or array based on the target language.
 * @param {any} data
 * @param {string} lang
 */
function localize(data, lang) {
  if (Array.isArray(data)) {
    return data.map((item) => localize(item, lang));
  } else if (data !== null && typeof data === "object") {
    // If it's a leaf localization node (has the target language key)
    if (data[lang] !== undefined) {
      return data[lang];
    }
    // Otherwise, recurse
    const result = {};
    for (const [key, value] of Object.entries(data)) {
      result[key] = localize(value, lang);
    }
    return result;
  }
  return data;
}

function makeInitialState() {
  return {
    currentStep: 1,
    attendeeInfo: {
      fullName: "",
      email: "",
      phone: "",
      company: "",
      jobTitle: "",
      shippingAddress: "",
      ticketType: "vip", // 'general' | 'vip' | 'student'
    },
    /** @type {string[]} */
    selectedSessionIds: [],
    /**
     * Keyed by addon id.
     * @type {Record<string, { quantity: number, size: string | null }>}
     */
    selectedAddons: {},
    isSubmitted: false,
    orderId: null,
  };
}

// ── Singleton state (shared across all callers) ───────────────────────────────

/** Single Source of Truth for all form state */
const state = ref(makeInitialState());

/**
 * Tracks which steps the user has explicitly attempted to leave
 * (i.e. clicked "Next" while on that step). Field-level error messages
 * in each view are only rendered once the corresponding step is touched.
 */
const touchedSteps = ref(new Set());

// ── Composable ───────────────────────────────────────────────────────────────

export function useEventRegistration() {
  const { t, locale } = useI18n();

  // ── Reactive Localized Data ──────────────────────────────────────────

  const event = computed(() => localize(rawEvent, locale.value));
  const sessions = computed(() => localize(rawSessions, locale.value));
  const addons = computed(() => localize(rawAddons, locale.value));

  /** Ticket lookup keyed by id for O(1) access */
  const TICKET_MAP = computed(() =>
    Object.fromEntries(event.value.ticketTypes.map((t) => [t.id, t])),
  );

  /** Formats a number as $X,XXX.XX */
  function formatCurrency(amount) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  }

  // ── Derived: sessions ──────────────────────────────────────────────────

  /** Sessions grouped by calendar date string (YYYY-MM-DD) */
  const sessionsByDate = computed(() => {
    /** @type {Map<string, any>} */
    const map = new Map();
    for (const session of sessions.value) {
      const day = session.date.slice(0, 10);
      if (!map.has(day)) map.set(day, []);
      map.get(day).push(session);
    }
    return map;
  });

  /** Full session objects that are currently selected */
  const selectedSessions = computed(() =>
    sessions.value.filter((s) => state.value.selectedSessionIds.includes(s.id)),
  );

  /**
   * Set of session IDs that conflict with at least one other selected session.
   * Computed once from selected sessions — no watch needed.
   */
  const sessionConflictIds = computed(() => {
    const selected = selectedSessions.value;
    const conflicting = new Set();
    for (let i = 0; i < selected.length; i++) {
      for (let j = i + 1; j < selected.length; j++) {
        const a = selected[i];
        const b = selected[j];
        if (
          hasTimeOverlap(
            new Date(a.date).getTime(),
            new Date(a.endDate).getTime(),
            new Date(b.date).getTime(),
            new Date(b.endDate).getTime(),
          )
        ) {
          conflicting.add(a.id);
          conflicting.add(b.id);
        }
      }
    }
    return conflicting;
  });

  // ── Derived: add-ons ───────────────────────────────────────────────────

  /** Add-ons grouped by category string */
  const addonsByCategory = computed(() => {
    /** @type {Map<string, any>} */
    const map = new Map();
    for (const addon of addons.value) {
      if (!map.has(addon.category)) map.set(addon.category, []);
      map.get(addon.category).push(addon);
    }
    return map;
  });

  /**
   * Set of workshop addon IDs that overlap with at least one selected session.
   * These should be shown as unavailable in the UI.
   */
  const workshopConflictIds = computed(() => {
    const selected = selectedSessions.value;
    const conflicting = new Set();
    for (const addon of addons.value) {
      if (addon.category !== "workshop") continue;
      for (const session of selected) {
        if (
          hasTimeOverlap(
            new Date(addon.date).getTime(),
            new Date(addon.endDate).getTime(),
            new Date(session.date).getTime(),
            new Date(session.endDate).getTime(),
          )
        ) {
          conflicting.add(addon.id);
          break;
        }
      }
    }
    return conflicting;
  });

  /** True when at least one merchandise item is in the cart */
  const hasMerchandise = computed(() =>
    Object.keys(state.value.selectedAddons).some((id) => {
      const addon = addons.value.find((a) => a.id === id);
      return addon?.category === "merchandise";
    }),
  );

  // ── Derived: pricing ───────────────────────────────────────────────────

  const isVip = computed(() => state.value.attendeeInfo.ticketType === "vip");

  const ticketPrice = computed(() => {
    const { ticketType } = state.value.attendeeInfo;
    return ticketType ? (TICKET_MAP.value[ticketType]?.price ?? 0) : 0;
  });

  /**
   * Itemised order lines used for the running total and review summary.
   * Each item: { id, label, unitPrice, quantity, subtotal, discountNote? }
   */
  const orderItems = computed(() => {
    const items = [];
    const { ticketType } = state.value.attendeeInfo;

    if (ticketType) {
      const ticket = TICKET_MAP.value[ticketType];
      items.push({
        id: "ticket",
        label: `${ticket.name} Ticket`,
        unitPrice: ticket.price,
        quantity: 1,
        subtotal: ticket.price,
      });
    }

    for (const [addonId, opts] of Object.entries(state.value.selectedAddons)) {
      const addon = addons.value.find((a) => a.id === addonId);
      if (!addon) continue;
      const qty = opts.quantity ?? 1;
      const isWorkshop = addon.category === "workshop";
      const unitPrice =
        isWorkshop && isVip.value
          ? addon.price * (1 - VIP_WORKSHOP_DISCOUNT)
          : addon.price;

      const baseName = addon.sizes?.length
        ? addon.name.replace(/\s*\([^)]*\)$/, "").trim()
        : addon.name;
      const label = opts.size ? `${baseName} (${opts.size})` : baseName;

      const item = {
        id: addonId,
        label,
        unitPrice,
        quantity: qty,
        subtotal: unitPrice * qty,
      };
      if (isWorkshop && isVip.value) item.discountNote = t("addons.workshopDiscount");
      items.push(item);
    }

    return items;
  });

  /** Grand total as a plain number */
  const totalPrice = computed(() =>
    orderItems.value.reduce((sum, item) => sum + item.subtotal, 0),
  );

  /** Grand total formatted as $X,XXX.XX */
  const formattedTotal = computed(() => formatCurrency(totalPrice.value));

  // ── Derived: validation ────────────────────────────────────────────────

  /**
   * All validation errors across all steps.
   * Errors are always kept fresh — no manual synchronisation needed.
   *
   * Shape:
   *   step1: Record<fieldName, string>
   *   step2: string[]
   *   step3: string[]
   */
  const validationErrors = computed(() => {
    const errors = { step1: {}, step2: [], step3: [] };
    const { attendeeInfo, selectedAddons } = state.value;

    // Step 1 — attendee info
    if (!attendeeInfo.fullName.trim())
      errors.step1.fullName = t("errors.nameRequired");

    if (!attendeeInfo.email.trim()) {
      errors.step1.email = t("errors.emailRequired");
    } else if (!EMAIL_RE.test(attendeeInfo.email.trim())) {
      errors.step1.email = t("errors.emailInvalid");
    }

    if (!attendeeInfo.phone.trim()) {
      errors.step1.phone = t("errors.phoneRequired");
    } else if (!PHONE_RE.test(attendeeInfo.phone.trim())) {
      errors.step1.phone = t("errors.phoneInvalid");
    }

    if (!attendeeInfo.company.trim())
      errors.step1.company = t("errors.companyRequired");

    if (!attendeeInfo.jobTitle.trim())
      errors.step1.jobTitle = t("errors.jobTitleRequired");

    if (!attendeeInfo.ticketType)
      errors.step1.ticketType = t("errors.ticketRequired");

    // Shipping address becomes required when any merchandise is in the cart
    if (hasMerchandise.value && !attendeeInfo.shippingAddress.trim())
      errors.step1.shippingAddress = t("errors.shippingRequired");

    // Step 2 — session conflicts
    if (sessionConflictIds.value.size > 0)
      errors.step2.push(t("errors.sessionConflict"));

    // Step 3 — merchandise size selection
    for (const [addonId, opts] of Object.entries(selectedAddons)) {
      const addon = addons.value.find((a) => a.id === addonId);
      if (addon?.sizes?.length && !opts.size)
        errors.step3.push(t("errors.sizeRequired", { name: addon.name }));
    }

    return errors;
  });

  /** Steps (1-indexed) that currently contain at least one error */
  const stepsWithErrors = computed(() => {
    const { step1, step2, step3 } = validationErrors.value;
    const result = [];
    if (Object.keys(step1).length > 0) result.push(1);
    if (step2.length > 0) result.push(2);
    if (step3.length > 0) result.push(3);
    return result;
  });

  /** True only when every step passes validation */
  const isFormValid = computed(() => stepsWithErrors.value.length === 0);

  // ── Navigation ─────────────────────────────────────────────────────────

  /**
   * Mark a step as "touched" so field-level errors become visible.
   * Called by App.vue before advancing to the next step.
   */
  function touchStep(step) {
    touchedSteps.value = new Set([...touchedSteps.value, step]);
  }

  function nextStep() {
    if (state.value.currentStep < TOTAL_STEPS) state.value.currentStep++;
  }

  function prevStep() {
    if (state.value.currentStep > 1) state.value.currentStep--;
  }

  function goToStep(step) {
    if (step >= 1 && step <= TOTAL_STEPS) state.value.currentStep = step;
  }

  // ── Actions ────────────────────────────────────────────────────────────

  function selectTicket(type) {
    state.value.attendeeInfo.ticketType = type;
  }

  function toggleSession(sessionId) {
    const ids = state.value.selectedSessionIds;
    const idx = ids.indexOf(sessionId);
    if (idx === -1) {
      ids.push(sessionId);
    } else {
      ids.splice(idx, 1);
    }
  }

  /**
   * Add or update an add-on in the cart.
   * Calling this for an add-on not yet in the cart will add it.
   * @param {string} addonId
   * @param {{ quantity?: number, size?: string | null }} [opts]
   */
  function updateAddon(addonId, opts = {}) {
    const addon = addons.value.find((a) => a.id === addonId);
    if (!addon) return;
    if (!state.value.selectedAddons[addonId]) {
      state.value.selectedAddons[addonId] = { quantity: 1, size: null };
    }
    const current = state.value.selectedAddons[addonId];
    if (opts.quantity !== undefined) current.quantity = opts.quantity;
    if (opts.size !== undefined) current.size = opts.size;
  }

  function removeAddon(addonId) {
    delete state.value.selectedAddons[addonId];
  }

  /**
   * Convenience toggle — adds with defaults if absent, removes if present.
   * @param {string} addonId
   * @param {{ quantity?: number, size?: string | null }} [opts]
   */
  function toggleAddon(addonId, opts = {}) {
    if (state.value.selectedAddons[addonId]) {
      removeAddon(addonId);
    } else {
      updateAddon(addonId, opts);
    }
  }

  /**
   * Attempt form submission.
   * @returns {boolean} true when the form is valid and submission is recorded.
   */
  function submit() {
    if (!isFormValid.value) return false;
    // Generate order ID like TC2028-47291
    state.value.orderId = `TC2028-${Math.floor(10000 + Math.random() * 90000)}`;
    state.value.isSubmitted = true;
    return true;
  }

  /** Reset the entire form to its initial state */
  function reset() {
    state.value = makeInitialState();
    touchedSteps.value = new Set();
  }

  // ── Public API ─────────────────────────────────────────────────────────

  return {
    // Raw state — expose so components can bind to nested fields directly
    state,

    // Localized data
    event,
    sessions,
    addons,

    // Derived: sessions
    sessionsByDate,
    selectedSessions,
    sessionConflictIds,

    // Derived: add-ons
    addonsByCategory,
    workshopConflictIds,
    hasMerchandise,

    // Derived: ticket
    isVip,
    ticketPrice,

    // Derived: pricing
    orderItems,
    totalPrice,
    formattedTotal,

    // Derived: validation
    validationErrors,
    stepsWithErrors,
    isFormValid,
    touchedSteps,

    // Navigation
    nextStep,
    prevStep,
    goToStep,
    touchStep,

    // Actions
    selectTicket,
    toggleSession,
    updateAddon,
    removeAddon,
    toggleAddon,
    submit,
    reset,

    // Helpers
    formatCurrency,

    // Constants (useful for templates)
    TOTAL_STEPS,
    ticketTypes: computed(() => event.value.ticketTypes),
  };
}
