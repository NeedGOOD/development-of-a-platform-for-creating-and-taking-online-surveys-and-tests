import React, { useMemo } from 'react';
import { Button, Divider, List, Result, Space, Tag, Typography } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { GlassCard } from '../components/GlassCard';
import {
  ATTEMPT_STATUS,
  FORM_MODE,
  QUESTION_TYPE,
  getAttemptById,
  getFormById,
} from '../testdata';

function modeTag(mode) {
  if (mode === FORM_MODE.TEST) return <Tag color="gold">TEST</Tag>;
  return <Tag color="lime">SURVEY</Tag>;
}

function optionLabel(question, optionId) {
  const opt = (question.options || []).find((o) => String(o.id) === String(optionId));
  return opt ? opt.label : String(optionId);
}

function formatValue(question, value) {
  if (value == null) return '—';

  if (question.type === QUESTION_TYPE.SINGLE_CHOICE) return optionLabel(question, value);

  if (question.type === QUESTION_TYPE.MULTIPLE_CHOICE) {
    if (!Array.isArray(value) || !value.length) return '—';
    return value.map((id) => optionLabel(question, id)).join(', ');
  }

  if (question.type === QUESTION_TYPE.RATING) return String(value);

  return String(value);
}

function correctnessTag(question, value) {
  if (question.type === QUESTION_TYPE.SINGLE_CHOICE) {
    if (value == null) return <Tag>—</Tag>;
    return String(value) === String(question.correctOptionId) ? (
      <Tag color="green">Correct</Tag>
    ) : (
      <Tag color="red">Wrong</Tag>
    );
  }

  if (question.type === QUESTION_TYPE.MULTIPLE_CHOICE) {
    const got = Array.isArray(value) ? value.map(String).sort() : [];
    const correct = Array.isArray(question.correctOptionIds)
      ? question.correctOptionIds.map(String).sort()
      : [];

    if (!correct.length) return <Tag>—</Tag>;
    return got.join('|') === correct.join('|') ? (
      <Tag color="green">Correct</Tag>
    ) : (
      <Tag color="red">Wrong</Tag>
    );
  }

  return <Tag>—</Tag>;
}

export function AttemptResultPage() {
  const navigate = useNavigate();
  const { attemptId } = useParams();

  const attempt = useMemo(() => getAttemptById(attemptId), [attemptId]);
  const form = useMemo(() => (attempt ? getFormById(attempt.formId) : null), [attempt]);

  if (!attempt || !form) {
    return (
      <Result
        status="404"
        title="Result not found"
        extra={
          <Button type="primary" onClick={() => navigate('/dashboard/attempts')}>
            Back to attempts
          </Button>
        }
      />
    );
  }

  if (attempt.status === ATTEMPT_STATUS.IN_PROGRESS) {
    return (
      <Result
        status="info"
        title="Attempt is still in progress"
        extra={
          <Space wrap>
            <Button onClick={() => navigate('/dashboard/attempts')}>Back</Button>
            <Button
              type="primary"
              onClick={() => navigate(`/dashboard/forms/${attempt.formId}/take`)}
            >
              Continue
            </Button>
          </Space>
        }
      />
    );
  }

  const answers = attempt.answers || {};
  const questions = Array.isArray(form.questions) ? form.questions : [];
  const isTest = form.mode === FORM_MODE.TEST;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 900 }}>
      <GlassCard
        style={{ borderRadius: 20 }}
        bodyStyle={{ display: 'flex', flexDirection: 'column', gap: 8 }}
        title={
          <Space wrap size={8}>
            {modeTag(form.mode)}
            <span style={{ fontWeight: 900 }}>{form.title}</span>
          </Space>
        }
      >
        <div className="sl-muted2" style={{ fontSize: 12 }}>
          Submitted: {attempt.submittedAt ? new Date(attempt.submittedAt).toLocaleString() : '—'}
        </div>

        {isTest ? (
          <Typography.Title level={3} style={{ margin: 0 }}>
            Score: {attempt.score ?? 0}/{attempt.maxScore ?? 0}
          </Typography.Title>
        ) : (
          <Typography.Title level={3} style={{ margin: 0 }}>
            Thank you!
          </Typography.Title>
        )}

        <Space wrap>
          <Button onClick={() => navigate('/dashboard/attempts')}>Back</Button>
          <Button type="primary" onClick={() => navigate(`/dashboard/forms/${form.id}/take`)}>
            Start again
          </Button>
        </Space>
      </GlassCard>

      <GlassCard style={{ borderRadius: 20 }}>
        <List
          dataSource={questions}
          renderItem={(q, index) => {
            const value = answers[q.id];
            return (
              <List.Item>
                <div style={{ width: '100%' }}>
                  <Space wrap size={8}>
                    <Tag>{index + 1}</Tag>
                    <Typography.Text style={{ fontWeight: 800 }}>{q.title}</Typography.Text>
                    {isTest ? correctnessTag(q, value) : null}
                  </Space>

                  <div className="sl-muted2" style={{ marginTop: 8 }}>
                    Your answer: <strong>{formatValue(q, value)}</strong>
                  </div>

                  {isTest && q.type !== QUESTION_TYPE.TEXT && q.type !== QUESTION_TYPE.RATING ? (
                    <div className="sl-muted2" style={{ marginTop: 6 }}>
                      Correct:{' '}
                      <strong>
                        {q.type === QUESTION_TYPE.SINGLE_CHOICE
                          ? formatValue(q, q.correctOptionId)
                          : formatValue(q, q.correctOptionIds || [])}
                      </strong>
                    </div>
                  ) : null}

                  <Divider style={{ margin: '12px 0 0' }} />
                </div>
              </List.Item>
            );
          }}
        />
      </GlassCard>
    </div>
  );
}

