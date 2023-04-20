import React, { useState, useEffect } from 'react';
import { Breadcrumb, Button, Col, Form, Row, Typography, Input, Select, Space, Modal, notification, Table } from 'antd';
import { UserAddOutlined, UserDeleteOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { API, Auth } from "aws-amplify";
import './management.less';
import { getClientUsersList, createClientUser, updateClientUser } from '../api/index';
import { useSelector } from 'react-redux';
import { createAuditRecord } from '../../api/auditAPI';
import { formatTimeStr } from 'antd/es/statistic/utils';

const { confirm } = Modal;

const UserManagement = (props) => {
    const { client: tenant } = props
    const [state, setState] = useState({
        isLoaded: false,
        tenantId: null
    })
    useEffect(() => {
        if (tenant.tenantId) {
            setState({ ...state, isLoaded: true, tenantId: tenant.tenantId, ...tenant })
        }
        getUsersList();
    }, [])

    const apiName = "AdminQueries";
    const loggedUser = useSelector(state => state.user.name)
    const [data, setData] = useState([]);
    const [tableData, setTableData] = useState(data);
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const [formValues, setFormValues] = useState({
        name: "",
        email: "",
        role: "",
        key: ""
    });
    const [form] = Form.useForm();
    const [formEdit] = Form.useForm();

    //-----------------Get User List Functionalities---------------------------------

    const getUsersList = async () => {

        getClientUsersList(tenant.tenantId).then((res) => {
            let data = res.listClientUsers.items
            for (let i = 0; i < Object.keys(data).length; i++) {
                let role = "";
                if (data[i].role === 'tenantAdmin')
                    role = 'Admin';
                else if (data[i].role === 'tenantSupervisor')
                    role = 'Supervisor';
                else if (data[i].role === 'tenantUser')
                    role = 'User';

                setData(prev => [...prev, {
                    key: data[i].id,
                    name: data[i].name,
                    email: data[i].email,
                    status: data[i].status,
                    role: role
                }])
                setTableData(prev => [...prev, {
                    key: data[i].id,
                    name: data[i].name,
                    email: data[i].email,
                    status: data[i].status,
                    role: role
                }])
            }
        }).catch((err) => {
            notification.error({
                message: 'Error',
                description: 'Error while fetching list'
            })
        })
    }

    //-------------------Create User Functionalities-------------

    const showCreateModal = () => {
        setCreateModalVisible(true)
    }

    const handleCreateSubmit = (values) => {
        console.log(values)
        setCreateModalVisible(false)
        createUser(values)
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



    async function createUser(values) {
        //Get Values from form
        const name = values.name;
        const email = values.email;
        const password = randomPasswordGenerator();
        const role = values.role;
        const phone = values.phone

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
                        Value: state.tenantId,
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
                console.log("Response from CreateTenant API is ", response);
                // if signup is successful in cognito, create a clientUser record in dynamodb
                createClientUser({
                    name: name,
                    email: email,
                    role: role,
                    tenantId: state.tenantId
                }).then(async (data) => {
                    notification.success({
                        message: 'Success',
                        description: 'User created successfully'
                    })
                    setTableData([]);
                    getUsersList();
                    form.resetFields()
                    //Add an entry to audit table
                    let changesMade = {
                        oldValue: name,
                        newValue: email,
                        field: "email",
                    };

                    let auditRecord = {
                        tenantId: state.tenantId,
                        resource: "UserManagement",
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
    const disableUser = async (value) => {
        var username = value.email;
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
            .then((response) => {
                console.log("Response from Disable user API is ", response);
                updateStatusClientUser(selectedRow[0]);
            }).catch((error) => {
                console.log(error.response);
            });
    }

    const updateStatusClientUser = async (selectedRow) => {
        updateClientUser({
            isDisable: true,
            id: selectedRow.key,
            status: 0
        }).then(async (res) => {
            notification.success({
                message: 'Success',
                description: 'User Disabled successfully',
            });
            setTableData([]);
            getUsersList();
            //Add an entry to audit table
            let changesMade = {
                oldValue: 'Enable',
                newValue: 'Disable',
                field: 'Status',
            };

            let auditRecord = {
                tenantId: state.tenantId,
                resource: "UserManagement",
                action: "Disable",
                byUser: loggedUser,
                byDateTime: new Date().toISOString(),
                changesMade: JSON.stringify(changesMade),
            };

            await createAuditRecord(auditRecord);

        }).catch((err) => {
            console.log(err);
        })
    }


    const showRemoveConfirm = () => {
        if (selectedRow !== null) {
            confirm({
                title: 'Are you sure disable this user?',
                icon: <ExclamationCircleFilled />,
                content: 'User will be disabled from these groups.',
                okText: 'Yes',
                okType: 'danger',
                cancelText: 'No',
                onOk() {
                    console.log('OK');
                    disableUser(selectedRow[0]);
                },
                onCancel() {
                    console.log('Cancel');
                },
            });
        }
        else (
            notification.error({
                message: 'Error',
                description: 'Please select the user to disable'
            })
        )
    };
    //----------------------Update User Functionalities--------------------------------------------------

    const showEditModal = () => {
        setEditModalVisible(true)
    }

    const removeUserInCognito = async (selectedRow) => {

        var role = selectedRow.role === 'Admin' ? 'tenantAdmin' : selectedRow.role === 'Supervisor' ? 'tenantSupervisor' : 'tenantUser';
        var username = selectedRow.email;
        const path = "/removeUserFromGroup";
        const myInit = {
            body: {
                username: username,
                groupname: role
            },
            headers: {
                Authorization: `Bearer ${(await Auth.currentSession())
                    .getAccessToken()
                    .getJwtToken()}`,
            },
        };
        API.post(apiName, path, myInit)
            .then((response) => {
                console.log("Response from RemoveTenant API is ", response);
                updateUserRole(username, selectedRow.newRole)

            }).catch((error) => {
                console.log(error.response);
            });

    }


    const updateUserRole = async (username, role) => {

        //1. upade user role in cognito
        const path = "/addUserToGroup";
        const myInit = {
            body: {
                username: username,
                groupname: role,
            },
            headers: {
                Authorization: `Bearer ${(await Auth.currentSession())
                    .getAccessToken()
                    .getJwtToken()}`,
            },
        };
        API.post(apiName, path, myInit)
            .then((response) => {
                console.log("Response from addUser API is ", response);
            })
            .catch((error) => {
                console.log(error);
            });

        // 2. updating user role in clientUser
        updateClientUser({
            isDisable: false,
            id: formValues.key,
            role: role
        }).then(async (res) => {
            notification.success({
                message: 'Success',
                description: 'User updated successfully',
            });
            setTableData([]);
            getUsersList();
            formEdit.resetFields();
            setFormValues([]);
            //Add an entry to audit table

            let changesMade = {
                oldValue: formValues.role === 'Admin' ? 'tenantAdmin' : formValues.role === 'Supervisor' ? 'tenantSupervisor' : 'tenantUser',
                newValue: role,
                field: 'role',
            };

            let auditRecord = {
                tenantId: state.tenantId,
                resource: "UserManagement",
                action: "Update",
                byUser: loggedUser,
                byDateTime: new Date().toISOString(),
                changesMade: JSON.stringify(changesMade),
            };

            await createAuditRecord(auditRecord);

        }).catch((err) => {
            console.log(err);
        })
    }


    const updateUser = async (values) => {

        var username = formValues.email
        var role = values.role
        // removing user from the previous group
        let selectedRow = { 'email': username, 'role': formValues.role, 'newRole': role }
        removeUserInCognito(selectedRow);
        // Adding the user in the new group

    }

    const handleEditSubmit = (values) => {
        setEditModalVisible(false)
        updateUser(values);
    }

    const handleEditCancel = () => {
        setEditModalVisible(false)
        formEdit.resetFields()
        setFormValues([]);
    };

    //------------------------------------------------------------



    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            fixed: 'left',
            render: (_, record) => (
                <a onClick={() => { showEditModal(); setFormValues({ email: record.email, name: record.name, role: record.role, key: record.key }) }} >{record.name}</a>
            ),
            sorter: (a, b) => a.name.localeCompare(b.name)
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status) => status !== 0 ? "Enabled" : "Disabled",
        },
    ];

    const breadcrumbItems = [
        {
            title: 'Home',
        },
        {
            title: 'Users management',
        },
    ]


    return (
        <div className='content-container'>
            <div className='main-container'>
                <Row className='breadcrumb-container'>
                    <Col span={24}>
                        <Breadcrumb items={breadcrumbItems} />
                    </Col>
                </Row>
                <Row className='topic-container' justify="space-between">
                    <Typography.Title level={3} > Users Management </Typography.Title>
                    <Space>
                        <Input
                            placeholder="Search here"
                            value={searchValue}
                            onChange={e => {
                                const currValue = e.target.value;
                                setSearchValue(currValue);
                                const filteredData = data.filter(entry =>
                                    entry.email.toLowerCase().includes(currValue.toLowerCase()) || entry.role.toLowerCase().includes(currValue.toLowerCase()) || entry.name.toLowerCase().includes(currValue.toLowerCase())
                                );
                                setTableData(filteredData);
                            }}
                        />
                        <Button type='primary' size='large' onClick={showCreateModal}><UserAddOutlined />Add</Button>
                        <Button type='primary' size='large' onClick={showRemoveConfirm}><UserDeleteOutlined />Disable</Button>
                    </Space>
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
                <Modal title={<h3> Create User</h3>} className='CreateModal' open={createModalVisible} onOk={form.submit} onCancel={handleCreateCancel} >
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
                        initialValues={formValues}
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
                                    message: 'Please input your Phone!'
                                },
                                {
                                    pattern: new RegExp(/^\+((?:9[679]|8[035789]|6[789]|5[90]|42|3[578]|2[1-689])|9[0-58]|8[1246]|6[0-6]|5[1-8]|4[013-9]|3[0-469]|2[70]|7|1)(?:\W*\d){0,13}\d$/),
                                    message: 'Please input a valid phone number!'
                                }
                            ]}>
                            <Input datatype='number' />
                        </Form.Item>

                        <Form.Item
                            name="role"
                            label="Role"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Select
                                placeholder="Select a role"
                                allowClear
                            >
                                <Select.Option value='tenantAdmin'>Admin</Select.Option>
                                <Select.Option value='tenantSupervisor'>Supervisor</Select.Option>
                                <Select.Option value='tenantUser'>User</Select.Option>
                            </Select>
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal title={<h2> Edit Tenant</h2>} className='editModal' open={editModalVisible} onOk={formEdit.submit} onCancel={handleEditCancel} >
                    <Space
                        direction="vertical"
                        size="middle"
                        style={{
                            display: 'flex',
                        }}
                    >
                        <h4>{"Name: " + formValues.name}</h4>
                        <h4>{"Email: " + formValues.email}</h4>
                        <Form
                            form={formEdit}
                            name='EditForm'
                            labelCol={{
                                span: 8,
                            }}
                            wrapperCol={{
                                span: 16,
                            }}
                            style={{
                                maxWidth: '100%',
                            }}
                            onFinish={handleEditSubmit}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                            layout='vertical'
                            initialValues={formValues}
                        >

                            <Form.Item
                                name="role"
                                label="Role"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <Select
                                    placeholder="Select a role"
                                    allowClear
                                >
                                    <Select.Option value='tenantAdmin'>Admin</Select.Option>
                                    <Select.Option value='tenantSupervisor'>Supervisor</Select.Option>
                                    <Select.Option value='tenantUser'>User</Select.Option>
                                </Select>
                            </Form.Item>
                        </Form>
                    </Space>

                </Modal>
            </div>
        </div>
    );
}

export default UserManagement;