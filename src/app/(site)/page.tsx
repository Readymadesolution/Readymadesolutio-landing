import Hero from "@/components/home/Hero";
import LogosStrip from "@/components/home/LogosStrip";
import Products from "@/components/home/Products";
import WhoWeAre from "@/components/home/WhoWeAre";
import Testimonials from "@/components/home/Testimonials";
import Process from "@/components/home/Process";
import CtaBand from "@/components/home/CtaBand";

/* Section gaps match the Figma frame: 56 above hero, 32 hero->logos,
   32 logos->products, then 104 between the remaining sections. */
const Spacer = ({ h }: { h: number }) => (
  <div style={{ height: h }} aria-hidden="true" />
);

export default function Home() {
  return (
    <div className="bg-white">
      <Spacer h={56} />
      <Hero />
      <Spacer h={32} />
      <LogosStrip />
      <Spacer h={32} />
      <Products />
      <Spacer h={104} />
      <WhoWeAre />
      <Spacer h={104} />
      <Testimonials />
      <Spacer h={104} />
      <Process />
      <Spacer h={104} />
      <CtaBand />
    </div>
  );
}
