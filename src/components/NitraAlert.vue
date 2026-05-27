<script setup>
import { computed } from "vue";

const props = defineProps({
  /**
   * 'info'   — blue icon, neutral title, neutral body, info-tinted surface
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
        container:
          "bg-info-subtle-rest border border-info-opacity rounded-lg gap-3",
        showIcon: true,
        iconColor: "text-info",
        titleSize:
          "text-[length:var(--font-size-md)] leading-[20px] font-semibold",
        titleColor: "text-neutral",
        bodySize: "text-[length:var(--font-size-md)] leading-[20px]",
        bodyColor: "text-neutral",
        gap: "gap-1",
        role: "status",
      }
    : {
        container:
          "bg-danger-muted-rest border border-danger-muted rounded-md gap-2",
        showIcon: false,
        titleSize:
          "text-[length:var(--font-size-sm)] leading-[16px] font-medium",
        titleColor: "text-danger",
        bodySize: "text-[length:var(--font-size-sm)] leading-[16px]",
        bodyColor: "text-danger",
        gap: "gap-2",
        role: "alert",
      },
);
</script>

<template>
  <div
    :role="config.role"
    :class="['flex flex-nowrap items-start p-4', config.container]"
  >
    <!-- Icon (info only) -->
    <q-icon
      v-if="config.showIcon"
      name="info"
      size="20px"
      :class="['shrink-0', config.iconColor]"
    />

    <!-- Content -->
    <div :class="['flex min-w-0 flex-col', config.gap]">
      <!-- Title -->
      <p v-if="title" :class="[config.titleSize, config.titleColor]">
        {{ title }}
      </p>

      <!-- Body: slot or single message (info) -->
      <template v-if="!messages.length">
        <slot>
          <p v-if="message" :class="[config.bodySize, config.bodyColor]">
            {{ message }}
          </p>
        </slot>
      </template>

      <!-- Bullet list (danger) -->
      <ul v-else class="flex flex-col gap-2">
        <li
          v-for="(msg, index) in messages"
          :key="index"
          :class="[
            'flex items-start gap-1.5',
            config.bodySize,
            config.bodyColor,
          ]"
        >
          <span>•</span>
          <span>{{ msg }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<style scoped>
p,
ul,
li {
  padding: 0;
  margin: 0;
}
</style>
