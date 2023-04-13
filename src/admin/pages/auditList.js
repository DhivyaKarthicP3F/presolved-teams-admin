import React, { useState, useEffect } from 'react';
import { Breadcrumb, Button, Col, Dropdown, Row, Typography, Input, Select, Space, Card, notification, Table, message, DatePicker } from 'antd';
import { FilterOutlined, UserOutlined, CalendarOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { listAuditRecords } from "../../api/auditAPI";
import { useSelector } from 'react-redux';
import moment from 'moment-timezone';
import './index.less';


const AuditList = () => {

    useEffect(() => {
        getAuditList();
    }, [])

    const tenantId = useSelector(state => state.user.tenantId)
    const [data, setData] = useState([]);
    const [tableData, setTableData] = useState(data);
    const [key, setKey] = useState('date');

    const getAuditList = () => {
        listAuditRecords(tenantId, null, null).then(async (res) => {
            console.clear()
            console.log(res)

            let data = res.data.listPresolvedAudits.items
            for (let i = 0; i < Object.keys(data).length; i++) {
                setData(prev => [...prev, {
                    key: data[i].id,
                    byUser: data[i].byUser,
                    byDateTime: data[i].byDateTime,
                    resource: data[i].resource,
                    action: data[i].action
                }])
                setTableData(prev => [...prev, {
                    key: data[i].id,
                    byUser: data[i].byUser,
                    byDateTime: data[i].byDateTime,
                    resource: data[i].resource,
                    action: data[i].action
                }])
            }
        }).catch((error) => {
            notification.error({
                message: 'Error',
                description: 'Error while fetching list'
            })
            console.log(error)
        })
    }

    const onChangeDatePicker = (date, dateString) => {
        console.log(date, dateString);
        let pickedDate = moment(dateString).format('L')
        const filteredData = data.filter(entry =>
            entry.byDateTime.includes(pickedDate)
        );
        setTableData(filteredData);
    };

    const onChangeInput = (e) => {
        let pickedUser = e.target.value
        const filteredData = data.filter(entry =>
            entry.byUser.toLowerCase().includes(pickedUser.toLowerCase())
        );
        setTableData(filteredData);
    }

    const onChangeSelect = (value) => {
        let pickedAction = value
        const filteredData = data.filter(entry =>
            entry.action.toLowerCase().includes(pickedAction.toLowerCase())
        );
        setTableData(filteredData);
    }

    const onClick = ({ key }) => {
        message.info(`Click on item ${key}`);
        setKey(key);
        let filteredData = [];
        switch (key) {
            case 'action':
                let pickedAction = 'create'
                filteredData = data.filter(entry =>
                    entry.action.toLowerCase().includes(pickedAction.toLowerCase())
                );
                break;
            case 'date':
                let pickedDate = moment(Date.now).format('L')
                filteredData = data.filter(entry =>
                    entry.byDateTime.includes(pickedDate)
                );
                break;
            //   case user:

            //   break;
            default:
                filteredData = data
        }
        setTableData(filteredData);
    };

    const items = [
        {
            key: 'user',
            label: 'User',
            icon: <UserOutlined />
        },
        {
            key: 'date',
            label: 'Date',
            icon: <CalendarOutlined />
        },
        {
            key: 'action',
            label: 'Action',
            icon: <CheckCircleOutlined />
        },
    ];

    const columns = [
        {
            title: 'Date',
            dataIndex: 'byDateTime',
            key: 'byDateTime',
            fixed: 'left',
            render: (record) => {
                console.clear();
                console.log('record', record)
                return (
                    <div>
                        <p>{moment(record.byDateTime).format('L')}</p>
                    </div>
                );
            },
        },
        {
            title: 'User',
            dataIndex: 'byUser',
            key: 'byUser',

        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
        },

        {
            title: 'Resource',
            dataIndex: 'resource',
            key: 'resource',
        },
    ];

    return (

        <div className='content-container'>
            <div className='admin-dashboard'>
                <Row className='breadcrumb-container'>
                    <Col span={24}>
                        <Breadcrumb>
                            <Breadcrumb.Item>Home</Breadcrumb.Item>
                            <Breadcrumb.Item>Audit</Breadcrumb.Item>
                        </Breadcrumb>
                    </Col>
                </Row>

                <Row className='greetings-container' >
                    <Col span={24} style={{ padding: '10px' }}>

                        <Card className='greetings-card' bordered={false} >

                            <Card.Meta style={{ marginBottom: '20px' }} title={<Row justify="space-between" >
                                <Typography.Title level={4}>Audit Log</Typography.Title>
                                <Dropdown
                                    menu={{
                                        items,
                                        onClick
                                    }}
                                >
                                    <Button onClick={(e) => e.preventDefault()}>
                                        <Space>
                                            <FilterOutlined /> Filter by
                                        </Space>
                                    </Button>
                                </Dropdown>
                            </Row>}
                            />
                            {key === 'date' &&
                                <Space>
                                    <Typography>Date</Typography>
                                    <DatePicker onChange={onChangeDatePicker} />
                                </Space>
                            }
                            {key === 'user' &&
                                <Space>
                                    <Typography>User</Typography>
                                    <Input onChange={onChangeInput} />
                                </Space>
                            }
                            {key === 'action' &&
                                <Space>
                                    <Typography>Action</Typography>
                                    <Select
                                        defaultValue="create"
                                        options={[
                                            {
                                                value: 'create',
                                                label: 'Create',
                                            },
                                            {
                                                value: 'update',
                                                label: 'Update',
                                            },
                                            {
                                                value: 'disable',
                                                label: 'Disable',
                                            },
                                        ]}
                                        onChange={onChangeSelect} />
                                </Space>
                            }
                        </Card>

                    </Col>
                </Row>


                <Row >
                    <Col className='table-container'>
                        <Table
                            bordered
                            columns={columns}
                            dataSource={tableData}

                        />
                    </Col>
                </Row>

            </div>
        </div>
    );
}

export default AuditList;