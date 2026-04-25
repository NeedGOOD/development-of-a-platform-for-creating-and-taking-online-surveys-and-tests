import React, { useMemo, useState } from 'react';
import {
  App,
  Button,
  Empty,
  Input,
  List,
  Space,
  Tabs,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import {
  BarChartOutlined,
  CopyOutlined,
  EditOutlined,
  EyeOutlined,
  LinkOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  SendOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/GlassCard';

const FORM_MODE = {
  TEST: 'TEST',
  SURVEY: 'SURVEY',
};

const FORM_STATUS = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED',
};

const testUser = {
  id: 1,
  name: 'Creator',
  email: 'alex@test.com',
  role: 'CREATOR',
};

const testForms = [
  {
    id: 1,
    title: 'JavaScript Basics',
    description: 'Basic JavaScript test for beginners.',
    mode: FORM_MODE.TEST,
    status: FORM_STATUS.PUBLISHED,
    accessCode: 'JS-101',
    cover: { hue: 45 },
  },
  {
    id: 2,
    title: 'Feedback Survey',
    description: 'Short survey for collecting feedback.',
    mode: FORM_MODE.SURVEY,
    status: FORM_STATUS.PUBLISHED,
    accessCode: 'FB-001',
    cover: { hue: 150 },
  },
  {
    id: 3,
    title: 'React Fundamentals',
    description: 'React components, props, state and hooks.',
    mode: FORM_MODE.TEST,
    status: FORM_STATUS.DRAFT,
    accessCode: null,
    cover: { hue: 210 },
  },
  {
    id: 4,
    title: 'UI/UX Survey',
    description: 'Survey about interface and user experience.',
    mode: FORM_MODE.SURVEY,
    status: FORM_STATUS.DRAFT,
    accessCode: null,
    cover: { hue: 280 },
  },
];

function modeTag(mode) {
  if (mode === FORM_MODE.TEST) return <Tag color="gold">TEST</Tag>;
  return <Tag color="lime">SURVEY</Tag>;
}

function statusTag(status) {
  if (status === FORM_STATUS.PUBLISHED) return <Tag color="green">Published</Tag>;
  if (status === FORM_STATUS.ARCHIVED) return <Tag>Archived</Tag>;
  return <Tag color="processing">Draft</Tag>;
}

function formShareUrl(formId) {
  return `${window.location.origin}/play/${formId}`;
}

function FormCard({ form, actions }) {
  const hue = Number(form.cover?.hue || 200);

  return (
    <div
      className="sl-glass"
      style={{
        width: '100%',
        maxWidth: '100%',
        minWidth: 0,
        boxSizing: 'border-box',
        borderRadius: 20,
        padding: 14,
        background:
          `radial-gradient(900px 220px at -40% -30%, hsla(${hue}, 95%, 70%, .22), transparent 70%), ` +
          'rgba(255,255,255,.60)',
        border: '1px solid rgba(11,18,32,.08)',
        minHeight: 160,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      <Space wrap size={8}>
        {modeTag(form.mode)}
        {statusTag(form.status)}
        {form.accessCode && <Tag color="blue">{form.accessCode}</Tag>}
      </Space>

      <div style={{ fontWeight: 900, fontSize: 16, lineHeight: 1.2 }}>
        {form.title}
      </div>

      <div className="sl-muted2" style={{ fontSize: 12, flex: 1 }}>
        {form.description || '—'}
      </div>

      <Space wrap>{actions}</Space>
    </div>
  );
}

export function MyFormsPage() {
  const { message } = App.useApp();
  const navigate = useNavigate();

  const user = testUser;
  const isCreator = user.role === 'CREATOR' || user.role === 'ADMIN';

  const [forms, setForms] = useState(testForms);
  const [q, setQ] = useState('');

  const published = useMemo(() => {
    return forms.filter((form) => form.status === FORM_STATUS.PUBLISHED);
  }, [forms]);

  const mine = forms;

  const filteredPublished = useMemo(() => {
    const search = q.trim().toLowerCase();

    if (!search) return published;

    return published.filter((form) =>
      `${form.title} ${form.description || ''} ${form.accessCode || ''}`
        .toLowerCase()
        .includes(search)
    );
  }, [published, q]);

  const filteredMine = useMemo(() => {
    const search = q.trim().toLowerCase();

    if (!search) return mine;

    return mine.filter((form) =>
      `${form.title} ${form.description || ''} ${form.accessCode || ''}`
        .toLowerCase()
        .includes(search)
    );
  }, [mine, q]);

  function createNew(mode) {
    const newForm = {
      id: Date.now(),
      title: mode === FORM_MODE.TEST ? 'New Test' : 'New Survey',
      description: 'New draft form.',
      mode,
      status: FORM_STATUS.DRAFT,
      accessCode: null,
      cover: {
        hue: Math.floor(Math.random() * 360),
      },
    };

    setForms((prev) => [newForm, ...prev]);
    message.success('Form created');
    navigate(`/app/forms/${newForm.id}/edit`);
  }

  function publish(formId) {
    setForms((prev) =>
      prev.map((form) =>
        form.id === formId
          ? {
              ...form,
              status: FORM_STATUS.PUBLISHED,
              accessCode: form.accessCode || `FORM-${form.id}`,
            }
          : form
      )
    );

    message.success('Published');
  }

  async function copy(text) {
    try {
      await navigator.clipboard.writeText(text);
      message.success('Copied');
    } catch {
      message.warning('Clipboard copy failed');
    }
  }

  const publishedTab = (
    <List
      grid={{ gutter: 12, xs: 1, sm: 2, md: 3 }}
      dataSource={filteredPublished}
      locale={{
        emptyText: <Empty description="No published forms" />,
      }}
      renderItem={(form) => (
        <List.Item>
          <FormCard
            form={form}
            actions={[
              <Button
                key="take"
                size="small"
                type="primary"
                icon={<PlayCircleOutlined />}
                onClick={() => navigate(`/app/forms/${form.id}/take`)}
              >
                Take
              </Button>,

              form.accessCode ? (
                <Tooltip key="code" title="Copy access code">
                  <Button
                    size="small"
                    icon={<CopyOutlined />}
                    onClick={() => copy(form.accessCode)}
                  />
                </Tooltip>
              ) : null,

              <Tooltip key="link" title="Copy public link">
                <Button
                  size="small"
                  icon={<LinkOutlined />}
                  onClick={() => copy(formShareUrl(form.id))}
                />
              </Tooltip>,
            ]}
          />
        </List.Item>
      )}
    />
  );

  const mineTab = (
    <List
      grid={{ gutter: 12, xs: 1, sm: 2, md: 3 }}
      dataSource={filteredMine}
      locale={{
        emptyText: <Empty description="No forms yet" />,
      }}
      renderItem={(form) => (
        <List.Item>
          <FormCard
            form={form}
            actions={[
              <Button
                key="edit"
                size="small"
                icon={<EditOutlined />}
                onClick={() => navigate(`/app/forms/${form.id}/edit`)}
              >
                Edit
              </Button>,

              <Button
                key="preview"
                size="small"
                icon={<EyeOutlined />}
                onClick={() => navigate(`/app/forms/${form.id}/take`)}
              >
                Preview
              </Button>,

              <Tooltip key="analytics" title="Analytics">
                <Button
                  size="small"
                  icon={<BarChartOutlined />}
                  onClick={() => navigate(`/app/forms/${form.id}/analytics`)}
                />
              </Tooltip>,

              form.status !== FORM_STATUS.PUBLISHED ? (
                <Button
                  key="publish"
                  size="small"
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={() => publish(form.id)}
                >
                  Publish
                </Button>
              ) : (
                <Tooltip key="share" title="Copy public link">
                  <Button
                    size="small"
                    icon={<LinkOutlined />}
                    onClick={() => copy(formShareUrl(form.id))}
                  />
                </Tooltip>
              ),
            ]}
          />
        </List.Item>
      )}
    />
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <GlassCard
        style={{ borderRadius: 20 }}
        bodyStyle={{
          display: 'flex',
          gap: 10,
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ flex: 1, minWidth: 220 }}>
          <Typography.Title level={4} style={{ margin: 0 }}>
            Forms
          </Typography.Title>

          <div className="sl-muted2" style={{ fontSize: 12 }}>
            Public forms can be opened and completed. Creator can create and publish forms.
          </div>
        </div>

        <Input
          value={q}
          onChange={(event) => setQ(event.target.value)}
          placeholder="Search by title / description / code"
          style={{ maxWidth: 360 }}
        />

        {isCreator && (
          <Space wrap>
            <Button icon={<PlusOutlined />} onClick={() => createNew(FORM_MODE.SURVEY)}>
              Survey
            </Button>

            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => createNew(FORM_MODE.TEST)}
            >
              Test
            </Button>
          </Space>
        )}
      </GlassCard>

      <GlassCard style={{ borderRadius: 20 }}>
        <Tabs
          items={[
            {
              key: 'published',
              label: 'Available',
              children: publishedTab,
            },
            ...(isCreator
              ? [
                  {
                    key: 'mine',
                    label: 'Mine',
                    children: mineTab,
                  },
                ]
              : []),
          ]}
        />
      </GlassCard>
    </div>
  );
}