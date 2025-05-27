"use client";

import MobileLayout from "../components/MobileLayout";
import DesktopLayout from "../components/DesktopLayout";
import DesktopShopPage from "../components/_ui/(desktop)/Shop";

export default function ShopPage() {
  return (
    <>
      <MobileLayout>
        {/* <MobileTourDatesPage /> */}

        <h2>🖥️ Mobile Shop</h2>
      </MobileLayout>

      <DesktopLayout>
        <DesktopShopPage />
      </DesktopLayout>
    </>
  );
}
