import Navbar from "@/components/Navbar";
import BioSection from "@/components/BioSection";
import NewsSection from "@/components/NewsSection";
import PublicationsSection from "@/components/PublicationsSection";
import NotesSection from "@/components/NotesSection";
import ServicesSection from "@/components/ServicesSection";
import AwardsSection from "@/components/AwardsSection";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <BioSection />
        <NewsSection />
        <PublicationsSection />
        <NotesSection />
        <ServicesSection />
        <AwardsSection />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
