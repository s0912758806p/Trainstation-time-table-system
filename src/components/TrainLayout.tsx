import React, { useState, useMemo, useCallback } from 'react';
import {
  Layout, Menu, Avatar, Dropdown, Button, Space, Drawer, Badge, Tooltip, List, Typography,
} from 'antd';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  ScheduleOutlined, SearchOutlined, UserOutlined, LogoutOutlined,
  BellOutlined, MenuUnfoldOutlined, MenuFoldOutlined, ReconciliationOutlined,
  HomeOutlined, QuestionCircleOutlined, EnvironmentOutlined, InfoCircleOutlined,
  MenuOutlined, RocketOutlined, SettingOutlined, SunOutlined, MoonOutlined,
  CheckCircleOutlined, WarningOutlined, InfoCircleFilled,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { logout } from '../store/authSlice';
import DateTime from './DateTime';
import useIsMobile from '../hooks/useIsMobile';
import { useTheme } from '../contexts/ThemeContext';

const { Header, Content, Sider } = Layout;
const { Text } = Typography;

const NOTIFICATIONS = [
  {
    id: '1',
    icon: <WarningOutlined style={{ color: '#f59e0b' }} />,
    title: '颱風警報：東部列車異動',
    desc: '09/15 花東線部分班次停駛，請提前確認',
    time: '10 分鐘前',
    unread: true,
  },
  {
    id: '2',
    icon: <CheckCircleOutlined style={{ color: '#22c55e' }} />,
    title: '訂單 #TW2024091501 已確認',
    desc: '臺北 → 高雄，09/20 07:30 出發',
    time: '1 小時前',
    unread: true,
  },
  {
    id: '3',
    icon: <InfoCircleFilled style={{ color: 'var(--brand)' }} />,
    title: '秋季優惠活動開跑',
    desc: '10–11 月週間自由座 75 折，立即查詢',
    time: '昨天',
    unread: false,
  },
];

const NAV_ITEMS = [
  { key: '/dashboard',     icon: <HomeOutlined />,           label: '首頁總覽' },
  { key: '/schedule',      icon: <ScheduleOutlined />,       label: '時刻查詢' },
  { key: '/tickets',       icon: <SearchOutlined />,         label: '車票查詢' },
  { key: '/orders',        icon: <ReconciliationOutlined />, label: '訂單管理' },
  { key: '/train-details', icon: <InfoCircleOutlined />,     label: '列車詳情' },
  { key: '/station-info',  icon: <EnvironmentOutlined />,    label: '站點資訊' },
  { key: '/profile',       icon: <UserOutlined />,           label: '會員中心' },
  { key: '/faq',           icon: <QuestionCircleOutlined />, label: '幫助中心' },
];

