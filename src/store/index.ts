import {configureStore} from "@reduxjs/toolkit";
import userStore from "@/store/modules/user";
import workStore from "@/store/modules/work";
import analysisStore from "@/store/modules/analyse";
import settingStore from "@/store/modules/setting";

const store = configureStore({
    reducer: {
        user: userStore.reducer,
        work: workStore.reducer,
        analysis: analysisStore.reducer,
        setting: settingStore.reducer
    }
});

export default store;
