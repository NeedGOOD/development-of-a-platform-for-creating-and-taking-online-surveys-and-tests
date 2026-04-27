import React from 'react';
import { Typography } from 'antd';

export function Brand({ compact = false }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span
        style={{
          width: 50,
          height: 50,
          borderRadius: 12,
          display: 'inline-block',
          background:
            'conic-gradient(from 220deg, rgba(14,165,233,1), rgba(20,184,166,1), rgba(253,230,138,1), rgba(14,165,233,1))',
          boxShadow: '0 10px 22px rgba(14,165,233,.18)',
          border: '1px solid rgba(11,18,32,.08)',
          position: 'relative',
          top: 2,
        }}
      />
      <div style={{ lineHeight: 2 }}>
        <Typography.Text style={{ fontWeight: 800, fontSize: compact ? 16 : 18 }}>
          DIPLOMA NAME
        </Typography.Text>
        {!compact ? (
          <div style={{ fontSize: 12, color: 'rgba(11,18,32,.55)' }}>Surveys & tests</div>
        ) : null}
      </div>
    </div>
  );
}
