import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SiteHeader from "../components/Header";
import AppLayout from "../components/AppLayout";
import LoginPage from "./Autharization/LoginPage";
import { LandingPage } from "./LandingPage";
import { RegisterPage } from "./Autharization/RegisterPage";
import { NotFoundPage } from "./NotFoundPage";
import { DashboardPage } from "./DashboardPage";
import { MyFormsPage } from "./MyForms";
import { ProfilePage } from "./Profile";
import { RequireAuth } from "../auth/RequireAuth";
import { AttemptsPage } from "./AttemptsPage";
import { AttemptResultPage } from "./AttemptResultPage";
import { FormTakePage } from "./FormTakePage";
import { FormCreatePage } from "./FormCreatePage";
import { FormEditorPage } from "./FormEditorPage";
import { FormAnalyticsPage } from "./FormAnalyticsPage";

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
        <Route
          element={
            <RequireAuth>
              <AppLayout />
            </RequireAuth>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/forms" element={<MyFormsPage />} />
          <Route path="/dashboard/forms/new" element={<FormCreatePage />} />
          <Route path="/dashboard/forms/:formId/edit" element={<FormEditorPage />} />
          <Route path="/dashboard/forms/:formId/take" element={<FormTakePage />} />
          <Route path="/dashboard/forms/:formId/analytics" element={<FormAnalyticsPage />} />
          <Route path="/dashboard/attempts" element={<AttemptsPage />} />
          <Route
            path="/dashboard/attempts/:attemptId/result"
            element={<AttemptResultPage />}
          />
          <Route path="/dashboard/profile" element={<ProfilePage />} />
          <Route path="/dashboard/*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
