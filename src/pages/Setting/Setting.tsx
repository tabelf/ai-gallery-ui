import {Button, Card, Col, Divider, Form, Input, message, Radio, Row} from "antd";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {fetchSettingInfo, fetchUpdateSetting} from "@/store/modules/setting";
import {isDeepEqual} from "@/utils/utils";
import {throttle} from 'lodash-es';
import {fetchUpdateUser} from "@/store/modules/user";
import RequireAuth from "@/components/RequireAuth";

function Setting() {
    const dispatch = useDispatch();
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
            message.success("保存成功");
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
    // setStorage(settingInfo.store_name);

    return (
        <div className={"setting-container"}>
            <Card extra={<Button type={"primary"}
                                 onClick={handleSetting}
                                 style={{marginTop: 12}}>保存</Button>}>
                <RequireAuth allowedRoles={['ADMIN']}>
                    <div>
                        <Divider orientation="left" style={{marginTop: 0}}>系统设置</Divider>
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
                                    <Form.Item label="存储服务" name="store_name">
                                        <Radio.Group onChange={handleStorage}>
                                            <Radio value={"local"}>本地存储</Radio>
                                            <Radio value={"cos"}>腾讯云COS</Radio>
                                            <Radio value={"oss"}>阿里云OSS</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                                <Col offset={2} span={22}>
                                    <Form.Item label="存储地址" name="store_address">
                                        <Input/>
                                    </Form.Item>
                                </Col>
                                {
                                    storage != 'local' && <>
                                        <Col offset={2} span={22}>
                                            <Form.Item label="存储ID" name="secure_id">
                                                <Input.Password/>
                                            </Form.Item>
                                        </Col>
                                        <Col offset={2} span={22}>
                                            <Form.Item label="存储KEY" name="secure_key">
                                                <Input.Password/>
                                            </Form.Item>
                                        </Col>
                                    </>
                                }
                                {
                                    storage == 'oss' && <Col offset={2} span={22}>
                                        <Form.Item label="存储桶名称" name="store_bucket">
                                            <Input/>
                                        </Form.Item>
                                    </Col>
                                }
                                <Col offset={2} span={22}>
                                    <Form.Item label="初始/重置用户密码" name="init_pwd">
                                        <Input.Password/>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </RequireAuth>
                <div>
                    <Divider orientation="left">账号设置</Divider>
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
                                <Form.Item label="用户名" name="username">
                                    <Input/>
                                </Form.Item>
                            </Col>
                            <Col offset={2} span={22}>
                                <Form.Item label="昵称" name="nickname">
                                    <Input/>
                                </Form.Item>
                            </Col>
                            {
                                showPwd ? (
                                    <>
                                        <Col offset={2} span={22}>
                                            <Form.Item label="旧密码" name="old_password">
                                                <Input.Password/>
                                            </Form.Item>
                                        </Col>
                                        <Col offset={2} span={22}>
                                            <Form.Item label="新密码" name="new_password">
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
                                            <Button type={"primary"} onClick={() => handleSetPwd(true)}>修改密码</Button>
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
