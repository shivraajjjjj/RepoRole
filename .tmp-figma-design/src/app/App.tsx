import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { HowItWorks } from "./components/HowItWorks";
import { Samples } from "./components/Samples";
import { AboutUs } from "./components/AboutUs";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <div
      className="min-h-screen"
      style={{
        background: "#07071a",
        color: "#e2e4ef",
        fontFamily: "'Inter', sans-serif",
        scrollBehavior: "smooth",
      }}
    >
      <Navbar />
      <Hero />
      <HowItWorks />
      <Samples />
      <AboutUs />
      <Footer />
    </div>
  );
}
