import { LegalDocumentShell } from './LegalDocumentShell';

const EMAIL = 'care@awnaturals.in';

export function AccessibilityPage() {
  return (
    <LegalDocumentShell
      title="Accessibility statement"
      description="Our commitment to making the AW Naturals website usable for as many people as possible."
    >
      <h2>1. Our commitment</h2>
      <p>
        AW Naturals is committed to improving the accessibility of our website. We aim to meet reasonable standards for
        perceivable, operable, understandable, and robust content, aligned with WCAG 2.1 Level AA where practicable,
        as we continue to iterate on design and engineering.
      </p>

      <h2>2. What we are doing</h2>
      <ul>
        <li>Semantic HTML and meaningful headings to support screen readers and keyboard navigation;</li>
        <li>Sufficient colour contrast for core text and interactive elements on key pages;</li>
        <li>Visible focus states on interactive controls where we control styles;</li>
        <li>Text alternatives for informative images where provided in code;</li>
        <li>Responsive layouts that scale across common viewport sizes.</li>
      </ul>

      <h2>3. Known limitations</h2>
      <p>
        Some third-party embeds (for example payment or analytics widgets) may not fully meet the same accessibility
        standards as our first-party pages. We select partners with care and welcome feedback if you encounter barriers.
      </p>

      <h2>4. Assistive technology</h2>
      <p>
        Our site is tested periodically with keyboard-only navigation and common browser zoom levels. We recommend using
        the latest versions of Chrome, Safari, Firefox, or Edge for the best experience.
      </p>

      <h2>5. Feedback &amp; assistance</h2>
      <p>
        If you have difficulty accessing any part of our website, or suggestions for improvement, please email{' '}
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a> with “Accessibility” in the subject line and, if possible, the page URL and
        a short description of the issue. We will try to respond within a reasonable time and work with you on
        alternatives where we can.
      </p>

      <h2>6. Ongoing improvements</h2>
      <p>
        Accessibility is an ongoing effort. As we ship new features and pages, we will continue to review contrast,
        focus order, form labels, and media alternatives. This statement may be updated as our practices evolve.
      </p>
    </LegalDocumentShell>
  );
}
