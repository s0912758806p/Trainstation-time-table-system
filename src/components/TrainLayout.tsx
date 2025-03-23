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
        className="flex items-center justify-between"
        style={{
          padding: '0 20px',
          background: '#1e3a8a',
          color: 'white',
        }}
      >
        <div className="logo flex items-center">
          <img
            src="/train-logo.png"
            alt="台鐵"
            style={{ height: 40, marginRight: 10 }}
          />
          <h1 style={{ color: 'white', margin: 0, fontSize: '1.5rem' }}>
            台灣鐵路管理局
          </h1>
        </div>
        <div className="right-content">
          <Space>
            <Button
              type="text"
              icon={<BellOutlined />}
              style={{ color: 'white' }}
            />
            <Dropdown
              menu={{ items }}
              trigger={['click']}
              placement="bottomRight"
            >
              <Button
                type="text"
                icon={
                  <Avatar
                    style={{ backgroundColor: '#1890ff' }}
                    icon={<UserOutlined />}
                  />
                }
                style={{ color: 'white' }}
              >
                {user?.username || '用戶'}
              </Button>
            </Dropdown>
          </Space>
        </div>
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
