import React from 'react';
import { Button, Form, Input, Space, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { GlassCard } from '../../components/GlassCard';

export default function LoginPage() {
  return (
    <div className="sl-page sl-animateIn">
      <GlassCard
        title={<span style={{ fontWeight: 800 }}>Увійти</span>}
        style={{ borderRadius: 18, maxWidth: 520, margin: '0 auto' }}
        bodyStyle={{ display: 'flex', flexDirection: 'column', gap: 12 }}
      >
        <Typography.Paragraph className="sl-muted" style={{ margin: 0 }}>
          Демо-сторінка. Автентифікація буде підключена пізніше.
        </Typography.Paragraph>

        <Form layout="vertical">
          <Form.Item label="Email" name="email">
            <Input placeholder="teacher@demo.com" autoComplete="email" />
          </Form.Item>
          <Form.Item label="Пароль" name="password">
            <Input.Password placeholder="demo1234" autoComplete="current-password" />
          </Form.Item>
          <Space wrap>
            <Button type="primary" htmlType="submit">
              Увійти
            </Button>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <Button>На головну</Button>
            </Link>
          </Space>
        </Form>

        <Typography.Text className="sl-muted2">
          Немає акаунта? <Link to="/register">Реєстрація</Link>
        </Typography.Text>
      </GlassCard>
    </div>
  );
}
