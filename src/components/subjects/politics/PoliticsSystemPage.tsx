import Link from "next/link"
import type { ReactNode } from "react"
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Building2,
  FileText,
  Gavel,
  Landmark,
  Library,
  Newspaper,
  Scale,
  ShieldCheck,
  Users,
} from "lucide-react"
import { Breadcrumbs } from "@/components/academy/layout/Breadcrumbs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { EntityHero } from "@/components/entities/EntityHero"
import { CareerLadder } from "@/components/visualizations/CareerLadder"
import {
  ComparisonMatrix,
  type ComparisonMatrixColumn,
  type ComparisonMatrixRow,
} from "@/components/visualizations/ComparisonMatrix"
import { ConceptMap } from "@/components/visualizations/ConceptMap"
import { ExposureMap } from "@/components/visualizations/ExposureMap"
import { FlowDiagram } from "@/components/visualizations/FlowDiagram"
import type { SubjectManifest } from "@/types/curriculum"

interface PoliticsSystemPageProps {
  subject: SubjectManifest
  guideRail?: ReactNode
}

const regimeColumns: ComparisonMatrixColumn[] = [
  {
    key: "democracy",
    label: "Liberal Democracy",
    description: "Competitive elections, lawful opposition, and institutional accountability.",
  },
  {
    key: "communism",
    label: "Communism",
    description: "Common ownership ideal, usually implemented through strong one-party control.",
  },
  {
    key: "fascism",
    label: "Fascism",
    description: "Authoritarian ultranationalism with a leader cult and suppressed pluralism.",
  },
  {
    key: "authoritarianism",
    label: "Authoritarian Rule",
    description: "Order and control concentrated in the executive with limited public challenge.",
  },
]

const regimeRows: ComparisonMatrixRow[] = [
  {
    label: "Power is justified by",
    description: "What makes the regime claim legitimacy.",
    cells: [
      { value: "Consent, elections, rights" },
      { value: "Class rule, party vanguard" },
      { value: "Nation, unity, leader" },
      { value: "Order, stability, force" },
    ],
  },
  {
    label: "Upside if it works",
    description: "Why people find the model attractive at all.",
    cells: [
      { value: "Pluralism and correction", tone: "positive" },
      { value: "Coordinated mobilisation", tone: "positive" },
      { value: "Fast national alignment", tone: "caution" },
      { value: "Fast decisions", tone: "caution" },
    ],
  },
  {
    label: "Downside if it fails",
    description: "The predictable failure mode to remember.",
    cells: [
      { value: "Gridlock and shallow politics", tone: "caution" },
      { value: "Centralised repression", tone: "risk" },
      { value: "Violence and persecution", tone: "risk" },
      { value: "Abuse without correction", tone: "risk" },
    ],
  },
  {
    label: "Freedom and opposition",
    description: "Can citizens organise against power?",
    cells: [
      { value: "Protected and legal", tone: "positive" },
      { value: "Usually narrowed by party", tone: "risk" },
      { value: "Suppressed", tone: "risk" },
      { value: "Managed or restricted", tone: "risk" },
    ],
  },
  {
    label: "Decision speed",
    description: "How quickly the system can move.",
    cells: [
      { value: "Slower but contested", tone: "neutral" },
      { value: "Fast if centralised", tone: "caution" },
      { value: "Fast and coercive", tone: "risk" },
      { value: "Fast and executive-led", tone: "caution" },
    ],
  },
  {
    label: "Accountability",
    description: "How power is checked when it goes wrong.",
    cells: [
      { value: "High if institutions hold", tone: "positive" },
      { value: "Weak outside party", tone: "risk" },
      { value: "Low", tone: "risk" },
      { value: "Low to moderate", tone: "risk" },
    ],
  },
  {
    label: "Citizen experience",
    description: "What daily life tends to feel like under the model.",
    cells: [
      { value: "Voice, rights, friction" },
      { value: "Security plus constraint" },
      { value: "Mobilisation and fear", tone: "risk" },
      { value: "Order with caution", tone: "caution" },
    ],
  },
  {
    label: "Anchor examples",
    description: "Historical or contemporary memory hooks.",
    cells: [
      { value: "Australia, UK, Canada" },
      { value: "USSR, Mao-era China, Cuba" },
      { value: "Mussolini's Italy, Nazi Germany" },
      { value: "Pinochet-era Chile, many military regimes" },
    ],
  },
]

