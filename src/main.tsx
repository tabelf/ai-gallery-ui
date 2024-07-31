import React from 'react';
import ReactDOM from 'react-dom/client';
import {RouterProvider} from 'react-router-dom';
import router from "./router";
import {Provider} from 'react-redux';
import './index.less';
import store from "@/store";
import zhCN from 'antd/locale/zh_CN';
import enCN from 'antd/locale/en_US';
import {I18nextProvider} from 'react-i18next';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import {ConfigProvider} from "antd";
import i18n from "@/i18n/i18n";
import {LocaleContext} from "@/hook/context";

dayjs.locale('zh-cn');

function App() {
    const [locale, setLocale] = React.useState(enCN);

    const changeLocale = (locale) => {
        const newLocale = locale === 'zh' ? zhCN : enCN;

        setLocale(newLocale);

        dayjs.locale(locale === 'zh' ? 'zh-cn' : 'en');
    };

    return (
        <LocaleContext.Provider value={changeLocale}>
            <I18nextProvider i18n={i18n}>
                <ConfigProvider locale={locale}>
                    <Provider store={store}>
                        <RouterProvider router={router}/>
                    </Provider>
                </ConfigProvider>
            </I18nextProvider>
        </LocaleContext.Provider>
    );
}


ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
