import {Avatar, Card, Dropdown, Image, message, Space, Tooltip} from "antd";
import Masonry from "react-masonry-css";
import usePage from "@/hook/Page";
import {useDispatch, useSelector} from "react-redux";
import {clearWorkList, fetchModelList, fetchSizeList, fetchWorkList} from "@/store/modules/work";
import {CaretDownOutlined, CopyOutlined, UserOutlined} from '@ant-design/icons';
import InfiniteScroll from "react-infinite-scroll-component";
import {useEffect, useLayoutEffect, useRef, useState} from "react";
import copy from "copy-to-clipboard";
import {useNavigate} from "react-router-dom";
import {CopyIcon, LayerIcon} from "@/assets/Icon";
import {useCollapse} from "@/hook/context";

const breakPoints = {
    490: 1,
    735: 2,
    980: 3,
    1225: 4,
    1470: 5,
    1715: 6,
    1960: 7,
    2205: 8,
    2450: 9,
    2695: 10,
    2940: 11,
    3185: 12,
    3430: 13,
    3675: 14,
    3920: 15
};

function Work() {
    const {page, setPage} = usePage(20, loadWorkData);
    const cardRef = useRef(null); // 创建一个ref来引用Card组件
    const [tooltipWidth, setTooltipWidth] = useState(0); // 状态来存储tooltip的宽度
    const [option, setOption] = useState({
        sortedName: "时间正序",
        sizeName: "全部",
        modelName: "全部",
        hasExcellent: "全部",
        hasRefImage: "不限"
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const workList = useSelector(state => state.work.workList);
    const modelList = useSelector(state => state.work.modelList);
    const sizeList = useSelector(state => state.work.sizeList);
    const collapse = useCollapse();

    useLayoutEffect(() => {
        const calculateWidth = () => {
            if (cardRef.current) {
                const cardWidth = cardRef.current.offsetWidth;
                setTooltipWidth(cardWidth); // 设置tooltip的宽度为Card的宽度
            }
        };
        setTimeout(() => {
            calculateWidth(); // 初始化时计算宽度
        }, 300);
        window.addEventListener('resize', calculateWidth); // 当窗口大小改变时重新计算宽度

        return () => {
            window.removeEventListener('resize', calculateWidth); // 清除事件监听器
        };
    }, [cardRef, workList, collapse]);

    useEffect(() => {
        dispatch(fetchModelList());
        dispatch(fetchSizeList());
    }, []);

    function loadWorkData() {
        if (page.offset == 1) {
            dispatch(clearWorkList());
        }
        dispatch(fetchWorkList({
            ...page,
            offset: (page.offset - 1) * page.limit,
        }));
    }

    function loadNextData() {
        setPage({...page, offset: page.offset + 1});
    }

    function handleOrderBy(value) {
        const arr = value.key.split(',');
        if (arr.length > 1 && option.sortedName == arr[1]) {
            return;
        }
        dispatch(clearWorkList());
        setOption({...option, sortedName: arr[1]});
        setPage({...page, offset: 1, sorted: arr[0]});
    }

    function handleSize(value) {
        const arr = value.key.split(',');
        if (arr.length > 1 && option.sizeName == arr[1]) {
            return;
        }
        dispatch(clearWorkList());
        setOption({...option, sizeName: arr[1]});
        setPage({...page, offset: 1, size: arr[0]});
    }

    function handleModel(value) {
        const arr = value.key.split(',');
        if (arr.length > 1 && option.modelName == arr[1]) {
            return;
        }
        dispatch(clearWorkList());
        setOption({...option, modelName: arr[1]});
        setPage({...page, offset: 1, sd_model_name: arr[0]});
    }

    function handleExcellent(value) {
        const arr = value.key.split(',');
        if (arr.length > 1 && option.hasExcellent == arr[1]) {
            return;
        }
        dispatch(clearWorkList());
        setOption({...option, hasExcellent: arr[1]});
        setPage({...page, offset: 1, has_excellent: arr[0]});
    }

    function handleRefImage(value) {
        const arr = value.key.split(',');
        if (arr.length > 1 && option.hasRefImage == arr[1]) {
            return;
        }
        dispatch(clearWorkList());
        setOption({...option, hasRefImage: arr[1]});
        setPage({...page, offset: 1, has_ref_image: arr[0]});
    }

    function handleCopy(text) {
        copy(text);
        message.success('复制成功');
    }

    function handleNavDetail(taskId) {
        navigate('/detail?taskId=' + taskId);
    }

    const modelItems = [
        {
            label: "全部",
            key: ['', '全部'],
            onClick: handleModel,
        }
    ];

    modelList.models.map(m => {
        modelItems.push({
            label: m,
            key: [m, m],
            onClick: handleModel
        });
    });

    const sizeItems = [
        {
            label: "全部",
            key: ['', '全部'],
            onClick: handleSize,
        }
    ];

    sizeList.sizes.map(s => {
        sizeItems.push({
            label: s,
            key: [s, s],
            onClick: handleSize
        });
    });

    const refItems = [
        {
            label: "不限",
            key: ['', '不限'],
            onClick: handleRefImage
        },
        {
            label: "无",
            key: ['0', '无'],
            onClick: handleRefImage
        },
        {
            label: "有",
            key: ['1', '有'],
            onClick: handleRefImage
        }
    ];

    const excellentItems = [
        {
            label: "全部",
            key: ['', '全部'],
            onClick: handleExcellent
        },
        {
            label: "普通",
            key: ['0', '普通'],
            onClick: handleExcellent
        },
        {
            label: "优秀",
            key: ['1', '优秀'],
            onClick: handleExcellent
        }
    ];

    const orderByItems = [
        {
            label: '时间正序',
            key: ['asc', '时间正序'],
            onClick: handleOrderBy
        },
        {
            label: '时间倒叙',
            key: ['desc', '时间倒叙'],
            onClick: handleOrderBy
        }
    ];

    return (
        <div>
            <div className={"work-optional-container"}>
                <Space size={"large"}>
                    <WorkSelector items={orderByItems} title={"排序：" + option.sortedName}/>
                    <WorkSelector items={sizeItems} title={"尺寸：" + option.sizeName}/>
                    <WorkSelector items={modelItems} title={"模型：" + option.modelName}/>
                    <WorkSelector items={excellentItems} title={"作品：" + option.hasExcellent}/>
                    <WorkSelector items={refItems} title={"参考图：" + option.hasRefImage}/>
                </Space>
            </div>
            <div className={"work-infinite-scroll-list"}>
                <InfiniteScroll
                    dataLength={workList.data.length}
                    next={loadNextData}
                    hasMore={workList.data.length < workList.total}
                    loader={<h4>Loading...</h4>}
                    scrollableTarget="scrollableDiv"
                >
                    <Masonry breakpointCols={breakPoints}
                             className="my-masonry-grid"
                             columnClassName="my-masonry-grid_column">
                        {
                            workList.data.map(w => (
                                <Card hoverable
                                      className={"work-card"}
                                      style={{
                                          marginBottom: 12
                                      }}
                                      ref={cardRef}
                                      cover={<WorkFavoredBtn onClick={() => handleNavDetail(w.task_id)}
                                                             path={w.head_image}
                                                             count={w.count}/>}
                                >
                                    <Card.Meta description={
                                        <div>
                                            <div>
                                                <Tooltip title={w.prompt}
                                                         placement="top"
                                                         overlayInnerStyle={
                                                             {
                                                                 width: `${tooltipWidth}px`,
                                                                 marginBottom: 2,
                                                                 fontSize: 12,
                                                                 borderRadius: 0
                                                             }
                                                         }
                                                         color={"rgba(0, 0, 0, 0.5)"}
                                                         arrow={false}>
                                                    <span className={"work-prompt"}>
                                                        <span className={"work-prompt-content"}>{w.prompt}</span>
                                                        <i className="icon-copy" onClick={() => handleCopy(w.prompt)}>
                                                            <CopyIcon title={"复制"}/>
                                                        </i>
                                                    </span>
                                                </Tooltip>
                                            </div>
                                            <div style={{fontSize: 13}}>
                                                <Space>
                                                    <Avatar size={14} icon={<UserOutlined/>}/>
                                                    <span style={{ lineHeight: '1', verticalAlign: 'middle' }}>{w.author_name}</span>
                                                </Space>
                                            </div>
                                        </div>
                                    }/>
                                </Card>
                            ))
                        }
                    </Masonry>
                </InfiniteScroll>
            </div>
        </div>
    );
}

function WorkFavoredBtn(props: { path: string, count: number, onClick: () => void }) {
    return (
        <Image
            onClick={props.onClick}
            preview={{
                visible: false,
                mask: <div style={{
                    display: 'flex',
                    position: 'relative', // 添加相对定位
                    top: 0, left: 0,
                    width: '100%', height: '100%', // 确保mask覆盖整个图片区域
                    padding: '10px',
                    background: 'none',
                }}>
                    <div style={{flex: 1}}/>
                    <div style={{
                        position: 'absolute', // 添加绝对定位
                        bottom: 10, left: 10, // 调整位置到左下角
                    }}>
                        {props.count > 1 && <LayerIcon/>}
                    </div>
                </div>
            }} alt="example" src={props.path}/>
    );
}

function WorkSelector(props) {
    return (
        <Dropdown
            menu={{
                items: props.items,
            }}
            placement="bottom"
            trigger={['click']}
        >
            <Space>
                {props.title}
                <CaretDownOutlined/>
            </Space>
        </Dropdown>
    );
}

export default Work;
