import React, { useState, useEffect } from 'react';
import { useParams } from '@gatsbyjs/reach-router';
import { listAuditRecords } from "../../api/auditAPI";
import { getClientUsersList } from '../api/index';
import { Breadcrumb, Button, Col, Form, Row, Typography, Input, Select, Space, Modal, notification, Table, Card, Tabs } from 'antd';
import moment from 'moment-timezone';
import { useSelector } from 'react-redux';

const TenantDetails = () => {


    useEffect(() => {
        getTenantUsersList(tenantId);
        getTenantAuditList(tenantId)
    }, [])

    const tenantId = useSelector(state => state.admin.tenantId)
    const tenantCompanyName = useSelector(state => state.admin.tenantCompanyName)
    const [tenantUserData, setTenantUserData] = useState([]);
    const [tenantAuditData, setTenantAuditData] = useState([]);


    const getTenantUsersList = (tenantId) => {
        setTenantUserData([]);
        getClientUsersList(tenantId).then((res) => {
            let data = res.listClientUsers.items
            for (let i = 0; i < Object.keys(data).length; i++) {
                let role = "";
                if (data[i].role === 'tenantAdmin')
                    role = 'Admin';
                else if (data[i].role === 'tenantSupervisor')
                    role = 'Supervisor';
                else if (data[i].role === 'tenantUser')
                    role = 'User';

                setTenantUserData(prev => [...prev, {
                    key: data[i].id,
                    name: data[i].name,
                    role: role
                }])
            }
        }).catch((err) => {
            notification.error({
                message: 'Error',
                description: 'Error while fetching tenants user list'
            })
        })
    }

    const getTenantAuditList = (tenantId) => {
        setTenantAuditData([]);
        listAuditRecords(tenantId, null, null).then(async (res) => {
            let data = res.data.listPresolvedAudits.items
            console.log('data', data)
            for (let i = 0; i < Object.keys(data).length; i++) {
                setTenantAuditData(prev => [...prev, {
                    key: data[i].id,
                    byUser: data[i].byUser,
                    byDateTime: moment(data[i].byDateTime).format('L'),
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

    const UserColumns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name)
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
        },
    ];

    const AuditColumns = [
        {
            title: 'Date',
            dataIndex: 'byDateTime',
            key: 'byDateTime',
            fixed: 'left',
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

    const tabItems = [
        {
            label: 'Users',
            key: 'users',
            children: (
                <Table
                    columns={UserColumns}
                    dataSource={tenantUserData}
                    pagination={{ pageSize: 5 }}
                />
            )
        },
        {
            label: 'Audit',
            key: 'audit',
            children: (
                <Table
                    columns={AuditColumns}
                    dataSource={tenantAuditData}
                    pagination={{ pageSize: 5 }}
                />
            )
        },
    ];

    const onTabKeyChange = (key) => {

    }


    return (

        <div className='content-container'>
            <div className='admin-dashboard'>
                <Row className="greetings-container">
                    <Col span={24}>
                        <Card
                            className="greetings-card"
                            bordered={false}
                        >
                            <Card.Meta title={tenantCompanyName}/>
                            <Card.Meta description="Users list and call logs of the tenant" />
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col className='table-container'>
                        <Tabs defaultActiveKey='users' items={tabItems} onChange={onTabKeyChange}>
                        </Tabs>
                    </Col>
                </Row>
            </div>
        </div>
    );
}

export default TenantDetails;