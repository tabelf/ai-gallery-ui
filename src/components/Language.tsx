import React, {useEffect} from "react";
import {useTranslation} from "react-i18next";
import {LanguageIcon} from "@/assets/Icon";
import {Dropdown} from "antd";
import {useLocale} from "@/hook/context";

function Language() {
    const {t, i18n} = useTranslation();
    const changeLocale = useLocale();

    function handleChangeLanguage({key}) {
        i18n.changeLanguage(key);
        changeLocale(key);
        localStorage.setItem('selectedLocale', key);
    }

    useEffect(() => {
        const selectedLocale = localStorage.getItem('selectedLocale');
        if (selectedLocale) {
            i18n.changeLanguage(selectedLocale);
            changeLocale(selectedLocale);
        }
    }, []);

    const languageItems = [
        {
            key: 'zh',
            label: t('common.chinese'),
        },
        {
            key: 'en',
            label: t('common.english'),
        }
    ];

    return (
        <Dropdown menu={{
            items: languageItems,
            onClick: handleChangeLanguage
        }} placement="bottom">
            <LanguageIcon/>
        </Dropdown>
    );
}

export default Language;
