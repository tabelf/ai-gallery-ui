import {Button, Card, Col, Form, Input, message, Modal, Row, Select, Space, Table, Tag} from "antd";
import React, {useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    fetchCreateOrUpdateUser,
    fetchDeleteUser,
    fetchResetUserPwd,
    fetchUpdateUserStatue,
    fetchUserList
} from "@/store/modules/user";
import PopModal from "@/components/PopModal";
import usePage from "@/hook/Page";
import useForm from "@/hook/Form";
import {ExclamationCircleFilled} from '@ant-design/icons';
import TagButton from "@/components/TagButton";
import {useTranslation} from "react-i18next";

const {confirm} = Modal;

function User() {
    const dispatch = useDispatch();
    const userList = useSelector(state => state.user.userList);
    const {t, i18n} = useTranslation();
    const newUserModelRef = useRef();
    const {page, setPage, handlePage} = usePage(10, loadUserList);
    const {form, handleFormValueChange} = useForm(() => setPage({...page, offset: 1}));
    const [modalForm] = Form.useForm();

    function loadUserList() {
        const data = form.getFieldsValue();
        dispatch(fetchUserList({
            ...data,
            ...page,
            offset: (page.offset - 1) * page.limit
        }));
    }

    function handleNewUser() {
        newUserModelRef.current.showOpen();
    }

    function handleUpdateUser(data) {
        modalForm.setFieldsValue(data);
        handleNewUser();
    }

    function handleCreateUser() {
        const data = modalForm.getFieldsValue();
        dispatch(fetchCreateOrUpdateUser(data, loadUserList));
        handleClear();
    }

    function handleClear() {
        modalForm.resetFields();
    }

    const roleOptions = [
        {
            value: 'ADMIN',
            label: t('user.admin'),
        },
        {
            value: 'USER',
            label: t('user.general'),
        },
    ];

    const statusOptions = [
        {
            value: 1,
            label: t('user.normal'),
        },
        {
            value: 0,
            label: t('user.disable'),
        },
    ];

    function handleUserStatus(data: { user_id: number, status: number }) {
        let text = '';
        if (data.status == 1) {
            text = t('user.enable');
        } else {
            text = t('user.disable');
        }
        confirm({
            title: text + t('user.user'),
            icon: <ExclamationCircleFilled/>,
            content: t('user.user_confirm', {status: text}),
            onOk() {
                dispatch(fetchUpdateUserStatue(data, loadUserList));
            },
            onCancel() {
            },
        });
    }

    function handleResetPwd(user_id: number) {
        confirm({
            title: t('user.reset_pwd'),
            icon: <ExclamationCircleFilled/>,
            content: t('user.reset_pwd_confirm'),
            onOk() {
                dispatch(fetchResetUserPwd(user_id, () => message.success(t('user.reset_success'))));
            },
            onCancel() {
            },
        });
    }

    function handleDeleteUser(user_id: number) {
        confirm({
            title: t('user.del_user'),
            icon: <ExclamationCircleFilled/>,
            content: t('user.del_user_confirm'),
            onOk() {
                dispatch(fetchDeleteUser(user_id, loadUserList));
            },
            onCancel() {
            },
        });
    }

    const columns = [
            {
                title: t('user.username'),
                dataIndex: 'username',
                key: 'username',
            },
            {
                title: t('user.nickname'),
                dataIndex: 'nickname',
                key: 'nickname',
            },
            {
                title: t('user.role'),
                dataIndex: 'role',
                key: 'role',
                render: (text) => {
                    if (i18n.language == 'zh') {
                        return text === "ADMIN" ? "管理员" : "普通用户";
                    }
                    return text;
                }
            },
            {
                title: t('user.status'),
                dataIndex: 'status',
                key: 'status',
                render: (text) => text === 1
                    ? <Tag color={"green"}>{t('user.normal')}</Tag> : <Tag color={"volcano"}>{t('user.disable')}</Tag>
            },
            {
                title: t('common.action'),
                key: 'action',
                width: 300,
                render: (_, record) => {
                    if (record.username === "admin" && record.nickname === "admin") {
                        return <>-</>;
                    } else {
                        return <Space>
                            {
                                record.status === 1 ?
                                    <TagButton color={"#f50"} onClick={() => handleUserStatus({
                                        user_id: record.user_id,
                                        status: 0
                                    })}>{t('user.disable')}</TagButton> :
                                    <TagButton color={"#87d068"} onClick={() => handleUserStatus({
                                        user_id: record.user_id,
                                        status: 1
                                    })}>{t('user.enable')}</TagButton>
                            }
                            <TagButton color={"#ff4d4f"}
                                       onClick={() => handleDeleteUser(record.user_id)}>{t('common.delete')}</TagButton>
                            <TagButton color={"#2db7f5"}
                                       onClick={() => handleUpdateUser(record)}>{t('common.edit')}</TagButton>
                            <TagButton color={"#108ee9"}
                                       onClick={() => handleResetPwd(record.user_id)}>{t('user.reset_pwd')}</TagButton>
                        </Space>;
                    }
                }
            }
        ]
    ;

    return (
        <div>
            <div className={"form-option-container"}>
                <Card>
                    <Form labelCol={{span: 6}}
                          form={form}
                          wrapperCol={{span: 18}}
                          onFieldsChange={handleFormValueChange}>
                        <Row>
                            <Col span={7}>
                                <Form.Item label={t('user.username')} name="username">
                                    <Input placeholder={t('user.username_placeholder')}/>
                                </Form.Item>
                            </Col>
                            <Col span={7}>
                                <Form.Item label={t('user.nickname')} name="nickname">
                                    <Input placeholder={t('user.nickname_placeholder')}/>
                                </Form.Item>
                            </Col>
                            <Col span={7}>
                                <Form.Item label={t('user.role')} name="role">
                                    <Select
                                        allowClear
                                        style={{
                                            width: '100%',
                                        }}
                                        placeholder={t('user.role_placeholder')}
                                        options={roleOptions}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={7}>
                                <Form.Item label={t('user.status')} name="status">
                                    <Select
                                        allowClear
                                        style={{
                                            width: '100%',
                                        }}
                                        placeholder={t('user.status_placeholder')}
                                        options={statusOptions}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Card>
            </div>

            <div className={"form-data-container"}>
                <Card extra={
                    <div>
                        <Button type="primary" onClick={handleNewUser}>{t('common.add')}</Button>
                    </div>
                }>
                    <Table pagination={{
                        current: page.offset,
                        pageSize: page.limit,
                        total: userList.total,
                        onChange: page => handlePage(page),
                        showTotal: total => {
                            if (i18n.language == 'zh') {
                                return `共 ${total} 条`;
                            }
                            return `${total} in total`;
                        }
                    }}
                           columns={columns}
                           dataSource={userList.data}/>
                </Card>
            </div>

            <PopModal title={t('user.add_user')}
                      width={430} ref={newUserModelRef}
                      onOk={handleCreateUser}
                      okText={t('common.ok')}
                      cancelText={t('common.cancel')}
                      onCancel={handleClear}>
                <Form layout="vertical" form={modalForm} style={{marginTop: 24}}>
                    <Form.Item label={t('user.username')} name="username" rules={[{required: true}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item label={t('user.nickname')} name="nickname" rules={[{required: true}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item label={t('user.role')} name="role" rules={[{required: true}]}>
                        <Select allowClear style={{
                            width: '100%',
                        }} placeholder={t('user.role_placeholder')}
                                options={roleOptions}
                        />
                    </Form.Item>
                    <Form.Item name="user_id" style={{display: 'none'}}>
                        <Input/>
                    </Form.Item>
                </Form>
            </PopModal>
        </div>
    );
}


export default User;
