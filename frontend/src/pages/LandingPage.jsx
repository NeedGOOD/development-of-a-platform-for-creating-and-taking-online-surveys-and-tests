import React from 'react';
import { Button, Col, Divider, Row, Space, Tag, Typography } from 'antd';
import { ArrowRightOutlined, FormOutlined, SafetyOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { GlassCard } from '../components/GlassCard';
import { Link } from "react-router-dom";

export function LandingPage() {
  return (
    <div className="sl-page sl-animateIn">
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} md={14}>
          <Space orientation="vertical" size={16} style={{ width: '100%' }}>
            <Space wrap size={8}>
              <Tag color="geekblue">React</Tag>
              <Tag color="cyan">Ant Design</Tag>
              <Tag color="gold">Tests</Tag>
              <Tag color="lime">Surveys</Tag>
            </Space>
            <Typography.Title className="sl-heroTitle" style={{ margin: 0, fontSize: 44, lineHeight: 1.05 }}>
              Платформа для створення та проходження онлайн-опитувань і тестів
            </Typography.Title>
            <Typography.Paragraph className="sl-muted" style={{ margin: 0, fontSize: 16 }}>
              Конструктор запитань, логіка оцінювання, таймери, збереження прогресу та аналітика результатів — в одному
              місці.
            </Typography.Paragraph>
            <Space wrap>
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <Button type="primary" size="large" icon={<ArrowRightOutlined />}>
                  Почати
                </Button>
              </Link>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <Button size="large">Увійти</Button>
              </Link>
            </Space>
          </Space>
        </Col>

        <Col xs={24} md={10}>
          <GlassCard
            title={<span style={{ fontWeight: 800 }}>Демо-доступ</span>}
            style={{ borderRadius: 18 }}
            bodyStyle={{ display: 'flex', flexDirection: 'column', gap: 10 }}
          >
            <div className="sl-muted2" style={{ fontSize: 13 }}>
              Це демонстраційний режим з локальним сховищем (Mock API). Ви можете одразу перевірити інтерфейс та логіку.
            </div>
            <Divider style={{ margin: '10px 0' }} />
            <div style={{ display: 'grid', gap: 10 }}>
              <div
                className="sl-glass"
                style={{ borderRadius: 16, padding: 12, background: 'rgba(255,255,255,.55)' }}
              >
                <div style={{ fontWeight: 800 }}>Викладач (Creator)</div>
                <div className="sl-muted2" style={{ fontSize: 12 }}>
                  email: <code>teacher@demo.com</code> · password: <code>demo1234</code>
                </div>
              </div>
              <div
                className="sl-glass"
                style={{ borderRadius: 16, padding: 12, background: 'rgba(255,255,255,.55)' }}
              >
                <div style={{ fontWeight: 800 }}>Студент (Student)</div>
                <div className="sl-muted2" style={{ fontSize: 12 }}>
                  email: <code>student@demo.com</code> · password: <code>demo1234</code>
                </div>
              </div>
            </div>
          </GlassCard>
        </Col>
      </Row>

      <Divider style={{ margin: '26px 0 18px' }} />

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <GlassCard
            style={{ borderRadius: 18 }}
            bodyStyle={{ display: 'flex', flexDirection: 'column', gap: 10 }}
            title={
              <Space>
                <ThunderboltOutlined />
                <span style={{ fontWeight: 800 }}>Логіка тестів</span>
              </Space>
            }
          >
            <div className="sl-muted">
              Підтримка одиночного/множинного вибору, текстових та числових відповідей, балів і часткового оцінювання.
            </div>
          </GlassCard>
        </Col>
        <Col xs={24} md={8}>
          <GlassCard
            style={{ borderRadius: 18 }}
            bodyStyle={{ display: 'flex', flexDirection: 'column', gap: 10 }}
            title={
              <Space>
                <FormOutlined />
                <span style={{ fontWeight: 800 }}>Конструктор</span>
              </Space>
            }
          >
            <div className="sl-muted">Секції, питання, опції, правильні відповіді, налаштування доступу та публікації.</div>
          </GlassCard>
        </Col>
        <Col xs={24} md={8}>
          <GlassCard
            style={{ borderRadius: 18 }}
            bodyStyle={{ display: 'flex', flexDirection: 'column', gap: 10 }}
            title={
              <Space>
                <SafetyOutlined />
                <span style={{ fontWeight: 800 }}>Збереження прогресу</span>
              </Space>
            }
          >
            <div className="sl-muted">Спроба зберігається по мірі заповнення; можна продовжити з того місця, де зупинились.</div>
          </GlassCard>
        </Col>
      </Row>
    </div>
  );
}

export default LandingPage;