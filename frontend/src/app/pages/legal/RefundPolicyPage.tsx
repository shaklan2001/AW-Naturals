import { Link } from 'react-router';
import { LegalDocumentShell } from './LegalDocumentShell';

const EMAIL = 'care@awnaturals.in';

export function RefundPolicyPage() {
  return (
    <LegalDocumentShell
      title="Refund & cancellation policy"
      description="How refunds, returns, and cancellations work for orders placed through AW Naturals."
    >
      <h2>1. Overview</h2>
      <p>
        We want you to be satisfied with your purchase. This policy explains when you may cancel an order, return a
        product, or request a refund, and how to contact us.
      </p>

      <h2>2. Order cancellation</h2>
      <p>
        If your order has not yet shipped, you may request cancellation by emailing{' '}
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a> with your order number. We will confirm whether cancellation is possible.
        Once an order has shipped, cancellation may no longer be available; you may instead follow the returns process
        below where eligible.
      </p>

      <h2>3. Returns &amp; eligibility</h2>
      <p>To be eligible for a return or refund (where applicable), items generally must:</p>
      <ul>
        <li>Be unused, unopened, and in original packaging where hygiene or safety requires it;</li>
        <li>Be returned within the timeframe we specify when you request a return (typically within 7–14 days of
          delivery, unless a longer period is required by law);</li>
        <li>Include proof of purchase (order number or receipt).</li>
      </ul>
      <p>
        Certain items (e.g. opened consumables, personalised goods, or clearance items marked as non-returnable) may
        not be eligible for return except where required by law or if the product is defective.
      </p>

      <h2>4. Defective or damaged products</h2>
      <p>
        If you receive a damaged, defective, or incorrect item, contact us within 48 hours of delivery with photos and
        your order number. We will arrange a replacement, repair, or refund as appropriate.
      </p>

      <h2>5. Refund method &amp; timing</h2>
      <p>
        Approved refunds are processed to the original payment method where possible. Depending on your bank or payment
        provider, refunds may take several business days to appear. We are not responsible for delays caused by
        financial institutions.
      </p>

      <h2>6. Shipping costs for returns</h2>
      <p>
        Unless the return is due to our error or a defective product, return shipping may be your responsibility. We
        will confirm return instructions and any applicable fees when you contact support.
      </p>

      <h2>7. Digital services &amp; consultations</h2>
      <p>
        For paid digital services, tele-consultations, or bookings, cancellation and refund terms may be communicated
        at the time of purchase. Unless otherwise stated, fees for completed sessions may be non-refundable.
      </p>

      <h2>8. Chargebacks</h2>
      <p>
        If you have an issue with your order, please contact us first so we can resolve it. Initiating a chargeback
        without contacting us may delay resolution.
      </p>

      <h2>9. Consumer rights</h2>
      <p>
        Nothing in this policy limits any statutory rights you may have as a consumer under applicable law in India
        or your jurisdiction.
      </p>

      <h2>10. Contact</h2>
      <p>
        For returns, refunds, or cancellations: <a href={`mailto:${EMAIL}`}>{EMAIL}</a>. You can also reach us via the{' '}
        <Link to="/contact">Contact</Link> page.
      </p>
    </LegalDocumentShell>
  );
}
