import { LegalDocumentShell } from './LegalDocumentShell';

const EMAIL = 'care@awnaturals.in';

export function PrivacyPolicyPage() {
  return (
    <LegalDocumentShell
      title="Privacy Policy"
      description="How AW Naturals collects, uses, and protects your personal information when you use our website and services."
    >
      <h2>1. Who we are</h2>
      <p>
        AW Naturals (“we”, “us”, “our”) operates this website and related wellness services. For privacy questions,
        contact us at{' '}
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
      </p>

      <h2>2. Information we collect</h2>
      <p>We may collect the following categories of information:</p>
      <ul>
        <li>
          <strong>Account &amp; contact details</strong> — name, email address, phone number, and shipping address when
          you register, place an order, or contact us.
        </li>
        <li>
          <strong>Order &amp; transaction data</strong> — products purchased, payment status (processed by our payment
          partners; we do not store full card numbers on our servers), and delivery information.
        </li>
        <li>
          <strong>Technical &amp; usage data</strong> — IP address, browser type, device information, and cookies or
          similar technologies used to keep the site secure and improve performance.
        </li>
        <li>
          <strong>Communications</strong> — messages you send to support or through forms on the site.
        </li>
      </ul>

      <h2>3. How we use your information</h2>
      <p>We use personal information to:</p>
      <ul>
        <li>Process and fulfil orders, payments, and deliveries;</li>
        <li>Provide customer support and respond to enquiries;</li>
        <li>Maintain account security and prevent fraud;</li>
        <li>Comply with legal obligations;</li>
        <li>Improve our website, products, and services (including aggregated or de-identified analytics where
          appropriate).</li>
      </ul>

      <h2>4. Legal basis (where applicable)</h2>
      <p>
        Depending on context, we rely on performance of a contract (e.g. fulfilling your order), legitimate interests
        (e.g. fraud prevention, service improvement), consent (e.g. certain marketing cookies, where required), or
        legal obligation.
      </p>

      <h2>5. Sharing of information</h2>
      <p>
        We may share information with trusted service providers who assist us (for example: payment processors,
        shipping partners, hosting, and email). They may only use your data as instructed by us and for the purposes
        described here. We may also disclose information if required by law or to protect our rights and the safety of
        our users.
      </p>

      <h2>6. Data retention</h2>
      <p>
        We retain personal data only as long as needed for the purposes above, including legal, accounting, or reporting
        requirements. Retention periods vary by data type and context.
      </p>

      <h2>7. Your rights</h2>
      <p>
        Subject to applicable law, you may have the right to access, correct, delete, or restrict processing of your
        personal data, or to object to certain processing. You may also have the right to lodge a complaint with a
        supervisory authority. To exercise your rights, email{' '}
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
      </p>

      <h2>8. Security</h2>
      <p>
        We implement appropriate technical and organisational measures to protect your information. No method of
        transmission over the internet is 100% secure; we encourage you to use strong passwords and protect your
        account credentials.
      </p>

      <h2>9. Children</h2>
      <p>
        Our services are not directed at children under 16. We do not knowingly collect personal information from
        children. If you believe we have done so, please contact us and we will take steps to delete it.
      </p>

      <h2>10. Changes</h2>
      <p>
        We may update this Privacy Policy from time to time. The “Last updated” date at the top will change when we
        do. Continued use of the site after changes constitutes acceptance of the updated policy where permitted by law.
      </p>
    </LegalDocumentShell>
  );
}
