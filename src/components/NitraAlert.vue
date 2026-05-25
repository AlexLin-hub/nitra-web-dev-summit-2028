<script setup>
import { computed } from "vue";

const props = defineProps({
  /**
   * 'info'   — blue icon, neutral title, muted body
   * 'danger' — no icon, danger title, danger bullet list
   */
  variant: {
    type: String,
    default: "info",
    validator: (v) => ["info", "danger"].includes(v),
  },
  title: {
    type: String,
    default: "",
  },
  /**
   * Single body text (info variant).
   * Use the default slot for richer content.
   */
  message: {
    type: String,
    default: "",
  },
  /**
   * Bullet message list (danger variant).
   */
  messages: {
    type: Array,
    default: () => [],
  },
});

const config = computed(() =>
  props.variant === "info"
    ? {
        bg: "bg-info-subtle-rest",
        icon: "info",
        iconColor: "text-info",
        titleColor: "text-neutral",
        textColor: "text-neutral-muted",
        role: "status",
        showIcon: true,
      }
    : {
        bg: "bg-danger-subtle-rest",
        titleColor: "text-danger",
        textColor: "text-danger",
        role: "alert",
        showIcon: false,
      }
);
</script>

<template>
  <div
    :role="config.role"
    :class="['flex gap-3 rounded-xl p-4', config.bg]"
  >
    <!-- Icon (info only) -->
    <q-icon
      v-if="config.showIcon"
      name="info"
      size="20px"
      :class="['shrink-0 mt-0.5', config.iconColor]"
    />

    <!-- Content -->
    <div class="flex flex-col gap-1 min-w-0">
      <!-- Title -->
      <p
        v-if="title"
        class="text-[length:var(--font-size-sm)] font-semibold"
        :class="config.titleColor"
      >
        {{ title }}
      </p>

      <!-- Body: slot or single message (info) -->
      <template v-if="!messages.length">
        <slot>
          <p
            v-if="message"
            class="text-[length:var(--font-size-sm)]"
            :class="config.textColor"
          >
            {{ message }}
          </p>
        </slot>
      </template>

      <!-- Bullet list (danger) -->
      <ul v-else class="flex flex-col gap-0.5">
        <li
          v-for="(msg, index) in messages"
          :key="index"
          class="flex items-start gap-1.5 text-[length:var(--font-size-sm)]"
          :class="config.textColor"
        >
          <span class="mt-px">•</span>
          <span>{{ msg }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
