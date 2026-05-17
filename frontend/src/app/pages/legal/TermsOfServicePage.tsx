import { Link } from 'react-router';
import { LegalDocumentShell } from './LegalDocumentShell';

const EMAIL = 'care@awnaturals.in';

export function TermsOfServicePage() {
  return (
    <LegalDocumentShell
      title="Terms of Service"
      description="Rules and conditions for using the AW Naturals website, purchasing products, and engaging with our services."
    >
      <h2>1. Acceptance</h2>
      <p>
        By accessing or using the AW Naturals website (the “Site”), creating an account, or placing an order, you agree
        to these Terms of Service. If you do not agree, please do not use the Site.
      </p>

      <h2>2. Eligibility</h2>
      <p>
        You must be at least the age of majority in your jurisdiction to use the Site and purchase products. You
        represent that the information you provide is accurate and complete.
      </p>

      <h2>3. Products &amp; orders</h2>
      <p>
        Product descriptions, images, and prices are provided in good faith. We reserve the right to correct errors,
        refuse or cancel orders (including after confirmation) where pricing or availability was listed incorrectly, or
        where we suspect fraud. Orders are subject to acceptance and stock availability.
      </p>

      <h2>4. Pricing &amp; payment</h2>
      <p>
        Prices are displayed in Indian Rupees (INR) unless stated otherwise. Taxes and shipping, if applicable, will
        be shown at checkout. Payments are processed by our third-party payment provider; their terms may also apply.
      </p>

      <h2>5. Shipping &amp; risk</h2>
      <p>
        Shipping timelines are estimates. Risk of loss for physical goods passes in accordance with our carrier’s
        terms and applicable law once the order is handed to the carrier, unless we specify otherwise.
      </p>

      <h2>6. Wellness &amp; medical disclaimer</h2>
      <p>
        Our products and content are for general wellness and educational purposes. They are not intended to diagnose,
        treat, cure, or prevent any disease. Always consult a qualified healthcare professional before starting any
        new supplement or regimen, especially if you are pregnant, nursing, or have a medical condition.
      </p>

      <h2>7. Intellectual property</h2>
      <p>
        All content on the Site (including text, graphics, logos, and design) is owned by AW Naturals or its licensors
        and is protected by intellectual property laws. You may not copy, modify, or distribute our content without
        prior written permission, except as allowed by law for personal, non-commercial use.
      </p>

      <h2>8. Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Use the Site for any unlawful purpose or in violation of any laws;</li>
        <li>Attempt to gain unauthorised access to our systems, other users’ accounts, or data;</li>
        <li>Interfere with the proper working of the Site or impose an unreasonable load on our infrastructure;</li>
        <li>Use automated means to scrape or harvest data without our consent.</li>
      </ul>

      <h2>9. Limitation of liability</h2>
      <p>
        To the fullest extent permitted by applicable law, AW Naturals and its affiliates will not be liable for any
        indirect, incidental, special, consequential, or punitive damages, or for loss of profits or data, arising from
        your use of the Site or products. Our total liability for any claim relating to the Site or an order is
        limited to the amount you paid us for that order, except where liability cannot be limited by law.
      </p>

      <h2>10. Indemnity</h2>
      <p>
        You agree to indemnify and hold harmless AW Naturals from claims, damages, or expenses arising from your
        violation of these Terms or misuse of the Site, to the extent permitted by law.
      </p>

      <h2>11. Governing law &amp; disputes</h2>
      <p>
        These Terms are governed by the laws of India, without regard to conflict-of-law rules. Courts at Mumbai,
        Maharashtra shall have exclusive jurisdiction, subject to any mandatory consumer protections in your place of
        residence.
      </p>

      <h2>12. Changes</h2>
      <p>
        We may update these Terms from time to time. The updated version will be posted on the Site with a new “Last
        updated” date. Material changes may be communicated where required by law.
      </p>

      <h2>13. Contact</h2>
      <p>
        Questions about these Terms? Email{' '}
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a> or visit our{' '}
        <Link to="/contact">Contact</Link> page.
      </p>
    </LegalDocumentShell>
  );
}
