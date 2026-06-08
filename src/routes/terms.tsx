import { createFileRoute } from "@tanstack/react-router";
import { CustomerLayout } from "@/components/CustomerLayout";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — Asari Bouquet & Flower" },
      { name: "description", content: "Syarat dan ketentuan pemesanan di Asari Bouquet & Flower." },
    ],
  }),
  component: Terms,
});

function Terms() {
  return (
    <CustomerLayout>
      <div className="max-w-3xl mx-auto px-6 py-20">
        <h1 className="font-display text-5xl text-center mb-10">Terms &amp; Conditions</h1>
        <div className="space-y-10 text-sm text-[var(--asari-charcoal)] leading-relaxed">

          <Group title="Order Rules">
            <Section title="Order Placement">
              Please place your orders at least two days in advance (D-2) or as specified in our Open Order announcements.
            </Section>
            <Section title="Availability">
              Last-minute orders are only accepted for ready-stock flowers.
            </Section>
            <Section title="Custom Orders">
              We highly recommend placing custom orders well in advance.
            </Section>
            <Section title="Purchasing Channels">
              Orders are exclusively processed via Instagram Direct Message (DM) or WhatsApp.
            </Section>
            <Section title="Location & Operations">
              We are based in Antapani, Bandung City. Please note that we operate exclusively online and <strong>do not have a physical storefront</strong>.
            </Section>
            <Section title="Customer Service">
              Please expect delayed responses to messages sent outside of business hours or on holidays.
            </Section>
            <Section title="Updates">
              Please refer to our Instagram Story for the latest information and updates.
            </Section>
          </Group>

          <Group title="Payment">
            <Section title="Order Processing">
              Orders will only be added to our queue upon receipt of full payment or a down payment (DP).
            </Section>
            <Section title="Payment Method">
              We strictly accept payments via bank transfer.
            </Section>
            <Section title="Proof of Payment">
              Customers are required to send proof of payment via chat to verify their transaction.
            </Section>
            <Section title="Down Payments (DP)">
              A minimum 50% DP applies to purchases of IDR 100,000 and above. For orders below IDR 100,000, the DP amount will be adjusted accordingly.
            </Section>
          </Group>

          <Group title="Pickup & Delivery Rules">
            <Section title="Schedule Changes">
              If you need to change your pickup day or time, please notify our admin immediately via chat.
            </Section>
            <Section title="Early Pickup">
              Bouquets cannot be collected earlier than the scheduled time specified in your order format without prior confirmation from our admin.
            </Section>
            <Section title="Collection Methods">
              You may opt for self-pickup or arrange your own courier service.
            </Section>
            <Section title="Store Delivery Arrangement">
              If you are ordering from outside Bandung, we can help arrange a delivery driver for you. Please ensure the recipient's contact number remains active throughout the delivery process.
            </Section>
            <Section title="Service Area Coverage">
              We exclusively serve Bandung and its surrounding areas. Due to the delicate nature of fresh flowers, out-of-town shipping is not available.
            </Section>
          </Group>

          <Group title="Disclaimer">
            <Section title="Order Forms">
              Customers are requested to fill out the order form clearly and completely. If there are any revisions, please notify us immediately.
            </Section>
            <Section title="Liability">
              We are not responsible for any errors resulting from unclear or incomplete order details provided by the customer.
            </Section>
            <Section title="Order Confirmation">
              Submitting the order form confirms that your order is final, and prompt payment is required.
            </Section>
            <Section title="Handcrafted Nature">
              Because our arrangements are handcrafted and the natural proportions of flowers vary, no two arrangements will ever be exactly identical.
            </Section>
            <Section title="Reference Photos">
              We will do our absolute best to match catalog or reference photos, but exact replication is not possible. We also accept custom requests and external reference photos, but we cannot replicate them 100% as we do not plagiarize other florists' work.
            </Section>
            <Section title="Substitutions">
              Flower availability is subject to change, so placing orders several days in advance is highly recommended. If a specific flower in your arrangement is unavailable, we will notify you and substitute it with a similar flower of equal value.
            </Section>
            <Section title="Lifespan">
              Our flowers typically stay fresh for ± 3-4 days. For example, picking up your bouquet the day before your event (D-1) is perfectly safe.
            </Section>
            <Section title="Care Instructions">
              While we cannot guarantee the exact lifespan of the flowers, keeping them in a cool place and away from direct sunlight or heat will significantly prolong their freshness.
            </Section>
            <Section title="Refund Policy">
              All sales are final. Purchased items cannot be returned or refunded.
            </Section>
            <Section title="Revision Surcharge">
              Any design revisions requested after the arrangement is completed may incur a 25% surcharge of the product price (unless the error was made by our team).
            </Section>
            <Section title="Safe Transport">
              For safety reasons, customers picking up more than one Large (Size L) bouquet are strictly required to use a car.
            </Section>
          </Group>

        </div>
      </div>
    </CustomerLayout>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h2 className="font-display text-2xl text-[var(--asari-charcoal)] border-b border-[var(--asari-blush-light)] pb-2">{title}</h2>
      {children}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-display text-base text-[var(--asari-gold)] mb-1">{title}</h3>
      <p>{children}</p>
    </div>
  );
}