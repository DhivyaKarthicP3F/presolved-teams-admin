import React, { useState, useEffect } from 'react';
import { Breadcrumb, Col, Row, Typography, Input, Select, Space, Card, notification, Table, DatePicker } from 'antd';
import { FilterFilled, CloseCircleTwoTone, PhoneFilled } from '@ant-design/icons';
import { getCallLogs } from '../api/index';
import { useSelector } from 'react-redux';
import moment from 'moment-timezone';
import './index.less';


const CallLogs = () => {

    useEffect(() => {
        getCallLogsList();
    }, [])

    const { RangePicker } = DatePicker;
    const tenantId = useSelector(state => state.user.tenantId)
    const [data, setData] = useState([]);
    const [tableData, setTableData] = useState(data);
    const [pickedFromDate, setPickedFromDate] = useState(null);
    const [pickedToDate, setPickedToDate] = useState(null);
    const [pickedAction, setPickedAction] = useState(null);
    const [pickedUser, setPickedUser] = useState(null);

    const getCallLogsList = () => {
        getCallLogs(tenantId).then(async (res) => {
            let data = res.listClientCallLogs.items
            for (let i = 0; i < Object.keys(data).length; i++) {
                setData(prev => [...prev, {
                    key: data[i].id,
                    calleeNumber: data[i].calleeNumber,
                    callerNumber: data[i].callerNumber,
                    callDuration: moment(data[i].callDuration).format('L'),
                    callType: data[i].callType,
                    callStartTime: data[i].callStartTime
                }])
            }
            let sortedData = dataSorting(data);
            setTableData(sortedData);
            console.clear
            console.log('call log :', data)
        }).catch((error) => {
            notification.error({
                message: 'Error',
                description: 'Error while fetching list'
            })
            console.log(error)
        })
    }

    const dataSorting = (sortingData) => {
        return sortingData.sort(function compare(a, b) {
            var dateA = new Date(a.byDateTime);
            var dateB = new Date(b.byDateTime);
            return dateB - dateA;
        })
    }

    const onChangeInput = (e) => {
        setPickedUser(e.target.value)
        filterFunction(pickedFromDate, pickedToDate, pickedAction, e.target.value)
    }

    const onChangeSelect = (value) => {
        setPickedAction(value)
        filterFunction(pickedFromDate, pickedToDate, value, pickedUser)
    }

    const onRangeChange = (dates, dateStrings) => {
        if (dates) {
            setPickedFromDate(moment(dateStrings[0]).format('L'))
            setPickedToDate(moment(dateStrings[1]).format('L'))
            filterFunction(moment(dateStrings[0]).format('L'), moment(dateStrings[1]).format('L'), pickedAction, pickedUser)
        }
    };

    const filterFunction = (fromDate, toDate, action, user) => {
        console.log('date: ', fromDate, toDate, 'action : ', action, 'user: ', user)
        let filteredData = []
        for (let i = 0; i < Object.keys(data).length; i++) {
            if (fromDate === null && action === null && user === null)
                filteredData.push(data[i])
            if (fromDate !== null && action === null && user === null)
                if (fromDate <= data[i].byDateTime && data[i].byDateTime <= toDate)
                    filteredData.push(data[i])
            if (fromDate !== null && action !== null && user === null)
                if (fromDate <= data[i].byDateTime && data[i].byDateTime <= toDate && data[i].action === action)
                    filteredData.push(data[i])
            if (fromDate !== null && action === null && user !== null)
                if (fromDate <= data[i].byDateTime && data[i].byDateTime <= toDate && data[i].byUser.toLowerCase().includes(user.toLowerCase()))
                    filteredData.push(data[i])
            if (fromDate !== null && action !== null && user !== null)
                if (fromDate <= data[i].byDateTime && data[i].byDateTime <= toDate && data[i].action === action && data[i].byUser.toLowerCase().includes(user.toLowerCase()))
                    filteredData.push(data[i])
            if (fromDate === null && action !== null && user === null)
                if (data[i].action === action)
                    filteredData.push(data[i])
            if (fromDate === null && action !== null && user !== null)
                if (data[i].byUser.toLowerCase().includes(user.toLowerCase()) && data[i].action === action)
                    filteredData.push(data[i])
            if (fromDate === null && action === null && user !== null)
                if (data[i].byUser.toLowerCase().toLowerCase().includes(user))
                    filteredData.push(data[i])
        }
        let sortedData = dataSorting(filteredData);
        setTableData(sortedData);
    }

    const breadcrumbItems = [
        {
            title: 'Home',
        },
        {
            title: 'CallLogs',
        },
    ]

    const columns = [

        {
            title: 'Date',
            dataIndex: 'callStartTime',
            key: 'callStartTime',
            fixed: 'left',
            render: (record) => {
                return (
                    <p>{moment(record).format("L")}</p>
                );
            },
        },
        {
            title: 'Type',
            dataIndex: 'callType',
            key: 'callType',

        },
        {
            title: 'Callee Number',
            dataIndex: 'calleeNumber',
            key: 'calleeNumber',
        },

        {
            title: 'Caller Number',
            dataIndex: 'callerNumber',
            key: 'callerNumber',
        },
        {
            title: 'Call Duration',
            dataIndex: 'callDuration',
            key: 'callDuration',
        }
    ];

    return (

        <div className='content-container'>
            <div className='admin-dashboard'>
                <Row className='breadcrumb-container'>
                    <Col span={24}>
                        <Breadcrumb items={breadcrumbItems} />
                    </Col>
                </Row>
                <Row className='greetings-container' >
                    <Col span={24} style={{ padding: '10px' }}>

                        <Card className='greetings-card' bordered={false} >
                            <Card.Meta title={<Space direction='vertical'>
                                <Typography.Title level={3} style={{ color: '#639' }}><PhoneFilled style={{ marginRight: '15px', color: '#639' }} />Call Logs</Typography.Title>
                                <Typography >Details about the call origin, call destination, the length of the call, and other transmission details.</Typography>
                            </Space>}
                            />
                        </Card>

                    </Col>
                </Row>
                <Row className='topic-container' justify="space-between" >
                    <Space>
                        <FilterFilled />
                        <Typography.Title level={5}>Date</Typography.Title>
                        <RangePicker format='MM/DD/YYYY' allowClear={false} onChange={onRangeChange} value={pickedFromDate === null ? [null, null] : [moment(pickedFromDate), moment(pickedToDate)]} />
                        <CloseCircleTwoTone onClick={() => { setPickedFromDate(null), setPickedToDate(null), filterFunction(null, null, pickedAction, pickedUser) }} />
                    </Space>
                    {/* <Space>
                        <FilterFilled />
                        <Typography.Title level={5}>User</Typography.Title>
                        <Input value={pickedUser} onChange={onChangeInput} placeholder='Select user' />
                        <CloseCircleTwoTone onClick={() => { setPickedUser(null); filterFunction(pickedFromDate, pickedToDate, pickedAction, null) }} />
                    </Space>
                    <Space>
                        <FilterFilled />
                        <Typography.Title level={5}> Action</Typography.Title>
                        <Select
                            value={pickedAction}
                            placeholder='Select'
                            options={[
                                {
                                    value: 'Create',
                                    label: 'Create',
                                },
                                {
                                    value: 'Update',
                                    label: 'Update',
                                },
                                {
                                    value: 'Disable',
                                    label: 'Disable',
                                },
                            ]}
                            onChange={onChangeSelect} />
                        <CloseCircleTwoTone onClick={() => { setPickedAction(null), filterFunction(pickedFromDate, pickedToDate, null, pickedUser) }} />
                    </Space> */}
                </Row>                <Row >
                    <Col className='table-container'>
                        <Table
                            bordered
                            columns={columns}
                            dataSource={tableData}
                            pagination={{ pageSize: 10 }}
                        />
                    </Col>
                </Row>

            </div>
        </div>
    );
}

export default CallLogs;