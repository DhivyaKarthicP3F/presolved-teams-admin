import React, { useState } from 'react'
import { UserOutlined,SettingFilled ,AuditOutlined } from '@ant-design/icons';
import { Layout, Menu, Space, Typography, } from 'antd';
import { Link } from '@gatsbyjs/reach-router'
const items = [ 
    {
        key: 'users',
        icon: <UserOutlined />,
        label: <Link to="/admin/">Users</Link>,

    },
    {
        key: 'tenants',
        icon: <SettingFilled />,
        label: <Link to="/admin/tenants">Tenants</Link>

    },
    {
        key: 'auditList',
        icon: <AuditOutlined />,
        label: <Link to="/admin/audit-list">Audit</Link>,
    },

];

const AdminSider = () => {
    const { Sider } = Layout;
    const [collapsed, setCollapsed] = useState(false);


    return (
        <Sider  width={250} collapsedWidth={100} className="primary-sidebar" theme='light' collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
            <div className="logo-container" >
                <div className={`logo ${collapsed && 'collapsed' || ''}`} style={{height:'55px'}}>Presolved</div>
            </div>
            <div className='main-menu'>
                <Typography.Text className='nav-placeholder' strong>Navigations</Typography.Text>
            <Menu theme="light" defaultSelectedKeys={['users']} mode="inline" items={items} />
            </div>
        </Sider>
        );
}

export default AdminSider