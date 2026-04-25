import React, { useMemo, useState } from 'react';
import {
  App,
  Button,
  Col,
  Divider,
  Empty,
  Input,
  List,
  Row,
  Space,
  Statistic,
  Tag,
  Typography,
} from 'antd';
import {
  ArrowRightOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { GlassCard } from '../components/GlassCard';

const FORM_MODE = {
  TEST: 'TEST',
  SURVEY: 'SURVEY',
};

const FORM_STATUS = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
};

const testUser = {
  id: 1,
  name: 'Олександр',
  role: 'CREATOR',
};

const testPublishedForms = [
  {
    id: 1,
    title: 'JavaScript Basics',
    description: 'Тест на базові знання JavaScript.',
    mode: FORM_MODE.TEST,
    status: FORM_STATUS.PUBLISHED,
    accessCode: 'JS-101',
  },
  {
    id: 2,
    title: 'Feedback Survey',
    description: 'Коротке опитування для збору відгуків.',
    mode: FORM_MODE.SURVEY,
    status: FORM_STATUS.PUBLISHED,
    accessCode: 'FB-001',
  },
  {
    id: 3,
    title: 'React Fundamentals',
    description: 'Перевірка знань React компонентів, props та state.',
    mode: FORM_MODE.TEST,
    status: FORM_STATUS.PUBLISHED,
    accessCode: 'REACT-01',
  },
];

const testMineForms = [
  ...testPublishedForms,
  {
    id: 4,
    title: 'HTML & CSS Draft',
    description: 'Чернетка тесту по HTML та CSS.',
    mode: FORM_MODE.TEST,
    status: FORM_STATUS.DRAFT,
    accessCode: null,
  },
  {
    id: 5,
    title: 'Student Survey Draft',
    description: 'Чернетка опитування для студентів.',
    mode: FORM_MODE.SURVEY,
    status: FORM_STATUS.DRAFT,
    accessCode: null,
  },
];

const testAttempts = [
  {
    id: 101,
    formId: 1,
    formTitle: 'JavaScript Basics',
    formMode: FORM_MODE.TEST,
    status: 'SUBMITTED',
    startedAt: '2026-04-25T12:30:00',
  },
  {
    id: 102,
    formId: 2,
    formTitle: 'Feedback Survey',
    formMode: FORM_MODE.SURVEY,
    status: 'IN_PROGRESS',
    startedAt: '2026-04-25T14:10:00',
  },
  {
    id: 103,
    formId: 3,
    formTitle: 'React Fundamentals',
    formMode: FORM_MODE.TEST,
    status: 'SUBMITTED',
    startedAt: '2026-04-24T18:45:00',
  },
];

function modeTag(mode) {
  if (mode === FORM_MODE.TEST) return <Tag color="gold">TEST</Tag>;
  return <Tag color="lime">SURVEY</Tag>;
}

