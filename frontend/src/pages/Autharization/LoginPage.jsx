import React from "react";
import { Button, Form, Input, message, Space, Typography } from "antd";
import { Link } from "react-router-dom";
import { GlassCard } from "../../components/GlassCard";
import { login } from "../../components/fetch/auth";
import { useRoute } from "../../components/function/route";

export default function LoginPage() {
  const route = useRoute();
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await login(e.target);
      message.success(`Успішний вхід! Ласкаво просимо, ${result.name}`);
      // Тут можна додати логіку для збереження стану автентифікації, наприклад, в контексті або localStorage
      route("/dashboard");
    } catch (error) {
      message.error("Помилка входу. Перевірте дані.");
    }
  };

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

        <Form layout="vertical" onSubmitCapture={handleSubmit}>
          <Form.Item label="Email" name="email">
            <Input placeholder="Пошта" autoComplete="email" />
          </Form.Item>
          <Form.Item label="Пароль" name="password">
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
