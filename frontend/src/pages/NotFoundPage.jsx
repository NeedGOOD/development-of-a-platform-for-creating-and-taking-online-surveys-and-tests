import React from 'react';
import { Button, Result } from 'antd';
import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="sl-page sl-animateIn" style={{ paddingTop: 30 }}>
      <Result
        status="404"
        title="404"
        subTitle="Сторінку не знайдено"
        extra={
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Button type="primary">На головну</Button>
          </Link>
        }
      />
    </div>
  );
}
