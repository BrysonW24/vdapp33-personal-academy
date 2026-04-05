"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Brain, ArrowRight, CheckCircle2, Trophy, XCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useProgress } from "@/lib/progress"

interface QuizQuestion {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

interface QuizSectionProps {
  quiz: QuizQuestion[]
  lessonSlug: string
  subjectSlug?: string
}

export function QuizSection({
  quiz,
  lessonSlug,
  subjectSlug,
}: QuizSectionProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [results, setResults] = useState<boolean[]>([])
  const [finished, setFinished] = useState(false)

  const { completeLesson, getSubjectProgress, isLessonComplete, saveQuizResult } =
    useProgress()

  const alreadyComplete = subjectSlug
    ? isLessonComplete(subjectSlug, lessonSlug)
    : isLessonComplete(lessonSlug)

  const question = quiz[currentQuestion]
  const isCorrect = selected === question?.correctIndex

  function handleSelect(index: number) {
    if (revealed) return
    setSelected(index)
    setRevealed(true)
    setResults((previous) => [...previous, index === question.correctIndex])
  }

  function handleNext() {
    if (currentQuestion < quiz.length - 1) {
      setCurrentQuestion((value) => value + 1)
      setSelected(null)
      setRevealed(false)
      return
    }

    const score = results.filter(Boolean).length
    subjectSlug
      ? saveQuizResult(subjectSlug, lessonSlug, score, quiz.length)
      : saveQuizResult(lessonSlug, score, quiz.length)
    subjectSlug
      ? completeLesson(subjectSlug, lessonSlug)
      : completeLesson(lessonSlug)
    setFinished(true)
  }

  if (alreadyComplete && !finished) {
    const stored = subjectSlug
      ? getSubjectProgress(subjectSlug).quizResults[lessonSlug]
      : useProgress.getState().quizResults[lessonSlug]

    return (
      <Card className="border-editorial-green/30 bg-editorial-green-soft/20">
        <CardContent className="p-5 flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-editorial-green shrink-0" />
          <div>
            <p className="font-semibold text-sm text-editorial-green">
              Knowledge Check Complete
            </p>
            {stored && (
              <p className="text-xs text-editorial-muted mt-0.5">
                You scored {stored.score}/{stored.total}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (finished) {
    const score = results.filter(Boolean).length

    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="border-editorial-green/30 bg-editorial-green-soft/20">
          <CardContent className="p-6 text-center space-y-3">
            <Trophy className="h-8 w-8 text-editorial-amber mx-auto" />
            <p className="text-xl font-bold font-serif">
              {score === quiz.length
                ? "Perfect Score!"
                : score >= quiz.length - 1
                  ? "Great Work!"
                  : "Keep Going!"}
            </p>
            <p className="text-sm text-editorial-muted">
              You got {score} of {quiz.length} correct
            </p>
            <div className="flex justify-center gap-2">
              {results.map((correct, index) => (
                <div
                  key={index}
                  className={cn(
                    "h-3 w-3 rounded-full",
                    correct ? "bg-editorial-green" : "bg-editorial-red"
                  )}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Brain className="h-5 w-5 text-editorial-blue" />
          Knowledge Check
        </h2>
        <Badge variant="outline" className="text-xs">
          {currentQuestion + 1} of {quiz.length}
        </Badge>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
        >
          <Card>
            <CardContent className="p-5 space-y-4">
              <p className="font-medium text-sm">{question.question}</p>

              <div className="space-y-2">
                {question.options.map((option, index) => {
                  const isSelected = selected === index
                  const isAnswer = index === question.correctIndex

                  return (
                    <button
                      key={index}
                      onClick={() => handleSelect(index)}
                      disabled={revealed}
                      className={cn(
                        "w-full text-left rounded-[14px] border-2 p-3.5 text-sm transition-all duration-200",
                        revealed && isAnswer
                          ? "border-editorial-green bg-editorial-green-soft/40"
                          : revealed && isSelected && !isAnswer
                            ? "border-editorial-red bg-editorial-red-soft/40"
                            : isSelected
                              ? "border-editorial-blue bg-editorial-blue-soft/30"
                              : "border-transparent bg-editorial-canvas/60 hover:bg-editorial-canvas hover:border-editorial-ink/10",
                        revealed && !isSelected && !isAnswer && "opacity-40"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full border text-xs font-mono shrink-0">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span>{option}</span>
                        {revealed && isAnswer && (
                          <CheckCircle2 className="h-4 w-4 text-editorial-green ml-auto shrink-0" />
                        )}
                        {revealed && isSelected && !isAnswer && (
                          <XCircle className="h-4 w-4 text-editorial-red ml-auto shrink-0" />
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>

              {revealed && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="rounded-[12px] bg-white/80 border border-editorial-ink/5 p-4"
                >
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-editorial-muted mb-1">
                    {isCorrect ? "Correct!" : "Not quite"}
                  </p>
                  <p className="text-sm text-editorial-muted leading-relaxed">
                    {question.explanation}
                  </p>
                </motion.div>
              )}

              {revealed && (
                <div className="flex justify-end">
                  <Button size="sm" onClick={handleNext} className="gap-1.5">
                    {currentQuestion < quiz.length - 1
                      ? "Next Question"
                      : "See Results"}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </section>
  )
}