const australiaNodes = [
  {
    id: "voters",
    label: "Voters",
    color: "#2f4f79",
    bgColor: "rgba(47,79,121,0.12)",
    description: "Legitimacy starts with elections and public consent.",
    details:
      "Voters choose the House and the Senate. Elections do not decide everything, but they decide who gets a legitimate claim to govern.",
    connections: ["house", "senate", "media"],
    angle: 145,
  },
  {
    id: "house",
    label: "House",
    color: "#386a58",
    bgColor: "rgba(56,106,88,0.12)",
    description: "The chamber that decides who can form government.",
    details:
      "The House of Representatives is where governments are won and lost. If you control confidence here, you control the executive.",
    connections: ["cabinet", "senate", "states"],
    angle: 110,
  },
  {
    id: "senate",
    label: "Senate",
    color: "#a16a1f",
    bgColor: "rgba(161,106,31,0.12)",
    description: "The review chamber where negotiation becomes real.",
    details:
      "The Senate can amend, scrutinise, and slow legislation. In Australia, this often matters more than textbook civics suggests.",
    connections: ["cabinet", "committees", "courts"],
    angle: 55,
  },
  {
    id: "cabinet",
    label: "Cabinet",
    color: "#7f3529",
    bgColor: "rgba(127,53,41,0.12)",
    description: "The real executive core of government.",
    details:
      "Cabinet sets political direction, decides priorities, and resolves conflicts between ministers. Much of the real contest happens before Parliament sees the final product.",
    connections: ["aps", "committees", "media"],
    angle: 15,
  },
  {
    id: "aps",
    label: "APS",
    color: "#5b6c8d",
    bgColor: "rgba(91,108,141,0.12)",
    description: "Departments design options and implement decisions.",
    details:
      "The Australian Public Service turns political goals into policy options, cabinet submissions, legislation instructions, implementation plans, and operational delivery.",
    connections: ["courts", "states", "lobbying"],
    angle: -30,
  },
  {
    id: "courts",
    label: "Courts",
    color: "#6f5b3e",
    bgColor: "rgba(111,91,62,0.12)",
    description: "The legal boundary around public power.",
    details:
      "Courts interpret the Constitution, statutes, and administrative law. They do not run politics, but they can stop unlawful conduct and reshape incentives.",
    connections: ["states", "committees"],
    angle: -80,
  },
  {
    id: "states",
    label: "States",
    color: "#4d6f66",
    bgColor: "rgba(77,111,102,0.12)",
    description: "Federalism means power is split, not singular.",
    details:
      "Australian politics is never only Canberra. States run major service systems and negotiate constantly with the Commonwealth.",
    connections: ["media", "lobbying"],
    angle: -125,
  },
  {
    id: "media",
    label: "Media",
    color: "#916443",
    bgColor: "rgba(145,100,67,0.12)",
    description: "Attention, framing, and public mood sit outside formal institutions.",
    details:
      "The media cannot pass laws, but it can make issues salient, punish incompetence, and reshape what politicians think is politically survivable.",
    connections: ["lobbying", "committees"],
    angle: -165,
  },
  {
    id: "lobbying",
    label: "Lobbying",
    color: "#8a4f5f",
    bgColor: "rgba(138,79,95,0.12)",
    description: "Influence enters through meetings, submissions, and pressure.",
    details:
      "Corporations, unions, NGOs, and industry bodies try to move ministers, staffers, and departments. This is normal politics until it becomes corrupt or opaque.",
    connections: ["committees", "cabinet"],
    angle: 210,
  },
  {
    id: "committees",
    label: "Scrutiny",
    color: "#446270",
    bgColor: "rgba(68,98,112,0.12)",
    description: "Committees, inquiries, audits, and commissions slow the system down on purpose.",
    details:
      "Scrutiny is where claims get tested. In Australia this includes committees, ANAO audits, ombudsmen, regulators, integrity bodies, inquiries, and sometimes royal commissions.",
    connections: ["house", "senate", "cabinet"],
    angle: 250,
  },
]

