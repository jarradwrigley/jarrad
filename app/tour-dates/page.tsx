"use client";

import MobileLayout from "../components/MobileLayout";
import DesktopLayout from "../components/DesktopLayout";

export default function DashboardPage() {
  return (
    <>
      <MobileLayout>
        {/* <MobileTourDatesPage /> */}

        <h2>🖥️ Mobile Dashboard</h2>
      </MobileLayout>

      <DesktopLayout>
        <h2>🖥️ Desktop Dashboard</h2>
      </DesktopLayout>
    </>
  );
}
