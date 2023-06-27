import React, { useState, useEffect } from 'react';
import { Breadcrumb, Button, Col, Form, Row, Typography, Input, Select, Space, Modal, notification, Table, Card } from 'antd';
import { UserAddOutlined, UserDeleteOutlined, ExclamationCircleFilled, SettingFilled } from '@ant-design/icons';
import './management.less';
import { getClientSignupUserList, createSignup } from '../api/index';
import { API, Auth } from "aws-amplify";
import { createAuditRecord } from "../../api/auditAPI";
import { useSelector } from 'react-redux';
import { Link } from '@gatsbyjs/reach-router'
const { confirm } = Modal;
import { useDispatch } from "react-redux";
import { updateTenantId } from "../../store/reducers/admin";


const TenantsManagement = () => {

    useEffect(() => {
        getTenantList();
    }, [])

    const apiName = "AdminQueries";
    const dispatch = useDispatch();
    const loggedUser = useSelector(state => state.user.name)
    const [data, setData] = useState([]);
    const [tableData, setTableData] = useState(data);
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const [form] = Form.useForm();

    //-----------------Get User List Functionalities---------------------------------

    const getTenantList = async () => {
        getClientSignupUserList().then(async (res) => {
            let data = res.listClientSignups.items
            for (let i = 0; i < Object.keys(data).length; i++) {
                setData(prev => [...prev, {
                    key: data[i].id,
                    name: data[i].name,
                    company: data[i].company,
                    tenantId: data[i].id,
                    email: data[i].email,
                    phone: data[i].phone
                }])
                setTableData(prev => [...prev, {
                    key: data[i].id,
                    name: data[i].name,
                    company: data[i].company,
                    tenantId: data[i].id,
                    email: data[i].email,
                    phone: data[i].phone
                }])
            }
        }).catch((error) => {
            notification.error({
                message: 'Error',
                description: 'Error while fetching list'
            })
            console.log('list', error)
        })
    }


    //-------------------Create User Functionalities-------------

    const showCreateModal = () => {
        setCreateModalVisible(true)
    }

    const handleCreateSubmit = (values) => {
        setCreateModalVisible(false)
        createTenant(values)
    }

    const handleCreateCancel = () => {
        setCreateModalVisible(false)
        form.resetFields()
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const randomPasswordGenerator = () => {
        var length = 8,
            charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]\:;?><,./-=",
            retVal = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        return retVal;
    }

    const UUIDGenerator = () => {
        var dt = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (dt + Math.random() * 16) % 16 | 0;
            dt = Math.floor(dt / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    }



    async function createTenant(values) {

        //Get Values from form
        const name = values.name;
        const email = values.email;
        const phone = values.phone
        const password = randomPasswordGenerator();
        const role = "tenantAdmin";
        const tenantId = UUIDGenerator();
        const company = values.company
        console.log('password', password)
        const path = "/users";

        const myInit = {
            body: {
                username: email,
                email: email,
                password: password,
                groupname: role,
                userAttributes: JSON.stringify([
                    {
                        Name: "name",
                        Value: name,
                    },
                    {
                        Name: "phone_number",
                        Value: phone,
                    },
                    {
                        Name: "custom:tenantId",
                        Value: tenantId,
                    },
                ]),
            },
            headers: {
                Authorization: `Bearer ${(await Auth.currentSession())
                    .getAccessToken()
                    .getJwtToken()}`,
            },
        };
        API.post(apiName, path, myInit)
            .then((response) => {
                console.log("Response from CreateTenant API in Cognito is ", response);
                // if signup is successful in cognito, create a signup record in dynamodb
                createSignup({
                    id: tenantId,
                    name: name,
                    company: company,
                    email: email,
                    phone: phone,
                    role: role,
                }).then(async (data) => {
                    notification.success({
                        message: 'Success',
                        description: 'Tenant created successfully'
                    })
                    setTableData([]);
                    getTenantList();
                    form.resetFields()
                    //Add an entry to audit table
                    let changesMade = {
                        oldValue: name,
                        newValue: email,
                        field: "email",
                    };

                    let auditRecord = {
                        tenantId: "P3Fusion",
                        resource: "AdminTenantManagement",
                        action: "Create",
                        byUser: loggedUser,
                        byDateTime: new Date().toISOString(),
                        changesMade: JSON.stringify(changesMade),
                    };
                    await createAuditRecord(auditRecord);
                }).catch((err) => {
                    throw err;
                })
            })
            .catch((error) => {
                console.log(error.response);
            });
    }

    //----------------Remove User functionalities-----------------------------

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRow(selectedRows)
        },
    };


    const disableTenant = async (selectedRow) => {

        var username = selectedRow.email;
        const path = "/disableUser";
        const myInit = {
            body: {
                username: username,
            },
            headers: {
                Authorization: `Bearer ${(await Auth.currentSession())
                    .getAccessToken()
                    .getJwtToken()}`,
            },
        };
        API.post(apiName, path, myInit)
            .then(async (response) => {
                console.log("Response from Disable user API is ", response);
                notification.info({
                    message: "Success",
                    description: "Tenant diasabled successfully",
                });
                setTableData([]);
                getTenantList();
                //Add an entry to audit table
                let changesMade = {
                    oldValue: 'Enable',
                    newValue: 'Disable',
                    field: 'Status',
                };

                let auditRecord = {
                    tenantId: "P3Fusion",
                    resource: "AdminTenantManagement",
                    action: "Disable",
                    byUser: loggedUser,
                    byDateTime: new Date().toISOString(),
                    changesMade: JSON.stringify(changesMade),
                };

                await createAuditRecord(auditRecord);
            }).catch((error) => {
                console.log(error.response);
            });
    }

    const showRemoveConfirm = () => {
        if (selectedRow !== null) {
            confirm({
                title: 'Are you sure disable this tenant?',
                icon: <ExclamationCircleFilled />,
                content: 'Tenant will be disabled from these groups.',
                okText: 'Yes',
                okType: 'danger',
                cancelText: 'No',
                onOk() {
                    console.log('OK');
                    disableTenant(selectedRow[0]);
                },
                onCancel() {
                    console.log('Cancel');
                },
            });
        }
        else (
            notification.error({
                message: 'Error',
                description: 'Please select the tenant to disable'
            })
        )
    };


    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            fixed: 'left',
            sorter: (a, b) => a.name.localeCompare(b.name),
            render: (_, record) => (
                <Link
                    to={`/admin/tenant-details/${record.tenantId}`}
                    onClick={()=>{
                        dispatch(updateTenantId({tenantId:record.tenantId, tenantCompanyName: record.company}))
                    }}
                >
                    {record.name}
                </Link>
            ),
        },
        {
            title: 'Tenant Id',
            dataIndex: 'tenantId',
            key: 'tenantId',
        },
        {
            title: 'Company',
            dataIndex: 'company',
            key: 'company',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
        },
    ];

    const breadcrumbItems = [
        {
            title: 'Home',
        },
        {
            title: 'Tenants management',
        },
    ]


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
                            <Card.Meta title={<Row justify='space-between'>
                                <Space direction='vertical'>
                                    <Typography.Title level={3} style={{ color: '#639' }}><SettingFilled  style={{ marginRight: '15px', color: '#639' }} />Tenants Management</Typography.Title>
                                    <Typography >The solution you need for effective management of tenants and their accounts</Typography>
                                </Space>
                                <Space>
                                    <Input
                                        placeholder="Search here"
                                        value={searchValue}
                                        onChange={e => {
                                            const currValue = e.target.value;
                                            setSearchValue(currValue);
                                            const filteredData = data.filter(entry =>
                                                entry.email.toLowerCase().includes(currValue.toLowerCase()) ||
                                                entry.name.toLowerCase().includes(currValue.toLowerCase()) ||
                                                entry.company.toLowerCase().includes(currValue.toLowerCase()) ||
                                                entry.tenantId.toLowerCase().includes(currValue.toLowerCase())
                                            );
                                            setTableData(filteredData);
                                        }}
                                    />
                                    <Button type='primary' size='large' onClick={showCreateModal}><UserAddOutlined />Add</Button>
                                    <Button type='primary' size='large' onClick={showRemoveConfirm}><UserDeleteOutlined />Disable</Button>
                                </Space>
                            </Row>}
                            />
                        </Card>
                    </Col>
                </Row>
                <Row >
                    <Col className='table-container'>
                        <Table
                            rowSelection={{
                                type: 'radio',
                                ...rowSelection,
                            }}
                            bordered
                            columns={columns}
                            dataSource={tableData}

                        />
                    </Col>
                </Row>
                <Modal
                    title={<h3>Onboarding Tenant</h3>}
                    className='CreateModal'
                    open={createModalVisible}
                    onOk={form.submit}
                    onCancel={handleCreateCancel}
                    footer={[
                        <Button
                            type="default"
                            onClick={handleCreateCancel}
                        >
                            Cancel
                        </Button>,
                        <Button key="submit" type="primary" onClick={form.submit}>
                            Save
                        </Button>
                    ]}
                >
                    <Form
                        form={form}
                        name="createForm"
                        labelCol={{
                            span: 12,
                        }}
                        wrapperCol={{
                            span: 20,
                        }}
                        style={{
                            maxWidth: '100%',
                        }}
                        onFinish={handleCreateSubmit}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                        layout='vertical'
                    >

                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please provide your name!',
                                },
                            ]}

                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Company"
                            name="company"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please provide your company!',
                                },
                            ]}

                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    type: 'email',
                                    message: 'The input is not valid E-mail!',
                                },
                                {
                                    required: true,
                                    message: 'Please provide your email!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label='Phone # with country code (Eg:+1)'
                            name='phone'
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your company Phone!'
                                },
                                {
                                    pattern: new RegExp(/^\+((?:9[679]|8[035789]|6[789]|5[90]|42|3[578]|2[1-689])|9[0-58]|8[1246]|6[0-6]|5[1-8]|4[013-9]|3[0-469]|2[70]|7|1)(?:\W*\d){0,13}\d$/),
                                    message: 'Please input a valid phone number!'
                                }
                            ]}>
                            <Input datatype='number' />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </div>
    );
}

export default TenantsManagement;