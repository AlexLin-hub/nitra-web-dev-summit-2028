# Composables Architecture

This directory contains the business logic and state management for the Nitra WebDev Summit 2028 registration flow.

## `useEventRegistration.js`

This is the primary global composable managing the multi-step registration process.

### Architecture Overview

#### 1. Single Source of Truth (SSOT)

All form state is stored in a single `ref` object. This ensures data consistency across all 4 steps and simplifies the final submission.

- **State includes:** `currentStep`, `attendeeInfo`, `selectedSessionIds`, `selectedAddons`, and `isSubmitted`.

#### 2. Derived State (Computed Only)

We strictly use `computed` properties for any data derived from the base state. This ensures reactivity without the side effects or synchronization issues of `watch`.

| Computed Property     | Description                                                             |
| --------------------- | ----------------------------------------------------------------------- |
| `sessionsByDate`      | Groups sessions by date for the UI.                                     |
| `sessionConflictIds`  | Detects time overlaps between selected sessions.                        |
| `workshopConflictIds` | Identifies workshops that conflict with selected sessions.              |
| `orderItems`          | Generates itemized receipt lines, applying VIP discounts automatically. |
| `totalPrice`          | Calculates the grand total.                                             |
| `validationErrors`    | Real-time validation object for all steps.                              |
| `stepsWithErrors`     | Identifies which steps (1-3) currently have validation issues.          |

#### 3. Navigation APIs

The composable exposes helper functions to manage the user's progress through the form:

- `nextStep()` / `prevStep()`
- `goToStep(step)`

#### 4. Actions

State mutations are performed through explicit action functions:

- `selectTicket(type)`
- `toggleSession(sessionId)`
- `updateAddon(addonId, opts)` / `toggleAddon(addonId)`
- `submit()`: Validates the entire form and marks it as submitted.
- `reset()`: Returns the state to its initial values.

#### 5. Validation Rules

- **Step 1:** Required fields, email/phone formatting, and conditional shipping address (required if merchandise is selected).
- **Step 2:** Time conflict detection for sessions.
- **Step 3:** Size selection for merchandise.
- **Step 4:** Unified validation check before final submission.
