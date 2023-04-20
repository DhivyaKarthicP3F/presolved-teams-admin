import React, { useState, useEffect } from 'react';
import { Breadcrumb, Col, Row, Typography, Input, Select, Space, Card, notification, Table, DatePicker } from 'antd';
import { FilterFilled, CloseCircleTwoTone } from '@ant-design/icons';
import { listAuditRecords } from "../../api/auditAPI";
import { useSelector } from 'react-redux';
import moment from 'moment-timezone';
import './index.less';


const AuditList = () => {

    useEffect(() => {
        getAuditList();
    }, [])

    const { RangePicker } = DatePicker;
    const tenantId = useSelector(state => state.user.tenantId)
    const [data, setData] = useState([]);
    const [tableData, setTableData] = useState(data);
    const [pickedFromDate, setPickedFromDate] = useState(null);
    const [pickedToDate, setPickedToDate] = useState(null);
    const [pickedAction, setPickedAction] = useState(null);
    const [pickedUser, setPickedUser] = useState(null);

    const getAuditList = () => {
        listAuditRecords(tenantId, null, null).then(async (res) => {
            let data = res.data.listPresolvedAudits.items
            for (let i = 0; i < Object.keys(data).length; i++) {
                setData(prev => [...prev, {
                    key: data[i].id,
                    byUser: data[i].byUser,
                    byDateTime: moment(data[i].byDateTime).format('L'),
                    resource: data[i].resource,
                    action: data[i].action
                }])
            }
            let sortedData = dataSorting(data);
            setTableData(sortedData);
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
                if (fromDate <= data[i].byDateTime && data[i].byDateTime <= toDate && data[i].byUser.includes(user))
                    filteredData.push(data[i])
            if (fromDate !== null && action !== null && user !== null)
                if (fromDate <= data[i].byDateTime && data[i].byDateTime <= toDate && data[i].action === action && data[i].byUser.includes(user))
                    filteredData.push(data[i])
            if (fromDate === null && action !== null && user === null)
                if (data[i].action === action)
                    filteredData.push(data[i])
            if (fromDate === null && action !== null && user !== null)
                if (data[i].byUser.includes(user) && data[i].action === action)
                    filteredData.push(data[i])
            if (fromDate === null && action === null && user !== null)
                if (data[i].byUser.includes(user))
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
            title: 'Audit',
        },
    ]

    const columns = [
        {
            title: 'Date',
            dataIndex: 'byDateTime',
            key: 'byDateTime',
            fixed: 'left',
            render: (record) => {
                return (
                    <p>{moment(record).format("L")}</p>
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
                        <Breadcrumb items={breadcrumbItems} />
                    </Col>
                </Row>
                <Row className='topic-container' justify="space-between">
                    <Typography.Title level={3}>Audit Log</Typography.Title>
                </Row>


                <Row className='greetings-container' >
                    <Col span={24} style={{ padding: '10px' }}>

                        <Card className='greetings-card' bordered={false} >
                            <Card.Meta title={<Row justify="space-between" >
                                <Space>
                                    <FilterFilled />
                                    <Typography.Title level={5}>Date</Typography.Title>
                                    <RangePicker format='MM/DD/YYYY' allowClear={false} onChange={onRangeChange} value={pickedFromDate === null ? [null, null] : [moment(pickedFromDate), moment(pickedToDate)]} />
                                    <CloseCircleTwoTone onClick={() => { setPickedFromDate(null), setPickedToDate(null), filterFunction(null, null, pickedAction, pickedUser) }} />
                                </Space>
                                <Space>
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
                                </Space>
                            </Row>}
                            />
                        </Card>

                    </Col>
                </Row>
                <Row >
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

export default AuditList;