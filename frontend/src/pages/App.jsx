import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SiteHeader from '../components/Header';
import LoginPage from './Autharization/LoginPage';
import { LandingPage } from './LandingPage';
import { RegisterPage } from './Autharization/RegisterPage'
import { NotFoundPage } from './NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteHeader />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}