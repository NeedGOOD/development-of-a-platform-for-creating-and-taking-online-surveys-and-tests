import React, { useMemo, useState } from 'react';
import { Button, Empty, List, Space, Tag, Typography } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { ATTEMPT_STATUS, listAttempts } from '../testdata';
import { useAuth } from '../auth/AuthContext';
import { GlassCard } from '../components/GlassCard';

function statusTag(status) {
  if (status === ATTEMPT_STATUS.SUBMITTED) return <Tag color="green">Submitted</Tag>;
  return <Tag color="processing">In progress</Tag>;
}

export function AttemptsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [attempts, setAttempts] = useState(() => listAttempts({ userId: user.id }));

  const sorted = useMemo(() => {
    return [...attempts].sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt));
  }, [attempts]);

  function refresh() {
    setAttempts(listAttempts({ userId: user.id }));
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <GlassCard
        style={{ borderRadius: 20 }}
        bodyStyle={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 10,
        }}
      >
        <div>
          <Typography.Title level={4} style={{ margin: 0 }}>
            Attempts
          </Typography.Title>
          <div className="sl-muted2" style={{ fontSize: 12 }}>
            Your recent tests/surveys progress and results.
          </div>
        </div>

        <Button onClick={refresh}>Refresh</Button>
      </GlassCard>

      <GlassCard style={{ borderRadius: 20 }}>
        <List
          dataSource={sorted}
          locale={{
            emptyText: <Empty description="No attempts yet" />,
          }}
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
                    icon={<PlayCircleOutlined />}
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
                    <span style={{ fontWeight: 800 }}>{attempt.formTitle}</span>
                  </Space>
                }
                description={
                  <span className="sl-muted2">Started: {new Date(attempt.startedAt).toLocaleString()}</span>
                }
              />
            </List.Item>
          )}
        />
      </GlassCard>
    </div>
  );
}
