import {createSlice} from "@reduxjs/toolkit";
import request from "@/utils/request";
import {errors} from "@/utils/utils";

const analysisStore = createSlice({
    name: 'analysis',
    initialState: {
        baseData: {
            "task_total": 0,
            "work_total": 0,
            "excellent_total": 0,
            "account_total": 0,
            "today_task_count": 0,
            "today_work_count": 0,
            "today_excellent_count": 0
        },
        taskData: {
            times: [],
            tasks: []
        },
        userData: {
            users: []
        }
    },
    reducers: {
        setBaseData(state, action) {
            state.baseData = action.payload;
        },
        setTaskData(state, action) {
            state.taskData = action.payload;
        },
        setUserData(state, action) {
            state.userData = action.payload;
        },
    }
});

const {setBaseData, setTaskData, setUserData} = analysisStore.actions;

// 异步请求部分
const fetchAnalysisBase = () => {
    return async (dispatch) => {
        try {
            const res = await request.get('/api/v1/manage/analysis/base');
            dispatch(setBaseData(res));
        } catch (error) {
            errors(error.response.data);
        }
    };
};

const fetchAnalysisTask = (params) => {
    return async (dispatch) => {
        try {
            const res = await request.get('/api/v1/manage/analysis/task', params);
            dispatch(setTaskData(res));
        } catch (error) {
            errors(error.response.data);
        }
    };
};

const fetchAnalysisUser = (params) => {
    return async (dispatch) => {
        try {
            const res = await request.get('/api/v1/manage/analysis/user', params);
            dispatch(setUserData(res));
        } catch (error) {
            errors(error.response.data);
        }
    };
};

export {
    fetchAnalysisBase,
    fetchAnalysisTask,
    fetchAnalysisUser
};

export default analysisStore;
