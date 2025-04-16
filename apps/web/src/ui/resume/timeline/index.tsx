"use client";

import { Calendar, MapPin } from "lucide-react";
import { motion } from "motion/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/ui/atoms/cards";

const experiences = [
  {
    title: "JAMstack Development Lead",
    company: "Takeda",
    location: "Lexington, MA (Remote)",
    period: "April 2022 – September 2024",
    description:
      "Led a global team of developers to build and deploy UI/UX-focused web and XR solutions, including the new Takeda dot com site which was shipped across 70 geographies. Collaborated with the Immersive Experience team to design visually engaging interfaces using React, TypeScript, & Next.js.",
    achievements: [
      "Decreased build times 4x by leading a Netlify-to-Vercel migration",
      "Developed @takeda-digital/xr, a CLI package to automate XR project deployment of 20+ projects; enabled non-developers to hand off assets (3DVista Pro) and generated deployment-ready Next.js apps (analytics, SSO auth, API routes, middleware) with 3 commands, reducing deployment time from weeks to under 1 hour",
      "Leveraged Cloudinary CDN to mirror 100,000+ media assets per project, improving performance by 3x, as recognized by the Head of Immersive Experiences",
      "Designed and deployed BioLife XR, a user-centric virtual experience targeting prospective donors using @takeda-digital/xr, reaching 4,000–5,000 users monthly since launch",
      "Analyzed Google Analytics to identify and fix a Facebook mobile browser issue, implementing edge middleware redirect logic that reduced bounce rate by 15% and increased conversions by 20%",
      "Developed an internal package ecosystem (12+ packages) used by 20+ projects org-wide",
      "Guided the organization in adopting Next.js, coaching non-technical stakeholders on best practices and accelerating enterprise-wide buy-in. Leveraged Sanity CMS as our headless CMS of choice",
      "Conducted several dozen interviews for Senior Engineer and Senior Architect roles and directly onboarded and mentored several of these hires by hosting weekly roundtables"
    ]
  },
  {
    title: "Software Engineer & HIPAA Compliance Officer",
    company: "Cortina",
    location: "Chattanooga, TN (Remote)",
    period: "May 2021 – February 2022",
    description:
      "Developed a full-stack telemedicine platform with React, TypeScript, Node, & Prisma, integrating REST APIs (Zendesk, HubSpot, Stripe) for real-time data syncing. Synced HubSpot CRM via Nest.js+Next.js strategy.",
    achievements: [
      "Built an event-driven ticketing system for Patients/MDs via TypeGraphQL",
      "Completed necessary steps to secure HIPAA seal of Compliance for the teledermatology startup",
      "Conducted weekly meetings with an external marketing firm; worked closely with the head designer"
    ]
  },
  {
    title: "Cofounder & Tech Lead",
    company: "Windy City Devs LLC",
    location: "Highland Park, IL",
    period: "March 2020 – February 2022",
    description:
      "Modernized client web presence with Next.js and headless WordPress on AWS, focusing on performance, SEO, and UI/UX.",
    achievements: [
      "Architected Headless WP strategy",
      "Optimized accessibility features by integrating AWS Polly and Alexa text-to-voice"
    ]
  },
  {
    title: "Full-Stack Bootcamp TA",
    company: "Vanderbilt University",
    location: "Nashville, TN (Remote)",
    period: "September 2020 – March 2021",
    description:
      "Mentored 40+ students in full-stack development, focusing on React, Node, and GraphQL.",
    achievements: [
      "Mentored a cohort of 40+ aspiring developers through hands-on projects"
    ]
  }
];

