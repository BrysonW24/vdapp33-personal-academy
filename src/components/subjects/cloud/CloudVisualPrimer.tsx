import {
  BellRing,
  Cloud,
  Database,
  FolderKanban,
  HardDrive,
  KeyRound,
  Network,
  Server,
  ShieldCheck,
  TerminalSquare,
} from "lucide-react"
import type { ReactNode } from "react"

type CloudVisualPrimerProps = {
  variant?: "hero" | "lesson"
  focus?: "full" | "general" | "comparison" | "aws" | "responsibility"
}

const CATEGORY_CARDS = [
  {
    title: "Compute",
    summary: "Where workloads run, from virtual machines to containers and serverless functions.",
    icon: Server,
    color: "#F59E0B",
  },
  {
    title: "Storage",
    summary: "Where files, logs, backups, and objects live.",
    icon: HardDrive,
    color: "#0EA5E9",
  },
  {
    title: "Database",
    summary: "Where structured application data is stored and queried.",
    icon: Database,
    color: "#8B5CF6",
  },
  {
    title: "Networking",
    summary: "How systems connect, route traffic, and stay reachable.",
    icon: Network,
    color: "#2F9E84",
  },
  {
    title: "Identity",
    summary: "Who is allowed in, what they can do, and how access is controlled.",
    icon: KeyRound,
    color: "#B76835",
  },
  {
    title: "Monitoring",
    summary: "How teams see logs, metrics, alerts, and service health.",
    icon: BellRing,
    color: "#EF6C57",
  },
  {
    title: "Analytics",
    summary: "How raw data becomes dashboards, models, reports, and operational insight.",
    icon: FolderKanban,
    color: "#14B8A6",
  },
] as const

const PROVIDER_COMPARISON_ROWS = [
  {
    category: "VMs / compute",
    why: "Raw rented computing power for apps and workloads.",
    aws: "EC2",
    azure: "Virtual Machines",
    gcp: "Compute Engine",
    heroku: "Dynos",
    snowflake: "Virtual warehouses",
  },
  {
    category: "Containers",
    why: "Managed runtime for containerized applications.",
    aws: "EKS",
    azure: "AKS",
    gcp: "GKE",
    heroku: "Container runtime",
    snowflake: "Not core",
  },
  {
    category: "Object storage",
    why: "Files, logs, assets, and data objects.",
    aws: "S3",
    azure: "Blob Storage",
    gcp: "Cloud Storage",
    heroku: "Add-ons / external stores",
    snowflake: "Managed storage",
  },
  {
    category: "Database",
    why: "Application-grade relational or operational data.",
    aws: "RDS / DynamoDB",
    azure: "Azure SQL / Cosmos DB",
    gcp: "Cloud SQL / Firestore",
    heroku: "Heroku Postgres",
    snowflake: "Tables, stages, schemas",
  },
  {
    category: "Warehouse / analytics",
    why: "Large-scale analysis, reporting, and governed data work.",
    aws: "Redshift / Athena",
    azure: "Synapse",
    gcp: "BigQuery",
    heroku: "Usually external",
    snowflake: "Core product",
  },
  {
    category: "IAM",
    why: "Identity, roles, permissions, and access boundaries.",
    aws: "IAM",
    azure: "Entra ID + RBAC",
    gcp: "Cloud IAM",
    heroku: "Teams / SSO",
    snowflake: "RBAC",
  },
  {
    category: "Networking",
    why: "Private networks, routing, and traffic control.",
    aws: "VPC",
    azure: "Virtual Network",
    gcp: "VPC",
    heroku: "Private Spaces",
    snowflake: "Private connectivity",
  },
  {
    category: "Monitoring",
    why: "Logs, metrics, dashboards, and alerts.",
    aws: "CloudWatch",
    azure: "Azure Monitor",
    gcp: "Cloud Monitoring",
    heroku: "Metrics + log drains",
    snowflake: "Snowsight + account usage",
  },
  {
    category: "Serverless / automation",
    why: "Event-driven jobs and lightweight operational automation.",
    aws: "Lambda",
    azure: "Azure Functions",
    gcp: "Cloud Run / Functions",
    heroku: "Workers + release phase",
    snowflake: "Tasks / procedures",
  },
] as const

