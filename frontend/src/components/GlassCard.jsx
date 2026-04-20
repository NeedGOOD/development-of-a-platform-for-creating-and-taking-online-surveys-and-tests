import React from 'react';
import { Card } from 'antd';

export function GlassCard({ style, bodyStyle, ...rest }) {
  const nextStyles = {
    ...(rest.styles || {}),
    body: {
      ...((rest.styles || {}).body || {}),
      ...(bodyStyle || {}),
    },
  };
  return (
    <Card
      {...rest}
      styles={nextStyles}
      style={{
        ...(style || {}),
        background: 'var(--sl-surface)',
        border: '1px solid var(--sl-stroke)',
        boxShadow: 'var(--sl-shadow-soft)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    />
  );
}