const policyStages = [
  {
    label: "Issue emerges",
    value: "1",
    description: "Problem, promise, crisis, or pressure.",
    color: "#2f4f79",
    softColor: "rgba(47,79,121,0.12)",
  },
  {
    label: "Options built",
    value: "2",
    description: "Departments and advisers frame choices.",
    color: "#386a58",
    softColor: "rgba(56,106,88,0.12)",
  },
  {
    label: "Consultation",
    value: "3",
    description: "Stakeholders, states, experts, and industry.",
    color: "#a16a1f",
    softColor: "rgba(161,106,31,0.12)",
  },
  {
    label: "Cabinet decision",
    value: "4",
    description: "Politics chooses one path.",
    color: "#7f3529",
    softColor: "rgba(127,53,41,0.12)",
  },
  {
    label: "Delivery path",
    value: "5",
    description: "Program, funding, regulation, or bill.",
    color: "#5b6c8d",
    softColor: "rgba(91,108,141,0.12)",
  },
  {
    label: "Implementation and review",
    value: "6",
    description: "Agencies deliver and reality bites back.",
    color: "#4d6f66",
    softColor: "rgba(77,111,102,0.12)",
  },
]

const legislationStages = [
  {
    label: "Policy instruction",
    value: "1",
    description: "Government decides it needs a law.",
    color: "#2f4f79",
    softColor: "rgba(47,79,121,0.12)",
  },
  {
    label: "Drafting",
    value: "2",
    description: "Legislation is prepared and checked.",
    color: "#386a58",
    softColor: "rgba(56,106,88,0.12)",
  },
  {
    label: "House introduction",
    value: "3",
    description: "First reading and second-reading debate.",
    color: "#a16a1f",
    softColor: "rgba(161,106,31,0.12)",
  },
  {
    label: "Scrutiny and amendment",
    value: "4",
    description: "Committees, negotiations, and Senate leverage.",
    color: "#7f3529",
    softColor: "rgba(127,53,41,0.12)",
  },
  {
    label: "Both houses agree",
    value: "5",
    description: "Identical text survives both chambers.",
    color: "#5b6c8d",
    softColor: "rgba(91,108,141,0.12)",
  },
  {
    label: "Assent and implementation",
    value: "6",
    description: "The Act starts meeting the real world.",
    color: "#4d6f66",
    softColor: "rgba(77,111,102,0.12)",
  },
]

const oversightStages = [
  {
    label: "Committee",
    value: "1",
    description: "Parliamentary evidence and scrutiny.",
    color: "#2f4f79",
    softColor: "rgba(47,79,121,0.12)",
  },
  {
    label: "Audit / Ombudsman",
    value: "2",
    description: "Administrative and financial checks.",
    color: "#386a58",
    softColor: "rgba(56,106,88,0.12)",
  },
  {
    label: "Court / Regulator",
    value: "3",
    description: "Legal boundary and enforcement.",
    color: "#a16a1f",
    softColor: "rgba(161,106,31,0.12)",
  },
  {
    label: "Inquiry",
    value: "4",
    description: "Structured investigation into a failure.",
    color: "#7f3529",
    softColor: "rgba(127,53,41,0.12)",
  },
  {
    label: "Royal Commission",
    value: "5",
    description: "Exceptional public inquiry with major powers.",
    color: "#5b6c8d",
    softColor: "rgba(91,108,141,0.12)",
  },
  {
    label: "Reform / Election",
    value: "6",
    description: "Politics absorbs the findings.",
    color: "#4d6f66",
    softColor: "rgba(77,111,102,0.12)",
  },
]

