export const metadata = {
  title: 'Privacy Policy',
  description: 'Logotham Privacy Policy',
}

export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-3xl py-8">
      <h1 className="text-3xl font-bold mb-6">Logotham Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-8">Effective 16 December 2025</p>

      <p className="mb-4">
        Logotham (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) operates the logo builder available at{' '}
        <a href="https://logotham.app" className="underline">
          https://logotham.app
        </a>
        . This policy explains what information we collect through the product, how we use it, and the options you have.
      </p>

      <h2 className="text-2xl font-semibold mb-4 mt-8">1. Information We Collect</h2>

      <h3 className="text-xl font-medium mb-2 mt-6">Account & Authentication Data</h3>
      <ul className="list-disc list-inside mb-4 pl-4">
        <li>Name, email, avatar, provider IDs, OAuth tokens, and verification status required by Better Auth.</li>
        <li>Session metadata (session ID, expiry, IP, user agent) stored in the sessions table.</li>
      </ul>

      <h3 className="text-xl font-medium mb-2 mt-6">Social Logins</h3>
      <p className="mb-4">
        If you sign in with Google or GitHub, we receive the basic profile details those providers supply. We never see your social passwords.
      </p>

      <h3 className="text-xl font-medium mb-2 mt-6">Subscription & Billing Data</h3>
      <p className="mb-4">
        Stripe customer IDs, subscription IDs, plan name, price ID, quantity, status, and cancellation flags stored in subscriptions when you upgrade or manage a plan through the Stripe plugin.
      </p>

      <h3 className="text-xl font-medium mb-2 mt-6">Usage & Credits</h3>
      <ul className="list-disc list-inside mb-4 pl-4">
        <li>Credit balances, plan name, limits, and reset timestamps cached in Upstash Redis.</li>
        <li>Aggregate counters such as &ldquo;logos generated&rdquo; maintained in Upstash.</li>
      </ul>

      <h3 className="text-xl font-medium mb-2 mt-6">AI Generation Inputs</h3>
      <p className="mb-4">
        Prompts you type plus logo brief metadata are sent to OpenRouter&rsquo;s API when you run generateLogos. We do not persist those prompts in our database after the request completes.
      </p>

      <h3 className="text-xl font-medium mb-2 mt-6">On-Device Data</h3>
      <ul className="list-disc list-inside mb-4 pl-4">
        <li>Logo configurations you edit are saved to your browser&rsquo;s localStorage via useLogoHistory so recent sessions reopen with your last state.</li>
        <li>Cookies set by Better Auth keep you signed in.</li>
      </ul>

      <h3 className="text-xl font-medium mb-2 mt-6">Diagnostics & Analytics</h3>
      <ul className="list-disc list-inside mb-4 pl-4">
        <li>We load @vercel/analytics, which records anonymized page metrics.</li>
        <li>Server logs capture standard request metadata (timestamp, IP) for troubleshooting.</li>
      </ul>
      <p className="mb-4">
        We do not store the actual raster or vector exports you download; they are generated on the fly in your browser.
      </p>

      <h2 className="text-2xl font-semibold mb-4 mt-8">2. How We Use Information</h2>
      <ul className="list-disc list-inside mb-4 pl-4">
        <li><strong>Provide the app:</strong> Authenticate you, persist editor state, and render logos.</li>
        <li><strong>Process payments:</strong> Initiate subscriptions, upgrades, billing-portal sessions, and credit allotments.</li>
        <li><strong>Enforce limits:</strong> Deduct credits via consumeCredits before each AI run.</li>
        <li><strong>Improve reliability:</strong> Monitor aggregate stats and error logs to keep the service stable.</li>
        <li><strong>Respond to you:</strong> Feedback dialogs and support DMs (see Section 9) rely on contact info you provide.</li>
      </ul>
      <p className="mb-4">We do not sell or rent personal data.</p>

      <h2 className="text-2xl font-semibold mb-4 mt-8">3. Sharing with Service Providers</h2>
      <p className="mb-4">We share only what&rsquo;s necessary with these processors:</p>
      <div className="overflow-x-auto mb-4">
        <table className="min-w-full divide-y divide-border">
          <thead>
            <tr className="bg-muted">
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Vendor
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Purpose
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Data shared
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">Stripe</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">Checkout, subscriptions, billing portal</td>
              <td className="px-6 py-4 text-sm">Name, email, Stripe customer/subscription IDs, plan info. Card data stays with Stripe.</td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">OpenRouter</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">Claude Haiku 4.5 model that designs logos</td>
              <td className="px-6 py-4 text-sm">Prompt text, forced icon/task instructions.</td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">Upstash Redis</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">Credit ledger & aggregate counts</td>
              <td className="px-6 py-4 text-sm">User ID, plan, balance/limit numbers, reset dates.</td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">Vercel</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">Hosting & analytics</td>
              <td className="px-6 py-4 text-sm">Pseudonymous page metrics, truncated IPs.</td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">OAuth providers (Google, GitHub)</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">Account creation / login</td>
              <td className="px-6 py-4 text-sm">Your provider ID, email, and avatar as returned by them.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mb-4">
        Each vendor processes data under its own privacy terms; Stripe and OpenRouter host data in the United States.
      </p>

      <h2 className="text-2xl font-semibold mb-4 mt-8">4. Cookies & Local Storage</h2>
      <ul className="list-disc list-inside mb-4 pl-4">
        <li>Better Auth session cookies keep you signed in and protect routes.</li>
        <li>localStorage (key lucide-logo-config) persists the last logo config on your own device only.</li>
        <li>You may clear browser storage to reset local drafts.</li>
      </ul>

      <h2 className="text-2xl font-semibold mb-4 mt-8">5. Data Retention</h2>
      <ul className="list-disc list-inside mb-4 pl-4">
        <li>Account, session, and subscription records remain until you delete the account or we close it for inactivity.</li>
        <li>Credit ledgers in Upstash keep the latest balance plus reset timestamps; aggregate logo counts are stored indefinitely for historical reporting.</li>
        <li>AI prompts are sent to OpenRouter for immediate processing and not saved in our Postgres database.</li>
        <li>Local storage remains until cleared by you.</li>
      </ul>

      <h2 className="text-2xl font-semibold mb-4 mt-8">6. Security</h2>
      <ul className="list-disc list-inside mb-4 pl-4">
        <li>PostgreSQL tables are managed through Drizzle ORM with UUID primary keys.</li>
        <li>Secrets (Stripe keys, OpenRouter key, Upstash tokens) stay in .env files and server-side actions only.</li>
        <li>Stripe Checkout and Billing Portal handle payment data directly; we never see full card details.</li>
        <li>All AI calls run from server actions so API keys are not exposed to the browser.</li>
      </ul>

      <h2 className="text-2xl font-semibold mb-4 mt-8">7. Your Rights & Choices</h2>
      <ul className="list-disc list-inside mb-4 pl-4">
        <li><strong>Access / update:</strong> Edit your profile or social accounts inside Settings (/settings).</li>
        <li><strong>Delete account:</strong> Use the &ldquo;Delete account&rdquo; flow. This queues removal of your user, sessions, accounts, and subscriptions.</li>
        <li><strong>Unsubscribe:</strong> Cancel or downgrade in /billing or /pricing; Stripe webhooks update our records automatically.</li>
        <li><strong>Export logos:</strong> Use in-app export tools; we do not offer an automated export of raw database data yet, but we&rsquo;ll respond to reasonable requests.</li>
      </ul>
      <p className="mb-4">
        Email addresses or data from OAuth providers can also be updated by reconnecting the provider.
      </p>

      <h2 className="text-2xl font-semibold mb-4 mt-8">8. International Transfers</h2>
      <p className="mb-4">
        We operate from the United States. When you use Logotham, your data may be processed in the U.S. and any location where our processors (Stripe, Upstash, OpenRouter, Vercel) maintain infrastructure. We rely on Standard Contractual Clauses in our vendor agreements where applicable.
      </p>

      <h2 className="text-2xl font-semibold mb-4 mt-8">9. Contact</h2>
      <p className="mb-4">Questions or privacy requests?</p>
      <ul className="list-disc list-inside mb-4 pl-4">
        <li>Use the in-app Feedback dialog.</li>
        <li>Or reach us on X/Twitter via{' '}
          <a href="https://x.com/mathaegon" className="underline">
            @mathaegon
          </a>. We&rsquo;ll respond within 30 days.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mb-4 mt-8">10. Changes</h2>
      <p className="mb-4">
        We&rsquo;ll update this policy if we add major features (e.g., new data tables or processors). The &ldquo;effective date&rdquo; above reflects the latest code-state review. Continued use of Logotham after changes means you accept the updated policy.
      </p>
    </div>
  )
}