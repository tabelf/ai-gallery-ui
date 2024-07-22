import {createSlice} from "@reduxjs/toolkit";
import request from "@/utils/request";
import {errors} from "@/utils/utils";

const settingStore = createSlice({
    name: 'setting',
    initialState: {
        settingInfo: {},
    },
    reducers: {
        setSettingInfo(state, action) {
            state.settingInfo = action.payload;
        },
    }
});

const {setSettingInfo} = settingStore.actions;

const fetchSettingInfo = () => {
    return async (dispatch) => {
        try {
            const res = await request.get('/api/v1/manage/setting');
            dispatch(setSettingInfo(res));
        } catch (error) {
            errors(error.response.data);
        }
    };
};

const fetchUpdateSetting = (data, callback) => {
    return async (dispatch) => {
        try {
            await request.put('/api/v1/manage/setting', data);
            callback();
        } catch (error) {
            errors(error.response.data);
        }
    };
};


export {
    fetchSettingInfo,
    fetchUpdateSetting
};

export default settingStore;
