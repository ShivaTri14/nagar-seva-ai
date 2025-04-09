
import { useRef } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useScrollAnimation } from "@/lib/animations";

const faqs = [
  {
    question: "How do I file a new complaint?",
    answer: "You can file a new complaint by navigating to the Complaints section, clicking on 'File New Complaint', and filling out the required details. You can also attach images to help describe the issue better."
  },
  {
    question: "How long does it take to resolve a complaint?",
    answer: "Resolution time varies depending on the nature of the complaint. Water and electricity issues are typically resolved within 24-48 hours, while infrastructure-related complaints may take 3-7 days."
  },
  {
    question: "Can I track the status of my complaint?",
    answer: "Yes, you can track your complaint status using the 'Track Status' section. Enter your complaint ID or phone number to get real-time updates on your complaint."
  },
  {
    question: "How do I apply for a birth or death certificate?",
    answer: "Visit the Services section and select 'Certificates'. Fill the required form, upload necessary documents, and pay the applicable fee. You'll receive an acknowledgment and can track status online."
  },
  {
    question: "What payment methods are accepted for municipal taxes?",
    answer: "We accept online payments through credit/debit cards, UPI, net banking, and mobile wallets. You can also pay offline at designated municipal collection centers."
  },
  {
    question: "How can I contact the municipal helpdesk?",
    answer: "You can contact our helpdesk at 1800-xxx-xxxx (toll-free) or email us at help@prayagrajmc.gov.in. Our AI chatbot is also available 24/7 for immediate assistance."
  }
];

export default function FAQSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isVisible = useScrollAnimation(sectionRef, 0.1);
  
  return (
    <section ref={sectionRef} className="py-16 bg-white">
      <div className={`container mx-auto px-4 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="text-center mb-12">
          <h2 className="section-heading">Frequently Asked Questions</h2>
          <p className="section-subheading max-w-2xl mx-auto">
            Find quick answers to common questions about our municipal services
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg mb-4 shadow-sm">
                <AccordionTrigger className="px-4 hover:bg-municipal-primary/5 rounded-t-lg">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 pt-2 text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
