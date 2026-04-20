import React, { useState } from 'react';
import { Button, Layout, Space } from 'antd';
import { Brand } from './Brand';
import { Link, Outlet } from 'react-router-dom';

const { Header, Content, Footer } = Layout;

export default function SiteHeader() {
  const [isAuthed, setIsAuthed] = useState(true);

  return (
    <Layout style={{ minHeight: '100vh', background: 'transparent' }}>
      <Header
        style={{
          background: 'transparent',
          paddingInline: 16,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          className="sl-glass"
          style={{
            width: '100%',
            maxWidth: 1120,
            margin: '0 auto',
            padding: '10px 12px',
            borderRadius: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Brand compact />
          </Link>
          <Space size={10}>
            {isAuthed ? (
              <Link to="/app" style={{ textDecoration: 'none' }}>
                <Button type="primary">Панель</Button>
              </Link>
            ) : (
              <>
                <Link to="/login" style={{ textDecoration: 'none' }}>
                  <Button>Увійти</Button>
                </Link>
                <Link to="/register" style={{ textDecoration: 'none' }}>
                  <Button type="primary">Реєстрація</Button>
                </Link>
              </>
            )}
          </Space>
        </div>
      </Header>

      <Content style={{ background: 'transparent' }}>
        <Outlet />
      </Content>

      <Footer style={{ background: 'transparent', padding: '18px 16px' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', color: 'rgba(11,18,32,.55)' }}>
          SurveyLab {new Date().getFullYear()} · React + Ant Design · (Mock API)
        </div>
      </Footer>
    </Layout>
  );
}

