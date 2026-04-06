import { NexusWordmark } from "@/components/branding/NexusWordmark"

export function Footer() {
  return (
    <footer className="relative z-[1] mx-[18px] mb-[18px] mt-8 rounded-[18px] border border-[rgba(44,49,59,0.08)] bg-[rgba(255,252,247,0.78)] backdrop-blur-[16px] py-6">
      <div className="container flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-editorial-muted">
        <div className="flex items-center gap-3">
          <NexusWordmark size="compact" />
          <p>by Vivacity Digital</p>
        </div>
        <p>Curiosity-driven learning in one multi-subject shell</p>
      </div>
    </footer>
  )
}
