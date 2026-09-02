import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="h-full w-full overflow-y-auto bg-background">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 py-12">
        <h1 className="text-3xl font-bold tracking-tight">
          About{" "}
          <span className="font-bold before:-rotate-1 before:-z-10 relative z-10 inline-block px-[0.3rem] py-[0.2rem] font-mono text-2xl text-gray-900 dark:text-primary-foreground outline-none before:pointer-events-none before:absolute before:inset-0 before:rounded-xs before:bg-[#fbbf24]">
            Logotham
          </span>
        </h1>

        <div className="space-y-6 text-base leading-relaxed text-muted-foreground">
          <p>
            I ran into this myself: I&apos;m not a designer, but I relied on a
            tool called{" "}
            <Link
              href="https://logofa.st"
              target="_blank"
              rel="noreferrer"
              className="font-bold text-[#fbbf24] underline underline-offset-4 hover:text-primary"
            >
              logofa.st
            </Link>{" "}
            to spin up logos quickly. It only supported an older Lucide icon
            set, had very few customization options, and was filled with ads.
          </p>
          <p>
            So I built{" "}
            <span className="font-bold before:-rotate-1 before:-z-10 relative z-10 inline-block px-[0.3rem] py-[0.2rem] font-mono text-gray-900 dark:text-primary-foreground text-sm outline-none before:pointer-events-none before:absolute before:inset-0 before:rounded-xs before:bg-[#fbbf24]">
              Logotham
            </span>
            . It supports Lucide, Lucide Lab, Flaticon, Feather, Iconoir,
            Boxicons, and Heroicons icons (for now) and I&apos;m releasing it
            for free so other founders can iterate without friction.
          </p>
          <p>
            My goal is to provide a simple, clean, and powerful tool that
            generates production-ready assets without the bloat. Whether you
            need a favicon, a social media avatar, or a full brand kit, Logotham
            has you covered.
          </p>
          <p>
            Questions or ideas? I&apos;m{" "}
            <Link
              href="https://x.com/mathaegon"
              target="_blank"
              rel="noreferrer"
              className="font-medium before:-rotate-1 before:-z-10 relative z-10 inline-block px-[0.3rem] py-[0.2rem] font-mono text-gray-900 dark:text-primary-foreground text-sm outline-none before:pointer-events-none before:absolute before:inset-0 before:rounded-xs before:bg-[#fbbf24] underline underline-offset-4 hover:text-muted/50"
            >
              @mathaegon
            </Link>{" "}
            on X.
          </p>
        </div>

        <div className="space-y-8">
          <h2 className="text-2xl font-bold tracking-tight">Legal & Privacy</h2>

          <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
            <h3>
              <strong>Privacy Policy</strong>
            </h3>
            <p>
              Logotham uses
              <Link
                href="https://vercel.com/analytics"
                target="_blank"
                rel="noreferrer"
                className="font-bold text-[#fbbf24] underline underline-offset-4 hover:text-primary"
              >
                {" Vercel Analytics "}
              </Link>
              to collect anonymous, aggregated usage data (e.g., &quot;page
              views&quot;, &quot;country&quot;, &quot;device type&quot;) to
              understand how the application is used and to improve the user
              experience. No personal identifying information (PII) is
              collected, stored, or processed. Logotham is cookie-less.
            </p>

            <h3>
              <strong>Terms of Service</strong>
            </h3>
            <p>
              Logotham is provided &quot;as is&quot; without warranty of any
              kind, express or implied. Users are solely responsible for any
              content they create using Logotham, including generated logos,
              text, and designs. You retain all intellectual property rights to
              the assets you create and export. However, Logotham makes no
              guarantees regarding the uniqueness or trademarkability of any
              generated logo or design, and we bear no responsibility for any
              intellectual property disputes that may arise from your use of the
              service.
            </p>
            <p>By using Logotham, you agree to these terms.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
