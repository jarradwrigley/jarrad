"use client";

import MobileLayout from "../components/MobileLayout";
import DesktopLayout from "../components/DesktopLayout";
import DesktopContactPage from "../components/_ui/(desktop)/Contact";

export default function ContactPage() {
  return (
    <>
      <MobileLayout>
        {/* <MobileTourDatesPage /> */}

        <h2>🖥️ Mobile Contact</h2>
      </MobileLayout>

      <DesktopLayout>
        <DesktopContactPage />
      </DesktopLayout>
    </>
  );
}
