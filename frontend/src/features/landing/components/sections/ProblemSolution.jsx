// src/features/landing/components/sections/ProblemSolution.jsx
import React from "react";
import ProblemCard from "../cards/ProblemCard";
import SolutionCard from "../cards/SolutionCard";
import { PROBLEM_SOLUTION_STRINGS } from "../../constants/landingConstants";
import {
  MotionDiv,
  MotionStagger,
  MotionItem,
} from "@/animations/MotionElements";

export default function ProblemSolution() {
  const problems = PROBLEM_SOLUTION_STRINGS.items.map((item) => item.problem);
  const solutions = PROBLEM_SOLUTION_STRINGS.items.map((item) => item.solution);

  return (
    <section
      id="problem-solution"
      className="relative min-h-screen py-12 flex items-center overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/p-section-bg.jpg" 
          alt=""
          className="w-full h-full object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl w-full mx-auto px-6">
        {/* Header*/}
        <MotionDiv delay={0.1} className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-warning/10 text-warning text-lg font-semibold border border-warning/20 mb-6">
            {PROBLEM_SOLUTION_STRINGS.badge}
          </span>

          <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            {PROBLEM_SOLUTION_STRINGS.titleFirst}
            <br />
            <span className="text-primary">
              {PROBLEM_SOLUTION_STRINGS.titleSecond}
            </span>
          </h2>

          <p className="text-muted text-lg leading-8 max-w-2xl mx-auto">
            {PROBLEM_SOLUTION_STRINGS.subtitle}
          </p>
        </MotionDiv>

        {/* Cards*/}
        <MotionStagger className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Problem card*/}
          <MotionItem>
            <ProblemCard
              title={PROBLEM_SOLUTION_STRINGS.problemCardTitle}
              items={problems}
            />
          </MotionItem>

          {/* Solution card*/}
          <MotionItem>
            <SolutionCard
              title={PROBLEM_SOLUTION_STRINGS.solutionCardTitle}
              items={solutions}
            />
          </MotionItem>
        </MotionStagger>
      </div>
    </section>
  );
}
