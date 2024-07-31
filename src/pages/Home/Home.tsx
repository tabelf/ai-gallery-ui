import React, {useEffect, useState} from 'react';
import {AreaChartOutlined, ProductOutlined, SettingOutlined, TeamOutlined, UserOutlined} from '@ant-design/icons';
import {Avatar, Dropdown, Image, Layout, Menu, Space, theme} from 'antd';
import { useTranslation } from 'react-i18next';
import {Outlet, useNavigate} from 'react-router-dom';
import Logo from '@/assets/logo1.png';
import {fetchUserInfo, getUserToken, logout} from "@/store/modules/user";
import {isEmpty} from "@/utils/utils";
import './index.less';
import {useDispatch, useSelector} from "react-redux";
import {CollapseContext} from "@/hook/context";
import Language from "@/components/Language";


const {Header, Content, Footer, Sider} = Layout;


const Home: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [showLogo, setShowLogo] = useState(true);
    const [refreshWork, setRefreshWork] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const userInfo = useSelector(state => state.user.userInfo);

    const userItems = [
        {
            key: 'info',
            label: <span>{t('user.nickname')}: {userInfo.nickname}</span>,
        },
        {
            key: 'logout',
            label: <span onClick={handleLogout}>{t('common.logout')}</span>,
        }
    ];

    const menuItems = [
        {
            key: '/analyse',
            icon: <AreaChartOutlined/>,
            label: t('menu.analyse'),
            role: ['ADMIN']
        },
        {
            key: '/work-manage',
            icon: <ProductOutlined/>,
            label: t('menu.work_manage'),
            children: [
                {
                    key: '/work',
                    label: t('menu.work'),
                    role: ['ADMIN', 'USER']
                },
                {
                    key: '/task',
                    label: t('menu.task'),
                    role: ['ADMIN', 'USER']
                }
            ]
        },
        {
            key: '/user',
            icon: <TeamOutlined/>,
            label: t('menu.user'),
            role: ['ADMIN']
        },
        {
            key: '/setting',
            icon: <SettingOutlined/>,
            label: t('menu.setting'),
            role: ['ADMIN', 'USER']
        },
    ];

    const {
        token: {colorBgContainer},
    } = theme.useToken();

    useEffect(() => {
        const userInfo = getUserToken();
        if (isEmpty(userInfo)) {
            navigate("/login");
            return;
        }
        dispatch(fetchUserInfo());
    }, []);

    function handleCollapsed(value) {
        setCollapsed(value);
        setShowLogo(!value);
        setRefreshWork(!refreshWork);
    }

    function handleMenuClick({key}) {
        navigate(key);
    }

    function handleLogout() {
        logout(1);
    }

    function getItemPermission(values) {
        const userRole = userInfo.role;
        if (isEmpty(values) || isEmpty(userRole)) {
            return [];
        }
        return values.filter(menuItem => {
            if (menuItem.children) {
                // 递归过滤子菜单
                menuItem.children = getItemPermission(menuItem.children);
                // 只保留至少有一个子菜单项与用户角色匹配的菜单项，或者没有 role 属性的菜单项
                return menuItem.children.length > 0 || !menuItem.role;
            } else {
                if (!menuItem.role) {
                    // 如果没有 role 属性，总是保留该菜单项
                    return true;
                } else {
                    // 如果有 role 属性，检查用户角色是否在 role 数组中
                    return menuItem.role.includes(userRole);
                }
            }
        });
    }

    return (
        <CollapseContext.Provider value={refreshWork}>
            <Layout style={{minHeight: '100vh'}}>
                <Sider collapsible
                       collapsed={collapsed}
                       collapsedWidth={50}
                       onCollapse={(value) => handleCollapsed(value)}>
                    <div className="logo">
                        {showLogo && <Image src={Logo} width={140} preview={false}/>}
                    </div>
                    <Menu theme="dark"
                          mode="inline"
                          onClick={handleMenuClick}
                          items={getItemPermission(menuItems)}/>
                </Sider>
                <Layout>
                    <Header style={{padding: 0, background: colorBgContainer}}>
                        <div className={"user-info"}>
                            <Space size={"large"}>
                                <Language />
                                <Dropdown
                                    menu={{
                                        items: userItems,
                                    }}
                                    placement="bottom"
                                    trigger={['click']}
                                >
                                    <Space>
                                        <Avatar
                                            style={{
                                                backgroundColor: '#87d068',
                                            }}
                                            icon={<UserOutlined/>}
                                        />
                                        <span>{userInfo.nickname}</span>
                                    </Space>
                                </Dropdown>
                            </Space>
                        </div>
                    </Header>
                    <Content style={{margin: '12px'}}>
                        <div style={{minHeight: 360}}>
                            {/* 二级路由的出口 */}
                            <Outlet/>
                        </div>
                    </Content>
                    <Footer style={{textAlign: 'center', fontSize: 13, opacity: 0.9}}>
                        Copyright © {new Date().getFullYear()} Gallery
                    </Footer>
                </Layout>
            </Layout>
        </CollapseContext.Provider>
    );
};

export default Home;
