import React from 'react';
import { Layout, Menu, Avatar, Dropdown, Button, Space } from 'antd';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  ScheduleOutlined,
  SearchOutlined,
  UserOutlined,
  LogoutOutlined,
  BellOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { logout } from '../store/authSlice';
import DateTime from './DateTime';

const { Header, Content, Sider } = Layout;

const TrainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = React.useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const items = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '個人資料',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '登出',
      onClick: handleLogout,
    },
  ];

  const navigationItems = [
    {
      key: '/schedule',
      icon: <ScheduleOutlined />,
      label: <Link to="/schedule">時刻表查詢</Link>,
    },
    {
      key: '/tickets',
      icon: <SearchOutlined />,
      label: <Link to="/tickets">車票查詢</Link>,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          background: '#fff',
          boxShadow: '0 1px 4px rgba(0, 21, 41, 0.08)',
        }}
      >
        <div className="logo-container" style={{ marginRight: 'auto' }}>
          <Link to="/">
            <h1 style={{ margin: 0, fontSize: '1.5rem' }}>台鐵時刻查詢系統</h1>
          </Link>
        </div>

        <div
          className="center-content"
          style={{ marginRight: 'auto', marginLeft: '32px' }}
        >
          <DateTime
            style={{
              fontSize: '1rem',
              fontWeight: 'normal',
              color: '#666',
              marginLeft: '24px',
            }}
          />
        </div>

        <Space>
          <Button
            type="text"
            icon={<BellOutlined />}
            style={{ marginRight: 12 }}
          />
          <Dropdown menu={{ items }} placement="bottomRight">
            <Space style={{ cursor: 'pointer' }}>
              <Avatar
                style={{ backgroundColor: '#1890ff' }}
                icon={<UserOutlined />}
              />
              <span>{user?.username || '用戶'}</span>
            </Space>
          </Dropdown>
        </Space>
      </Header>

      <Layout>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          width={200}
          theme="light"
          trigger={null}
        >
          <div className="flex justify-end p-2">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
            />
          </div>
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={navigationItems}
            style={{ borderRight: 0 }}
          />
        </Sider>
        <Layout style={{ padding: '0 0 24px' }}>
          <Content
            style={{
              margin: 0,
              minHeight: 280,
              background: '#f5f5f5',
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default TrainLayout;
