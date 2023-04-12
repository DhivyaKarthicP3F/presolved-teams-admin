import React, { useState, useEffect } from 'react';
import { Breadcrumb, Button, Col, Form, Row, Typography, Input, Select, Space, Modal, notification, Table } from 'antd';
import { listAuditRecords } from "../../api/auditAPI";
import { useSelector } from 'react-redux';
import moment from 'moment-timezone';

const AuditList=()=>{

    useEffect(() => {
        getAuditList();
    }, [])

    const tenantId = useSelector(state => state.user.tenantId)
    const [data, setData] = useState([]);
    const [tableData, setTableData] = useState(data);

    const getAuditList=()=>{
        listAuditRecords(tenantId,null,null).then(async (res) => {
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
    const columns = [
        {
            title: 'Date',
            dataIndex: 'byDateTime',
            key: 'byDateTime',
            fixed: 'left',
            render: (record) => {
                console.clear();
                console.log('record',record)
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
            <div className='main-container'>
                <Row className='breadcrumb-container'>
                    <Col span={24}>
                        <Breadcrumb>
                            <Breadcrumb.Item>Home</Breadcrumb.Item>
                            <Breadcrumb.Item>Audit</Breadcrumb.Item>
                        </Breadcrumb>
                    </Col>
                </Row>
                <Row className='topic-container' justify="space-between">
                    <Typography.Title level={3} >Audit log</Typography.Title>
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