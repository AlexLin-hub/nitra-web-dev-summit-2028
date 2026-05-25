# Nitra WebDev Summit 2028 - Project Plan

## 1. Implementation Steps

1. **State Management:** Create a global composable to manage step navigation and store form data across all steps for the final review.
2. **UI Components:** Extract reusable UI components based on the Figma design (naming convention: `Nitra[ComponentName].vue`).
3. **Step Navigation:** Implement form steps as separate components and use Vue's dynamic `<component :is="...">` to handle step transitions seamlessly while sharing the global state.
4. **Data Integration:** Integrate the provided mock data to drive the page logic and dynamic rendering.
5. **Validation:** Implement validation rules for each step before allowing the user to proceed.
6. **UX Polish:** Refine the user experience, including error states and smooth transitions.

## 2. Architectural Decisions

- **Composable over Pinia:** I chose a Vue composable for state management to keep the architecture lightweight. It establishes a Single Source of Truth (SSOT) for the form data without the overhead of an external library.
- **Dynamic Components (`<component :is="...">`):** This approach simplifies step navigation and ensures the component state is easily preserved across steps without requiring a complex Vue Router setup.
- **Computed Properties:** Strictly used for deriving state (e.g., calculating the total price) to ensure reactivity and prevent data inconsistency caused by manual `watch` updates.

## 3. Future Improvements

- Implement the `beforeunload` event listener to warn users and prevent accidental data loss if they try to leave the page in the middle of the form.

## 4. Nice to Have (Bonus)

- Integrate `vue-i18n` to support `en-US` and `zh-TW` localizations.

## 5. AI Collaboration Log

_(To be updated during the development process...)_

## 6. Challenges & Solutions

_(To be updated during the development process...)_
