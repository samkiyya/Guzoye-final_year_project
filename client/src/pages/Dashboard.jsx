import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import DashUsers from "../components/DashUsers";
import DashboardComp from "../components/DashbordComponet";
import ManagerDashboard from "./manager/ManagerDashboard";

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  const [activePanelId, setActivePanelId] = useState(1); // Assuming 1 is the default panel ID

  useEffect(() => {
    if (location.state?.tab && location.state?.panelId) {
      setTab(location.state.tab);
      setActivePanelId(location.state.panelId);
    } else {
      const urlParams = new URLSearchParams(location.search);
      const tabFromUrl = urlParams.get("tab");
      if (tabFromUrl) {
        setTab(tabFromUrl);
      }
    }
  }, [location.search]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        {/* Sidebar */}
        <DashSidebar />
      </div>
      <div className="flex-1 p-4">
        {/* Conditionally render based on the current tab */}
        {tab === "profile" && <DashProfile activePanelId={activePanelId} />}
        {tab === "users" && <DashUsers />}
        {tab === "dash" && <DashboardComp />}
        {tab === "manager" && <ManagerDashboard />}
      </div>
    </div>
  );
}
