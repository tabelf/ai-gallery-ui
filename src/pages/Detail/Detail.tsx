import {Avatar, Button, Card, Col, Descriptions, Image, Row, Space} from "antd";
import Slider from "react-slick";
import {useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {fetchWorkDetail, fetchWorkExcellent} from "@/store/modules/work";
import {downloadFile, getEmpty, getGenerateCategory} from "@/utils/utils";
import {Img2Img} from "@/utils/constants";
import {DownloadOutlined, HeartOutlined, MenuOutlined, UserOutlined} from '@ant-design/icons';
import {useTranslation} from "react-i18next";

function Detail() {
    const {t, i18n} = useTranslation();
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();
    const workDetail = useSelector(state => state.work.workDetail);
    const [subIndex, setSubIndex] = useState(0);

    useEffect(() => {
        const taskId = searchParams.get('taskId');
        dispatch(fetchWorkDetail(taskId));
    }, []);

    function handleMarkExcellent(taskId, subTask, hasExcellent) {
        dispatch(fetchWorkExcellent({
            task_id: taskId,
            sub_task_id: subTask.sub_task_id,
            has_excellent: hasExcellent,
        }));
    }

    function handleDownload(details) {
        details.map(d => downloadFile(d.image_url));
    }

    const items = [
        {
            label: t('detail.category'),
            children: getGenerateCategory(workDetail.category, i18n.language),
        },
        {
            label: t('detail.size'),
            children: getEmpty(workDetail.size, i18n.language),
        },
        {
            label: t('detail.seed'),
            children: workDetail.seed,
        },
        {
            label: t('detail.sampler_name'),
            children: workDetail.sampler_name,
        },
        {
            label: t('detail.steps'),
            children: workDetail.steps,
        },
        {
            label: t('detail.cfg_scale'),
            children: workDetail.cfg_scale,
        },
        {
            label: t('detail.total'),
            children: workDetail.total,
        },
        {
            label: t('detail.model_name'),
            children: workDetail.sd_model_name,
        },
        {
            label: t('detail.vae_name'),
            children: getEmpty(workDetail.sd_vae_name, i18n.language),
        },
        {
            label: t('detail.job_timestamp'),
            children: workDetail.job_timestamp,
        },
        {
            label: t('detail.version'),
            children: workDetail.version,
        },
    ];
    if (workDetail.category === Img2Img && workDetail.ref_images) {
        items.push({
            label: t('detail.ref_image'),
            children: <Image width={150} src={workDetail.ref_images[0]}/>,
        });
    }

    const images = [];
    workDetail.details.map(d => images.push(d.image_url));

    const settings = {
        customPaging: function (i) {
            return (
                <a>
                    <img style={{width: 80, height: 65}} src={images[i]}/>
                </a>
            );
        },
        dots: true,
        dotsClass: "slick-dots slick-thumb",
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        afterChange: (index) => {
            setSubIndex(index);
        }
    };

    return (
        <div>
            <Row gutter={[20, 16]}>
                <Col span={16}>
                    <Card style={{
                        minHeight: 'calc(100vh - 180px)', // 设置Card的最大高度
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <div className="slider-container">
                            {
                                workDetail.details.length === 1 ? (
                                    <div>
                                        <Image width={480} preview={false} src={images[0]}/>
                                    </div>
                                ) : (
                                    <Slider {...settings}>
                                        {
                                            images.map(d => (
                                                <div>
                                                    <Image preview={false} width={480} src={d}/>
                                                </div>
                                            ))
                                        }
                                    </Slider>
                                )
                            }
                        </div>
                    </Card>

                </Col>
                <Col span={8}>
                    <div className={"work-text-detail"}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}>
                            <div>
                                <Space>
                                    <Avatar icon={<UserOutlined/>}/>
                                    <span>{workDetail.author_name}</span>
                                </Space>
                            </div>
                            <div style={{textAlign: "right"}}>
                                <Space>
                                    {
                                        workDetail.details.length > 0 && (
                                            workDetail.details[subIndex].has_excellent ? (
                                                <Button style={{
                                                    backgroundColor: '#e3e5e7',
                                                    color: '#9499a0'
                                                }}
                                                        onClick={() => handleMarkExcellent(workDetail.task_id, workDetail.details[subIndex], false)}
                                                        icon={<MenuOutlined/>}>{t('common.flagged')}</Button>
                                            ) : (
                                                <Button type={"primary"}
                                                        onClick={() => handleMarkExcellent(workDetail.task_id, workDetail.details[subIndex], true)}
                                                        icon={<HeartOutlined/>}>{t('common.excellent')}</Button>
                                            )
                                        )
                                    }
                                    <Button
                                        onClick={() => handleDownload(workDetail.details)}
                                        icon={<DownloadOutlined/>}>{t('common.download')}</Button>
                                </Space>
                            </div>
                        </div>
                        <Card title={t('common.prompt')} style={{marginTop: 15}}>
                            {workDetail.prompt}
                        </Card>
                        <Card title={t('common.negative_prompt')} style={{marginTop: 20}}>
                            {getEmpty(workDetail.negative_prompt)}
                        </Card>
                        <Card title={t('common.details')} style={{marginTop: 20}}>
                            <Descriptions column={1} items={items}/>
                        </Card>
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default Detail;
