import React, { useEffect, useState } from 'react';
import { App, Button, Form, Input, Space, Tag, Typography } from 'antd';
import { LogoutOutlined, SaveOutlined } from '@ant-design/icons';
import { GlassCard } from '../components/GlassCard';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export function ProfilePage() {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const { user, updateProfile, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (!user) return;
    form.setFieldsValue({
      name: user.name,
      email: user.email,
      role: user.role,
    });
  }, [user, form]);

  async function save(values) {
    setLoading(true);

    try {
      updateProfile({
        name: values.name,
      });

      message.success('Saved');
    } catch (error) {
      message.error(error?.message || 'Save failed');
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    logout();
    navigate('/login');
  }

  if (!user) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 720 }}>
      <GlassCard
        style={{ borderRadius: 20 }}
        title={<span style={{ fontWeight: 900 }}>Profile</span>}
        bodyStyle={{ display: 'flex', flexDirection: 'column', gap: 12 }}
      >
        <Space wrap size={8}>
          <Tag color="geekblue">{user.role}</Tag>
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
            <Button danger icon={<LogoutOutlined />} onClick={handleLogout}>
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
