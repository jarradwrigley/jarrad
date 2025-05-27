"use client";

import MobileLayout from "../components/MobileLayout";
import DesktopLayout from "../components/DesktopLayout";
import DesktopShopPage from "../components/_ui/(desktop)/Shop";
import DesktopBlogPage from "../components/_ui/(desktop)/Blog";

export default function ShopPage() {
  return (
    <>
      <MobileLayout>
        {/* <MobileTourDatesPage /> */}

        <h2>🖥️ Mobile Blog</h2>
      </MobileLayout>

      <DesktopLayout>
        <DesktopBlogPage />
      </DesktopLayout>
    </>
  );
}
