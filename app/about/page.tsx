"use client";

import MobileLayout from "../components/MobileLayout";
import DesktopLayout from "../components/DesktopLayout";
import DesktopTourDatesPage from "../components/_ui/(desktop)/TourDates";
import DesktopAboutPage from "../components/_ui/(desktop)/About";

export default function AboutPage() {
  return (
    <>
      <MobileLayout>
        {/* <MobileTourDatesPage /> */}

        <h2>🖥️ Mobile Dashboard</h2>
      </MobileLayout>

      <DesktopLayout>
        <DesktopAboutPage />
      </DesktopLayout>
    </>
  );
}
