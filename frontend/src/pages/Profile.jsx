import React, { useEffect, useState } from 'react';
import { App, Button, Form, Input, Space, Tag, Typography } from 'antd';
import { LogoutOutlined, SaveOutlined } from '@ant-design/icons';
import { GlassCard } from '../components/GlassCard';

const testUser = {
  name: 'Creator',
  email: 'alex@test.com',
  role: 'CREATOR',
  isGuest: false,
};

export function ProfilePage() {
  const { message } = App.useApp();
  const [user, setUser] = useState(testUser);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      name: user.name,
      email: user.email,
      role: user.role,
    });
  }, [user, form]);

  function save(values) {
    setLoading(true);

    setTimeout(() => {
      const nextUser = {
        ...user,
        name: values.name,
      };

      setUser(nextUser);
      message.success('Saved');
      setLoading(false);
    }, 500);
  }

  function logout() {
    console.log('Logout demo');
    message.info('Logout demo');
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 720 }}>
      <GlassCard
        style={{ borderRadius: 20 }}
        title={<span style={{ fontWeight: 900 }}>Profile</span>}
        bodyStyle={{ display: 'flex', flexDirection: 'column', gap: 12 }}
      >
        <Space wrap size={8}>
          <Tag color="geekblue">{user.role}</Tag>
          {user.isGuest ? <Tag>Guest</Tag> : null}
        </Space>

        <Form form={form} layout="vertical" onFinish={save} requiredMark={false}>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Enter your name' }]}
          >
            <Input placeholder="Your name" />
          </Form.Item>

          <Form.Item name="email" label="Email">
            <Input readOnly />
          </Form.Item>

          <Form.Item name="role" label="Role">
            <Input readOnly />
          </Form.Item>

          <Space wrap style={{ justifyContent: 'space-between', width: '100%' }}>
            <Button danger icon={<LogoutOutlined />} onClick={logout}>
              Logout
            </Button>

            <Button type="primary" icon={<SaveOutlined />} htmlType="submit" loading={loading}>
              Save
            </Button>
          </Space>
        </Form>

        <Typography.Paragraph className="sl-muted2" style={{ fontSize: 12, margin: 0 }}>
          Demo mode: data is stored only inside the component state.
        </Typography.Paragraph>
      </GlassCard>
    </div>
  );
}