const AWS_FAMILIES = [
  {
    title: "Compute",
    color: "#F59E0B",
    services: ["EC2", "EKS", "Lambda"],
    summary: "Where application logic actually runs.",
  },
  {
    title: "Storage & data",
    color: "#0EA5E9",
    services: ["S3", "RDS", "EBS"],
    summary: "Where files, application data, and persistent volumes live.",
  },
  {
    title: "Networking",
    color: "#2F9E84",
    services: ["VPC", "Route 53", "CloudFront"],
    summary: "How traffic enters, routes, and reaches the right workloads.",
  },
  {
    title: "Identity & security",
    color: "#B76835",
    services: ["IAM", "KMS", "Security Groups"],
    summary: "Who gets access, how secrets are protected, and how boundaries are enforced.",
  },
  {
    title: "Observability",
    color: "#EF6C57",
    services: ["CloudWatch", "CloudTrail", "Config"],
    summary: "How teams see what happened, what is happening, and what drifted.",
  },
] as const

const WELL_ARCHITECTED_PILLARS = [
  "Operational excellence",
  "Security",
  "Reliability",
  "Performance efficiency",
  "Cost optimization",
  "Sustainability",
] as const

function SectionShell({
  eyebrow,
  title,
  body,
  children,
}: {
  eyebrow: string
  title: string
  body: string
  children: ReactNode
}) {
  return (
    <section className="rounded-[24px] border border-[rgba(44,49,59,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.97),rgba(249,246,239,0.95))] p-4 shadow-editorial-soft sm:p-5">
      <p className="text-[10px] uppercase tracking-[0.18em] text-editorial-muted">
        {eyebrow}
      </p>
      <h3 className="mt-2 font-serif text-[1.65rem] font-semibold leading-tight text-editorial-ink sm:text-[2rem]">
        {title}
      </h3>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-editorial-muted sm:text-base">
        {body}
      </p>
      <div className="mt-4">{children}</div>
    </section>
  )
}

