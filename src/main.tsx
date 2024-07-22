import React from 'react';
import ReactDOM from 'react-dom/client';
import {RouterProvider} from 'react-router-dom';
import router from "./router";
import { Provider } from 'react-redux';
import './index.less';
import store from "@/store";
import locale from 'antd/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import {ConfigProvider} from "antd";

dayjs.locale('zh-cn');

ReactDOM.createRoot(document.getElementById('root')!).render(
    <ConfigProvider locale={locale}>
        <Provider store={store}>
            <RouterProvider router={router} />
        </Provider>
    </ConfigProvider>,
);
