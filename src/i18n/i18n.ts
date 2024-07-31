import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from './locales/en.json';
import zhTranslation from  './locales/zh.json';

const resources = {
    en: {
        translation: enTranslation
    },
    zh: {
        translation: zhTranslation
    }
};

i18n.use(initReactI18next).init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false, // react already safes from xss
        returnObjects: true,
    },
    initImmediate: false,
    preload: ['en', 'zh'],
    detection: {
        order: ['cookie', 'localStorage', 'navigator'],
        caches: ['localStorage'],
    },
});

export default i18n;