const exposureAxes = [
  { key: "media", label: "Media heat" },
  { key: "law", label: "Legal detail" },
  { key: "bureaucracy", label: "Bureaucratic complexity" },
  { key: "negotiation", label: "Negotiation intensity" },
  { key: "pressure", label: "Pressure / time stress" },
]

const exposureProfiles = [
  {
    label: "MP / Parliamentarian",
    description: "Public-facing, political, and constantly balancing party, electorate, and media.",
    values: { media: 5, law: 3, bureaucracy: 3, negotiation: 4, pressure: 5 },
  },
  {
    label: "Ministerial Adviser",
    description: "Fast political judgment, heavy briefing flow, and high exposure to risk.",
    values: { media: 4, law: 3, bureaucracy: 4, negotiation: 4, pressure: 5 },
  },
  {
    label: "APS Policy Officer",
    description: "Deep policy work, cabinet process, consultation, and implementation logic.",
    values: { media: 2, law: 4, bureaucracy: 5, negotiation: 4, pressure: 4 },
  },
  {
    label: "Lobbyist / Corporate Affairs",
    description: "External influence work through relationships, submissions, and issue framing.",
    values: { media: 3, law: 3, bureaucracy: 3, negotiation: 5, pressure: 4 },
  },
  {
    label: "Political Journalist",
    description: "Attention, narrative, sources, and deadline-driven public explanation.",
    values: { media: 5, law: 2, bureaucracy: 2, negotiation: 4, pressure: 5 },
  },
]

const roleCards = [
  {
    title: "Federal politician / MP",
    summary:
      "Represents an electorate, negotiates inside party structures, works committees, and lives with permanent scrutiny.",
    href: "/politics/day-in-the-life/federal-politician",
    icon: Landmark,
  },
  {
    title: "Political staffer / adviser",
    summary:
      "Writes, briefs, coordinates, calms, escalates, and keeps a principal from being surprised by the world.",
    href: "/politics/day-in-the-life/political-staffer",
    icon: Users,
  },
  {
    title: "APS policy officer",
    summary:
      "Builds policy options, drafts cabinet-ready work, consults stakeholders, and helps government move from intention to delivery.",
    href: "/politics/day-in-the-life/aps-policy-officer",
    icon: FileText,
  },
  {
    title: "Committee secretariat",
    summary:
      "Runs evidence-heavy parliamentary scrutiny, drafts reports, and turns hearings into institutional memory.",
    href: "/politics/day-in-the-life/committee-secretariat",
    icon: Scale,
  },
  {
    title: "Lobbyist / corporate affairs",
    summary:
      "Represents outside interests into the policy process through persuasion, timing, and clean stakeholder strategy.",
    href: "/politics/day-in-the-life/lobbyist-corporate-affairs",
    icon: Building2,
  },
  {
    title: "Regulator / inquiry role",
    summary:
      "Lives inside the accountability layer where misconduct, failure, and implementation gaps are tested.",
    href: "/politics/day-in-the-life/regulator-investigator",
    icon: ShieldCheck,
  },
  {
    title: "Political journalist",
    summary:
      "Tracks power, narrative, and signals across parliament, media cycles, leaks, and public trust.",
    href: "/politics/day-in-the-life/political-journalist",
    icon: Newspaper,
  },
]

function Section({
  eyebrow,
  title,
  summary,
  children,
  cta,
}: {
  eyebrow: string
  title: string
  summary: string
  children: ReactNode
  cta?: { href: string; label: string }
}) {
  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl">
          <p className="text-[11px] uppercase tracking-[0.18em] text-editorial-muted">
            {eyebrow}
          </p>
          <h2 className="mt-2 font-serif text-3xl font-semibold text-editorial-ink">
            {title}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-editorial-muted">
            {summary}
          </p>
        </div>
        {cta ? (
          <Button asChild variant="secondary">
            <Link href={cta.href}>
              {cta.label}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        ) : null}
      </div>
      {children}
    </section>
  )
}

function MemoryStrip({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <Badge key={item} variant="outline" className="bg-white/80">
          {item}
        </Badge>
      ))}
    </div>
  )
}

