import React, { useState, useEffect } from "react";
import { StoreProvider, useStore } from "./context/StoreContext";
import { Sidebar } from "./components/navigation/Sidebar";
import { Header } from "./components/navigation/Header";
import { Toast } from "./components/common/Toast";
import { CreateJobModal } from "./components/modals/CreateJobModal";

import { AuthView } from "./views/AuthView";
import { DashboardView } from "./views/DashboardView";
import { HrDashboardView } from "./views/HrDashboardView";
import { CandidateDashboardView } from "./views/CandidateDashboardView";
import { JobsListView } from "./views/JobsListView";
import { JobDetailView } from "./views/JobDetailView";
import { OpenRolesView } from "./views/OpenRolesView";
import { MyApplicationsView } from "./views/MyApplicationsView";
import { AnalyticsView } from "./views/AnalyticsView";
import { UsersManagementView } from "./views/UsersManagementView";
import { AuditLogsView } from "./views/AuditLogsView";
import { NotificationsView } from "./views/NotificationsView";
import { can } from "./constants/recruitmentData";

function AppShell() {
  const { state, dispatch } = useStore();
  const [view, setView] = useState("dashboard");
  const [showCreate, setShowCreate] = useState(false);

  // Set default view depending on logged in role
  useEffect(() => {
    if (state.role === "candidate") {
      setView("candidate_dashboard");
    } else if (state.role === "hr") {
      setView("hr_dashboard");
    } else {
      setView("dashboard");
    }
  }, [state.role, state.user]);

  if (!state.isAuthenticated) {
    return (
      <>
        <AuthView />
        <Toast toast={state.toast} onClear={() => dispatch({ type: "CLEAR_TOAST" })} />
      </>
    );
  }

  return (
    <div className="atlas-root" style={{ display: "flex", height: "100vh", width: "100%" }}>
      <Sidebar view={view} setView={setView} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Header view={view} />

        <main className="atlas-scroll" style={{ flex: 1, overflowY: "auto", padding: 26 }}>
          <div style={{ maxWidth: 1080, margin: "0 auto" }}>
            {view === "dashboard" && <DashboardView setView={setView} openCreate={() => setShowCreate(true)} />}
            {view === "hr_dashboard" && <HrDashboardView />}
            {view === "candidate_dashboard" && <CandidateDashboardView setView={setView} />}
            {view === "jobs" && <JobsListView setView={setView} openCreate={() => setShowCreate(true)} />}
            {view === "job_detail" && <JobDetailView setView={setView} />}
            {(view === "open_jobs" || view === "open_roles") && <OpenRolesView />}
            {view === "my_applications" && <MyApplicationsView />}
            {view === "analytics" && <AnalyticsView />}
            {view === "users" && <UsersManagementView />}
            {view === "audit_logs" && <AuditLogsView />}
            {view === "notifications" && <NotificationsView />}
          </div>
        </main>
      </div>

      {showCreate && <CreateJobModal onClose={() => setShowCreate(false)} />}
      <Toast toast={state.toast} onClear={() => dispatch({ type: "CLEAR_TOAST" })} />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppShell />
    </StoreProvider>
  );
}
