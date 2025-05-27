"use client";

import MobileLayout from "../components/MobileLayout";
import DesktopLayout from "../components/DesktopLayout";
import DesktopTourDatesPage from "../components/_ui/(desktop)/TourDates";

export default function TourDatesPage() {
  return (
    <>
      <MobileLayout>
        {/* <MobileTourDatesPage /> */}

        <h2>🖥️ Mobile Dashboard</h2>
      </MobileLayout>

      <DesktopLayout>
        <DesktopTourDatesPage />
      </DesktopLayout>
    </>
  );
}