export function PoliticsSystemPage({
  subject,
  guideRail,
}: PoliticsSystemPageProps) {
  return (
    <div className="container mx-auto px-4 py-10 space-y-12">
      <Breadcrumbs
        segments={[
          { label: subject.name, href: `/${subject.slug}` },
          { label: "System" },
        ]}
      />

      <EntityHero
        title="Politics as a working system"
        subtitle="Start with the memorable map first: regimes, Australian institutions, policy, legislation, influence, scrutiny, and the people whose careers run inside it."
        entityKind="subject"
        themeColor={subject.color}
        variant="gradient"
        statChips={[
          { label: "Anchor model", value: "Power map" },
          { label: "Worked example", value: "Australia" },
          { label: "Priority", value: "Frameworks first" },
        ]}
      />

      <Card className="rounded-[28px] border-[rgba(44,49,59,0.08)] bg-[rgba(247,243,234,0.78)]">
        <CardContent className="grid gap-4 p-6 lg:grid-cols-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-editorial-muted">
              Mental model
            </p>
            <h3 className="mt-2 font-serif text-xl font-semibold text-editorial-ink">
              Politics is a system for making collective decisions under conflict.
            </h3>
          </div>
          <div className="text-sm leading-relaxed text-editorial-muted">
            The fastest way to understand politics is not to memorise personalities.
            It is to map who decides, who advises, who blocks, who implements, and
            how legitimacy is earned or lost.
          </div>
          <div className="text-sm leading-relaxed text-editorial-muted">
            Once that map is stable, you can drop into campaigns, media strategy,
            ideology, geopolitics, or public policy without drowning in the field.
          </div>
        </CardContent>
      </Card>

      <Section
        eyebrow="1. Regime Comparison"
        title="How different regimes trade freedom, speed, and control"
        summary="Treat regime types as tradeoff systems, not trivia. Every model promises some upside. Every model also carries a predictable failure mode."
        cta={{ href: "/politics/modules/regimes-and-ideologies", label: "Go deeper into regimes" }}
      >
        <MemoryStrip
          items={[
            "Democracy trades speed for legitimacy",
            "Communism trades pluralism for coordination",
            "Fascism trades rights for mobilisation",
            "Authoritarian rule trades accountability for control",
          ]}
        />
        <ComparisonMatrix columns={regimeColumns} rows={regimeRows} />
      </Section>

      <Section
        eyebrow="2. Australia's Operating System"
        title="How Australian politics actually works"
        summary="Australia is a federal parliamentary democracy with a constitutional monarchy, but the memorable operational model is simpler: voters create legitimacy, the House forms government, the Senate forces negotiation, Cabinet chooses direction, the APS builds and implements, and courts enforce legal boundaries."
        cta={{
          href: "/politics/modules/australias-political-system",
          label: "Go deeper into Australia",
        }}
      >
        <div className="grid gap-5 lg:grid-cols-[1.15fr,0.85fr]">
          <ConceptMap
            centerLabel="Australia"
            centerSublabel="power map"
            centerColor={subject.color}
            nodes={australiaNodes}
            radius={36}
            className="rounded-[28px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,255,255,0.82)] p-4 shadow-editorial-soft"
          />

          <div className="space-y-4">
            {[
              {
                title: "House forms government",
                detail:
                  "This is the chamber that decides confidence. If you want to know who governs, start here.",
              },
              {
                title: "Senate makes negotiation real",
                detail:
                  "Australia's review chamber is where amendment, delay, and leverage often happen.",
              },
              {
                title: "Cabinet is the decision core",
                detail:
                  "Most major political choices are shaped here before Parliament sees the final public version.",
              },
              {
                title: "APS turns politics into machinery",
                detail:
                  "Departments turn intention into policy options, bills, implementation plans, and delivery.",
              },
            ].map((item) => (
              <Card
                key={item.title}
                className="rounded-[22px] border-[rgba(44,49,59,0.08)] bg-[rgba(255,255,255,0.82)]"
              >
                <CardContent className="p-5">
                  <h3 className="font-semibold text-editorial-ink">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-editorial-muted">
                    {item.detail}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      <Section
        eyebrow="3. Policy Process"
        title="How an issue becomes policy"
        summary="Policy is where politics becomes substance. The memorable model is: issue, options, consultation, cabinet choice, delivery path, implementation, evaluation."
        cta={{ href: "/politics/modules/policy-process", label: "Go deeper into policy" }}
      >
        <div className="grid gap-5 lg:grid-cols-[1fr,0.9fr]">
          <FlowDiagram
            stages={policyStages}
            orientation="horizontal"
            footerNote="Remember the real leverage point: much of the serious contest happens before Parliament sees a bill."
            className="rounded-[28px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,255,255,0.82)] p-6 shadow-editorial-soft"
          />
          <Card className="rounded-[28px] border-[rgba(44,49,59,0.08)] bg-[rgba(247,243,234,0.78)]">
            <CardContent className="space-y-4 p-6">
              <p className="text-[11px] uppercase tracking-[0.18em] text-editorial-muted">
                Mental model
              </p>
              <h3 className="font-serif text-xl font-semibold text-editorial-ink">
                Policy is politics after slogans end.
              </h3>
              <ul className="space-y-2 text-sm leading-relaxed text-editorial-muted">
                <li>Good policy work turns values and incentives into concrete options.</li>
                <li>Consultation is not decoration. It changes feasibility, cost, and backlash risk.</li>
                <li>Implementation is where strong policy ideas can still die.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section
        eyebrow="4. Legislation"
        title="How policy becomes law"
        summary="The mental model is a funnel: drafting narrows possibility, parliamentary scrutiny tests it, the Senate forces realism, and implementation decides whether the law actually matters."
        cta={{
          href: "/politics/modules/legislation-and-regulation",
          label: "Go deeper into legislation",
        }}
      >
        <div className="grid gap-5 lg:grid-cols-[0.95fr,1.05fr]">
          <FlowDiagram
            stages={legislationStages}
            footerNote="Australia's Senate often matters more in practice than beginner civics suggests."
            className="rounded-[28px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,255,255,0.82)] p-6 shadow-editorial-soft"
          />
          <Card className="rounded-[28px] border-[rgba(44,49,59,0.08)] bg-[rgba(255,255,255,0.82)]">
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center gap-2">
                <Gavel className="h-4 w-4 text-editorial-amber" />
                <p className="text-[11px] uppercase tracking-[0.18em] text-editorial-muted">
                  Upside / downside
                </p>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-[18px] border border-[rgba(56,106,88,0.18)] bg-[rgba(56,106,88,0.08)] p-4">
                  <h3 className="font-semibold text-editorial-ink">Upside</h3>
                  <p className="mt-2 text-sm leading-relaxed text-editorial-muted">
                    Formal law gives durability, clarity, and enforceability that
                    ordinary policy announcements do not.
                  </p>
                </div>
                <div className="rounded-[18px] border border-[rgba(161,76,58,0.18)] bg-[rgba(161,76,58,0.08)] p-4">
                  <h3 className="font-semibold text-editorial-ink">Downside</h3>
                  <p className="mt-2 text-sm leading-relaxed text-editorial-muted">
                    It is slow, contestable, and easy to misunderstand if you only
                    watch the chamber theatrics instead of the drafting and negotiation.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section
        eyebrow="5. Influence and Scrutiny"
        title="How lobbying, committees, inquiries, and commissions fit together"
        summary="Politics is not only Parliament. Influence enters through lobbying, submissions, party networks, media, and public pressure. Scrutiny enters through committees, courts, auditors, integrity bodies, inquiries, and sometimes royal commissions."
        cta={{
          href: "/politics/modules/committees-inquiries-and-royal-commissions",
          label: "Go deeper into scrutiny",
        }}
      >
        <div className="grid gap-5 lg:grid-cols-[1fr,1fr]">
          <Card className="rounded-[28px] border-[rgba(44,49,59,0.08)] bg-[rgba(247,243,234,0.78)]">
            <CardContent className="space-y-4 p-6">
              <p className="text-[11px] uppercase tracking-[0.18em] text-editorial-muted">
                Influence map
              </p>
              <ul className="space-y-3 text-sm leading-relaxed text-editorial-muted">
                <li>
                  Corporations, unions, NGOs, and industry groups influence through
                  meetings, submissions, briefings, campaigns, and coalition work.
                </li>
                <li>
                  Lobbying is normal. Corruption is the line where hidden, dishonest,
                  or improper influence takes over.
                </li>
                <li>
                  Royal commissions do not directly make law. They investigate,
                  expose, recommend, and then throw the problem back into politics.
                </li>
              </ul>
            </CardContent>
          </Card>

          <FlowDiagram
            stages={oversightStages}
            footerNote="Use this ladder as a memory hook: not every failure goes straight to a royal commission."
            className="rounded-[28px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,255,255,0.82)] p-6 shadow-editorial-soft"
          />
        </div>
      </Section>

      <Section
        eyebrow="6. Working in the Field"
        title="What people in politics and public policy actually do"
        summary="Politics becomes real when you understand the documents, meetings, exposure, and pressures inside the field. These roles are not abstract identities. They are working environments."
        cta={{
          href: "/politics/modules/working-in-politics-and-public-policy",
          label: "Go deeper into careers",
        }}
      >
        <div className="grid gap-5 lg:grid-cols-2">
          <CareerLadder
            title="Public service ladder"
            summary="The policy and delivery route that turns political choices into machinery."
            stages={[
              {
                title: "Graduate / analyst",
                summary: "Research briefs, gather evidence, and learn how departments actually move work.",
              },
              {
                title: "Policy officer / adviser",
                summary: "Draft options, coordinate consultation, and translate complexity into decision-ready material.",
              },
              {
                title: "Manager / director",
                summary: "Run teams, negotiate across agencies, and own delivery risk.",
              },
              {
                title: "SES / executive",
                summary: "Steer departments, protect integrity, and make the administrative state work under pressure.",
              },
            ]}
          />
          <CareerLadder
            title="Political and influence ladder"
            summary="The public, strategic, and advocacy paths around elected power."
            stages={[
              {
                title: "Volunteer / staff assistant",
                summary: "Learn the rhythm of campaigns, electorates, and issue work.",
              },
              {
                title: "Adviser / researcher / reporter",
                summary: "Write, brief, source, and interpret the system daily.",
              },
              {
                title: "Chief of staff / senior advocate / editor",
                summary: "Coordinate pressure, message, and access at a senior level.",
              },
              {
                title: "Minister / MP / partner / bureau chief",
                summary: "Carry the public consequences of power, influence, or narrative leadership.",
              },
            ]}
          />
        </div>

        <ExposureMap axes={exposureAxes} profiles={exposureProfiles} />

        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {roleCards.map((role) => {
            const Icon = role.icon
            return (
              <Link
                key={role.href}
                href={role.href}
                className="rounded-[22px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,255,255,0.82)] p-5 shadow-editorial-soft transition-shadow hover:shadow-editorial-hover"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-[rgba(161,76,58,0.08)] text-[rgb(127,53,41)]">
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-editorial-ink">{role.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-editorial-muted">
                      {role.summary}
                    </p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </Section>

      <Card className="rounded-[28px] border-[rgba(44,49,59,0.08)] bg-[rgba(247,243,234,0.78)]">
        <CardContent className="grid gap-5 p-6 lg:grid-cols-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-editorial-muted">
              Remember this
            </p>
            <h3 className="mt-2 font-serif text-xl font-semibold text-editorial-ink">
              Politics is not random.
            </h3>
          </div>
          <div className="text-sm leading-relaxed text-editorial-muted">
            It is a system of incentives, legitimacy, institutions, and pressure.
            Once you can see the models, personalities stop feeling like chaos.
          </div>
          <div className="text-sm leading-relaxed text-editorial-muted">
            The field becomes memorable when you keep returning to power maps,
            tradeoff matrices, process funnels, and real working roles.
          </div>
        </CardContent>
      </Card>

      {guideRail}
    </div>
  )
}
