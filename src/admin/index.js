import React, { useEffect, useState } from 'react';
import { FileOutlined, PieChartOutlined, UserOutlined, DesktopOutlined, TeamOutlined } from '@ant-design/icons';
import { Layout, theme, Result, Spin, Space, Typography } from 'antd';
import './assets/style/index.less';
import AdminSider from './layout/sider';
import AdminHeader from './layout/header';
import { Router, navigate } from '@gatsbyjs/reach-router';

import AdminLoginPage from './pages/login';
import AdminMainPage from './pages';
import { Auth } from 'aws-amplify';
import { useDispatch } from 'react-redux';
import { updateUser } from '../store/reducers/user';
import { getClientInformation } from '../signup/api';
import { useSelector } from 'react-redux';
import { updateClient, updateClientConfig, updateWhiteListedUsers } from '../store/reducers/client';
import { getClientIntegration, getUsersWhiteListing } from './api';
import TeamsIntegration from './pages/teamsIntegration';
import TeamsUsersWhitelisting from './pages/usersWhitelist';
import UserManagement from './pages/userManagement';
<<<<<<< HEAD
import AuditList from './pages/auditList';
=======
import { getGroupsUsers } from './api/groups';

>>>>>>> 052c87482ef1186a1a42cadcee82bc22e6b732fd

const AdminIndexPage = (props) => {
    const dispatch = useDispatch()
    const { Content, Footer, } = Layout;

    const client = useSelector(state => state.client)
    const user = useSelector(state => state.user)

    const [state, setState] = useState({
        clientLoaded: false,
        configsLoaded: false
    })

    useEffect(() => {
        if (!user.isLoggedin || !client.isLoaded) {
            Auth.currentAuthenticatedUser().then((login) => {
                postLoginCheks(login)
            }).catch((err) => {
                navigate("/signup")
            })
        }
    }, [])
    
    const postLoginCheks = (login) => {
        getClientInformation(login.attributes.email).then((res) => {

            console.log({res});
            dispatch(updateUser({ ...res }))
            dispatch(updateClient({ ...res }))
            if (!client.config.isLoaded) {
                getClientIntegration(res.tenantId).then((gci) => {
                    dispatch(updateClientConfig({ ...gci, clientId: res.tenantId }))
                    setState({ ...state, clientLoaded: true, configsLoaded: true })
                })
            }
            if (!client.whiteListedUsers.isLoaded) {
                getGroupsUsers(res.tenantId).then((response) => {
                    dispatch(updateWhiteListedUsers(response?.listClientUsersGroups?.items))                 
                })               
            }

        })
    }


    return (

        <Layout className="main-layout">
            <AdminSider props={props} />
            <Layout className="site-layout">
                <AdminHeader />
                {
                    state.clientLoaded ?
                        < Content className="main-container">
                            <Router>
                                <AdminMainPage path="/" client={client} />
                                <AdminLoginPage path="/signup" />
                                <TeamsIntegration path="/teams-integration" client={client} />
                                <TeamsUsersWhitelisting path="/teams-users-whitelisting" client={client} />
                                <UserManagement path="/user-management" client={client}/>
                                <AuditList path="/audit-list" />
                            </Router>
                        </Content>
                        :
                        <section style={{ display: 'flex', minHeight: '100vh', padding: 24, justifyContent: 'center', alignItems: 'center' }}>
                            <Space size={20}>
                                <Spin size='large' />
                                <Typography.Title level={3}>Please wait while we load the data...</Typography.Title>
                            </Space>
                        </section>
                }
                <Footer className="primary-footer">
                    Presolved © 2020 Created by Presolved
                </Footer>
            </Layout>
        </Layout >

    );
}

export default AdminIndexPage