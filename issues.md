# UI

- [ ] `<button>`、`<h3/>`、`<p/>` 等標籤，需要移除 margin, padding, border 等預設樣式，避免影響設計。
- [ ] `@views/AttendeeInfo.vue`
  - [ ] `<NitraTextField/>` 沒有設定欄位錯誤訊息與狀態
  - [ ] Shipping Address `<NitraTextField/>` 當有購買 `merchandise` 時，為必填
- [ ] `@component/NitraSessionCard.vue` `capacityToken` 顏色，disabled&sold out 顏色: text/warning/default, >0.5 顏色: orange/600, else: bg/brand/emphasis/rest
- [ ] `@component/NitraAddonCard.vue` 的 select 需要參考 [figma 設計稿](https://www.figma.com/design/4rDWVk2kj6bjTlj6KcCXsD/Nitra-FE-Assessment---v2--Copy-?node-id=1172-596&m=dev)，且選單 placeholder 為 "Select"
- [ ] `@component/NitraAlert.vue` 的 icon 應與文字平行排列，參考 [figma 設計稿](https://www.figma.com/design/4rDWVk2kj6bjTlj6KcCXsD/Nitra-FE-Assessment---v2--Copy-?node-id=1220-2186&m=dev)

# UX

- [ ] `App.vue`
  - [ ] `<NitraStepper/>` 當到超過該階段時，才驗證有無錯誤
  - [ ] `<NitraStepper/>` 可以直接點回某個階段，快速跳轉
  - [ ] 新增 `beforeunload` event，阻擋使用者離開頁面，以免造成資料遺失
- [ ] `@views/AttendeeInfo.vue`
  - [ ] `<NitraTextField/>` 錯誤訊息與狀態，於點擊 `Next` 時才驗證
- [ ] `@component/NitraSessionCard.vue` 與 `@component/NitraAddonCard.vue` 的 hover 等狀態可以比照 `@component/NitraTicketCard.vue`
- [ ] `@views/Addons.vue` 的 `Meal Package` 選項，當 ticket type 為 `vip` 時，顯示一個 `<NitraAlert/>` 提示，告訴使用者已經有提供午餐。
