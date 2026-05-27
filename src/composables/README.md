# Composables Architecture

This directory contains the business logic and state management for the Nitra WebDev Summit 2028 registration flow.

## `useEventRegistration.js`

This is the primary global composable managing the multi-step registration process.

### Architecture Overview

#### 1. Single Source of Truth (SSOT)

All form state is stored in a single `ref` object. This ensures data consistency across all 4 steps and simplifies the final submission.

- **State includes:** `currentStep`, `attendeeInfo`, `selectedSessionIds`, `selectedAddons`, `isSubmitted`, and `orderId`.

#### 2. Derived State (Computed Only)

We strictly use `computed` properties for any data derived from the base state. This ensures reactivity without the side effects or synchronization issues of `watch`.

| Computed Property            | Description                                                              |
| ---------------------------- | ------------------------------------------------------------------------ |
| `sessionsByDate`             | Groups sessions by date for the UI.                                      |
| `sessionConflictIds`         | Detects time overlaps between selected sessions.                         |
| `workshopConflictIds`        | Identifies workshops that conflict with selected sessions.               |
| `sessionWorkshopConflictIds` | Identifies sessions that conflict with selected workshops.               |
| `orderItems`                 | Generates itemized receipt lines, applying VIP discounts automatically.  |
| `totalPrice`                 | Calculates the grand total as a number.                                  |
| `formattedTotal`             | Returns the total price as a localized currency string.                  |
| `validationErrors`           | Real-time validation object for all steps.                               |
| `stepsWithErrors`            | Identifies which steps (1-3) currently have validation issues.           |
| `isFormValid`                | Returns true only when all validation checks pass.                       |

#### 3. Navigation APIs

The composable exposes helper functions to manage the user's progress through the form:

- `nextStep()` / `prevStep()`
- `goToStep(step)`
- `touchStep(step)`: Marks a step as "touched" to enable field-level error display.

#### 4. Actions

State mutations are performed through explicit action functions:

- `selectTicket(type)`
- `toggleSession(sessionId)`
- `updateAddon(addonId, opts)` / `toggleAddon(addonId)`
- `removeAddon(addonId)`
- `submit()`: Validates the entire form, generates an `orderId`, and marks it as submitted.
- `reset()`: Returns the state to its initial values.

#### 5. Validation Rules

- **Step 1:** Required fields (Name, Email, Phone, Company, Job Title, Ticket Type), email/phone formatting, and conditional shipping address (required if merchandise is selected).
- **Step 2:** Time conflict detection for sessions.
- **Step 3:** Size selection for merchandise.
- **Step 4:** Unified validation check before final submission.
