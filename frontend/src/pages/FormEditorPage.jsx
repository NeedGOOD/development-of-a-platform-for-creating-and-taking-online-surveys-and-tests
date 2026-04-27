import React, { useEffect, useMemo, useState } from 'react';
import { App, Button, Divider, Form, Input, Result, Space, Tag, Typography } from 'antd';
import { InboxOutlined, SaveOutlined, SendOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { GlassCard } from '../components/GlassCard';
import {
  FORM_MODE,
  FORM_STATUS,
  archiveForm,
  getFormById,
  publishForm,
  updateForm,
} from '../testdata';
import { useAuth } from '../auth/AuthContext';

function modeTag(mode) {
  if (mode === FORM_MODE.TEST) return <Tag color="gold">TEST</Tag>;
  return <Tag color="lime">SURVEY</Tag>;
}

function statusTag(status) {
  if (status === FORM_STATUS.PUBLISHED) return <Tag color="green">Published</Tag>;
  if (status === FORM_STATUS.ARCHIVED) return <Tag>Archived</Tag>;
  return <Tag color="processing">Draft</Tag>;
}

export function FormEditorPage() {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const { formId } = useParams();
  const { user } = useAuth();

  const loaded = useMemo(() => getFormById(formId), [formId]);
  const [formState, setFormState] = useState(loaded);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    setFormState(loaded);
    if (!loaded) return;
    form.setFieldsValue({
      title: loaded.title,
      description: loaded.description,
    });
  }, [loaded, form]);

  if (!loaded) {
    return (
      <Result
        status="404"
        title="Form not found"
        extra={
          <Button type="primary" onClick={() => navigate('/dashboard/forms')}>
            Back to forms
          </Button>
        }
      />
    );
  }

  const isOwnerOrAdmin = user.role === 'ADMIN' || String(loaded.ownerId) === String(user.id);
  if (!isOwnerOrAdmin) {
    return (
      <Result
        status="403"
        title="No access"
        subTitle="You can edit only your forms."
        extra={
          <Button type="primary" onClick={() => navigate('/dashboard/forms')}>
            Back to forms
          </Button>
        }
      />
    );
  }

  async function handleSave(values) {
    setSaving(true);

    try {
      const updated = updateForm(loaded.id, {
        title: values.title,
        description: values.description,
      });
      setFormState(updated);
      message.success('Saved');
    } catch (error) {
      message.error(error?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  function handlePublish() {
    try {
      const updated = publishForm(loaded.id);
      setFormState(updated);
      message.success('Published');
    } catch (error) {
      message.error(error?.message || 'Publish failed');
    }
  }

  function handleArchive() {
    try {
      const updated = archiveForm(loaded.id);
      setFormState(updated);
      message.success('Archived');
    } catch (error) {
      message.error(error?.message || 'Archive failed');
    }
  }

  const questionsCount = Array.isArray(formState?.questions) ? formState.questions.length : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 900 }}>
      <GlassCard
        style={{ borderRadius: 20 }}
        title={
          <Space wrap size={8}>
            {modeTag(formState.mode)}
            {statusTag(formState.status)}
            {formState.accessCode ? <Tag color="blue">{formState.accessCode}</Tag> : null}
            <span style={{ fontWeight: 900 }}>Edit form</span>
          </Space>
        }
        bodyStyle={{ display: 'flex', flexDirection: 'column', gap: 12 }}
      >
        <Form form={form} layout="vertical" onFinish={handleSave} requiredMark={false}>
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Enter title' }]}
          >
            <Input placeholder="Form title" />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea placeholder="Short description" autoSize={{ minRows: 2, maxRows: 6 }} />
          </Form.Item>

          <Space wrap style={{ justifyContent: 'space-between', width: '100%' }}>
            <Space wrap>
              <Button onClick={() => navigate('/dashboard/forms')}>Back</Button>
              <Button onClick={() => navigate(`/dashboard/forms/${loaded.id}/take`)}>Preview</Button>
              <Button onClick={() => navigate(`/dashboard/forms/${loaded.id}/analytics`)}>Analytics</Button>
            </Space>

            <Space wrap>
              {formState.status !== FORM_STATUS.PUBLISHED ? (
                <Button type="primary" icon={<SendOutlined />} onClick={handlePublish}>
                  Publish
                </Button>
              ) : null}

              {formState.status !== FORM_STATUS.ARCHIVED ? (
                <Button icon={<InboxOutlined />} onClick={handleArchive}>
                  Archive
                </Button>
              ) : null}

              <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={saving}>
                Save
              </Button>
            </Space>
          </Space>
        </Form>

        <Divider style={{ margin: '8px 0' }} />

        <Typography.Paragraph className="sl-muted2" style={{ margin: 0, fontSize: 12 }}>
          Questions: <strong>{questionsCount}</strong> (demo editor: questions are read-only here)
        </Typography.Paragraph>
      </GlassCard>
    </div>
  );
}

