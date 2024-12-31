import Link from 'next/link'
import { getPosts } from '@/lib/posts'

export default async function Home() {
  const posts = await getPosts()
  const recentPosts = posts.slice(0, 3) // Get the 3 most recent posts

  return (
    <div className="space-y-12">
      <section>
        <h1 className="text-4xl font-bold mb-4">Welcome to My Portfolio</h1>
        <p className="text-xl">
          I'm Andrew S. Ross, a passionate engineer and tinkerer creating amazing web experiences.
        </p>
      </section>
      <section>
        <h2 className="text-2xl font-semibold mb-4">Featured Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <a
            href="https://experience.biolifeplasma.com"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-secondary p-4 rounded-lg transition-bg transition-color hover:opacity-90"
          >
            <h3 className="text-lg font-semibold">BioLife XR Experience</h3>
            <p>Led development of immersive 3D experiences for Takeda's plasma donation centers.</p>
          </a>
          <a
            href="https://www.thefaderoominc.com"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-secondary p-4 rounded-lg transition-bg transition-color hover:opacity-90"
          >
            <h3 className="text-lg font-semibold">The Fade Room Inc</h3>
            <p>Modern website for a Highland Park barbershop featuring dark theme and online booking.</p>
          </a>
          <div className="bg-secondary p-4 rounded-lg transition-bg transition-color">
            <h3 className="text-lg font-semibold">Cortina CRM</h3>
            <p>Built a CRM using Nest.js and Next.js with custom authentication.</p>
          </div>
          <div className="bg-secondary p-4 rounded-lg transition-bg transition-color">
            <h3 className="text-lg font-semibold">Headless WP Strategy</h3>
            <p>Architected Headless WordPress solutions for modern web presence.</p>
          </div>
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-semibold mb-4">Recent Blog Posts</h2>
        <div className="grid gap-6">
          {recentPosts.map((post) => (
            <article key={post.slug} className="group">
              <Link href={`/posts/${post.slug}`}>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <time className="text-secondary text-sm">
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                  <p className="text-foreground/80">{post.description}</p>
                </div>
              </Link>
            </article>
          ))}
        </div>
        <div className="mt-6">
          <Link href="/blog" className="text-primary hover:underline">
            View all blog posts →
          </Link>
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-semibold mb-4">Key Skills</h2>
        <ul className="list-disc list-inside grid grid-cols-2 gap-2">
          <li>Next.js / React.js</li>
          <li>TypeScript / Node.js</li>
          <li>GraphQL / REST APIs</li>
          <li>AWS / Azure / GCP</li>
          <li>Docker / Kubernetes</li>
          <li>UI/UX Design</li>
        </ul>
      </section>
    </div>
  )
}

