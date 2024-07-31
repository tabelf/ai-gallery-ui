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
import {useTranslation} from "react-i18next";

const {RangePicker} = DatePicker;

function Task() {
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
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

    const statusOptions = [
        {
            value: 'PROGRESS',
            label: t('task.progress'),
        },
        {
            value: 'COMPLETE',
            label: t('task.complete'),
        },
        {
            value: 'EXCEPTION',
            label: t('task.exception'),
        },
    ];

    const columns = [
        {
            title: t('detail.category'),
            dataIndex: 'category',
            width: 100,
            key: 'category',
            render: (text) => getGenerateCategory(text, i18n.language)
        },
        {
            title: t('detail.total'),
            dataIndex: 'total',
            key: 'total',
        },
        {
            title: t('task.author'),
            dataIndex: 'author_name',
            key: 'author_name',
        },
        {
            title: t('task.author'),
            width: 400,
            dataIndex: 'prompt',
            key: 'prompt',
        },
        {
            title: t('detail.job_timestamp'),
            dataIndex: 'job_timestamp',
            key: 'job_timestamp',
        },
        {
            title: t('task.status'),
            dataIndex: 'status',
            key: 'status',
            width: 80,
            render: (text) => {
                if (text === "PROGRESS") {
                    return <span>{t('task.progress')}</span>;
                } else if (text === "COMPLETE") {
                    return <span style={{color: "#87d068"}}>{t('task.complete')}</span>;
                } else if (text === "EXCEPTION") {
                    return <span style={{color: "#ff4d4f"}}>{t('task.exception')}</span>;
                } else {
                    return <span>{t('task.init')}</span>;
                }
            }
        },
        {
            title: t('task.schedule'),
            key: 'progress',
            render: (_, record) => {
                return <span>{record.count} / {record.total}</span>;
            }
        },
        {
            title: t('common.action'),
            key: 'action',
            width: 150,
            render: (_, record) => (
                <Space>
                    <TagButton color="#2db7f5"
                               onClick={() => handleTaskImage(record.task_id, record.image_urls)}>{t('common.view')}</TagButton>
                    <TagButton color="#87d068" onClick={() => handleDownloadAllImage(record.image_urls)}>{t('common.download')}</TagButton>
                </Space>
            )
        }
    ];

    const preview = t('common.preview');
    const download = t('common.download');

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
                            <Col span={7}>
                                <Form.Item label={t('detail.job_timestamp')} name="time">
                                    <RangePicker/>
                                </Form.Item>
                            </Col>
                            <RequireAuth allowedRoles={['ADMIN']}>
                                <Col span={7}>
                                    <Form.Item label={t('task.author')} name="author_ids">
                                        <Select
                                            mode="multiple"
                                            allowClear
                                            style={{
                                                width: '100%',
                                            }}
                                            placeholder={t('task.author_placeholder')}
                                            options={authorOption}
                                        />
                                    </Form.Item>
                                </Col>
                            </RequireAuth>
                            <Col span={7}>
                                <Form.Item label={t('task.status')} name="status">
                                    <Select
                                        allowClear
                                        style={{
                                            width: '100%',
                                        }}
                                        placeholder={t('task.status_placeholder')}
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
                        showTotal: total => {
                            if (i18n.language == 'zh') {
                                return `共 ${total} 条`;
                            }
                            return `${total} in total`;
                        }
                    }}
                           columns={columns}
                           dataSource={taskList.data}/>
                </Card>
            </div>

            <PopModal title={t('task.pic_list')}
                      width={560}
                      ref={taskImageModelRef}
                      okText={t('common.ok')}
                      cancelText={t('common.cancel')}
                      footer={<Button type={"primary"} onClick={() => handleNavDetail(taskImages.task_id)}>{t('task.view_detail')}</Button>}>
                <div style={{margin: 32}}>
                    <Row gutter={[24, 24]}>
                        {
                            taskImages.images.map(t => (
                                <Col span={12}>
                                    <Image src={t}
                                           preview={{
                                               mask:
                                                   <Space>
                                                       <span><EyeOutlined/> {preview}</span>
                                                       <span onClick={(e) => handleDownload(e, t)}><DownloadOutlined/> {download}</span>
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
