# Role

You are an expert Vue 3 Frontend Architect. Your task is to create a robust, scalable composable (`useEventRegistration.js`) for a multi-step event registration form.

# Context

Read the `README.md` file, specifically the "Step Details" and data schema sections.
We have 4 steps. Each step requires specific data to be stored and validated.

# Constraints & Architectural Rules

- You MUST use Vue 3 Composition API and JavaScript.
- You MUST use clean code and best practices to create.
- Create ONLY the composable file. Do NOT create UI components.
- **Single Source of Truth (SSOT):** Only use `ref` (don't use `reactive`) object to store the payload for all 4 steps (Attendee Info, Sessions, Add-ons, and currentStep).
- **Navigation APIs:** Implement and expose helper functions to manage the current step (e.g., `nextStep()`, `prevStep()`, `goToStep(step)`).
- **Derived State (CRITICAL):** You MUST use `computed` for any derived data (e.g., calculating the total price based on ticket type and add-ons, or checking time conflicts). Do NOT use `watch` for state synchronization.
- **Expose:** Return the state, computed properties, and navigation methods cleanly.
