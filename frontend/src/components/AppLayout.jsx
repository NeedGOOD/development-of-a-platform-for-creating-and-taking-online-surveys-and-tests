import React, { useMemo, useState } from 'react';
import { Button, Dropdown, Layout, Menu, Space, Typography, Grid } from 'antd';
import {
  DashboardOutlined,
  FormOutlined,
  HistoryOutlined,
  LogoutOutlined,
  PlusOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Brand } from './Brand';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { resetTestData } from '../testdata';

const { Header, Sider, Content } = Layout;

function getSelectedKey(path) {
  if (path.startsWith('/dashboard/forms')) return '/dashboard/forms';
  if (path.startsWith('/dashboard/attempts')) return '/dashboard/attempts';
  if (path.startsWith('/dashboard/profile')) return '/dashboard/profile';
  return '/dashboard';
}

export default function AppLayout() {
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md;

  const [collapsed, setCollapsed] = useState(isMobile);
  const { user, logout: logoutAuth, refresh } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const path = location.pathname;

  function logout() {
    logoutAuth();
    navigate('/login');
  }

  const menuItems = useMemo(() => {
    return [
      { key: '/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
      { key: '/dashboard/forms', icon: <FormOutlined />, label: 'Forms' },
      { key: '/dashboard/attempts', icon: <HistoryOutlined />, label: 'Attempts' },
      { key: '/dashboard/profile', icon: <UserOutlined />, label: 'Profile' },
    ];
  }, []);

  const userMenu = {
    items: [
      {
        key: 'profile',
        icon: <UserOutlined />,
        label: 'Profile',
        onClick: () => navigate('/dashboard/profile'),
      },
      {
        key: 'seed',
        icon: <PlusOutlined />,
        label: 'Reset Demo Data',
        onClick: () => {
          resetTestData();
          refresh();
          navigate('/dashboard');
        },
      },
      { type: 'divider' },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        danger: true,
        label: 'Logout',
        onClick: logout,
      },
    ],
  };

  return (
    <Layout style={{ minHeight: '100vh', background: 'transparent' }}>
      <Sider
        width={256}
        collapsed={collapsed}
        collapsible
        onCollapse={setCollapsed}
        trigger={null}
        breakpoint="md"
        collapsedWidth={isMobile ? 0 : 80}
        style={{ background: 'transparent', padding: 16 }}
      >
        <div
          className="sl-glass"
          style={{
            height: '100%',
            borderRadius: 18,
            padding: 12,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <div style={{ padding: '6px 6px 0' }}>
            <Brand compact={collapsed} />
          </div>

          <Menu
            mode="inline"
            selectedKeys={[getSelectedKey(path)]}
            items={menuItems}
            onClick={({ key }) => navigate(key)}
            style={{
              background: 'transparent',
              border: 'none',
              fontWeight: 600,
            }}
          />

          <div style={{ marginTop: 'auto' }}>
            <div
              style={{
                padding: 10,
                borderRadius: 14,
                border: '1px solid rgba(11,18,32,.08)',
                background: 'rgba(255,255,255,.55)',
              }}
            >
              <div style={{ fontWeight: 800 }}>{user.name}</div>

              <div style={{ fontSize: 12, color: 'rgba(11,18,32,.55)' }}>
                {user.email}
              </div>

              <div style={{ marginTop: 8 }}>
                <Dropdown menu={userMenu} placement="topLeft" trigger={['click']}>
                  <Button size="small" style={{ borderRadius: 999 }}>
                    Menu
                  </Button>
                </Dropdown>
              </div>
            </div>
          </div>
        </div>
      </Sider>

      <Layout style={{ background: 'transparent' }}>
        <Header style={{ background: 'transparent', padding: '14px 16px 0' }}>
          <div
            style={{
              maxWidth: 1120,
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 10,
            }}
          >
            <Space size={10}>
              {isMobile && (
                <Button
                  className="sl-glass"
                  onClick={() => setCollapsed((value) => !value)}
                  style={{
                    borderRadius: 14,
                    border: '1px solid rgba(11,18,32,.08)',
                  }}
                >
                  Menu
                </Button>
              )}

              <Typography.Text className="sl-muted" style={{ fontWeight: 700 }}>
                {path.startsWith('/dashboard/forms')
                  ? 'Forms'
                  : path.startsWith('/dashboard/attempts')
                  ? 'Attempts'
                  : path === '/dashboard/profile'
                  ? 'Profile'
                  : 'Dashboard'}
              </Typography.Text>
            </Space>

            {(user.role === 'CREATOR' || user.role === 'ADMIN') &&
              path === '/dashboard/forms' && (
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => navigate('/dashboard/forms/new')}
                >
                  Create
                </Button>
              )}
          </div>
        </Header>

        <Content style={{ background: 'transparent' }}>
          <div className="sl-page sl-animateIn" style={{ paddingTop: 18 }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
