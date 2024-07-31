import {Card, Col, Row} from "antd";
import ReactECharts from 'echarts-for-react';
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {fetchAnalysisBase, fetchAnalysisTask, fetchAnalysisUser} from "@/store/modules/analyse";
import { useTranslation } from 'react-i18next';

const dayIcon = 'M256 0h64v256H256zM704 0h64v256h-64zM384 128h256v64H384z M832 128v64h119.04v768H72.96V192H192V128H0v896h1024V128z M241.28 558.08c10.24-3.84 25.6-12.16 46.08-24.32 20.48-13.44 39.04-26.88 55.04-42.24a1065.472 1065.472 0 0 0 77.44-84.48c7.68-8.32 16-20.48 26.24-34.56 9.6-14.72 16.64-25.6 20.48-33.28l9.6-19.2c17.28 9.6 28.16 14.72 32 16l32.64 12.16-10.24 11.52c4.48 9.6 10.88 23.04 18.56 39.68 7.68 16.64 22.4 35.84 42.88 56.96 20.48 20.48 46.08 39.04 76.16 53.76 30.08 15.36 58.88 24.32 85.12 27.52l14.72 0.64c-8.32 7.04-13.44 12.8-17.92 16-3.84 4.48-8.96 10.24-15.36 17.92-6.4 8.32-10.24 14.72-11.52 18.56l-7.04 19.2-13.44-7.04c-49.28-26.88-83.2-48.64-101.76-64.64-19.2-17.28-37.76-35.84-55.04-56.96-17.92-20.48-30.72-40.32-39.04-58.24l-11.52-22.4c-24.96 31.36-46.72 58.24-66.56 80-19.2 22.4-42.24 46.08-68.48 69.76-26.24 23.68-49.92 43.52-70.4 58.88l-8.96 5.76c-5.12-8.96-9.6-17.28-14.08-23.68-5.12-6.4-18.56-16-39.68-28.8l14.08-4.48z m56.32 91.52v-20.48l-1.28-16.64c41.6 2.56 65.28 3.84 70.4 3.84h234.24c1.28 0 30.08-1.28 87.04-3.2l-25.6 42.88c-35.84 60.16-81.28 124.8-135.68 196.48l-10.88 14.08c-6.4-5.76-11.52-10.24-16.64-14.08-5.12-3.84-18.56-10.88-42.24-21.12l9.6-7.68c12.8-10.88 28.8-26.88 47.36-46.72 17.92-20.48 43.52-57.6 76.8-112h-224c-14.72 0-38.4 1.28-70.4 3.84a128 128 0 0 1 1.28-19.2zM512 487.04l26.88 92.16c-28.8 3.84-44.16 6.4-44.8 6.4l-15.36 3.2-3.2-16c-1.92-8.96-5.12-19.84-7.68-32.64-3.2-12.16-6.4-21.76-8.32-28.16l-5.76-15.36c14.72-1.28 33.92-4.48 58.24-9.6z';
const weekIcon = 'path://M752.3 126.1V77.9h-50v48.2H321.7V77.9h-50v48.2H64v820h896v-820H752.3z m157.7 780H114v-730h157.7v51.8h50v-51.8h380.5v51.8h50v-51.8H910v730zM396.2 395.4h231.7v34.2c-22.8 24.3-45.4 56.5-67.7 96.7-22.4 40.2-39.7 81.5-51.9 124-8.8 29.9-14.4 62.7-16.8 98.4h-45.2c0.5-28.2 6-62.2 16.6-102.1 10.6-39.9 25.8-78.3 45.5-115.4 19.8-37 40.8-68.2 63.1-93.6H396.2v-42.2z';
const monthIcon = 'path://M241.705341 731.315655c27.085623 20.951009 57.637584 31.463484 91.774445 31.463484 27.279402 0 48.823219-6.658581 64.74874-20.039486s23.888281-31.333449 23.888281-53.788789c0-50.062381-35.834971-75.12608-107.566105-75.12608l-32.966541 0L281.58416 572.376616l31.398466 0c63.508303 0 95.300701-23.500724 95.300701-70.560815 0-43.468818-24.282212-65.141396-72.846635-65.141396-27.74345 0-53.91755 9.402074-78.458558 28.131007l0-47.25387c25.915304-15.015272 56.133252-22.519084 90.729062-22.519084 33.744204 0 60.834927 8.809266 81.267069 26.432896 20.428317 17.623631 30.676897 40.536645 30.676897 68.603909 0 51.760491-26.439271 85.115864-79.240045 99.930983l0 1.046658c28.58868 3.067307 51.2378 13.180752 67.816047 30.282966 16.578247 17.104764 24.933664 38.449704 24.933664 64.036094 0 35.636093-12.793195 64.291066-38.444604 86.092405-25.651409 21.802614-59.788269 32.703921-102.346838 32.703921-37.469338 0-67.752304-6.987494-90.729062-20.956108L241.705341 731.315655 241.705341 731.315655 241.705341 731.315655zM241.705341 731.315655M535.301209 607.359982c0-69.837971 11.552759-122.708863 34.72457-158.545109 23.171811-35.834971 56.720962-53.782415 100.718845-53.782415 83.806585 0 125.712427 67.622269 125.712427 202.930549 0 66.775763-11.811555 117.884802-35.377297 153.197081-23.629485 35.377297-56.720962 53.002202-99.279531 53.002202-40.207732 0-71.342303-16.7784-93.407537-50.327551C546.331276 720.285588 535.301209 671.462369 535.301209 607.359982L535.301209 607.359982 535.301209 607.359982zM586.408973 605.079262c0 105.086507 26.633049 157.699878 79.95779 157.699878 52.483335 0 78.722453-53.394858 78.722453-160.244494 0-110.573494-25.721526-165.860241-77.153104-165.860241C613.629731 436.674405 586.408973 492.807657 586.408973 605.079262L586.408973 605.079262 586.408973 605.079262zM586.408973 605.079262M838.169115 73.105431c-18.276358 0-33.161594-14.94388-33.161594-33.156495l0-6.792441c0-18.276358-14.94388-33.156495-33.156495-33.156495l-6.792441 0c-18.276358 0-33.156495 14.950254-33.156495 33.156495l0 6.792441c0 18.276358-14.94898 33.156495-33.15522 33.156495l-372.971048 0c-18.276358 0-33.156495-14.94388-33.156495-33.156495l0-6.792441c0-18.276358-14.94898-33.156495-33.16032-33.156495l-6.852359 0c-18.276358 0-33.161594 14.950254-33.161594 33.156495l0 6.792441c0 18.276358-14.945155 33.156495-33.156495 33.156495l-153.132064 0c-18.276358 0-33.156495 14.950254-33.156495 33.161594l0 884.57138c0 18.276358 14.950254 33.161594 33.156495 33.161594l957.746928 0c18.21134 0 33.16032-14.950254 33.16032-33.161594l0-884.57138c0-18.21134-14.94898-33.161594-33.16032-33.161594L838.169115 73.105431 838.169115 73.105431 838.169115 73.105431zM962.711224 917.734249c0 18.21134-3.168021 47.332911-44.848214 49.338262l-811.532242 0c-37.488461 0-46.274779-31.125647-46.274779-49.338262L60.055989 179.436199c0-26.293937 28.063439-43.026442 46.274779-43.026442l79.95779 0c18.276358 0 33.156495 24.815102 33.156495 43.026442l0 25.805666c0 18.276358 14.94898 33.156495 33.161594 33.156495l6.852359 0c18.275083 0 33.16032-14.945155 33.16032-33.156495l0-25.805666c0-18.276358 14.945155-41.751585 33.156495-41.751585l372.835913 0c18.276358 0 33.161594 23.540245 33.161594 41.751585l0 26.230194c0 18.276358 14.945155 33.156495 33.156495 33.156495l6.787342 0c18.276358 0 33.161594-14.945155 33.161594-33.156495l0-26.230194c0-18.276358 15.173354-40.476727 33.384694-40.476727L917.897431 138.959472c28.471394 0 45.044542 16.148621 44.620014 40.476727L962.711224 917.734249 962.711224 917.734249 962.711224 917.734249zM962.711224 917.734249';

