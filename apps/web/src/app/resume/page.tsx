import { FaEnvelope, FaGlobe, FaStackOverflow } from "react-icons/fa";

export default function Resume() {
  return (
    <div className="min-h-screen bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-lg bg-white shadow-xl dark:bg-gray-800">
        <header className="bg-primary p-6 text-black dark:text-white">
          <h1 className="text-3xl font-bold">Andrew S. Ross</h1>
          <p className="mt-2 text-xl">Engineer, Tinkerer</p>
          <div className="mt-4 flex space-x-4">
            <a
              href="mailto:andrew@windycitydevs.io"
              className="flex items-center">
              <FaEnvelope className="mr-2" />
              andrew@windycitydevs.io
            </a>
            <a
              href="https://andrewross.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center">
              <FaGlobe className="mr-2" />
              andrewross.dev
            </a>
            <a
              href="https://stackoverflow.com/users/youruserid"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center">
              <FaStackOverflow className="mr-2" />
              Stack Overflow
            </a>
          </div>
        </header>

        <article className="p-6 text-foreground">
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-primary">
              Professional Experience
            </h2>

            <div className="mb-6">
              <h3 className="text-xl font-semibold">Freelance Web Developer</h3>
              <p className="text-secondary">
                The Fade Room Inc. - Highland Park, IL
              </p>
              <p className="text-secondary">December 2023</p>
              <ul className="mt-2 list-inside list-disc space-y-2">
                <li>
                  Designed and developed a modern, responsive website for an
                  independent barbershop.
                </li>
                <li>
                  Implemented dark theme design with gold accents for brand
                  consistency.
                </li>
                <li>
                  Built custom gallery showcase and online booking integration.
                </li>
                <li>
                  Created mobile-first layout with optimized performance and
                  SEO.
                </li>
              </ul>
            </div>
            <div className="mb-6">
              <h3 className="text-xl font-semibold">
                JAMstack Development Lead
              </h3>
              <p className="text-secondary">
                Takeda Pharmaceuticals, Intelligent Workplace Business Unit
              </p>
              <p className="text-secondary">April 2022 - September 2024</p>
              <ul className="mt-2 list-inside list-disc space-y-2">
                <li>
                  Spearheaded POCs for new technology integration across dev
                  teams and non-technical stakeholder projects.
                </li>
                <li>
                  Drove adoption of Next.js and Vercel, resulting in 4x faster
                  builds and deployment across 70+ geographies.
                </li>
                <li>
                  Architected and maintained an internal package ecosystem
                  published to a private AWS-hosted jfrog registry.
                </li>
                <li>
                  Collaborated with XR team, deploying secure and scalable
                  immersive experiences.
                </li>
                <li>
                  Developed a CLI package for asset transformation in 3D
                  software, powering 15+ XR projects.
                </li>
                <li>
                  Built a proof of concept for an Apple Wallet employee ID
                  generator, collaborating internationally.
                </li>
                <li>
                  Popularized monorepo usage and created a CLI package for
                  efficient project scaffolding.
                </li>
                <li>
                  Worked extensively with Node, TypeScript, React, Sanity,
                  Algolia, Cloudinary, Stackbit, Prisma, Azure, SQLServer, and
                  PostgreSQL.
                </li>
                <li>
                  Oversaw development of a new Plasma Derived Therapies employee
                  portal for BioLife.
                </li>
                <li>
                  Conducted numerous interviews for Senior Engineer and Senior
                  Architect roles.
                </li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold">
                Software Engineer & HIPAA Compliance Officer
              </h3>
              <p className="text-secondary">Cortina</p>
              <p className="text-secondary">June 2021 - February 2022</p>
              <ul className="mt-2 list-inside list-disc space-y-2">
                <li>
                  Served as HIPAA Compliance officer, securing official seal of
                  compliance.
                </li>
                <li>
                  Introduced regular dockerfile.yml usage for various services.
                </li>
                <li>
                  Built a CRM using Nest.js and Next.js with custom
                  server-to-serverless authentication.
                </li>
                <li>
                  Developed integrations for Zendesk, Hubspot, and created an
                  event-driven ticketing system.
                </li>
                <li>
                  Collaborated closely with lead UI/UX Designer, prototyping in
                  Figma.
                </li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold">Cofounder & Tech Lead</h3>
              <p className="text-secondary">Windy City Devs LLC</p>
              <p className="text-secondary">March 2020 - May 2021</p>
              <ul className="mt-2 list-inside list-disc space-y-2">
                <li>
                  Architected Headless WP strategy to modernize client web
                  presence.
                </li>
                <li>
                  Hosted Headless WordPress backends on AWS with CloudFront CDN
                  integration.
                </li>
                <li>
                  Optimized code reusability using Next.js, TypeScript, GraphQL,
                  and Tailwind CSS.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold">Full-Stack Bootcamp TA</h3>
              <p className="text-secondary">Vanderbilt University</p>
              <p className="text-secondary">September 2020 - April 2021</p>
              <ul className="mt-2 list-inside list-disc space-y-2">
                <li>Provided 1:1 and group instruction three times weekly.</li>
                <li>
                  Hosted weekly office hours for additional student support.
                </li>
                <li>
                  Presented new course material and solutions twice weekly
                  during lectures.
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-primary">
              Education
            </h2>
            <div className="mb-4">
              <h3 className="text-xl font-semibold">The University of Iowa</h3>
              <p>B.A. Biochemistry, B.S. Anthropology</p>
              <p>Chemistry Minor</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold">Northwestern University</h3>
              <p>Full-Stack Development</p>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-primary">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {[
                "TypeScript",
                "Next.js",
                "Nest.js",
                "React.js",
                "Prisma",
                "Node.js",
                "Tailwind CSS",
                "GraphQL",
                "REST",
                "Express.js",
                "Turborepo",
                "Vercel",
                "Jfrog",
                "PostgreSQL",
                "MongoDB",
                "MySQL",
                "SQL Server",
                "Sanity",
                "Algolia",
                "Okta",
                "Nexus",
                "TypeGraphQL",
                "Apollo",
                "Relay",
                "Postcss",
                "Redis",
                "Bull",
                "Codegen",
                "SWR",
                "Urql",
                "Axios",
                "Cloudflare",
                "Cloudinary",
                "Azure",
                "AWS",
                "GCP",
                "Docker",
                "WSL2",
                "WordPress",
                "WPGraphQL",
                "Stackbit",
                "Shopify",
                "Contentful",
                "Apache/Nginx",
                "PHP",
                "UI/UX",
                "Figma",
                "Photoshop"
              ].map(skill => (
                <span
                  key={skill}
                  className="rounded-full bg-primary bg-opacity-10 px-2 py-1 text-sm text-primary">
                  {skill}
                </span>
              ))}
            </div>
          </section>
        </article>
      </div>
    </div>
  );
}
