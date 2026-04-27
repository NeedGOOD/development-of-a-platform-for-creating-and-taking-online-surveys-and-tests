import React, { useEffect, useMemo, useState } from 'react';
import {
  App,
  Button,
  Checkbox,
  Divider,
  Empty,
  Input,
  Radio,
  Rate,
  Result,
  Space,
  Tag,
  Typography,
} from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { GlassCard } from '../components/GlassCard';
import {
  ATTEMPT_STATUS,
  FORM_MODE,
  QUESTION_TYPE,
  getFormById,
  saveAttemptAnswer,
  startAttempt,
  submitAttempt,
} from '../testdata';
import { useAuth } from '../auth/AuthContext';

function modeTag(mode) {
  if (mode === FORM_MODE.TEST) return <Tag color="gold">TEST</Tag>;
  return <Tag color="lime">SURVEY</Tag>;
}

function isReadOnly(attempt) {
  return attempt?.status === ATTEMPT_STATUS.SUBMITTED;
}

export function FormTakePage() {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const { formId } = useParams();
  const { user } = useAuth();

  const form = useMemo(() => getFormById(formId), [formId]);

  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);

    try {
      const started = startAttempt({ formId, userId: user.id });
      setAttempt(started);
    } catch (error) {
      message.error(error?.message || 'Failed to start attempt');
    } finally {
      setLoading(false);
    }
  }, [formId, user.id, message]);

  if (!form) {
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

  async function setAnswer(questionId, value) {
    if (!attempt) return;
    if (isReadOnly(attempt)) return;

    try {
      const updated = saveAttemptAnswer({
        attemptId: attempt.id,
        questionId,
        value,
      });

      setAttempt((prev) => ({
        ...prev,
        ...updated,
      }));
    } catch (error) {
      message.error(error?.message || 'Failed to save answer');
    }
  }

  async function handleSubmit() {
    if (!attempt) return;

    setSubmitting(true);
    try {
      const submitted = submitAttempt(attempt.id);
      setAttempt(submitted);
      message.success('Submitted');

      navigate(`/dashboard/attempts/${submitted.id}/result`);
    } catch (error) {
      message.error(error?.message || 'Submit failed');
    } finally {
      setSubmitting(false);
    }
  }

  const answers = attempt?.answers || {};
  const readOnly = isReadOnly(attempt);

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
        <Typography.Paragraph className="sl-muted" style={{ margin: 0 }}>
          {form.description || '—'}
        </Typography.Paragraph>

        <div className="sl-muted2" style={{ fontSize: 12 }}>
          Started: {attempt?.startedAt ? new Date(attempt.startedAt).toLocaleString() : '—'}
        </div>

        {readOnly ? (
          <div className="sl-muted2" style={{ fontSize: 12 }}>
            This attempt is submitted. You can start again by opening the form once more.
          </div>
        ) : null}
      </GlassCard>

      <GlassCard style={{ borderRadius: 20 }} bodyStyle={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {loading ? (
          <div className="sl-muted2">Loading…</div>
        ) : (form.questions || []).length ? (
          (form.questions || []).map((q, index) => {
            const value = answers[q.id];

            return (
              <div key={q.id}>
                <Space wrap size={8}>
                  <Tag>{index + 1}</Tag>
                  <Typography.Text style={{ fontWeight: 800 }}>{q.title}</Typography.Text>
                </Space>

                <div style={{ marginTop: 10 }}>
                  {q.type === QUESTION_TYPE.SINGLE_CHOICE ? (
                    <Radio.Group
                      value={value}
                      onChange={(e) => setAnswer(q.id, e.target.value)}
                      disabled={readOnly}
                      style={{ display: 'grid', gap: 8 }}
                    >
                      {(q.options || []).map((opt) => (
                        <Radio key={opt.id} value={opt.id}>
                          {opt.label}
                        </Radio>
                      ))}
                    </Radio.Group>
                  ) : q.type === QUESTION_TYPE.MULTIPLE_CHOICE ? (
                    <Checkbox.Group
                      value={Array.isArray(value) ? value : []}
                      onChange={(checked) => setAnswer(q.id, checked)}
                      disabled={readOnly}
                      style={{ display: 'grid', gap: 8 }}
                      options={(q.options || []).map((opt) => ({
                        label: opt.label,
                        value: opt.id,
                      }))}
                    />
                  ) : q.type === QUESTION_TYPE.TEXT ? (
                    <Input.TextArea
                      value={typeof value === 'string' ? value : ''}
                      onChange={(e) => setAnswer(q.id, e.target.value)}
                      placeholder={q.placeholder || 'Your answer…'}
                      disabled={readOnly}
                      autoSize={{ minRows: 3, maxRows: 6 }}
                    />
                  ) : q.type === QUESTION_TYPE.RATING ? (
                    <Space direction="vertical" size={8}>
                      <Rate
                        value={typeof value === 'number' ? value : 0}
                        onChange={(v) => setAnswer(q.id, v)}
                        count={q.max || 5}
                        disabled={readOnly}
                      />
                      <div className="sl-muted2" style={{ fontSize: 12 }}>
                        {value ? `Your rating: ${value}` : 'Select a rating'}
                      </div>
                    </Space>
                  ) : (
                    <Empty description="Unsupported question type" />
                  )}
                </div>

                <Divider style={{ margin: '14px 0 0' }} />
              </div>
            );
          })
        ) : (
          <Empty description="No questions in this form" />
        )}

        <Space wrap style={{ justifyContent: 'space-between' }}>
          <Button onClick={() => navigate('/dashboard/forms')}>Back</Button>

          {attempt?.status === ATTEMPT_STATUS.SUBMITTED ? (
            <Button
              type="primary"
              onClick={() => navigate(`/dashboard/attempts/${attempt.id}/result`)}
            >
              View result
            </Button>
          ) : (
            <Button type="primary" onClick={handleSubmit} loading={submitting} disabled={!attempt}>
              Submit
            </Button>
          )}
        </Space>
      </GlassCard>
    </div>
  );
}

