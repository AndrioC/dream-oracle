import HeroSection from '@/components/site/hero-section';
import ConceptExplanation from '@/components/site/concept-explanation-section';
import BenefitsSection from '@/components/site/benefits-section';
import HowItWorks from '@/components/site/how-it-works-section';
import DreamExamples from '@/components/site/dream-examples-section';
import PricingPlans from '@/components/site/pricing-plans-section';
import FAQSection from '@/components/site/faq-section';
import ContactSection from '@/components/site/contact-section';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ConceptExplanation />
      <BenefitsSection />
      <HowItWorks />
      <DreamExamples />
      <PricingPlans />
      <FAQSection />
      <ContactSection />
    </main>
  );
}