export function ResumeTimeline() {
  return (
    <div className="space-y-8">
      {experiences.map((experience, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}>
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle>{experience.title}</CardTitle>
                  <CardDescription className="mt-1 text-base">
                    {experience.company}
                  </CardDescription>
                </div>
                <div className="text-muted-foreground flex flex-col text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{experience.period}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{experience.location}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{experience.description}</p>
              <ul className="list-disc space-y-2 pl-5">
                {experience.achievements.map((achievement, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + i * 0.1 }}>
                    {achievement}
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

/**
 import type React from "react"
import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component"
import "react-vertical-timeline-component/style.min.css"
import { FaBriefcase } from "react-icons/fa"

const experiences = [
  {
    title: "JAMstack Development Lead",
    company: "Takeda Pharmaceuticals",
    location: "Lexington, MA (Remote)",
    period: "April 2022 – September 2024",
    description:
      "Led a global team of developers to build and deploy UI/UX-focused web and XR solutions, including the new Takeda dot com site which was shipped across 70 geographies. Collaborated with the Immersive Experience team to design visually engaging interfaces using React, TypeScript, & Next.js.",
    achievements: [
      "Decreased build times 4x by leading a Netlify-to-Vercel migration",
      "Developed @takeda-digital/xr, a CLI package to automate XR project deployment of 20+ projects; enabled non-developers to hand off assets (3DVista Pro) and generated deployment-ready Next.js apps (analytics, SSO auth, API routes, middleware) with 3 commands, reducing deployment time from weeks to under 1 hour",
      "Leveraged Cloudinary CDN to mirror 100,000+ media assets per project, improving performance by 3x, as recognized by the Head of Immersive Experiences",
      "Designed and deployed BioLife XR, a user-centric virtual experience targeting prospective donors using @takeda-digital/xr, reaching 4,000–5,000 users monthly since launch",
      "Analyzed Google Analytics to identify and fix a Facebook mobile browser issue, implementing edge middleware redirect logic that reduced bounce rate by 15% and increased conversions by 20%",
      "Developed an internal package ecosystem (12+ packages) used by 20+ projects org-wide",
      "Guided the organization in adopting Next.js, coaching non-technical stakeholders on best practices and accelerating enterprise-wide buy-in. Leveraged Sanity CMS as our headless CMS of choice",
      "Conducted several dozen interviews for Senior Engineer and Senior Architect roles and directly onboarded and mentored several of these hires by hosting weekly roundtables",
    ],
  },
  {
    title: "Software Engineer & HIPAA Compliance Officer",
    company: "Cortina",
    location: "Chattanooga, TN (Remote)",
    period: "May 2021 – February 2022",
    description:
      "Developed a full-stack telemedicine platform with React, TypeScript, Node, & Prisma, integrating REST APIs (Zendesk, HubSpot, Stripe) for real-time data syncing. Synced HubSpot CRM via Nest.js+Next.js strategy.",
    achievements: [
      "Built an event-driven ticketing system for Patients/MDs via TypeGraphQL",
      "Completed necessary steps to secure HIPAA seal of Compliance for the teledermatology startup",
      "Conducted weekly meetings with an external marketing firm; worked closely with the head designer",
    ],
  },
  {
    title: "Cofounder & Tech Lead",
    company: "Windy City Devs LLC",
    location: "Highland Park, IL",
    period: "March 2020 – February 2022",
    description:
      "Modernized client web presence with Next.js and headless WordPress on AWS, focusing on performance, SEO, and UI/UX.",
    achievements: [
      "Architected Headless WP strategy",
      "Optimized accessibility features by integrating AWS Polly and Alexa text-to-voice",
    ],
  },
  {
    title: "Full-Stack Bootcamp TA",
    company: "Vanderbilt University",
    location: "Nashville, TN (Remote)",
    period: "September 2020 – March 2021",
    description: "Mentored 40+ students in full-stack development, focusing on React, Node, and GraphQL.",
    achievements: ["Mentored a cohort of 40+ aspiring developers through hands-on projects"],
  },
]

const ResumeTimeline: React.FC = () => {
  return (
    <VerticalTimeline>
      {experiences.map((experience, index) => (
        <VerticalTimelineElement
          key={index}
          className="vertical-timeline-element--work"
          contentStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
          contentArrowStyle={{ borderRight: "7px solid  rgb(33, 150, 243)" }}
          date={experience.period}
          iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
          icon={<FaBriefcase />}
        >
          <h3 className="vertical-timeline-element-title">{experience.title}</h3>
          <h4 className="vertical-timeline-element-subtitle">
            {experience.company}, {experience.location}
          </h4>
          <p>{experience.description}</p>
          <ul>
            {experience.achievements.map((achievement, i) => (
              <li key={i}>{achievement}</li>
            ))}
          </ul>
        </VerticalTimelineElement>
      ))}
    </VerticalTimeline>
  )
}

export default ResumeTimeline

 */
