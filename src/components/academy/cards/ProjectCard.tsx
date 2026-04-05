"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { CheckCircle2, Clock } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useProgress } from "@/lib/progress"
import type { Project } from "@/types/curriculum"

interface ProjectCardProps {
  project: Project
  subjectSlug?: string
  basePath?: string
}

function DifficultyMeter({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs font-medium text-muted-foreground">Difficulty</span>
      <div className="flex gap-0.5">
        {Array.from({ length: 10 }, (_, index) => (
          <div
            key={index}
            className={cn(
              "h-2 w-2.5 rounded-sm transition-colors",
              index < value
                ? value <= 3
                  ? "bg-emerald-500"
                  : value <= 6
                    ? "bg-amber-500"
                    : "bg-rose-500"
                : "bg-muted"
            )}
          />
        ))}
      </div>
      <span className="text-xs font-semibold text-foreground">{value}/10</span>
    </div>
  )
}

export function ProjectCard({
  project,
  subjectSlug,
  basePath = "/projects",
}: ProjectCardProps) {
  const isComplete = useProgress((state) =>
    subjectSlug
      ? (state.subjects[subjectSlug]?.completedProjects ?? []).includes(project.slug)
      : state.completedProjects.includes(project.slug)
  )

  return (
    <Link href={`${basePath}/${project.slug}`} className="block">
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <Card className="h-full hover:border-primary/40 transition-colors">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-2">
              <DifficultyMeter value={project.difficulty} />
              {isComplete && (
                <Badge className="bg-editorial-green-soft text-editorial-green border-transparent text-[10px]">
                  <CheckCircle2 className="h-2.5 w-2.5 mr-0.5" />
                  Done
                </Badge>
              )}
            </div>
            <CardTitle className="text-lg mt-2">{project.title}</CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            <CardDescription className="line-clamp-2">
              {project.description}
            </CardDescription>

            <div className="flex flex-wrap gap-1.5">
              {project.skillsLearned.slice(0, 4).map((skill) => (
                <Badge key={skill} variant="outline" className="text-[11px]">
                  {skill}
                </Badge>
              ))}
              {project.skillsLearned.length > 4 && (
                <Badge variant="outline" className="text-[11px]">
                  +{project.skillsLearned.length - 4}
                </Badge>
              )}
            </div>
          </CardContent>

          <CardFooter>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>
                {project.estimatedHours} hour{project.estimatedHours !== 1 ? "s" : ""}
              </span>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </Link>
  )
}
