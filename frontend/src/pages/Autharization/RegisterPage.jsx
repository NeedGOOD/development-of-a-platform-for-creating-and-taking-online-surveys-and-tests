import React from 'react';
import { Button, Form, Input, Space, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { GlassCard } from '../../components/GlassCard';

export function RegisterPage() {
  return (
    <div className="sl-page sl-animateIn">
      <GlassCard
        title={<span style={{ fontWeight: 800 }}>Реєстрація</span>}
        style={{ borderRadius: 18, maxWidth: 520, margin: '0 auto' }}
        bodyStyle={{ display: 'flex', flexDirection: 'column', gap: 12 }}
      >
        <Typography.Paragraph className="sl-muted" style={{ margin: 0 }}>
          Демо-сторінка. Реєстрація буде підключена пізніше.
        </Typography.Paragraph>

        <Form layout="vertical">
          <Form.Item label="Імʼя" name="name">
            <Input placeholder="Ваше імʼя" autoComplete="name" />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input placeholder="you@example.com" autoComplete="email" />
          </Form.Item>
          <Form.Item label="Пароль" name="password">
            <Input.Password placeholder="••••••••" autoComplete="new-password" />
          </Form.Item>
          <Space wrap>
            <Button type="primary" htmlType="submit">
              Створити акаунт
            </Button>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <Button>На головну</Button>
            </Link>
          </Space>
        </Form>

        <Typography.Text className="sl-muted2">
          Вже є акаунт? <Link to="/login">Увійти</Link>
        </Typography.Text>
      </GlassCard>
    </div>
  );
}