import { Breadcrumb, Card, Col, Row, Typography, Table, Result, Button, Input, Space, Spin, Divider, List, Empty, Avatar, notification, Tabs, Modal } from 'antd';
import React, { useEffect, useState } from 'react';

import { PlusOutlined, UserOutlined, UserSwitchOutlined, CloseOutlined } from '@ant-design/icons';

import { useSelector } from 'react-redux';
import axios from 'axios';
import { addUserWhiteListing, } from '../../api';
import { deleteUserFromGroupAPI } from '../../api/groups';




const GetUsersFromGraph = ({ client, group, showUserslist }) => {
    const [searchResults, setSearchResults] = useState([])
    const [searchInProgress, setSearchInProgress] = useState(false)
    const [dataLoaded, setDataLoaded] = useState(false)
    const performSearch = (users) => {
        //'["Adele Vance","Alex Wilber","Diego Siciliani","Grady Archie","Henrietta Mueller","Isaiah Langer","Johanna Lorenz","Joni Sherman","Khizar Ahmed","Lee Gu","Lidia Holloway","Lynne Robbins","Megan Bowen","Miriam Graham","Nestor Wilke","Patti Fernandez","Pradeep Gupta"]'        
        setSearchInProgress(true)
        axios.post('https://dbzegnu5lj.execute-api.us-east-1.amazonaws.com/develop/teams/getUsersFromGraphAPI', {
            tenantID: client.config.mstenantId,
            displayName: users
        }, {
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((res) => {
            console.log({ res })
            if (res.data.result?.success) {
                setSearchResults(res.data.result?.users?.value || [])
                setSearchInProgress(false)
            }
        }).catch((err) => {
            console.error(err)
            notification.error({
                message: 'Error',
                description: 'Something went wrong while making the call.',
            });
        })


    }
    const addUsers = (user) => {
        const userData = {
            "tenantId": client.config.tenantId,
            "groupId": group.id,
            "displayName": user.displayName || " ",
            "businessPhones": user.businessPhones.length > 0 ? JSON.stringify(user.businessPhones[0]) : JSON.stringify([]),
            "givenName": user.givenName || " ",
            "jobTitle": user.jobTitle || " ",
            "mail": user.mail || " ",
            "mobilePhone": user.mobilePhone || " ",
            "officeLocation": user.officeLocation || " ",
            "preferredLanguage": user.preferredLanguage || " ",
            "surname": user.surname || " ",
            "userPrincipalName": user.userPrincipalName || " ",
            "uid": user.id || " ",
        }
        addUserWhiteListing(userData).then((res) => {
            notification.success({
                message: 'Success',
                description: 'User added to the group ' + group.name + ' successfully',
            });
        }).catch((err) => {
            notification.error({
                message: 'Error',
                description: err.message || 'Unable to add user to whitelist',
            });
        })


    }
    const removeUser = (user) => {
        Modal.confirm({
            title: 'Are you sure you want to remove this user from the group?',
            content: 'This action cannot be undone.',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                deleteUserFromGroupAPI({
                    input: {
                        id: user.id,
                    }
                }).then((res) => {
                    notification.success({
                        message: 'Success',
                        description: 'User removed from the group ' + group.name + ' successfully',
                    });
                }).catch((err) => {
                    notification.error({
                        message: 'Error',
                        description: err.message || 'Unable to remove user from group',
                    });
                })
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    const columns = [
        {
            title: 'Name',
            dataIndex: 'displayName',
            key: 'displayName',
            render: (text, record) => (
                <Space>
                    <AvatarUserInitials name={text} size={30} />
                    <Typography.Text>{text}</Typography.Text>
                </Space>
            ),
        },
        {
            title: 'Email',
            dataIndex: 'mail',
            key: 'mail',
        },
        {
            title: 'Job Title',
            dataIndex: 'jobTitle',
            key: 'jobTitle',
        },
        {
            title: 'Phone',
            dataIndex: 'mobilePhone',
            key: 'mobilePhone',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            render: (text, record) => (
                <Button type='primary' danger icon={<CloseOutlined />} onClick={() => removeUser(record)} title='Remove from the Group' />
            ),
        },
    ]
    return (
        <Row className='user-container' gutter={[16, 16]}>

            <Col span={24} className="input-section">
                <Space style={{ width: '95%' }} direction='vertical' size={10}>
                    <Typography.Text strong>Search Users</Typography.Text>
                    <Input.Search style={{ width: '100%' }} placeholder="Search By Name" enterButton="Search" size="large" onSearch={performSearch} />
                    <Typography.Text disabled>
                        Hint: Search by name or email
                    </Typography.Text>
                </Space>
                <Divider />
                <Space style={{ width: '100%' }} direction='vertical' size={30}>
                    <Typography.Text strong>Search Results</Typography.Text>
                    {searchInProgress && <Spin size='large' />}

                    {searchResults.length < 1 && !searchInProgress && <Typography.Text disabled>
                        <Empty description="No users data" />
                    </Typography.Text>}
                    {searchResults.length > 0 && !searchInProgress && <Space style={{ width: '100%' }} direction='vertical' size={20}>
                        <List
                            style={{ width: '50%' }}
                            pagination={{
                                position: 'bottom',
                                align: 'center',
                            }}
                            dataSource={searchResults}
                            renderItem={(item, index) => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={<AvatarUserInitials name={item.displayName} />}
                                        title={
                                            <Space size={5}>
                                                <Typography.Text strong>
                                                    {item.displayName}
                                                </Typography.Text>
                                                <Typography.Text type='secondary'>
                                                    {item.jobTitle}
                                                </Typography.Text>
                                            </Space>
                                        }
                                        description={
                                            <Space direction='vertical' size={5}>
                                                <Typography.Text type='secondary'>
                                                    {item.mail}
                                                </Typography.Text>
                                                <Typography.Text type='secondary'>
                                                    {item.mobilePhone || item.businessPhones[0]}
                                                </Typography.Text>
                                            </Space>

                                        }
                                    />
                                    <Button type='default'
                                        onClick={() => { addUsers(item) }}
                                        shape='circle' size='large' icon={<PlusOutlined />} />
                                </List.Item>
                            )}
                        />

                    </Space>}

                </Space>
                <Divider />

            </Col>

            <Col span={24} className="input-section">
                <Typography.Title level={5} type='secondary'>Users in the {group?.name} Group</Typography.Title>
                <Table columns={columns} dataSource={group?.users?.items || []} />
            </Col>

        </Row>
    )
}

const AvatarUserInitials = ({ name, size = 64 }) => {
    const initials = name?.split(' ').map((n) => n[0]).join('');
    return (
        <Avatar size={size} style={{ backgroundColor: '#663399', color: '#FFF', fontSize: size }}>{initials?.toUpperCase()}</Avatar>
    )
}


export default GetUsersFromGraph