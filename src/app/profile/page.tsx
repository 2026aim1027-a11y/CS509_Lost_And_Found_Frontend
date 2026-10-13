import type { Metadata } from "next";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import ProfileView from "@/components/profile/ProfileView";

export const metadata: Metadata = {
  title: "My profile",
};

export default function ProfilePage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <ProfileView />
      <Footer />
    </div>
  );
}