function GeneralCloudExplainer() {
  return (
    <SectionShell
      eyebrow="Cloud in general"
      title="The cloud is a bundle of service categories"
      body="Cloud is not one thing. It is a stack of capability that lets teams rent infrastructure, data, networking, identity, and monitoring instead of building all of it from scratch."
    >
      <div className="grid gap-4 lg:grid-cols-[1.05fr,0.95fr]">
        <div className="rounded-[22px] border border-[rgba(44,49,59,0.1)] bg-white/92 p-4">
          <svg
            viewBox="0 0 620 360"
            className="h-auto w-full"
            role="img"
            aria-label="A layered cloud explainer showing users, application layer, cloud service categories, and provider infrastructure."
          >
            <rect x="160" y="24" width="300" height="54" rx="22" fill="#FFFFFF" stroke="rgba(44,49,59,0.12)" />
            <text x="310" y="56" textAnchor="middle" fontSize="18" fill="#1d2126" fontWeight="600">
              Users and teams
            </text>

            <line x1="310" y1="78" x2="310" y2="110" stroke="#A0AEC0" strokeWidth="3" />

            <rect x="150" y="110" width="320" height="64" rx="24" fill="#FFFFFF" stroke="rgba(44,49,59,0.12)" />
            <text x="310" y="145" textAnchor="middle" fontSize="22" fill="#1d2126" fontWeight="600">
              Applications and data products
            </text>

            <line x1="310" y1="174" x2="310" y2="206" stroke="#A0AEC0" strokeWidth="3" />

            <rect x="52" y="208" width="516" height="86" rx="28" fill="rgba(14,165,233,0.08)" stroke="rgba(44,49,59,0.1)" />
            <text x="310" y="234" textAnchor="middle" fontSize="14" fill="#544f47" letterSpacing="0.14em">
              CLOUD SERVICE CATEGORIES
            </text>
            <text x="310" y="264" textAnchor="middle" fontSize="15" fill="#1d2126">
              Compute • Storage • Database • Networking • Identity • Monitoring • Analytics
            </text>

            <line x1="310" y1="294" x2="310" y2="322" stroke="#A0AEC0" strokeWidth="3" />

            <rect x="98" y="322" width="424" height="28" rx="14" fill="rgba(44,49,59,0.08)" />
            <text x="310" y="341" textAnchor="middle" fontSize="13" fill="#544f47" letterSpacing="0.14em">
              AWS • AZURE • GCP • HEROKU • SNOWFLAKE
            </text>
          </svg>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {CATEGORY_CARDS.map((card) => {
            const Icon = card.icon

            return (
              <div
                key={card.title}
                className="rounded-[18px] border border-[rgba(44,49,59,0.1)] bg-white/92 p-3.5"
              >
                <div className="flex items-start gap-3">
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px]"
                    style={{ backgroundColor: `${card.color}18`, color: card.color }}
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  <div>
                    <p className="font-medium text-editorial-ink">{card.title}</p>
                    <p className="mt-1 text-[13px] leading-[1.55] text-editorial-muted">
                      {card.summary}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </SectionShell>
  )
}

function ProviderComparisonExplainer() {
  return (
    <SectionShell
      eyebrow="Cloud systems comparison"
      title="The providers share categories even when the names differ"
      body="Beginners do not need to memorize every logo. They need to recognize that the same jobs keep reappearing: compute, storage, data, identity, networking, monitoring, and automation."
    >
      <div className="overflow-x-auto rounded-[22px] border border-[rgba(44,49,59,0.1)] bg-white/94">
        <div className="min-w-[980px]">
          <div className="grid grid-cols-[1.15fr,1fr,1fr,1fr,0.9fr,0.95fr] border-b border-[rgba(44,49,59,0.1)] bg-[rgba(44,49,59,0.04)]">
            {["Category", "AWS", "Azure", "GCP", "Heroku", "Snowflake"].map((label) => (
              <div key={label} className="px-4 py-3 text-sm font-semibold text-editorial-ink">
                {label}
              </div>
            ))}
          </div>

          {PROVIDER_COMPARISON_ROWS.map((row) => (
            <div
              key={row.category}
              className="grid grid-cols-[1.15fr,1fr,1fr,1fr,0.9fr,0.95fr] border-b border-[rgba(44,49,59,0.08)] last:border-b-0"
            >
              <div className="px-4 py-3">
                <p className="font-medium text-editorial-ink">{row.category}</p>
                <p className="mt-1 text-[12px] leading-[1.45] text-editorial-muted">
                  {row.why}
                </p>
              </div>
              <div className="px-4 py-3 text-sm text-editorial-ink">{row.aws}</div>
              <div className="px-4 py-3 text-sm text-editorial-ink">{row.azure}</div>
              <div className="px-4 py-3 text-sm text-editorial-ink">{row.gcp}</div>
              <div className="px-4 py-3 text-sm text-editorial-ink">{row.heroku}</div>
              <div className="px-4 py-3 text-sm text-editorial-ink">{row.snowflake}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {[
          {
            label: "AWS",
            summary: "Broadest service catalog and the easiest anchor for core cloud language.",
          },
          {
            label: "Azure",
            summary: "Strong fit where Microsoft identity, enterprise IT, and procurement matter.",
          },
          {
            label: "GCP",
            summary: "Especially strong in data, analytics, and modern infrastructure workflows.",
          },
          {
            label: "Heroku",
            summary: "Simpler developer platform that hides much more infrastructure detail.",
          },
          {
            label: "Snowflake",
            summary: "A data cloud, not a general infrastructure cloud, built around governed analytics.",
          },
        ].map((provider) => (
          <div
            key={provider.label}
            className="rounded-[18px] border border-[rgba(44,49,59,0.1)] bg-white/92 p-3.5"
          >
            <p className="font-medium text-editorial-ink">{provider.label}</p>
            <p className="mt-1 text-[13px] leading-[1.55] text-editorial-muted">
              {provider.summary}
            </p>
          </div>
        ))}
      </div>
    </SectionShell>
  )
}

function AwsDeepDiveExplainer() {
  return (
    <SectionShell
      eyebrow="AWS deepening"
      title="AWS is the concrete beginner example"
      body="For Neil at CrowdStrike, AWS is the most useful anchor because it makes sales-engineering language easier to decode. The job is not to learn every service. It is to understand where the core services fit."
    >
      <div className="grid gap-4 lg:grid-cols-[1fr,1fr]">
        <div className="grid gap-3 sm:grid-cols-2">
          {AWS_FAMILIES.map((family) => (
            <div
              key={family.title}
              className="rounded-[18px] border border-[rgba(44,49,59,0.1)] bg-white/92 p-3.5"
            >
              <div className="flex items-center gap-2">
                <span
                  className="inline-block h-2.5 w-10 rounded-full"
                  style={{ backgroundColor: family.color }}
                />
                <p className="font-medium text-editorial-ink">{family.title}</p>
              </div>
              <p className="mt-2 text-[13px] leading-[1.55] text-editorial-muted">
                {family.summary}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {family.services.map((service) => (
                  <span
                    key={service}
                    className="rounded-full border border-[rgba(44,49,59,0.1)] bg-white/94 px-2.5 py-1 text-[11px] text-editorial-ink"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-[22px] border border-[rgba(44,49,59,0.1)] bg-white/92 p-4">
          <p className="text-[10px] uppercase tracking-[0.18em] text-editorial-muted">
            How a simple AWS project gets built
          </p>
          <div className="mt-4 space-y-3">
            <div className="rounded-[18px] border border-[rgba(44,49,59,0.1)] bg-[rgba(44,49,59,0.03)] p-3.5">
              <p className="font-medium text-editorial-ink">1. App layer</p>
              <p className="mt-1 text-sm leading-relaxed text-editorial-muted">
                The user touches a web app, internal portal, API, or data product.
              </p>
            </div>
            <div className="rounded-[18px] border border-[rgba(44,49,59,0.1)] bg-[rgba(44,49,59,0.03)] p-3.5">
              <p className="font-medium text-editorial-ink">2. Compute layer</p>
              <p className="mt-1 text-sm leading-relaxed text-editorial-muted">
                The logic runs on EC2 virtual machines, containers on EKS, or event-driven functions on Lambda.
              </p>
            </div>
            <div className="rounded-[18px] border border-[rgba(44,49,59,0.1)] bg-[rgba(44,49,59,0.03)] p-3.5">
              <p className="font-medium text-editorial-ink">3. Data layer</p>
              <p className="mt-1 text-sm leading-relaxed text-editorial-muted">
                Files and logs land in S3, while operational app data might live in RDS.
              </p>
            </div>
            <div className="rounded-[18px] border border-[rgba(44,49,59,0.1)] bg-[rgba(44,49,59,0.03)] p-3.5">
              <p className="font-medium text-editorial-ink">4. Identity and networking</p>
              <p className="mt-1 text-sm leading-relaxed text-editorial-muted">
                IAM controls who can do what; VPC, routing, and security groups control how traffic moves.
              </p>
            </div>
            <div className="rounded-[18px] border border-[rgba(44,49,59,0.1)] bg-[rgba(44,49,59,0.03)] p-3.5">
              <p className="font-medium text-editorial-ink">5. Monitoring and improvement</p>
              <p className="mt-1 text-sm leading-relaxed text-editorial-muted">
                CloudWatch and related observability tools tell the team whether the stack is healthy, fast, and cost-aware.
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-[18px] border border-[rgba(44,49,59,0.1)] bg-[rgba(14,165,233,0.06)] p-3.5">
            <p className="text-[10px] uppercase tracking-[0.18em] text-editorial-muted">
              AWS mental shortcuts
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <p className="text-sm text-editorial-ink">EC2 = rented server / VM</p>
              <p className="text-sm text-editorial-ink">EKS = managed Kubernetes</p>
              <p className="text-sm text-editorial-ink">S3 = object storage bucket</p>
              <p className="text-sm text-editorial-ink">RDS = managed relational database</p>
              <p className="text-sm text-editorial-ink">IAM = identity and permissions</p>
              <p className="text-sm text-editorial-ink">CloudWatch = logs, metrics, alerts</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-[20px] border border-[rgba(44,49,59,0.1)] bg-white/92 p-4">
        <p className="text-[10px] uppercase tracking-[0.18em] text-editorial-muted">
          AWS design benchmark
        </p>
        <p className="mt-2 text-sm leading-relaxed text-editorial-muted">
          AWS frames good architecture through six Well-Architected pillars: operational excellence, security, reliability, performance efficiency, cost optimization, and sustainability. That gives non-technical learners a clean checklist for asking better questions about any proposed cloud setup.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {WELL_ARCHITECTED_PILLARS.map((pillar) => (
            <span
              key={pillar}
              className="rounded-full border border-[rgba(44,49,59,0.1)] bg-white/94 px-3 py-1.5 text-[11px] text-editorial-ink"
            >
              {pillar}
            </span>
          ))}
        </div>
      </div>
    </SectionShell>
  )
}

function ResponsibilityExplainer() {
  return (
    <SectionShell
      eyebrow="Responsibility and stack teaching"
      title="AWS manages the cloud infrastructure. The customer manages what they build on top."
      body="The shared responsibility model is the most important risk concept for beginners. Cloud does not remove responsibility. It changes where the responsibility boundary sits."
    >
      <div className="grid gap-4 lg:grid-cols-[0.95fr,1.05fr]">
        <div className="rounded-[22px] border border-[rgba(44,49,59,0.1)] bg-white/92 p-4">
          <div className="grid gap-3 md:grid-cols-[0.85fr,1.15fr]">
            <div className="rounded-[18px] bg-[#204f73] px-4 py-5 text-white">
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/80">
                Customer
              </p>
              <p className="mt-3 font-semibold">Security in the cloud</p>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-white/88">
                <li>Data and classification</li>
                <li>Identities, roles, and permissions</li>
                <li>OS hardening on EC2</li>
                <li>Application code and secrets</li>
                <li>Network rules and workload configuration</li>
              </ul>
            </div>

            <div className="space-y-2">
              {[
                "Application, identity, and access",
                "Operating system and network configuration",
                "Data encryption, integrity, and retention",
              ].map((line) => (
                <div
                  key={line}
                  className="rounded-[16px] bg-[#204f73] px-4 py-3 text-sm font-medium text-white"
                >
                  {line}
                </div>
              ))}
              <div className="rounded-[16px] bg-[#F59E0B] px-4 py-3 text-sm font-medium text-white">
                AWS managed services and platform software
              </div>
              <div className="grid gap-2 sm:grid-cols-3">
                {["Compute", "Storage", "Database", "Networking", "Regions", "Availability Zones"].map(
                  (line) => (
                    <div
                      key={line}
                      className="rounded-[16px] bg-[#F59E0B] px-4 py-3 text-sm font-medium text-white"
                    >
                      {line}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[22px] border border-[rgba(44,49,59,0.1)] bg-white/92 p-4">
          <p className="text-[10px] uppercase tracking-[0.18em] text-editorial-muted">
            Simple stack view
          </p>
          <div className="mt-4 grid gap-2">
            {[
              { label: "App", detail: "Customer-facing workflow, portal, API, or internal tool", color: "#7C3AED" },
              { label: "Compute", detail: "EC2, EKS, or Lambda run the workload", color: "#F59E0B" },
              { label: "Data", detail: "S3, RDS, and analytics layers store and shape information", color: "#0EA5E9" },
              { label: "Identity", detail: "IAM defines who can access what", color: "#B76835" },
              { label: "Networking", detail: "VPC and routing control how services talk", color: "#2F9E84" },
              { label: "Monitoring", detail: "CloudWatch reveals health, usage, and drift", color: "#EF6C57" },
            ].map((layer) => (
              <div
                key={layer.label}
                className="rounded-[16px] border border-[rgba(44,49,59,0.1)] bg-[rgba(255,255,255,0.96)] px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="inline-block h-2.5 w-10 rounded-full"
                    style={{ backgroundColor: layer.color }}
                  />
                  <p className="font-medium text-editorial-ink">{layer.label}</p>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-editorial-muted">
                  {layer.detail}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-[18px] border border-[rgba(44,49,59,0.1)] bg-[rgba(44,49,59,0.03)] p-3.5">
            <p className="flex items-center gap-2 font-medium text-editorial-ink">
              <ShieldCheck className="h-4 w-4 text-editorial-green" />
              What changes with managed services
            </p>
            <p className="mt-2 text-sm leading-relaxed text-editorial-muted">
              The more managed the service, the more AWS operates for you. On EC2 the customer manages more of the operating system and workload stack. On RDS, Lambda, or other managed services, AWS manages more of the underlying platform while the customer still owns data, access, and application behavior.
            </p>
          </div>
        </div>
      </div>
    </SectionShell>
  )
}

export function CloudVisualPrimer({
  variant = "hero",
  focus = "full",
}: CloudVisualPrimerProps) {
  const compact = variant === "lesson"
  const sections =
    focus === "full"
      ? ["general", "comparison", "aws", "responsibility"]
      : [focus]

  return (
    <section
      className={`space-y-4 rounded-[24px] border border-[rgba(44,49,59,0.12)] bg-[rgba(255,255,255,0.94)] p-4 shadow-editorial-soft ${
        compact ? "sm:p-5" : "sm:p-6"
      }`}
    >
      <div className="rounded-[20px] border border-[rgba(44,49,59,0.1)] bg-[linear-gradient(180deg,rgba(14,165,233,0.08),rgba(255,255,255,0.92))] p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px] bg-white/92 text-editorial-blue shadow-sm">
            <Cloud className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-editorial-muted">
              Cloud teaching map
            </p>
            <h2 className="mt-1 font-serif text-[1.9rem] font-semibold leading-tight text-editorial-ink sm:text-[2.35rem]">
              Learn the cloud shape before the jargon
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-editorial-muted sm:text-base">
              This visual stack moves in the right order: what cloud is, how the major providers line up, how AWS fits as a teaching example, and where responsibility sits between the platform and the customer.
            </p>
          </div>
        </div>
      </div>

      {sections.includes("general") ? <GeneralCloudExplainer /> : null}
      {sections.includes("comparison") ? <ProviderComparisonExplainer /> : null}
      {sections.includes("aws") ? <AwsDeepDiveExplainer /> : null}
      {sections.includes("responsibility") ? <ResponsibilityExplainer /> : null}

      <div className="rounded-[20px] border border-[rgba(44,49,59,0.1)] bg-[rgba(44,49,59,0.03)] p-4">
        <p className="flex items-center gap-2 font-medium text-editorial-ink">
          <TerminalSquare className="h-4 w-4 text-editorial-blue" />
          Beginner takeaway
        </p>
        <p className="mt-2 text-sm leading-relaxed text-editorial-muted">
          If a sales engineer says EC2, EKS, S3, IAM, CloudWatch, or Snowflake, the most useful response is not panic. Translate the word into its job: rented server, container runtime, storage, permissions, monitoring, or analytics.
        </p>
      </div>
    </section>
  )
}
