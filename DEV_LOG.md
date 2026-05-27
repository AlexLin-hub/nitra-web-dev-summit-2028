# Development Log (DEV_LOG.md)

This log documents the chronological development journey and the human-AI collaboration process for the Nitra Event Registration Wizard.

## Phase 1: Architecture & AI Constraints Setup

1. **Design `composable-workflow.md`:** Established strict rules for the AI (vanilla JS, `ref` only for SSOT, `computed` for derived state).
2. **Build `useEventRegistration.js`:** Generated the core state machine using the workflow prompt.
3. **Design `components-workflow.md`:** Defined UI generation rules (UnoCSS + Quasar synergy, Design Tokens mapping).

## Phase 2: Initial UI Generation & Figma Blocker

4. **Initial Component Generation:** Attempted to build components using Claude `Sonnet 4.6`. Faced permission issues with the provided Figma MCP link, so I temporarily used PNG exports to build the initial UI structure.
5. **Page Construction:** Built Step 1 to 4 pages (including Success State) by integrating the generated components and connecting them to `useEventRegistration.js`.

## Phase 3: Figma MCP Unlocked & UI Refinement

6. **Figma Blocker Resolved:** Duplicated the provided Figma design into my personal drafts to successfully unlock Figma Dev Mode and MCP access.
7. **UI Overhaul via MCP:** Re-ran the AI prompts using the live Figma MCP to update all components and step pages with precise Design Tokens.
8. **Human CSS Polish:** Conducted a manual pass to fix detail-level CSS issues (e.g., removing default margins/paddings on native HTML tags, adjusting `capacityToken` colors).

## Phase 4: UX Enhancements & i18n

9. **i18n Implementation:** Utilized `Gemini CLI (gemini-3-flash-preview)` to rapidly generate the `zh-TW` and `en-US` localization files based on the UI text.
10. **Business Logic Adjustment:** Moved the "Shipping Information" validation/display logic to trigger _only_ when the "Merchandise" tab is interacted with.

## Phase 5: Final Review

11. **Code Quality Check:** Performed a final code review using Antfu's skills conventions (specifically `/unocss` and `/vue`) to ensure enterprise-grade code cleanliness.
