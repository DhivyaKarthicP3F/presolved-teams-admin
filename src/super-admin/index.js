import React, { useState, useEffect } from 'react'
import { Router } from '@gatsbyjs/reach-router';
import { Layout, theme, Result, Spin, Space, Typography } from 'antd';
import { Auth } from 'aws-amplify';
import { useDispatch } from 'react-redux';
import { updateUser } from '../store/reducers/user';
import { getClientInformation } from '../signup/api';
import { useSelector } from 'react-redux';
import { updateClient, updateClientConfig } from '../store/reducers/client';
import { getClientIntegration } from './api';
import SuperAdminHeader from './layout/header';
import SuperAdminSider from './layout/sider';
import './assets/style/index.less';
import 'antd/dist/reset.css';
import AuditList from './pages/auditList';

const UsersManagement = React.lazy(() => import('./pages/usersManagement'))
const TenantsManagement = React.lazy(() => import('./pages/tenantsManagement'))
const TenantDetails = React.lazy(() => import('./pages/tenantDetails'))

const SuperAdminIndexPage = () => {

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
                getClientInformation(login.attributes.email).then((res) => {
                    dispatch(updateUser({ ...res }))
                    dispatch(updateClient({ ...res }))
                    if (!client.config.isLoaded) {
                        getClientIntegration(res.clientId).then((gci) => {
                            dispatch(updateClientConfig({ ...gci, clientId: res.clientId }))
                            setState({ ...state, clientLoaded: true, configsLoaded: true })
                        })
                    }
                })
            }).catch((err) => {
                navigate("/signup")
            })
        }
    }, [])



    return (
        <Layout className="main-layout">
            <SuperAdminSider />
            <Layout className="site-layout">
                <SuperAdminHeader />
                {
                    state.clientLoaded ?
                        < Content className="main-container">
                            <Router>
                                <UsersManagement path="/" />
                                <TenantsManagement path="/tenants" />
                                <TenantDetails path="/tenant-details/:id" />
                                <AuditList path="/audit-list"/>
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
    )
}

export default SuperAdminIndexPage