export function DashboardPage() {
  const { message } = App.useApp();

  const [published] = useState(testPublishedForms);
  const [mine] = useState(testMineForms);
  const [attempts] = useState(testAttempts);
  const [joinCode, setJoinCode] = useState('');

  const user = testUser;
  const isCreator = user?.role === 'CREATOR' || user?.role === 'ADMIN';

  const myDrafts = useMemo(() => {
    return mine.filter((form) => form.status !== FORM_STATUS.PUBLISHED);
  }, [mine]);

  function navigate(path) {
    console.log('Navigate to:', path);
    message.info(`Перехід: ${path}`);
  }

  function joinByCode() {
    const code = joinCode.trim();

    if (!code) {
      message.warning('Введіть код форми');
      return;
    }

    const form = published.find((item) => {
      return String(item.accessCode || '').toLowerCase() === code.toLowerCase();
    });

    if (!form) {
      message.warning('Не знайдено форму з таким кодом');
      return;
    }

    navigate(`/app/forms/${form.id}/take`);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, boxSizing: 'border-box', padding: 18, margin: "0 auto", maxWidth: 1120 }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={16}>
          <GlassCard
            style={{ borderRadius: 20 }}
            bodyStyle={{ display: 'flex', flexDirection: 'column', gap: 10 }}
            title={<span style={{ fontWeight: 900 }}>Вітаємо, {user.name}!</span>}
          >
            <Typography.Paragraph className="sl-muted" style={{ margin: 0 }}>
              {isCreator
                ? 'Створюйте тести/опитування, публікуйте посилання та переглядайте аналітику.'
                : 'Проходьте тести/опитування, зберігайте прогрес і переглядайте результати.'}
            </Typography.Paragraph>

            <Space wrap style={{ marginTop: 6 }}>
              {isCreator && (
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => navigate('/app/forms/new')}
                >
                  Новий тест/опитування
                </Button>
              )}

              <Button
                icon={<ArrowRightOutlined />}
                onClick={() => navigate('/app/forms')}
              >
                Відкрити форми
              </Button>
            </Space>
          </GlassCard>
        </Col>

        <Col xs={24} md={8}>
          <GlassCard
            style={{ borderRadius: 20 }}
            title={<span style={{ fontWeight: 900 }}>Швидкий вхід за кодом</span>}
          >
            <Space.Compact style={{ width: '100%' }}>
              <Input
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                placeholder="Напр.: JS-101"
                prefix={<SearchOutlined />}
              />

              <Button type="primary" onClick={joinByCode}>
                Перейти
              </Button>
            </Space.Compact>

            <div className="sl-muted2" style={{ fontSize: 12, marginTop: 10 }}>
              Демо-коди: <code>JS-101</code>, <code>FB-001</code>,{' '}
              <code>REACT-01</code>
            </div>
          </GlassCard>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <GlassCard
            style={{ borderRadius: 20 }}
            bodyStyle={{ display: 'grid', gap: 10 }}
            title="Статистика"
          >
            <Row gutter={[10, 10]}>
              <Col span={12}>
                <GlassCard size="small" style={{ borderRadius: 16 }} bodyStyle={{ padding: 12 }}>
                  <Statistic title="Форми" value={published.length} />
                </GlassCard>
              </Col>

              <Col span={12}>
                <GlassCard size="small" style={{ borderRadius: 16 }} bodyStyle={{ padding: 12 }}>
                  <Statistic title="Спроби" value={attempts.length} />
                </GlassCard>
              </Col>

              {isCreator && (
                <>
                  <Col span={12}>
                    <GlassCard size="small" style={{ borderRadius: 16 }} bodyStyle={{ padding: 12 }}>
                      <Statistic title="Мої" value={mine.length} />
                    </GlassCard>
                  </Col>

                  <Col span={12}>
                    <GlassCard size="small" style={{ borderRadius: 16 }} bodyStyle={{ padding: 12 }}>
                      <Statistic title="Чернетки" value={myDrafts.length} />
                    </GlassCard>
                  </Col>
                </>
              )}
            </Row>
          </GlassCard>
        </Col>

        <Col xs={24} md={16}>
          <GlassCard
            style={{ borderRadius: 20 }}
            title={<span style={{ fontWeight: 900 }}>Останні спроби</span>}
            bodyStyle={{ paddingTop: 6 }}
          >
            <List
              dataSource={attempts.slice(0, 5)}
              locale={{
                emptyText: <Empty description="Поки що немає спроб" />,
              }}
              renderItem={(attempt) => (
                <List.Item
                  actions={[
                    attempt.status === 'SUBMITTED' ? (
                      <Button
                        type="link"
                        onClick={() => navigate(`/app/attempts/${attempt.id}/result`)}
                      >
                        Результат
                      </Button>
                    ) : (
                      <Button
                        type="primary"
                        icon={<PlayCircleOutlined />}
                        onClick={() => navigate(`/app/forms/${attempt.formId}/take`)}
                      >
                        Продовжити
                      </Button>
                    ),
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <Space wrap size={8}>
                        {modeTag(attempt.formMode)}
                        <span style={{ fontWeight: 800 }}>{attempt.formTitle}</span>
                        {attempt.status === 'SUBMITTED' ? (
                          <Tag>Submitted</Tag>
                        ) : (
                          <Tag color="processing">In progress</Tag>
                        )}
                      </Space>
                    }
                    description={
                      <span className="sl-muted2">
                        Старт: {new Date(attempt.startedAt).toLocaleString()}
                      </span>
                    }
                  />
                </List.Item>
              )}
            />
          </GlassCard>
        </Col>
      </Row>

      <Divider style={{ margin: '10px 0' }} />

      <GlassCard
        style={{ borderRadius: 20 }}
        title={
          <span style={{ fontWeight: 900 }}>
            {isCreator ? 'Опубліковані (швидкий доступ)' : 'Доступні форми'}
          </span>
        }
      >
        <List
          grid={{ gutter: 12, xs: 1, sm: 2, md: 3 }}
          dataSource={published.slice(0, 6)}
          locale={{
            emptyText: <Empty description="Немає форм" />,
          }}
          renderItem={(form) => (
            <List.Item>
              <div
                className="sl-glass"
                style={{
                  borderRadius: 18,
                  padding: 14,
                  background: 'rgba(255,255,255,.58)',
                  border: '1px solid rgba(11,18,32,.08)',
                  minHeight: 150,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
              >
                <Space wrap size={8}>
                  {modeTag(form.mode)}
                  {form.accessCode && <Tag color="blue">{form.accessCode}</Tag>}
                </Space>

                <div style={{ fontWeight: 900, fontSize: 16, lineHeight: 1.2 }}>
                  {form.title}
                </div>

                <div className="sl-muted2" style={{ fontSize: 12, flex: 1 }}>
                  {form.description || '—'}
                </div>

                <Space style={{ justifyContent: 'space-between' }}>
                  <Button
                    size="small"
                    icon={<ArrowRightOutlined />}
                    onClick={() => navigate(`/app/forms/${form.id}/take`)}
                  >
                    Відкрити
                  </Button>
                </Space>
              </div>
            </List.Item>
          )}
        />
      </GlassCard>
    </div>
  );
}