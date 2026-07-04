import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full bg-base">
      {/* Left: sign-in */}
      <div className="flex w-full flex-col justify-center px-8 sm:px-16 lg:w-[440px] lg:shrink-0 lg:px-12">
        <div className="mb-10 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-platform font-mono text-sm font-bold text-white">
            K
          </div>
          <div className="leading-tight">
            <p className="font-mono text-2xs uppercase tracking-widest text-ink-dim">
              Kunsult
            </p>
            <p className="text-sm font-semibold text-ink">Platform</p>
          </div>
        </div>

        <p className="label-eyebrow">Sign in</p>
        <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-ink">
          Operate every tenant from one console
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          Release 0.1 · Demonstration build
        </p>

        <form className="mt-8 space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-xs font-medium text-ink-muted"
            >
              Work email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@kunsult.com"
              defaultValue="e.kunonga@kunsult.com"
              className="input-field"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-xs font-medium text-ink-muted"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••••"
              defaultValue="demo-password"
              className="input-field"
            />
          </div>

          <Link href="/operations" className="btn-primary w-full">
            Enter platform
          </Link>

          <p className="text-center text-xs text-ink-dim">
            Demonstration credentials are pre-filled. No real authentication
            is performed in Release 0.1.
          </p>
        </form>

        <div className="mt-10 border-t border-border pt-5">
          <p className="text-xs text-ink-dim">
            Provisioned tenants sign in through this same console — the
            platform resolves your organisation automatically after
            authentication.
          </p>
        </div>
      </div>

      {/* Right: platform hierarchy visual */}
      <div className="relative hidden flex-1 items-center justify-center overflow-hidden bg-surface lg:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #E8EAF0 1px, transparent 1px), linear-gradient(to bottom, #E8EAF0 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative w-full max-w-md px-8">
          <p className="label-eyebrow mb-6">Provisioning hierarchy</p>
          <ol className="space-y-0">
            {[
              { label: "KUNSULT PLATFORM", tone: "platform" as const },
              { label: "Tenant Factory", tone: "mid" as const },
              { label: "ZIPROH · Tenant 001", tone: "tenant" as const },
              { label: "Operations Centre", tone: "mid" as const },
              { label: "Engagements", tone: "mid" as const },
              { label: "Evidence", tone: "mid" as const },
              { label: "Intelligence", tone: "mid" as const },
              { label: "QA", tone: "mid" as const },
              { label: "Outputs", tone: "tenant" as const },
            ].map((node, i, arr) => (
              <li key={node.label} className="relative flex items-center gap-4 pb-7 last:pb-0">
                {i !== arr.length - 1 && (
                  <span className="absolute left-[7px] top-4 h-full w-px bg-border-strong" />
                )}
                <span
                  className={`relative z-10 h-4 w-4 shrink-0 rounded-full border-2 ${
                    node.tone === "platform"
                      ? "border-platform bg-platform-soft"
                      : node.tone === "tenant"
                      ? "border-tenant bg-tenant-soft"
                      : "border-border-strong bg-surface"
                  }`}
                />
                <span
                  className={`font-mono text-sm ${
                    node.tone === "mid" ? "text-ink-muted" : "text-ink font-medium"
                  }`}
                >
                  {node.label}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
