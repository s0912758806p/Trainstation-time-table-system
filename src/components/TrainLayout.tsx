import React, { useState, useMemo, useCallback } from 'react';
import { Layout, Menu, Avatar, Dropdown, Button, Space, Drawer } from 'antd';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  ScheduleOutlined,
  SearchOutlined,
  UserOutlined,
  LogoutOutlined,
  BellOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  ReconciliationOutlined,
  HomeOutlined,
  QuestionCircleOutlined,
  EnvironmentOutlined,
  InfoCircleOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { logout } from '../store/authSlice';
import DateTime from './DateTime';
import useIsMobile from '../hooks/useIsMobile';

const { Header, Content, Sider } = Layout;

const TrainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const isMobile = useIsMobile();
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = useCallback(() => {
    dispatch(logout());
    navigate('/login');
  }, [dispatch, navigate]);

  const handleMenuClick = useCallback((path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileDrawerOpen(false);
    }
  }, [isMobile, navigate]);

  const userMenuItems = useMemo(
    () => [
      {
        key: 'profile',
        icon: <UserOutlined />,
        label: '個人資料',
        onClick: () => navigate('/profile'),
      },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: '登出',
        onClick: handleLogout,
      },
    ],
    [handleLogout, navigate]
  );

  const navigationItems = useMemo(() => [
    {
      key: '/dashboard',
      icon: <HomeOutlined />,
      label: isMobile ? '首頁' : <Link to="/dashboard">首頁</Link>,
      onClick: isMobile ? () => handleMenuClick('/dashboard') : undefined,
    },
    {
      key: '/schedule',
      icon: <ScheduleOutlined />,
      label: isMobile ? '時刻表查詢' : <Link to="/schedule">時刻表查詢</Link>,
      onClick: isMobile ? () => handleMenuClick('/schedule') : undefined,
    },
    {
      key: '/tickets',
      icon: <SearchOutlined />,
      label: isMobile ? '車票查詢' : <Link to="/tickets">車票查詢</Link>,
      onClick: isMobile ? () => handleMenuClick('/tickets') : undefined,
    },
    {
      key: '/orders',
      icon: <ReconciliationOutlined />,
      label: isMobile ? '訂單管理' : <Link to="/orders">訂單管理</Link>,
      onClick: isMobile ? () => handleMenuClick('/orders') : undefined,
    },
    {
      key: '/train-details',
      icon: <InfoCircleOutlined />,
      label: isMobile ? '列車詳情' : <Link to="/train-details">列車詳情</Link>,
      onClick: isMobile ? () => handleMenuClick('/train-details') : undefined,
    },
    {
      key: '/station-info',
      icon: <EnvironmentOutlined />,
      label: isMobile ? '站點資訊' : <Link to="/station-info">站點資訊</Link>,
      onClick: isMobile ? () => handleMenuClick('/station-info') : undefined,
    },
    {
      key: '/profile',
      icon: <UserOutlined />,
      label: isMobile ? '會員中心' : <Link to="/profile">會員中心</Link>,
      onClick: isMobile ? () => handleMenuClick('/profile') : undefined,
    },
    {
      key: '/faq',
      icon: <QuestionCircleOutlined />,
      label: isMobile ? '幫助中心' : <Link to="/faq">幫助中心</Link>,
      onClick: isMobile ? () => handleMenuClick('/faq') : undefined,
    },
  ], [isMobile, handleMenuClick]);

  // 移動端抽屜菜單
  const mobileMenu = (
    <Drawer
      title="功能選單"
      placement="left"
      onClose={() => setMobileDrawerOpen(false)}
      open={mobileDrawerOpen}
      bodyStyle={{ padding: 0 }}
    >
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={navigationItems}
        style={{ borderRight: 0 }}
      />
    </Drawer>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: isMobile ? '0 12px' : '0 24px',
          background: '#fff',
          boxShadow: '0 1px 4px rgba(0, 21, 41, 0.08)',
          height: 64,
          position: 'sticky',
          top: 0,
          zIndex: 1000,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {isMobile && (
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setMobileDrawerOpen(true)}
              style={{ marginRight: 8 }}
            />
          )}

          <div className="logo-container">
            <Link to="/">
              <h1
                style={{
                  margin: 0,
                  fontSize: isMobile ? '1.1rem' : '1.5rem',
                  whiteSpace: 'nowrap',
                }}
              >
                台鐵時刻查詢系統
              </h1>
            </Link>
          </div>
        </div>

        {!isMobile && (
          <div
            className="center-content"
            style={{ marginRight: 'auto', marginLeft: '32px' }}
          >
            <DateTime
              style={{
                fontSize: '1rem',
                fontWeight: 'normal',
                color: '#666',
              }}
            />
          </div>
        )}

        <Space>
          {!isMobile && (
            <Button
              type="text"
              icon={<BellOutlined />}
              style={{ marginRight: 12 }}
            />
          )}
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Space style={{ cursor: 'pointer' }}>
              <Avatar
                style={{ backgroundColor: '#1890ff' }}
                icon={<UserOutlined />}
              />
              {!isMobile && <span>{user?.username || '用戶'}</span>}
            </Space>
          </Dropdown>
        </Space>
      </Header>

      <Layout>
        {/* 桌面版側欄 */}
        {!isMobile && (
          <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={setCollapsed}
            width={200}
            theme="light"
            trigger={null}
            style={{
              overflow: 'auto',
              height: 'calc(100vh - 64px)',
              position: 'sticky',
              top: 64,
              left: 0,
              zIndex: 999,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                padding: 8,
              }}
            >
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
        )}

        {/* 移動端抽屜菜單 */}
        {isMobile && mobileMenu}

        <Layout style={{ padding: 0 }}>
          <Content
            style={{
              margin: 0,
              minHeight: 280,
              background: '#f5f5f5',
              padding: isMobile ? 12 : 24,
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
