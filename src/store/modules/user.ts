import {createSlice} from "@reduxjs/toolkit";
import request from "@/utils/request";
import {Cache, errors, isEmpty} from "@/utils/utils";

export const USER_TOKEN_EXPIRED = 60 * 24 * 30; // 用户信息 30 天有效期
export const USER_TOKEN_KEY = "USER_TOKEN_KEY";

const userStore = createSlice({
    name: 'user',
    initialState: {
        userList: {
            total: 0,
            data: []
        },
        userInfo: {}
    },
    reducers: {
        setUserList(state, action) {
            state.userList = action.payload;
        },
        setUserInfo(state, action) {
            state.userInfo = action.payload;
        },
    }
});

const {setUserList, setUserInfo} = userStore.actions;

// 异步请求部分
const fetchUserList = (params) => {
    return async (dispatch) => {
        try {
            const res = await request.get('/api/v1/manage/user', params);
            dispatch(setUserList(res));
        } catch (error) {
            console.log("error.response =", error.response);
            errors(error.response.data);
        }
    };
};

const fetchCreateOrUpdateUser = (body, callback: () => void) => {
    return async (dispatch) => {
        try {
            if (body.user_id) {
                await request.put('/api/v1/manage/user/' + body.user_id, body);
            } else {
                await request.post('/api/v1/manage/user', body);
            }
        } catch (error) {
            errors(error.response.data);
        }
        callback();
    };
};

const fetchUpdateUserStatue = (user, callback: () => void) => {
    return async (dispatch) => {
        try {
            await request.put('/api/v1/manage/user/' + user.user_id, user);
        } catch (error) {
            errors(error.response.data);
        }
        callback();
    };
};

const fetchDeleteUser = (user_id, callback: () => void) => {
    return async (dispatch) => {
        try {
            await request.delete('/api/v1/manage/user/' + user_id);
        } catch (error) {
            errors(error.response.data);
        }
        callback();
    };
};

const fetchResetUserPwd = (user_id, callback: () => void) => {
    return async (dispatch) => {
        try {
            await request.put('/api/v1/manage/user/' + user_id + '/reset');
        } catch (error) {
            errors(error.response.data);
        }
        callback();
    };
};

const fetchLogin = (info) => {
    return async (dispatch) => {
        try {
            const res = await request.post('/api/v1/anonymous/login', info);
            Cache.set(USER_TOKEN_KEY, res.token, USER_TOKEN_EXPIRED);
            let beforePage = document.referrer;
            if (isEmpty(beforePage)) {
                beforePage = "/";
            }
            window.location.href = beforePage; // 返回进行登录页的前一个页面
        } catch (error) {
            errors(error.response.data);
        }
    };
};

const fetchUserInfo = () => {
    return async (dispatch) => {
        try {
            const res = await request.get('/api/v1/manage/user/detail');
            dispatch(setUserInfo(res));
        } catch (error) {
            errors(error.response.data);
        }
    };
};

const fetchUpdateUser = (data, callback) => {
    return async (dispatch) => {
        try {
            await request.put('/api/v1/manage/user/detail', data);
            callback();
        } catch (error) {
            errors(error.response.data);
        }
    };
};


function getUserToken() {
    return Cache.get(USER_TOKEN_KEY);
}

function logout(sleep) {
    Cache.remove(USER_TOKEN_KEY);
    setTimeout(() => {
        window.location.href = "/login";
    }, sleep);
}

export {
    fetchUserList,
    fetchLogin,
    fetchUpdateUserStatue,
    fetchDeleteUser,
    fetchCreateOrUpdateUser,
    fetchResetUserPwd,
    fetchUserInfo,
    getUserToken,
    fetchUpdateUser,
    logout
};

export default userStore;
