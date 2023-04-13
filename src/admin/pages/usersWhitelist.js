import { Breadcrumb, Card, Col, Row, Typography, Table, Result, Button, Input, Space, Spin, Divider, List, Empty, Avatar, notification, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import './usersWhitelist.less';
import { PlusOutlined, UserOutlined, UserSwitchOutlined } from '@ant-design/icons';
import bgimg from '../assets/images/icons/teams144.svg';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { addUserWhiteListing } from '../api';
import AdminManageGroups from './groups/manageGroups';

const TeamsUsersWhitelisting = (props) => {

    let client = useSelector(state => state.client)
    const [isLoaded, setIsLoaded] = useState(false)
    const [allowWhiteList, setAllowWhiteList] = useState(false)
    const [dataLoaded, setDataLoaded] = useState(false)
    useEffect(() => {
        if (client.config.isLoaded) {
            setIsLoaded(true)
            if (client.config?.loginMS > 0 && client.config?.consentMS > 0) {
                setAllowWhiteList(true)
            }
        }
        if (client.whiteListedUsers.isLoaded) {
            setDataLoaded(true)
        }
    }, [client.config, client.whiteListedUsers])





    return (
        <div className='content-container'>
            <div className='usersWhitelist'>
                <Row className='breadcrumb-container'>
                    <Col span={24}>
                        <Breadcrumb
                            items={[
                                { key: 'home', label: 'Home', href: '/' },
                                { key: 'admin', label: 'Admin', href: '/admin' },
                                { key: 'usersWhitelist', label: 'Users Whitelisting', href: '/admin/usersWhitelist' },
                            ]}
                        >

                        </Breadcrumb>
                    </Col>
                </Row>

                <Row className='greetings-container'>
                    <Col span={24}>
                        <Card className='greetings-card' bordered={false} style={{ backgroundImage: `url('${bgimg}')` }} >

                            <Card.Meta title="Microsoft Teams Users Whitelistings"
                            />
                            <Card.Meta description="Choose the list of users want to pre load to the CCP App" />
                        </Card>

                    </Col>
                </Row>
                {isLoaded ?
                    allowWhiteList ?
                        <Tabs
                            defaultActiveKey='manage-groups'
                            items={[
                                {
                                    key: 'manage-groups',
                                    label: <Typography.Title level={4}><UserSwitchOutlined /> Manage Groups</Typography.Title>,
                                    children: <AdminManageGroups client={client} />
                                }
                            ]}
                        />
                        :
                        <Result
                            status="403"
                            title="Please Complete the Teams integration first"
                            subTitle="You need to complete the Teams integration first to use this feature"
                        />
                    :
                    <div>
                        <Space>
                            <Spin size='large' />
                            <Typography.Title level={3}>Please wait while we load the data...</Typography.Title>
                        </Space>
                    </div>
                }


                <div style={{ margin: '50px 0' }}>&nbsp;</div>
            </div>
        </div>
    )
}

export default TeamsUsersWhitelisting


