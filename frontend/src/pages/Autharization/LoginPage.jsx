import React, { useEffect } from 'react';
import { Button, Form, Input, message, Space, Typography } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GlassCard } from "../../components/GlassCard";
import { useAuth } from '../../auth/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login } = useAuth();

  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (!user) return;
    navigate(from, { replace: true });
  }, [user, from, navigate]);

  async function handleFinish(values) {
    try {
      const result = await login({
        email: values.email,
        password: values.password,
      });

      message.success(`Успішний вхід! Ласкаво просимо, ${result.name}`);
      navigate(from, { replace: true });
    } catch (error) {
      message.error(error?.message || 'Помилка входу. Перевірте дані.');
    }
  }

  return (
    <div className="sl-page sl-animateIn">
      <GlassCard
        title={<span style={{ fontWeight: 800 }}>Увійти</span>}
        style={{ borderRadius: 18, maxWidth: 520, margin: "0 auto" }}
        bodyStyle={{ display: "flex", flexDirection: "column", gap: 12 }}
      >
        <Typography.Paragraph className="sl-muted" style={{ margin: 0 }}>
          Демо-сторінка. Автентифікація буде підключена пізніше.
        </Typography.Paragraph>

        <Form layout="vertical" onFinish={handleFinish}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Введіть email' }]}
          >
            <Input placeholder="Пошта" autoComplete="email" />
          </Form.Item>
          <Form.Item
            label="Пароль"
            name="password"
            rules={[{ required: true, message: 'Введіть пароль' }]}
          >
            <Input.Password
              placeholder="Пароль"
              autoComplete="current-password"
            />
          </Form.Item>
          <Space wrap>
            <Button type="primary" htmlType="submit">
              Увійти
            </Button>
            {/* <Link to="/" style={{ textDecoration: "none" }}>
              <Button>На головну</Button>
            </Link> */}
          </Space>
        </Form>

        <Typography.Text className="sl-muted2">
          Немає акаунта? <Link to="/register">Реєстрація</Link>
        </Typography.Text>
      </GlassCard>
    </div>
  );
}
