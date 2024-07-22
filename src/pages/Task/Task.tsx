import {Button, Card, Col, DatePicker, Form, Image, Row, Select, Space, Table} from "antd";
import React, {useEffect, useRef, useState} from "react";
import useForm from "@/hook/Form";
import TagButton from "@/components/TagButton";
import usePage from "@/hook/Page";
import {fetchAuthorList, fetchTaskList} from "@/store/modules/work";
import {useDispatch, useSelector} from "react-redux";
import dayjs from "dayjs";
import PopModal from "@/components/PopModal";
import {downloadFile, getGenerateCategory, isEmpty} from "@/utils/utils";
import {DownloadOutlined, EyeOutlined} from '@ant-design/icons';
import RequireAuth from "@/components/RequireAuth";
import {useNavigate} from "react-router-dom";

const {RangePicker} = DatePicker;

const statusOptions = [
    {
        value: 'PROGRESS',
        label: '处理中',
    },
    {
        value: 'COMPLETE',
        label: '已完成',
    },
    {
        value: 'EXCEPTION',
        label: '异常',
    },
];

function Task() {
    const dispatch = useDispatch();
    const {page, setPage, handlePage} = usePage(10, loadTaskData);
    const {form, handleFormValueChange} = useForm(() => setPage({...page, offset: 1}));
    const taskList = useSelector(state => state.work.taskList);
    const authorList = useSelector(state => state.work.authorList);
    const taskImageModelRef = useRef();
    const navigate = useNavigate();
    const [taskImages, setTaskImages] = useState({
        task_id: 0,
        images: []
    });

    useEffect(() => {
        dispatch(fetchAuthorList());
    }, []);

    function loadTaskData() {
        const data = getFormValue();
        dispatch(fetchTaskList({
            ...data,
            ...page,
            offset: (page.offset - 1) * page.limit,
        }));
    }

    function getFormValue() {
        const data = form.getFieldsValue();
        return {
            "start_time": data.time ? dayjs(data.time[0]).format('YYYY-MM-DD') : null,
            "end_time": data.time ? dayjs(data.time[1]).format('YYYY-MM-DD') : null,
            "author_ids": data.author_ids,
            "status": data.status,
        };
    }

    function handleTaskImage(task_id, images) {
        taskImageModelRef.current.showOpen();
        if (!isEmpty(images)) {
            setTaskImages({
                task_id: task_id,
                images: images
            });
        }
    }

    function handleDownload(e, url) {
        e.stopPropagation();
        downloadFile(url);
    }

    function handleDownloadAllImage(urls) {
        if (!isEmpty(urls)) {
            urls.map(url => downloadFile(url));
        }
    }

    function handleNavDetail(taskId) {
        navigate('/detail?taskId=' + taskId);
    }

    const authorOption = [];

    authorList.data.map(a => {
        authorOption.push({
            value: a.author_id,
            label: a.author_name,
        });
    });

    const columns = [
        {
            title: '类型',
            dataIndex: 'category',
            width: 100,
            key: 'category',
            render: (text) => getGenerateCategory(text)
        },
        {
            title: '图片数量',
            dataIndex: 'total',
            key: 'total',
        },
        {
            title: '上传人',
            dataIndex: 'author_name',
            key: 'author_name',
        },
        {
            title: '提示词',
            width: 400,
            dataIndex: 'prompt',
            key: 'prompt',
        },
        {
            title: '上传时间',
            dataIndex: 'job_timestamp',
            key: 'job_timestamp',
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 80,
            render: (text) => {
                if (text === "PROGRESS") {
                    return <span>处理中</span>;
                } else if (text === "COMPLETE") {
                    return <span style={{color: "#87d068"}}>已完成</span>;
                } else if (text === "EXCEPTION") {
                    return <span style={{color: "#ff4d4f"}}>异常</span>;
                } else {
                    return <span>已提交</span>;
                }
            }
        },
        {
            title: '处理进度',
            key: 'progress',
            render: (_, record) => {
                return <span>{record.count} / {record.total}</span>
            }
        },
        {
            title: '操作',
            key: 'action',
            width: 150,
            render: (_, record) => (
                <Space>
                    <TagButton color="#2db7f5"
                               onClick={() => handleTaskImage(record.task_id, record.image_urls)}>查看</TagButton>
                    <TagButton color="#87d068" onClick={() => handleDownloadAllImage(record.image_urls)}>下载</TagButton>
                </Space>
            )
        }
    ];

    return (
        <div>
            <div className={"form-option-container"}>
                <Card>
                    <Form labelCol={{span: 6}}
                          form={form}
                          wrapperCol={{span: 18}}
                          onFieldsChange={handleFormValueChange}
                    >
                        <Row>
                            <Col span={6}>
                                <Form.Item label="创建时间" name="time">
                                    <RangePicker/>
                                </Form.Item>
                            </Col>
                            <RequireAuth allowedRoles={['ADMIN']}>
                                <Col span={6}>
                                    <Form.Item label="上传人" name="author_ids">
                                        <Select
                                            mode="multiple"
                                            allowClear
                                            style={{
                                                width: '100%',
                                            }}
                                            placeholder="请选择上传人"
                                            options={authorOption}
                                        />
                                    </Form.Item>
                                </Col>
                            </RequireAuth>
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
                <Card>
                    <Table pagination={{
                        current: page.offset,
                        pageSize: page.limit,
                        total: taskList.total,
                        onChange: page => handlePage(page),
                        showTotal: total => `共 ${total} 条`,
                    }}
                           columns={columns}
                           dataSource={taskList.data}/>
                </Card>
            </div>

            <PopModal title={"图片列表"} width={560} ref={taskImageModelRef}
                      footer={<Button type={"primary"} onClick={() => handleNavDetail(taskImages.task_id)}>查看详情</Button>}>
                <div style={{margin: 32}}>
                    <Row gutter={[24, 24]}>
                        {
                            taskImages.images.map(t => (
                                <Col span={12}>
                                    <Image src={t}
                                           preview={{
                                               mask:
                                                   <Space>
                                                       <span><EyeOutlined/> 预览</span>
                                                       <span onClick={(e) => handleDownload(e, t)}><DownloadOutlined/> 下载</span>
                                                   </Space>
                                           }}
                                    />
                                </Col>
                            ))
                        }
                    </Row>
                </div>
            </PopModal>
        </div>
    );
}

export default Task;