const TrainLayout: React.FC = () => {
  const [collapsed, setCollapsed]         = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const isMobile   = useIsMobile();
  const { isDark, toggleTheme } = useTheme();
  const { user }   = useSelector((state: RootState) => state.auth);
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const location   = useLocation();

  const handleLogout = useCallback(() => {
    dispatch(logout());
    navigate('/login');
  }, [dispatch, navigate]);

  const handleMenuClick = useCallback((path: string) => {
    navigate(path);
    if (isMobile) setMobileDrawerOpen(false);
  }, [isMobile, navigate]);

  const navigationItems = useMemo(
    () => NAV_ITEMS.map(({ key, icon, label }) => ({
      key,
      icon,
      label: isMobile ? label : <Link to={key}>{label}</Link>,
      onClick: isMobile ? () => handleMenuClick(key) : undefined,
    })),
    [isMobile, handleMenuClick]
  );

  const userMenuItems = useMemo(() => [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '個人資料',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '帳號設定',
      onClick: () => navigate('/profile'),
    },
    { type: 'divider' as const },
    {
      key: 'logout',
      icon: <LogoutOutlined style={{ color: 'var(--color-danger)' }} />,
      label: <span style={{ color: 'var(--color-danger)' }}>登出</span>,
      onClick: handleLogout,
    },
  ], [handleLogout, navigate]);

  // ── Sidebar content (shared between desktop Sider and mobile Drawer) ──
  const sidebarContent = (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>

      {/* Logo */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: collapsed ? '18px 0' : '18px 16px',
        justifyContent: collapsed ? 'center' : 'flex-start',
        borderBottom: '1px solid var(--sidebar-border)',
        minHeight: 56, flexShrink: 0,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8, flexShrink: 0,
          background: 'var(--brand)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <RocketOutlined style={{ color: '#fff', fontSize: 15 }} />
        </div>
        {!collapsed && (
          <div>
            <div style={{
              fontSize: 14, fontWeight: 700, lineHeight: 1.2,
              color: 'var(--logo-text)',
              letterSpacing: '-0.2px',
            }}>
              台鐵查詢系統
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>
              時刻 · 票務 · 路線
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <div style={{ flex: 1, padding: '6px 0', overflowY: 'auto' }}>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={navigationItems}
          style={{ background: 'transparent', border: 'none' }}
          inlineCollapsed={collapsed}
        />
      </div>

      {/* User strip */}
      {!collapsed && (
        <div style={{
          padding: '10px 14px',
          borderTop: '1px solid var(--sidebar-border)',
          display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0,
        }}>
          <Avatar size={30} style={{
            background: 'var(--brand)',
            flexShrink: 0, fontSize: 12, fontWeight: 700,
          }}>
            {user?.username?.[0]?.toUpperCase() ?? 'U'}
          </Avatar>
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontSize: 13, fontWeight: 600, color: 'var(--text-primary)',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {user?.username ?? '用戶'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              {user?.isGuest ? '訪客模式' : '一般會員'}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const headerStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: isMobile ? '0 14px' : '0 20px',
    background: 'var(--header-bg)',
    borderBottom: '1px solid var(--header-border)',
    height: 56, position: 'sticky', top: 0, zIndex: 1000,
    boxShadow: 'none',
    transition: 'background 0.2s ease, border-color 0.2s ease',
  };

  const iconBtnStyle: React.CSSProperties = {
    color: 'var(--text-muted)',
    width: 34, height: 34, padding: 0, borderRadius: 8,
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={headerStyle}>
        {/* Left — menu toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {isMobile ? (
            <Button
              type="text"
              icon={<MenuOutlined />}
              style={iconBtnStyle}
              onClick={() => setMobileDrawerOpen(true)}
            />
          ) : (
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              style={iconBtnStyle}
              onClick={() => setCollapsed(!collapsed)}
            />
          )}
        </div>

        {/* Center — datetime */}
        {!isMobile && (
          <DateTime style={{ fontSize: 12.5, color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }} />
        )}

        {/* Right — actions */}
        <Space size={4}>
          {/* Dark / Light toggle */}
          <Tooltip title={isDark ? '切換亮色模式' : '切換深色模式'}>
            <Button
              type="text"
              icon={isDark ? <SunOutlined /> : <MoonOutlined />}
              style={iconBtnStyle}
              onClick={toggleTheme}
            />
          </Tooltip>

          {/* Notification */}
          <Dropdown
            placement="bottomRight"
            trigger={['click']}
            dropdownRender={() => (
              <div style={{
                width: 320,
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                boxShadow: 'var(--shadow-lg)',
                overflow: 'hidden',
              }}>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderBottom: '1px solid var(--border-subtle)',
                }}>
                  <Text strong style={{ fontSize: 14, color: 'var(--text-primary)' }}>通知</Text>
                  <Button type="link" size="small" style={{ padding: 0, fontSize: 12, color: 'var(--brand)' }}>
                    全部標記已讀
                  </Button>
                </div>
                <List
                  dataSource={NOTIFICATIONS}
                  renderItem={(item) => (
                    <List.Item
                      style={{
                        padding: '10px 16px',
                        cursor: 'pointer',
                        background: item.unread ? 'var(--brand-light)' : 'transparent',
                        transition: 'background 0.15s',
                        borderBottom: '1px solid var(--border-subtle)',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-subtle)')}
                      onMouseLeave={e => (e.currentTarget.style.background = item.unread ? 'var(--brand-light)' : 'transparent')}
                    >
                      <List.Item.Meta
                        avatar={
                          <div style={{ fontSize: 18, marginTop: 2 }}>{item.icon}</div>
                        }
                        title={
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Text style={{ fontSize: 13, fontWeight: item.unread ? 600 : 400, color: 'var(--text-primary)' }}>
                              {item.title}
                            </Text>
                            {item.unread && (
                              <span style={{
                                width: 6, height: 6, borderRadius: '50%',
                                background: 'var(--brand)', flexShrink: 0,
                              }} />
                            )}
                          </div>
                        }
                        description={
                          <div>
                            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 2 }}>
                              {item.desc}
                            </div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.time}</div>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
                <div style={{
                  padding: '10px 16px', textAlign: 'center',
                  borderTop: '1px solid var(--border-subtle)',
                }}>
                  <Button type="link" size="small" style={{ fontSize: 13, color: 'var(--brand)' }}>
                    查看全部通知
                  </Button>
                </div>
              </div>
            )}
          >
            <Button
              type="text"
              style={iconBtnStyle}
              icon={
                <Badge count={2} size="small" offset={[-3, 3]}>
                  <BellOutlined style={{ fontSize: 17, color: 'var(--text-muted)' }} />
                </Badge>
              }
            />
          </Dropdown>

          {/* User menu — 與其他 icon 按鈕風格一致 */}
          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            trigger={['click']}
          >
            <Button
              type="text"
              style={{
                ...iconBtnStyle,
                width: 'auto',
                padding: '0 6px',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <Avatar size={26} style={{
                background: 'var(--brand)', fontSize: 11, fontWeight: 700, flexShrink: 0,
              }}>
                {user?.username?.[0]?.toUpperCase() ?? 'U'}
              </Avatar>
              {!isMobile && (
                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>
                  {user?.username ?? '用戶'}
                </span>
              )}
            </Button>
          </Dropdown>
        </Space>
      </Header>

      <Layout>
        {/* Desktop Sider */}
        {!isMobile && (
          <Sider
            collapsed={collapsed}
            width={214}
            collapsedWidth={60}
            style={{
              background: 'var(--sidebar-bg)',
              borderRight: '1px solid var(--sidebar-border)',
              height: 'calc(100vh - 56px)',
              position: 'sticky', top: 56,
              overflow: 'hidden',
              transition: 'background 0.2s ease, border-color 0.2s ease',
            }}
          >
            {sidebarContent}
          </Sider>
        )}

        {/* Mobile Drawer */}
        {isMobile && (
          <Drawer
            open={mobileDrawerOpen}
            onClose={() => setMobileDrawerOpen(false)}
            placement="left"
            width={240}
            styles={{
              body: {
                padding: 0,
                background: 'var(--sidebar-bg)',
                display: 'flex', flexDirection: 'column',
              },
              header: { display: 'none' },
            }}
          >
            {sidebarContent}
          </Drawer>
        )}

        {/* Main content */}
        <Layout style={{ background: 'var(--bg-page)' }}>
          <Content style={{
            margin: 0,
            minHeight: 280,
            padding: isMobile ? 12 : 24,
            background: 'var(--bg-page)',
          }}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default TrainLayout;
