import { Button, Drawer, Space, Table, Typography, Row, Col, Form, Input, Divider, notification } from 'antd'
import {PlusOutlined, UserSwitchOutlined} from '@ant-design/icons'
import React, { useState } from 'react'
import GetUsersFromGraph from './searchUsers'
import { createNewGroupAPI } from '../../api/groups'

const AdminManageGroups = ({ client }) => {

    const [state, setState] = useState({
        visible: false,
        record: null,
        showUserslist: false,
        showAddgroup: false
    })
    const [form]=Form.useForm()


    const addUserHandler = (record) =>
        setState({
            visible: true,
            record: record
        })


    const showUserslistHandler = (record) => setState({
        visible: true,
        record,
        showUserslist: true
    })
    const addGroupHandler=(values)=>{
        const addGroupInput={
            name:values.name,
            description:values.description,
            tenantId:client.config.clientId
        }
        createNewGroupAPI(addGroupInput).then((res)=>{
            console.log({res});
            notification.success({
                message: 'Group Created',
                description: 'Group created successfully'
            })
        }).catch((err)=>{
            notification.error({
                message: 'Error',
                description: err.message || 'Unable to create group'
            })
        })
    }


    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => <a onClick={() => showUserslistHandler(record)} style={{ cursor: 'pointer' }}> <Space size={1} direction='vertical'>
                <Typography.Title level={5}>{text}</Typography.Title>
                <Typography.Text>{record.description}</Typography.Text>
            </Space>
            </a>,
        },
        {
            title: 'Users',
            dataIndex: 'users',
            render: (text, record) => record.users.items.length
        },
        {
            title: 'Created',
            dataIndex: 'createdAt',
            key: 'createdAt',
        },
        {
            title: 'Last Updated',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space>
                    <Button type='primary' onClick={() => addUserHandler(record)} >Add Users</Button>
                    <Button type='primary'>Edit</Button>
                </Space>)

        }
    ]
    return (
        <section className='manage-groups'>
            <Row align='middle' justify='space-between' gutter={[16,16]} style={{marginBottom:30}}>
                <Col flex={1}>&nbsp;</Col>
                <Col flex={0}>
                    <Button icon={<PlusOutlined/>} type='default' size='large' onClick={() => setState({ showAddgroup: true })}>Create New Group</Button>
                </Col>
            </Row>

            <Table columns={columns} dataSource={client.whiteListedUsers.items} />
            <Drawer width={state.showUserslist ? "80%" : "30%"} title={state.showUserslist ? <span>View Users belongs to {state.record?.name} group </span> : <span>Add User to the {state.record?.name} group</span>} open={state.visible} closable onClose={() => setState({
                visible: false,
                record: null
            })}>
                <GetUsersFromGraph client={client} group={state.record} showUserslist={state.showUserslist} />
            </Drawer>

            <Drawer mask={false} open={state.showAddgroup} title="create new group" width={720} closable onClose={() => setState({ showAddgroup: false })} >
                <Form size='large' form={form} layout='vertical' onFinish={addGroupHandler}>
                    <Form.Item label="Group Name" name="name" rules={[{ required: true, message: 'Please input group name!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Group Description" name="description" rules={[{ required: true, message: 'Please input group description!' }]}>
                        <Input.TextArea rows={3} />
                    </Form.Item>
                    <Divider />
                    <Form.Item>
                        <Space size={10}>
                        <Button type="primary" htmlType="submit">Create</Button>
                        <Button type="default" htmlType="reset">Reset</Button>
                        </Space>


                    </Form.Item>
                </Form>
            </Drawer>

        </section>
    )
}

export default AdminManageGroups