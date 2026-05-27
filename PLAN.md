# Nitra WebDev Summit 2028 - Project Plan

_Welcome! To see my complete development journey and AI collaboration methodology, please refer to the following documentation files:_

- [**`DEV_LOG.md`**](./DEV_LOG.md): Chronological development log and problem-solving journey.
- [**`composable-workflow.md`**](./composable-workflow.md): AI constraints for the state machine.
- [**`component-workflow.md`**](./component-workflow.md): AI constraints for UI generation.

---

## 1. Architectural Decisions & Project Overview

This project is an Event Registration Wizard built with **Vue 3.5.17**, **Quasar v2.18.5**, and **UnoCSS**. My primary goal was to deliver a highly maintainable, pixel-perfect multi-step form with a robust state machine.

- **Single Source of Truth (SSOT):** Instead of using Pinia, I implemented a global composable (`useEventRegistration.js`). I strictly used `ref` (avoiding `reactive` to prevent reactivity loss during state replacement) to store the payload for all steps.
- **Derived State:** All calculations (e.g., total prices, VIP discounts, time-conflict detection) are strictly handled via `computed`. I avoided manual `watch` updates to prevent data inconsistency.
- **Dynamic Components:** Used `<component :is="...">` to handle step transitions seamlessly. This keeps the architecture lightweight without requiring a complex Vue Router setup.
- **i18n Routing:** Implemented `vue-i18n` with a simple URL parameter approach (`?hl=lang`, defaulting to `en-us`) for scalability.

---

## 2. AI Collaboration Strategy

_Approximately 90% of the boilerplate and base logic was generated using AI, heavily guided by strict markdown-based constraints._

### Phase 1: Prompt Engineering via Workflow Files

Instead of writing ad-hoc prompts, I engineered specific "Rule Files" to constrain the AI's output. By defining strict boundaries for UnoCSS and Quasar, I prevented styling conflicts.

### Phase 2: Figma MCP Integration

Initially, I faced permission issues with the provided Figma link. I proactively duplicated the design into my personal drafts to unlock Figma Dev Mode. This allowed me to use the **Figma MCP server** with Cursor (`Claude 3.5 Sonnet`), feeding exact design tokens directly into the AI context for component generation.

### Phase 3: i18n Generation via Gemini CLI

To implement internationalization efficiently, I utilized the **Gemini CLI (`gemini-3-flash-preview`)**. I fed the UI text into the model to rapidly generate and structure the localization files (`zh-TW` and `en-US`), eliminating manual translation overhead.

### Phase 4: Human-in-the-Loop Code Review

AI is powerful but imperfect. I conducted a strict manual code review to fix AI hallucinations and polish the UI/UX:

- **CSS Resets:** Manually removed default margins/paddings on `<button>`, `<h3>`, `<p>` tags that the AI missed, ensuring pixel-perfect alignment with Figma.
- **Design Token Accuracy:** The AI hallucinated some capacity colors. I manually corrected the `capacityToken` logic in `NitraSessionCard.vue` (e.g., `< 0.5`: green, `>= 0.5`: red, `sold out`: warning/default).
- **Component Alignment:** Fixed icon alignments in `NitraAlert.vue` and corrected the placeholder text and styling in `NitraAddonCard.vue`'s select dropdown.

---

## 3. Product Sense & UX Polish

_Beyond the basic requirements, I implemented several business-driven UX enhancements:_

- **Defensive Programming:** Added a `beforeunload` event listener to prevent users from accidentally losing their data if they try to close the tab mid-registration.
- **Business Logic Enhancements:**
  - Set "VIP" as the default ticket selection to drive higher revenue.
  - Unified and localized the lunch-included notification block in the Add-ons step using i18n parameter interpolation: When a user chooses a General or VIP ticket, it dynamically displays a `<NitraAlert/>` reminding them that their specific ticket type (e.g., `{ticketName}`) already includes a two-day lunch, preventing accidental/redundant meal purchases.
  - Added a user-friendly `<NitraAlert/>` inline informational hint in the Sessions selection step when no sessions are selected yet, clarifying that session registration is optional and they can also decide on-site, thereby reducing registration friction.
  - Shipping Information validation is dynamically triggered _only_ if the user purchases merchandise.
- **Form Validation & Navigation & Layout Polish:**
  - Users can freely click the `<NitraStepper/>` to jump between steps for quick edits.
  - Implemented a `sticky` order summary sidebar in the Add-ons page, ensuring that the total price and selected items remain visible and interactive as users scroll down a long list of workshops, meals, and merchandise, drastically boosting the checkout/review UX.
  - Error states and validation messages are only triggered _after_ the user attempts to click "Next" or "input blur" or passes the step, preventing premature error flashing.
  - Synchronized disabled states for sessions and workshops to prevent time-conflict selections in real-time.
  - Auto-selected the first available product size when a user checks a merchandise item.

---

## 4. Future Improvements

Given more time, I would elevate the project further by:

1. **Testing:** Implementing comprehensive unit tests using **Vitest** to cover the time-conflict algorithms and price calculation logic in the composable.
2. **Backend Integration:** Deploying to Firebase Hosting and integrating Firestore for real-time ticket inventory management and automated confirmation emails.
3. **Responsive Web Design (RWD):** Further optimizing the mobile layout for smaller viewports.
