import CallToAction from "@/components/landing/CallToAction";
import CategoryMarquee from "@/components/landing/CategoryMarquee";
import FeedPreview from "@/components/landing/FeedPreview";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import Safety from "@/components/landing/Safety";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <CategoryMarquee />
        <HowItWorks />
        <FeedPreview />
        <Safety />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}
