import React from 'react';
import { App, Button, Result, Space, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { createForm, FORM_MODE } from '../testdata';
import { useAuth } from '../auth/AuthContext';
import { GlassCard } from '../components/GlassCard';

export function FormCreatePage() {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const { user } = useAuth();

  const isCreator = user.role === 'CREATOR' || user.role === 'ADMIN';

  if (!isCreator) {
    return (
      <Result
        status="403"
        title="No access"
        subTitle="Only creators can create forms."
        extra={
          <Button type="primary" onClick={() => navigate('/dashboard/forms')}>
            Back to forms
          </Button>
        }
      />
    );
  }

  function create(mode) {
    const form = createForm({
      ownerId: user.id,
      mode,
      title: mode === FORM_MODE.TEST ? 'New Test' : 'New Survey',
      description: 'New draft form.',
    });

    message.success('Created');
    navigate(`/dashboard/forms/${form.id}/edit`);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 720 }}>
      <GlassCard
        style={{ borderRadius: 20 }}
        bodyStyle={{ display: 'flex', flexDirection: 'column', gap: 12 }}
        title={<span style={{ fontWeight: 900 }}>Create new</span>}
      >
        <Typography.Paragraph className="sl-muted" style={{ margin: 0 }}>
          Choose what you want to create.
        </Typography.Paragraph>

        <Space wrap>
          <Button icon={<PlusOutlined />} onClick={() => create(FORM_MODE.SURVEY)}>
            Survey
          </Button>

          <Button type="primary" icon={<PlusOutlined />} onClick={() => create(FORM_MODE.TEST)}>
            Test
          </Button>
        </Space>
      </GlassCard>
    </div>
  );
}

