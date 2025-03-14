"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { AnimatedListItem } from "@/ui/atoms/animated-list-item";
import { Badge } from "@/ui/atoms/badge";
import { Button } from "@/ui/atoms/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/ui/atoms/cards";
import { Separator } from "@/ui/atoms/separator";
import { Tabs, TabsContent } from "@/ui/atoms/tabs";
import { AnimatedTabs } from "@/ui/resume/animated-tabs";
import { DownloadResumeButton } from "@/ui/resume/download-button";
import { SkillsVisualization } from "@/ui/resume/skills-visualization";
import { ResumeTimeline } from "@/ui/resume/timeline";
import { LinkedinIcon as Linkedin } from "@/ui/svg/linkedin";
import { GithubIcon } from "../svg/github";

export function InteractiveResume() {
  const [activeTab, setActiveTab] = useState("Experience");
  const tabs = ["Experience", "Skills", "Education", "Testimonials"];

  return (
    <section className="font-basis-grotesque-pro-regular container mx-auto px-4 py-8 md:px-6 lg:py-12">
      <div className="mb-8">
        <Button
          variant="ghost"
          size="sm"
          className="inline-flex items-center justify-start"
          asChild>
          <Link href="/" className="inline-flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4 flex-shrink-0" />
            <span className="whitespace-nowrap">Back to Home</span>
          </Link>
        </Button>
      </div>
      <div className="mb-8 flex flex-col items-start justify-between gap-6 md:flex-row">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Andrew S. Ross</h1>
          <p className="text-muted-foreground mt-1 text-xl">
            Software Engineering Lead
          </p>
          <p className="text-muted-foreground mt-2">Barrington, Illinois</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <DownloadResumeButton />
          <div className="flex gap-2">
            <Button variant="outline" size="icon" asChild>
              <a
                href="mailto:andew@windycitydevs.io"
                aria-label="Email"
                rel="noopener noreferrer"
                className="appearance-none">
                <Mail className="size-4" />
              </a>
            </Button>
            <Button variant="outline" size="icon" asChild>
              <a
                className="apperance-none"
                href="https://linkedin.com/in/asross"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn">
                <Linkedin className="size-4" />
              </a>
            </Button>
            <Button variant="outline" size="icon" asChild>
              <a
                className="apperance-none"
                rel="noopener noreferrer"
                href="https://github.com/DopamineDriven"
                target="_blank"
                aria-label="Github">
                <GithubIcon className="size-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>

      <p className="mb-8 max-w-3xl text-lg">
        Lead Software Engineer with 5+ years' experience delivering
        high-performance web and XR solutions. Skilled in React, TypeScript,
        Node.js, and Package Development. Passionate about driving innovation
        and cross-functional collaboration to scale products globally.
      </p>

      <AnimatedTabs tabs={tabs} onTabChange={setActiveTab} />

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}>
          {activeTab === "Experience" && (
            <Tabs value="Experience">
              <TabsContent value="Experience" className="space-y-8">
                <ResumeTimeline />
              </TabsContent>
            </Tabs>
          )}

          {activeTab === "Skills" && (
            <Tabs value="Skills">
              <TabsContent value="Skills">
                <div className="grid gap-8 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Technical Skills</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h3 className="mb-2 font-medium">Languages</h3>
                          <div className="flex flex-wrap gap-2">
                            <Badge className="bg-primary/90">
                              TypeScript (Expert)
                            </Badge>
                            <Badge className="bg-primary/90">
                              JavaScript (Expert)
                            </Badge>
                            <Badge>SQL</Badge>
                            <Badge>Python</Badge>
                            <Badge>Go</Badge>
                          </div>
                        </div>

                        <div>
                          <h3 className="mb-2 font-medium">
                            Frameworks & Libraries
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            <Badge className="bg-primary/90">
                              Next.js (Expert)
                            </Badge>
                            <Badge className="bg-primary/90">
                              React.js (Expert)
                            </Badge>
                            <Badge className="bg-primary/90">
                              Node.js (Expert)
                            </Badge>
                            <Badge>Tailwindcss</Badge>
                            <Badge>GraphQL</Badge>
                            <Badge>REST</Badge>
                            <Badge>Prisma</Badge>
                            <Badge>Postgres</Badge>
                            <Badge>SQL Server</Badge>
                            <Badge>d3</Badge>
                          </div>
                        </div>

                        <div>
                          <h3 className="mb-2 font-medium">
                            Platforms & Services
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            <Badge>Azure</Badge>
                            <Badge>GCP</Badge>
                            <Badge>AWS</Badge>
                            <Badge>Vercel</Badge>
                            <Badge>Heroku</Badge>
                            <Badge>Docker</Badge>
                            <Badge>JFrog</Badge>
                            <Badge>WordPress</Badge>
                            <Badge>Sanity</Badge>
                          </div>
                        </div>

                        <div>
                          <h3 className="mb-2 font-medium">Tools</h3>
                          <div className="flex flex-wrap gap-2">
                            <Badge>Git</Badge>
                            <Badge>Figma</Badge>
                            <Badge>Photoshop</Badge>
                            <Badge>Illustrator</Badge>
                            <Badge>Word</Badge>
                            <Badge>PowerPoint</Badge>
                            <Badge>Excel</Badge>
                            <Badge>Adobe Acrobat</Badge>
                            <Badge>3dvista Pro</Badge>
                            <Badge>Movavi</Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Skills Ecosystem</CardTitle>
                      <CardDescription>
                        Interactive visualization of technical skills and their
                        relationships (Work In Progress)
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex h-[500px] items-center justify-center">
                      <SkillsVisualization />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          )}

          {activeTab === "Education" && (
            <Tabs value="Education">
              <TabsContent value="Education">
                <Card>
                  <CardHeader>
                    <CardTitle>Education</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <motion.ul className="space-y-6">
                      <AnimatedListItem index={0}>
                        <h3 className="text-lg font-medium">
                          The University of Iowa, Iowa City, IA
                        </h3>
                        <ul className="text-muted-foreground mt-2 space-y-1">
                          <li>Bachelor of Science — Bio Anthropology</li>
                          <li>Bachelor of Arts — Biochemistry</li>
                          <li>Minor — Chemistry</li>
                        </ul>
                      </AnimatedListItem>

                      <AnimatedListItem index={1}>
                        <Separator className="my-4" />
                      </AnimatedListItem>

                      <AnimatedListItem index={2}>
                        <h3 className="text-lg font-medium">
                          Northwestern University, Evanston, IL
                        </h3>
                        <p className="text-muted-foreground mt-2">
                          Professional Certificate — Full-stack Development
                        </p>
                      </AnimatedListItem>
                    </motion.ul>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}

          {activeTab === "Testimonials" && (
            <Tabs value="Testimonials">
              <TabsContent value="Testimonials">
                <Card>
                  <CardHeader>
                    <CardTitle>Testimonials</CardTitle>
                    <CardDescription>
                      Feedback from Takeda colleagues
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <motion.ul className="space-y-6">
                      {/* <AnimatedListItem index={1}>
                        <blockquote className="border-l-4 pl-4 italic">
                          "By sharing your expertise and embodying Takeda's
                          leadership themes, you are driving innovation and
                          accelerating our digital journey... Your mindset of
                          curiosity and relentless commitment to excellence has
                          been the driving force behind what we have achieved
                          this year."
                          <footer className="text-muted-foreground mt-2 text-sm">
                            – Kristen F., T/E Leadership Team
                          </footer>
                        </blockquote>
                      </AnimatedListItem> */}

                      <AnimatedListItem index={0}>
                        <blockquote className="border-l-4 pl-4 italic">
                          "With your performance optimization of our
                          experiences, you were able to single handedly improve
                          performance of the website 3x, which is a metric that
                          led Intelligent Workplace KPIs during Q2 review."
                          <footer className="text-muted-foreground mt-2 text-sm">
                            – Matthew M.
                          </footer>
                        </blockquote>
                      </AnimatedListItem>
                      <AnimatedListItem index={1}>
                        <blockquote className="border-l-4 pl-4 italic">
                          "Andrew has been a constant and reliable building
                          block of our team over the last couple of years and is
                          always willing to help out and go the extra mile when
                          needed."
                          <footer className="text-muted-foreground mt-2 text-sm">
                            – Daniel K.
                          </footer>
                        </blockquote>
                      </AnimatedListItem>

                      <AnimatedListItem index={2}>
                        <blockquote className="border-l-4 pl-4 italic">
                          "Your tireless dedication and innovative approach have
                          helped make a significant impact on our organization
                          and its mission. By creating engaging and informative
                          experiences, we will effectively reach thousands of
                          potential donors."
                          <footer className="text-muted-foreground mt-2 text-sm">
                            – Matthew M.
                          </footer>
                        </blockquote>
                      </AnimatedListItem>
                    </motion.ul>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
