import React, { useMemo } from 'react';
import { Button, Col, Empty, List, Result, Row, Space, Statistic, Tag, Typography } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { GlassCard } from '../components/GlassCard';
import { ATTEMPT_STATUS, FORM_MODE, getFormAnalytics, getFormById, listAttempts } from '../testdata';

function modeTag(mode) {
  if (mode === FORM_MODE.TEST) return <Tag color="gold">TEST</Tag>;
  return <Tag color="lime">SURVEY</Tag>;
}

function statusTag(status) {
  if (status === ATTEMPT_STATUS.SUBMITTED) return <Tag color="green">Submitted</Tag>;
  return <Tag color="processing">In progress</Tag>;
}

export function FormAnalyticsPage() {
  const navigate = useNavigate();
  const { formId } = useParams();

  const form = useMemo(() => getFormById(formId), [formId]);
  const analytics = useMemo(() => getFormAnalytics(formId), [formId]);
  const attempts = useMemo(() => listAttempts({ formId }), [formId]);

  if (!form || !analytics) {
    return (
      <Result
        status="404"
        title="Analytics not found"
        extra={
          <Button type="primary" onClick={() => navigate('/dashboard/forms')}>
            Back to forms
          </Button>
        }
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 980 }}>
      <GlassCard
        style={{ borderRadius: 20 }}
        title={
          <Space wrap size={8}>
            {modeTag(form.mode)}
            <span style={{ fontWeight: 900 }}>{form.title}</span>
            <Tag>Analytics</Tag>
          </Space>
        }
        bodyStyle={{ display: 'flex', flexDirection: 'column', gap: 12 }}
      >
        <Row gutter={[12, 12]}>
          <Col xs={24} sm={12} md={6}>
            <GlassCard size="small" style={{ borderRadius: 16 }} bodyStyle={{ padding: 12 }}>
              <Statistic title="Total" value={analytics.totalAttempts} />
            </GlassCard>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <GlassCard size="small" style={{ borderRadius: 16 }} bodyStyle={{ padding: 12 }}>
              <Statistic title="Submitted" value={analytics.submittedAttempts} />
            </GlassCard>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <GlassCard size="small" style={{ borderRadius: 16 }} bodyStyle={{ padding: 12 }}>
              <Statistic title="In progress" value={analytics.inProgressAttempts} />
            </GlassCard>
          </Col>

          {form.mode === FORM_MODE.TEST ? (
            <Col xs={24} sm={12} md={6}>
              <GlassCard size="small" style={{ borderRadius: 16 }} bodyStyle={{ padding: 12 }}>
                <Statistic
                  title="Avg score"
                  value={
                    typeof analytics.averageScore === 'number'
                      ? analytics.averageScore.toFixed(2)
                      : '—'
                  }
                />
              </GlassCard>
            </Col>
          ) : null}
        </Row>

        <Space wrap>
          <Button onClick={() => navigate(`/dashboard/forms/${form.id}/edit`)}>Back</Button>
          <Button type="primary" onClick={() => navigate(`/dashboard/forms/${form.id}/take`)}>
            Preview
          </Button>
        </Space>
      </GlassCard>

      <GlassCard style={{ borderRadius: 20 }}>
        <Typography.Title level={4} style={{ marginTop: 0 }}>
          Attempts
        </Typography.Title>

        <List
          dataSource={[...attempts].sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt))}
          locale={{ emptyText: <Empty description="No attempts yet" /> }}
          renderItem={(attempt) => (
            <List.Item
              actions={[
                attempt.status === ATTEMPT_STATUS.SUBMITTED ? (
                  <Button
                    key="result"
                    type="link"
                    onClick={() => navigate(`/dashboard/attempts/${attempt.id}/result`)}
                  >
                    Result
                  </Button>
                ) : (
                  <Button
                    key="continue"
                    type="primary"
                    onClick={() => navigate(`/dashboard/forms/${attempt.formId}/take`)}
                  >
                    Continue
                  </Button>
                ),
              ]}
            >
              <List.Item.Meta
                title={
                  <Space wrap size={8}>
                    {statusTag(attempt.status)}
                    <span style={{ fontWeight: 800 }}>Attempt #{attempt.id}</span>
                  </Space>
                }
                description={
                  <span className="sl-muted2">
                    Started: {new Date(attempt.startedAt).toLocaleString()}
                  </span>
                }
              />
            </List.Item>
          )}
        />
      </GlassCard>
    </div>
  );
}

