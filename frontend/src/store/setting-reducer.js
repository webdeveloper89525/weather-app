import { createSlice } from "@reduxjs/toolkit";

export const initSetting = {
    direction: "ltr",
    language: "en",
    theme: "light",
    isPinnedSidebar: true,
};

const settingSlice = createSlice({
    name: "settings", //the way it will look in the store
    initialState: initSetting,
    reducers: {
        // Update Setting with new and store to local storage.
        saveSettings(state, action) {
            // action.payload can contain a subset of state
            state = action.payload
            window.localStorage.setItem("settings", JSON.stringify(state));

            return state;
        },

        // Load Settings from local storage and save to store.
        loadSettings() {
            let settings = initSetting;

            try {
                const storedData = window.localStorage.getItem("settings");
                if (storedData) settings = JSON.parse(storedData);
            } catch (err) {
                console.error(err);
            }

            return settings;
        },
    },
});

export const { saveSettings, loadSettings } = settingSlice.actions;
export default settingSlice.reducer;
