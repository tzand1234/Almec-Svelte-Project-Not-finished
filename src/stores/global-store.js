import { writable } from "svelte/store";

const globalStore = writable({
  alert: false,
  alertText: "default alert",
  alertDanger: false
});

//custom store
const store = {
  subscribe: globalStore.subscribe,
  toggleItem: (item, value, alertText = "default", alertDanger = false) => {
    if (item === "alert") {
      globalStore.update(storeValues => {
        return { ...storeValues, [item]: value, alertText, alertDanger };
      });
    }
  }
};


export default store;
