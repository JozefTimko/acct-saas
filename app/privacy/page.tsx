import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Workpaperly",
  description:
    "How Workpaperly collects, uses, and protects personal data under the UK GDPR and Data Protection Act 2018.",
  robots: { index: true, follow: true },
};

export default function Privacy() {
  return (
    <main className="prose prose-slate mx-auto max-w-3xl px-6 py-10">
      <h1>Privacy Policy — Workpaperly</h1>
      <p><strong>Effective date:</strong> 28 August 2025</p>
      <p>
        <strong>Who we are:</strong> “Workpaperly” is operated in the United
        Kingdom by <strong>Jozef</strong>.<br />
        <strong>Contact:</strong>{" "}
        <a href="mailto:jozef@workpaperly.com">jozef@workpaperly.com</a>
      </p>
      <p>
        We respect your privacy. This policy explains what personal data we
        collect, how we use it, and your rights under the UK GDPR and the Data
        Protection Act 2018.
      </p>

      <h2 id="controller">1) Controller</h2>
      <p>
        For the purposes of data protection law, <strong>Jozef</strong> (trading
        as Workpaperly) is the <strong>data controller</strong> for personal
        data collected via this website and any early-access/demo requests. If
        you later use our software to generate workpapers with your clients’
        accounting data, we generally act as your <strong>processor</strong> for
        that client data.
      </p>

      <h2 id="data-we-collect">2) Data we collect</h2>
      <ul>
        <li>
          <strong>Contact/enquiry data:</strong> your name, work email, company,
          and any message you send via our forms.
        </li>
        <li>
          <strong>Customer content (product users):</strong> data you upload or
          connect in order to generate workpapers (for example, trial balance,
          journals, nominal codes) and the resulting outputs (e.g., Excel
          workpaper packs).
        </li>
        <li>
          <strong>Technical data:</strong> basic information collected when you
          visit the site, such as pages viewed, referrers, and general
          device/browser information.
        </li>
        <li>
          <strong>Support data:</strong> information you provide when you
          contact us for help.
        </li>
      </ul>

      <h2 id="sources">3) Where the data comes from</h2>
      <ul>
        <li>Directly from you (forms, emails, in-product actions).</li>
        <li>From systems you choose to connect (if you enable integrations).</li>
        <li>
          From our hosting and form providers (e.g., service logs necessary to
          run the site).
        </li>
      </ul>

      <h2 id="purposes">4) How we use your data &amp; lawful bases</h2>
      <ul>
        <li>
          <strong>Provide the website and service</strong> (e.g., generate
          workpapers, keep the service running and secure).{" "}
          <em>Lawful basis:</em> <strong>contract necessity</strong> (when
          you’re a user) and <strong>legitimate interests</strong> (operate a
          reliable service).
        </li>
        <li>
          <strong>AI-assisted features</strong> (draft schedules/notes, surface
          anomalies) within the product. <em>Lawful basis:</em>{" "}
          <strong>contract necessity/legitimate interests</strong>.{" "}
          <strong>Human in the loop:</strong> outputs are drafts for your
          review; we do <strong>not</strong> make solely automated decisions
          with legal or similarly significant effects.
        </li>
        <li>
          <strong>Respond to enquiries and provide support.</strong>{" "}
          <em>Lawful basis:</em> <strong>legitimate interests</strong> (customer
          service) or <strong>contract necessity</strong> if you’re a user.
        </li>
        <li>
          <strong>Product improvement &amp; basic analytics</strong> (aggregate
          usage patterns, performance). <em>Lawful basis:</em>{" "}
          <strong>legitimate interests</strong>; consent will be sought for any
          non-essential cookies.
        </li>
        <li>
          <strong>Legal compliance</strong> (record-keeping, responding to
          lawful requests). <em>Lawful basis:</em>{" "}
          <strong>legal obligation</strong>.
        </li>
      </ul>

      <h2 id="ai">5) AI processing</h2>
      <p>
        We use AI models to draft or suggest content inside your workpapers (for
        example, lead schedules or variance notes). We do <strong>not</strong>{" "}
        use your customer content to train our models beyond providing the
        service to you. AI may run on Workpaperly infrastructure and/or trusted
        providers; access is restricted and data are encrypted in transit.
        Outputs are for your review and approval.
      </p>

      <h2 id="cookies">6) Cookies</h2>
      <p>
        We use <strong>essential</strong> cookies that are necessary to operate
        the site. If we introduce non-essential analytics or marketing cookies,
        we will present a cookie banner so you can accept or reject them.
      </p>

      <h2 id="sharing">7) Who we share data with</h2>
      <p>
        We do <strong>not</strong> sell your personal data. We share it only
        with trusted service providers who help us run the website and service,
        under contract:
      </p>
      <ul>
        <li>
          <strong>Hosting &amp; deployment:</strong> Vercel
        </li>
        <li>
          <strong>Database/auth (if used in the product):</strong> Supabase
        </li>
        <li>
          <strong>Forms (contact/demo requests):</strong> Formspree
        </li>
      </ul>
      <p>
        If you enable integrations (for example, connecting your accounting
        platform), we process the data you authorise within those scopes. We may
        share data with professional advisers or authorities where necessary
        (e.g., legal compliance) or in a business transfer with appropriate
        safeguards.
      </p>

      <h2 id="transfers">8) International transfers</h2>
      <p>
        Some providers may process data outside the UK/EEA. Where this occurs,
        we use appropriate safeguards such as{" "}
        <strong>Standard Contractual Clauses</strong> (with the UK
        Addendum/IDTA where relevant) and additional measures where necessary.
      </p>

      <h2 id="retention">9) Retention</h2>
      <ul>
        <li>
          <strong>Customer content (workpapers, journals/TB):</strong> kept
          while your account is active and for a default period of{" "}
          <strong>7 years</strong> to support year-end records, unless you
          delete sooner.
        </li>
        <li>
          <strong>Contact/enquiry data:</strong> typically kept for{" "}
          <strong>24 months</strong>.
        </li>
        <li>
          <strong>Backups:</strong> retained for a limited period before
          automatic purge.
        </li>
      </ul>
      <p>You can request deletion at any time (see your rights below).</p>

      <h2 id="security">10) Security</h2>
      <p>
        We apply appropriate technical and organisational measures, including
        encryption in transit, access controls and environment segregation. No
        system is 100% secure; we maintain incident-response processes and will
        notify you and the UK Information Commissioner’s Office (ICO)/affected
        users where required by law.
      </p>

      <h2 id="rights">11) Your rights (UK GDPR)</h2>
      <p>
        You have rights to <strong>access</strong>, <strong>rectify</strong>,{" "}
        <strong>erase</strong>, <strong>restrict</strong>, and{" "}
        <strong>object</strong> to processing; to{" "}
        <strong>data portability</strong>; and to{" "}
        <strong>withdraw consent</strong> where processing is based on consent.
        To exercise your rights, email{" "}
        <a href="mailto:jozef@workpaperly.com">jozef@workpaperly.com</a>. You
        may also complain to the UK regulator, the{" "}
        <a href="https://ico.org.uk" target="_blank" rel="noreferrer">
          ICO
        </a>
        .
      </p>

      <h2 id="children">12) Children</h2>
      <p>
        Our website and service are not directed to children under 16, and we do
        not knowingly collect their data.
      </p>

      <h2 id="links">13) Third-party links</h2>
      <p>
        If we link to other sites, their privacy practices are their own; please
        review their policies.
      </p>

      <h2 id="changes">14) Changes to this policy</h2>
      <p>
        We may update this policy from time to time. We will post changes here
        and update the effective date. If the changes are significant, we will
        notify you via the site or email.
      </p>

      <h2 id="contact">15) Contact</h2>
      <p>
        Questions or requests:{" "}
        <a href="mailto:jozef@workpaperly.com">jozef@workpaperly.com</a>
      </p>
    </main>
  );
}