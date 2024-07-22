import {Avatar, Button, Card, Col, Descriptions, Image, Row, Space} from "antd";
import Slider from "react-slick";
import {useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {fetchWorkDetail, fetchWorkExcellent} from "@/store/modules/work";
import {downloadFile, getEmpty, getGenerateCategory} from "@/utils/utils";
import {Img2Img} from "@/utils/constants";
import {DownloadOutlined, HeartOutlined, MenuOutlined, UserOutlined} from '@ant-design/icons';

function Detail() {
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
            label: '分类',
            children: getGenerateCategory(workDetail.category),
        },
        {
            label: '尺寸',
            children: getEmpty(workDetail.size),
        },
        {
            label: '种子',
            children: workDetail.seed,
        },
        {
            label: '采样器',
            children: workDetail.sampler_name,
        },
        {
            label: '步数',
            children: workDetail.steps,
        },
        {
            label: '引导系数',
            children: workDetail.cfg_scale,
        },
        {
            label: '生成数量',
            children: workDetail.total,
        },
        {
            label: '模型名称',
            children: workDetail.sd_model_name,
        },
        {
            label: 'VAE名称',
            children: getEmpty(workDetail.sd_vae_name),
        },
        {
            label: '生成时间',
            children: workDetail.job_timestamp,
        },
        {
            label: 'SD系统版本',
            children: workDetail.version,
        },
    ];
    if (workDetail.category === Img2Img && workDetail.ref_images) {
        items.push({
            label: '参考图',
            children: <Image width={150} src={workDetail.ref_images[0]} />,
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
                                                    icon={<MenuOutlined/>}>已标记</Button>
                                            ) : (
                                                <Button type={"primary"}
                                                    onClick={() => handleMarkExcellent(workDetail.task_id, workDetail.details[subIndex], true)}
                                                    icon={<HeartOutlined/>}>优秀</Button>
                                            )
                                        )
                                    }
                                    <Button
                                        onClick={() => handleDownload(workDetail.details)}
                                        icon={<DownloadOutlined/>}>全部下载</Button>
                                </Space>
                            </div>
                        </div>
                        <Card title="提示词" style={{marginTop: 15}}>
                            {workDetail.prompt}
                        </Card>
                        <Card title="反向提示词" style={{marginTop: 20}}>
                            {getEmpty(workDetail.negative_prompt)}
                        </Card>
                        <Card title="详细信息" style={{marginTop: 20}}>
                            <Descriptions column={1} items={items}/>
                        </Card>
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default Detail;
