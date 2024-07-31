import {Button, Card, Col, Divider, Form, Input, message, Radio, Row} from "antd";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {fetchSettingInfo, fetchUpdateSetting} from "@/store/modules/setting";
import {isDeepEqual} from "@/utils/utils";
import {throttle} from 'lodash-es';
import {fetchUpdateUser} from "@/store/modules/user";
import RequireAuth from "@/components/RequireAuth";
import {useTranslation} from "react-i18next";

function Setting() {
    const dispatch = useDispatch();
    const {t} = useTranslation();
    const [showPwd, setShowPwd] = useState(false);
    const [settingForm] = Form.useForm();
    const [accountForm] = Form.useForm();
    const userInfo = useSelector(state => state.user.userInfo);
    const settingInfo = useSelector(state => state.setting.settingInfo);
    const [storage, setStorage] = useState(null);

    useEffect(() => {
        loadData();
    }, [userInfo]);

    useEffect(() => {
        settingForm.setFieldsValue(settingInfo);
        accountForm.setFieldsValue(userInfo);
        setStorage(settingInfo.store_name);
    }, [settingInfo, userInfo]);

    function loadData() {
        if (userInfo.role == 'ADMIN') {
            dispatch(fetchSettingInfo());
        }
    }

    function handleSetPwd(show) {
        setShowPwd(show);
    }

    function handleStorage({target : {value}}) {
        setStorage(value);
    }

    function handleSetting() {
        const callback = throttle(() => {
            message.success(t('setting.save_success'));
            setShowPwd(false);
            loadData();
        }, 3000, {trailing: false});

        if (userInfo.role == 'ADMIN') {
            const settingData = settingForm.getFieldsValue();
            if (!isDeepEqual(settingData, settingInfo)) {
                dispatch(fetchUpdateSetting(settingData, callback));
            }
        }
        const userData = accountForm.getFieldsValue();
        if (!isDeepEqual(userData, userInfo)) {
            dispatch(fetchUpdateUser(userData, callback));
        }
    }

    return (
        <div className={"setting-container"}>
            <Card extra={<Button type={"primary"}
                                 onClick={handleSetting}
                                 style={{marginTop: 12}}>{t('common.save')}</Button>}>
                <RequireAuth allowedRoles={['ADMIN']}>
                    <div>
                        <Divider orientation="left" style={{marginTop: 0}}>{t('setting.system')}</Divider>
                        <Form style={{
                            maxWidth: 600,
                            marginLeft: 120
                        }}
                              labelCol={{
                                  span: 6,
                              }}
                              wrapperCol={{
                                  span: 18,
                              }}
                              form={settingForm}
                        >
                            <Row>
                                <Col offset={2} span={22}>
                                    <Form.Item label={t('setting.store_service')} name="store_name">
                                        <Radio.Group onChange={handleStorage}>
                                            <Radio value={"local"}>{t('setting.store.local')}</Radio>
                                            <Radio value={"cos"}>{t('setting.store.tx')}</Radio>
                                            <Radio value={"oss"}>{t('setting.store.ali')}</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                                <Col offset={2} span={22}>
                                    <Form.Item label={t('setting.store_address')} name="store_address">
                                        <Input/>
                                    </Form.Item>
                                </Col>
                                {
                                    storage != 'local' && <>
                                        <Col offset={2} span={22}>
                                            <Form.Item label={t('setting.secure_id')} name="secure_id">
                                                <Input.Password/>
                                            </Form.Item>
                                        </Col>
                                        <Col offset={2} span={22}>
                                            <Form.Item label={t('setting.secure_key')} name="secure_key">
                                                <Input.Password/>
                                            </Form.Item>
                                        </Col>
                                    </>
                                }
                                {
                                    storage == 'oss' && <Col offset={2} span={22}>
                                        <Form.Item label={t('setting.store_bucket')} name="store_bucket">
                                            <Input/>
                                        </Form.Item>
                                    </Col>
                                }
                                <Col offset={2} span={22}>
                                    <Form.Item label={t('setting.init_pwd')} name="init_pwd">
                                        <Input.Password/>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </RequireAuth>
                <div>
                    <Divider orientation="left">{t('setting.account')}</Divider>
                    <Form style={{
                        maxWidth: 600,
                        marginLeft: 120
                    }}
                          labelCol={{
                              span: 6,
                          }}
                          wrapperCol={{
                              span: 18,
                          }}
                          form={accountForm}
                    >
                        <Row>
                            <Col offset={2} span={22}>
                                <Form.Item label={t('setting.username')} name="username">
                                    <Input/>
                                </Form.Item>
                            </Col>
                            <Col offset={2} span={22}>
                                <Form.Item label={t('setting.nickname')} name="nickname">
                                    <Input/>
                                </Form.Item>
                            </Col>
                            {
                                showPwd ? (
                                    <>
                                        <Col offset={2} span={22}>
                                            <Form.Item label={t('setting.old_password')} name="old_password">
                                                <Input.Password/>
                                            </Form.Item>
                                        </Col>
                                        <Col offset={2} span={22}>
                                            <Form.Item label={t('setting.new_password')} name="new_password">
                                                <Input.Password/>
                                            </Form.Item>
                                        </Col>
                                    </>
                                ) : (
                                    <Col offset={2} span={22}>
                                        <Form.Item wrapperCol={{
                                            offset: 6,
                                            span: 16,
                                        }}>
                                            <Button type={"primary"} onClick={() => handleSetPwd(true)}>{t('setting.change_password')}</Button>
                                        </Form.Item>
                                    </Col>
                                )
                            }
                            <Form.Item name="user_id" style={{display: 'none'}}>
                                <Input/>
                            </Form.Item>
                        </Row>
                    </Form>
                </div>
            </Card>
        </div>
    );
}

export default Setting;
