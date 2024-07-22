import {createSlice} from "@reduxjs/toolkit";
import request from "@/utils/request";
import {errors} from "@/utils/utils";

const workStore = createSlice({
    name: 'work',
    initialState: {
        workList: {
            total: 0,
            data: []
        },
        taskList: {
            total: 0,
            data: []
        },
        modelList: {
            models: []
        },
        sizeList: {
            sizes: []
        },
        authorList: {
            data: []
        },
        workDetail: {
            details: []
        }
    },
    reducers: {
        setWorkList(state, action) {
            state.workList.total = action.payload.total; // 更新total
            state.workList.data = [
                ...state.workList.data, // 保留原有的数据
                ...action.payload.data, // 追加新数据
            ];
        },
        resetWorkList(state, action) {
            state.workList = action.payload;
        },
        setModelList(state, action) {
            state.modelList = action.payload;
        },
        setSizeList(state, action) {
            state.sizeList = action.payload;
        },
        setAuthorList(state, action) {
            state.authorList = action.payload;
        },
        setTaskList(state, action) {
            state.taskList = action.payload;
        },
        setWorkDetail(state, action) {
            state.workDetail = action.payload;
        },
        updateWorkDetail(state, action) {
            const mark = action.payload;
            state.workDetail.details = state.workDetail.details.map(d => {
                if (d.sub_task_id === mark.sub_task_id) {
                    d.has_excellent = mark.has_excellent;
                }
                return d;
            });
            console.log("state.workDetail.details ==", state.workDetail.details);
        }
    }
});

const {
    setWorkList,
    resetWorkList,
    setModelList,
    setTaskList,
    setAuthorList,
    setSizeList,
    setWorkDetail,
    updateWorkDetail
} = workStore.actions;

const fetchWorkList = (params) => {
    return async (dispatch) => {
        try {
            const res = await request.get('/api/v1/manage/work', params);
            dispatch(setWorkList(res));
        } catch (error) {
            errors(error.response.data);
        }
    };
};

const clearWorkList = () => {
    return async (dispatch) => {
        dispatch(resetWorkList({
            total: 0,
            data: []
        }));
    };
};

const fetchModelList = () => {
    return async (dispatch) => {
        try {
            const res = await request.get('/api/v1/manage/task/model');
            dispatch(setModelList(res));
        } catch (error) {
            errors(error.response.data);
        }
    };
};

const fetchSizeList = () => {
    return async (dispatch) => {
        try {
            const res = await request.get('/api/v1/manage/task/size');
            dispatch(setSizeList(res));
        } catch (error) {
            errors(error.response.data);
        }
    };
};

const fetchTaskList = (params) => {
    return async (dispatch) => {
        try {
            const res = await request.get('/api/v1/manage/task', params);
            dispatch(setTaskList(res));
        } catch (error) {
            errors(error.response.data);
        }
    };
};

const fetchAuthorList = (params) => {
    return async (dispatch) => {
        try {
            const res = await request.get('/api/v1/manage/task/author', params);
            dispatch(setAuthorList(res));
        } catch (error) {
            errors(error.response.data);
        }
    };
};

const fetchWorkDetail = (taskId) => {
    return async (dispatch) => {
        try {
            const res = await request.get('/api/v1/manage/work/' + taskId);
            dispatch(setWorkDetail(res));
        } catch (error) {
            errors(error.response.data);
        }
    };
};

const fetchWorkExcellent = (markBo : { task_id: number, sub_task_id: number, has_excellent: boolean }) => {
    return async (dispatch) => {
        try {
            await request.put('/api/v1/manage/work/excellent', markBo);
            dispatch(updateWorkDetail(markBo));
        } catch (error) {
            errors(error.response.data);
        }
    };
};

export {
    fetchWorkList,
    clearWorkList,
    fetchModelList,
    fetchTaskList,
    fetchAuthorList,
    fetchSizeList,
    fetchWorkDetail,
    fetchWorkExcellent
};

export default workStore;
