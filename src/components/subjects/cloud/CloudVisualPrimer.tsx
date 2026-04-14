import {
  Boxes,
  Cloud,
  Database,
  HardDrive,
  Server,
  Users,
} from "lucide-react"

type CloudVisualPrimerProps = {
  variant?: "hero" | "lesson"
}

const NODES = [
  {
    label: "Users",
    sublabel: "Customers and teams",
    icon: Users,
    color: "#0EA5E9",
  },
  {
    label: "App Layer",
    sublabel: "What people use",
    icon: Cloud,
    color: "#7C3AED",
  },
  {
    label: "EC2 / VMs",
    sublabel: "Rented servers",
    icon: Server,
    color: "#F59E0B",
  },
  {
    label: "EKS / Kubernetes",
    sublabel: "Container control",
    icon: Boxes,
    color: "#14B8A6",
  },
  {
    label: "S3",
    sublabel: "Files and logs",
    icon: HardDrive,
    color: "#38BDF8",
  },
  {
    label: "Snowflake",
    sublabel: "Analytics and data",
    icon: Database,
    color: "#F97316",
  },
] as const

export function CloudVisualPrimer({
  variant = "hero",
}: CloudVisualPrimerProps) {
  const compact = variant === "lesson"

  return (
    <section
      className={`rounded-[24px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,255,255,0.84)] shadow-editorial-soft ${
        compact ? "p-4 sm:p-5" : "p-5 sm:p-6"
      }`}
    >
      <div className={`grid gap-5 ${compact ? "lg:grid-cols-[0.9fr,1.1fr]" : "lg:grid-cols-[0.95fr,1.05fr]"}`}>
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-editorial-muted">
            Cloud visual primer
          </p>
          <h3
            className={`mt-2 font-serif font-semibold text-editorial-ink ${
              compact ? "text-[1.8rem] leading-tight sm:text-[2.2rem]" : "text-[2rem] leading-tight sm:text-[2.4rem]"
            }`}
          >
            A simple AWS-shaped map for non-technical learners
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-editorial-muted sm:text-base">
            Start with one mental picture: people use an app, the app runs on cloud
            services, some workloads live on virtual machines like EC2, some are run
            through Kubernetes on EKS, files and logs often land in S3, and analytics
            can flow into Snowflake.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-editorial-muted">
            This is a teaching model, not a claim about CrowdStrike&apos;s exact
            private architecture. It is the right beginner map for understanding the
            kind of platform language Neil will hear from sales engineers.
          </p>

          <div className="mt-4 grid grid-cols-2 gap-2.5">
            {NODES.slice(2).map((node) => {
              const Icon = node.icon

              return (
                <div
                  key={node.label}
                  className="rounded-[18px] border border-[rgba(44,49,59,0.08)] bg-white/86 p-3"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="flex h-8 w-8 items-center justify-center rounded-[10px]"
                      style={{
                        backgroundColor: `${node.color}18`,
                        color: node.color,
                      }}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-editorial-ink">
                        {node.label}
                      </p>
                      <p className="text-[11px] text-editorial-muted">
                        {node.sublabel}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="rounded-[22px] border border-[rgba(44,49,59,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(248,250,252,0.9))] p-4 sm:p-5">
          <svg
            viewBox="0 0 680 460"
            className="h-auto w-full"
            role="img"
            aria-label="Cloud primer diagram showing users, app layer, EC2 virtual machines, Kubernetes on EKS, S3 storage, and Snowflake analytics."
          >
            <defs>
              <linearGradient id="cloud-shell" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(14,165,233,0.12)" />
                <stop offset="100%" stopColor="rgba(124,58,237,0.08)" />
              </linearGradient>
            </defs>

            <rect x="115" y="88" width="450" height="275" rx="34" fill="url(#cloud-shell)" stroke="rgba(44,49,59,0.08)" />
            <text x="340" y="122" textAnchor="middle" fontSize="14" fill="#667085" letterSpacing="0.18em">
              AWS EXAMPLE ENVIRONMENT
            </text>

            <line x1="118" y1="220" x2="230" y2="220" stroke="#CBD5E1" strokeWidth="3" />
            <line x1="340" y1="175" x2="340" y2="206" stroke="#CBD5E1" strokeWidth="3" />
            <line x1="340" y1="250" x2="260" y2="298" stroke="#CBD5E1" strokeWidth="3" />
            <line x1="340" y1="250" x2="340" y2="298" stroke="#CBD5E1" strokeWidth="3" />
            <line x1="340" y1="250" x2="420" y2="298" stroke="#CBD5E1" strokeWidth="3" />

            <g transform="translate(18 176)">
              <rect width="100" height="88" rx="22" fill="white" stroke="rgba(44,49,59,0.08)" />
              <text x="50" y="34" textAnchor="middle" fontSize="18" fill="#111827" fontWeight="600">
                Users
              </text>
              <text x="50" y="58" textAnchor="middle" fontSize="12" fill="#667085">
                People in the world
              </text>
            </g>

            <g transform="translate(260 130)">
              <rect width="160" height="88" rx="24" fill="white" stroke="rgba(44,49,59,0.08)" />
              <text x="80" y="34" textAnchor="middle" fontSize="20" fill="#111827" fontWeight="600">
                App Layer
              </text>
              <text x="80" y="58" textAnchor="middle" fontSize="12" fill="#667085">
                What the customer touches
              </text>
            </g>

            <g transform="translate(170 300)">
              <rect width="130" height="94" rx="24" fill="white" stroke="rgba(44,49,59,0.08)" />
              <text x="65" y="34" textAnchor="middle" fontSize="18" fill="#111827" fontWeight="600">
                EC2 / VMs
              </text>
              <text x="65" y="58" textAnchor="middle" fontSize="12" fill="#667085">
                Rented servers
              </text>
            </g>

            <g transform="translate(275 300)">
              <rect width="130" height="94" rx="24" fill="white" stroke="rgba(44,49,59,0.08)" />
              <text x="65" y="34" textAnchor="middle" fontSize="18" fill="#111827" fontWeight="600">
                EKS
              </text>
              <text x="65" y="58" textAnchor="middle" fontSize="12" fill="#667085">
                Kubernetes control
              </text>
            </g>

            <g transform="translate(380 300)">
              <rect width="130" height="94" rx="24" fill="white" stroke="rgba(44,49,59,0.08)" />
              <text x="65" y="34" textAnchor="middle" fontSize="18" fill="#111827" fontWeight="600">
                S3 + Data
              </text>
              <text x="65" y="58" textAnchor="middle" fontSize="12" fill="#667085">
                Files, logs, analytics
              </text>
            </g>
          </svg>

          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            <div className="rounded-[16px] bg-white/88 p-3">
              <p className="text-[10px] uppercase tracking-[0.18em] text-editorial-muted">
                VM
              </p>
              <p className="mt-1 text-sm font-medium text-editorial-ink">
                EC2 is a rented server
              </p>
            </div>
            <div className="rounded-[16px] bg-white/88 p-3">
              <p className="text-[10px] uppercase tracking-[0.18em] text-editorial-muted">
                Containers
              </p>
              <p className="mt-1 text-sm font-medium text-editorial-ink">
                EKS runs Kubernetes for app workloads
              </p>
            </div>
            <div className="rounded-[16px] bg-white/88 p-3">
              <p className="text-[10px] uppercase tracking-[0.18em] text-editorial-muted">
                Data
              </p>
              <p className="mt-1 text-sm font-medium text-editorial-ink">
                S3 stores, Snowflake analyzes
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