function Analysis() {
    const [taskDay, setTaskDay] = useState({day: 7});
    const [userDay, setUserDay] = useState({day: 1});
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    const baseData = useSelector(state => state.analysis.baseData);
    const taskData = useSelector(state => state.analysis.taskData);
    const userData = useSelector(state => state.analysis.userData);


    useEffect(() => {
        dispatch(fetchAnalysisBase());
    }, []);

    useEffect(() => {
        dispatch(fetchAnalysisTask(taskDay));
    }, [taskDay]);

    useEffect(() => {
        dispatch(fetchAnalysisUser(userDay));
    }, [userDay]);

    const taskLegendData = [];
    const taskSeriesData = [];
    taskData.tasks.map(t => {
        const name = i18n.language == 'zh' ? t.name : t.en_name;
        taskLegendData.push(name);
        taskSeriesData.push({
            name: name,
            type: 'line',
            areaStyle: {normal: {}},
            data: t.data
        });
    });

    const option = {
        title: {
            text: t('analyse.task_data')
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: taskLegendData
        },
        toolbox: {
            feature: {
                myWeekly: {
                    show: true,
                    title: t('analyse.weekly_data'),
                    icon: weekIcon,
                    onclick: function () {
                        setTaskDay({day: 7});
                    }
                },
                myMonth: {
                    show: true,
                    title: t('analyse.month_data'),
                    icon: monthIcon,
                    onclick: function () {
                        setTaskDay({day: 30});
                    }
                },
                saveAsImage: {
                    title: t('analyse.save_image')
                },
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                data: taskData.times
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: taskSeriesData
    };

    const userXAxisData = [];
    const userSeriesData = [];

    userData.users.map(u => {
        userXAxisData.push(u.author_name);
        userSeriesData.push(u.count);
    });

    const option2 = {
        title: {
            text: t('analyse.user_data')
        },
        color: ["#3398DB"],
        tooltip: {
            trigger: "axis",
            axisPointer: {
                type: "shadow"
            }
        },
        toolbox: {
            feature: {
                myDay: {
                    show: true,
                    title: t('analyse.today_data'),
                    icon: dayIcon,
                    onclick: function () {
                        setUserDay({day: 1});
                    }
                },
                myWeekly: {
                    show: true,
                    title: t('analyse.weekly_data'),
                    icon: weekIcon,
                    onclick: function () {
                        setUserDay({day: 7});
                    }
                },
                myMonth: {
                    show: true,
                    title: t('analyse.month_data'),
                    icon: monthIcon,
                    onclick: function () {
                        setUserDay({day: 30});
                    }
                },
                saveAsImage: {
                    title: t('analyse.save_image')
                },
            }
        },
        grid: {},
        xAxis: [{
            type: "category",
            data: userXAxisData,
            axisTick: {
                alignWithLabel: true
            }
        }],
        yAxis: [{
            type: "value"
        }],
        series: [{
            name: t('analyse.submit_task_count'),
            type: "bar",
            barWidth: "60%",
            data: userSeriesData
        }]
    };

    return (
        <div>
            <div className={"analyse-module"}>
                <div>
                    <Row gutter={[48, 24]}>
                        <Col span={6}>
                            <Card>
                                <div>
                                    <p className={"analyse-title"}>{t('analyse.task_total')}</p>
                                    <p className={"analyse-value"}>{baseData.task_total}</p>
                                </div>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card>
                                <div>
                                    <p className={"analyse-title"}>{t('analyse.work_total')}</p>
                                    <p className={"analyse-value"}>{baseData.work_total}</p>
                                </div>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card>
                                <div>
                                    <p className={"analyse-title"}>{t('analyse.excellent_total')}</p>
                                    <p className={"analyse-value"}>{baseData.excellent_total}</p>
                                </div>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card>
                                <div>
                                    <p className={"analyse-title"}>{t('analyse.account_total')}</p>
                                    <p className={"analyse-value"}>{baseData.account_total}</p>
                                </div>
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card>
                                <div>
                                    <p className={"analyse-title"}>{t('analyse.today_task_count')}</p>
                                    <p className={"analyse-value"}>{baseData.today_task_count}</p>
                                </div>
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card>
                                <div>
                                    <p className={"analyse-title"}>{t('analyse.today_work_count')}</p>
                                    <p className={"analyse-value"}>{baseData.today_work_count}</p>
                                </div>
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card>
                                <div>
                                    <p className={"analyse-title"}>{t('analyse.today_excellent_count')}</p>
                                    <p className={"analyse-value"}>{baseData.today_excellent_count}</p>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </div>
                <div className={"analyse-picture-table"}>
                    <Row gutter={[48, 24]}>
                        <Col span={12}>
                            <Card>
                                <ReactECharts
                                    option={option}
                                    style={{height: 400}}
                                />
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card>
                                <ReactECharts
                                    option={option2}
                                    style={{height: 400}}
                                    opts={{renderer: 'svg'}}
                                />
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
            <div>

            </div>
        </div>
    );
}

export default Analysis;
