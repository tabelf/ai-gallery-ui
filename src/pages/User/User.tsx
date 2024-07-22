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

const {confirm} = Modal;

const roleOptions = [
    {
        value: 'ADMIN',
        label: '管理员',
    },
    {
        value: 'USER',
        label: '普通用户',
    },
];

const statusOptions = [
    {
        value: 1,
        label: '正常',
    },
    {
        value: 0,
        label: '禁用',
    },
];

function User() {
    const dispatch = useDispatch();
    const userList = useSelector(state => state.user.userList);

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

    function handleUserStatus(data: { user_id: number, status: number }) {
        let text = '';
        if (data.status == 1) {
            text = '启用';
        } else {
            text = '禁用';
        }
        confirm({
            title: text + '用户',
            icon: <ExclamationCircleFilled/>,
            content: '确定要' + text + '该用户吗？',
            onOk() {
                dispatch(fetchUpdateUserStatue(data, loadUserList));
            },
            onCancel() {
            },
        });
    }

    function handleResetPwd(user_id: number) {
        confirm({
            title: '重置密码',
            icon: <ExclamationCircleFilled/>,
            content: '确定要重置该用户密码吗？',
            onOk() {
                dispatch(fetchResetUserPwd(user_id, () => message.success("重置成功")));
            },
            onCancel() {
            },
        });
    }

    function handleDeleteUser(user_id: number) {
        confirm({
            title: '删除用户',
            icon: <ExclamationCircleFilled/>,
            content: '确定要删除该用户吗？',
            onOk() {
                dispatch(fetchDeleteUser(user_id, loadUserList));
            },
            onCancel() {
            },
        });
    }

    const columns = [
            {
                title: '用户名',
                dataIndex: 'username',
                key: 'username',
            },
            {
                title: '昵称',
                dataIndex: 'nickname',
                key: 'nickname',
            },
            {
                title: '角色',
                dataIndex: 'role',
                key: 'role',
                render: (text) => text === "ADMIN" ? "管理员" : "普通用户"
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                render: (text) => text === 1
                    ? <Tag color={"green"}>正常</Tag> : <Tag color={"volcano"}>禁用</Tag>
            },
            {
                title: '操作',
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
                                    })}>禁用</TagButton> :
                                    <TagButton color={"#87d068"} onClick={() => handleUserStatus({
                                        user_id: record.user_id,
                                        status: 1
                                    })}>启用</TagButton>
                            }
                            <TagButton color={"#ff4d4f"} onClick={() => handleDeleteUser(record.user_id)}>删除</TagButton>
                            <TagButton color={"#2db7f5"} onClick={() => handleUpdateUser(record)}>编辑</TagButton>
                            <TagButton color={"#108ee9"} onClick={() => handleResetPwd(record.user_id)}>重置密码</TagButton>
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
                            <Col span={6}>
                                <Form.Item label="用户名" name="username">
                                    <Input placeholder="请输入用户名"/>
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item label="昵称" name="nickname">
                                    <Input placeholder="请输入昵称"/>
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item label="角色" name="role">
                                    <Select
                                        allowClear
                                        style={{
                                            width: '100%',
                                        }}
                                        placeholder="请选择角色"
                                        options={roleOptions}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item label="状态" name="status">
                                    <Select
                                        allowClear
                                        style={{
                                            width: '100%',
                                        }}
                                        placeholder="请选择状态"
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
                        <Button type="primary" onClick={handleNewUser}>新建</Button>
                    </div>
                }>
                    <Table pagination={{
                        current: page.offset,
                        pageSize: page.limit,
                        total: userList.total,
                        onChange: page => handlePage(page),
                        showTotal: total => `共 ${total} 条`,
                    }}
                           columns={columns}
                           dataSource={userList.data}/>
                </Card>
            </div>

            <PopModal title={"新建用户"} width={430} ref={newUserModelRef} onOk={handleCreateUser} onCancel={handleClear}>
                <Form layout="vertical" form={modalForm} style={{marginTop: 24}}>
                    <Form.Item label="用户名" name="username" rules={[{required: true}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item label="昵称" name="nickname" rules={[{required: true}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item label="角色" name="role" rules={[{required: true}]}>
                        <Select allowClear style={{
                            width: '100%',
                        }} placeholder="请选择角色" options={roleOptions}
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
