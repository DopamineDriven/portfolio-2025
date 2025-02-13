export const getProjects = [
  {
    id: "1",
    title: "NEXT CHESS BOT",
    description: "ELEVATE YOUR GAME",
    imageUrl:
      "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/chess-v2/public/og.png",
    link: "/projects/next-chess-bot",
    slug: "next-chess-bot",
    externalLink: "https://www.nextchessbot.com",
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwindcss",
      "Websockets",
      "Webworkers",
      "v0",
      "Vercel",
      "motion",
      "@d0paminedriven/chess-icons",
      "@d0paminedriven/fs"
    ],
    date: "2025",
    content:
      "Next Chess Bot is powered by Stockfish chess engine and built with Next.js. It offers players several difficulty levels to choose from, best-path highlighting on a move-by-move basis in the form of hints, previous move navigation both during a match and following it, and helps to improve chess skills overall by providing realtime advantage feedback (black vs white advantage which changes with each move). An advantage graph is currently generated on a move-by-move basis on desktop only; downloading stats from a match that illustrate relative advantage by move as a single image coming soon (powered by recharts).\n"
  },
  {
    id: "2",
    title: "THE FADE ROOM INC",
    description: "EXPERIENCE THE ART OF GROOMING AT ITS FINEST",
    imageUrl:
      "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/web/public/thefaderoominc.png",
    link: "/projects/the-fade-room-inc",
    slug: "the-fade-room-inc",
    externalLink: "https://www.thefaderoominc.com",
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwindcss",
      "Vercel Blob",
      "@d0paminedriven/booksy",
      "v0",
      "Vercel",
      "motion"
    ],
    date: "2024",
    content:
      "A website for a highly skilled barber located in the Chicago North Shore suburb of Highland Park. Showcases his expertise in precision haircuts and beard sculpting. I wrote and published a cli-powered codegen package that programmatically reauthenticates with (and extracts reviews and images from) the software as a service provider that he uses to track appointments, showcase work, and more — Booksy.\n"
  },
  {
    id: "3",
    title: "BIOLIFE XR EXPERIENCE",
    description: "THERE'S PURPOSE IN YOUR PLASMA",
    imageUrl:
      "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/web/public/biolife-donor-experience.png",
    link: "/projects/biolife-xr-experience",
    slug: "biolife-xr-experience",
    externalLink: "https://experience.biolifeplasma.com",
    technologies: [
      "Next.js",
      "Cloudinary",
      "React",
      "jFrog",
      "TypeScript",
      "Tailwindcss",
      "3dVistaPro",
      "@redacted/xr",
      "@redacted/ui",
      "Vercel"
    ],
    date: "2023",
    content:
      "The only publicly accessible immersive experience of around a dozen and a half total that I handled from init to finish during my time at Takeda Pharmaceuticals (BioLife Plasma Services is a Takeda subsidiary). Is used to provide prospective first time donors with a walkthrough of the plasma donation process. The `@redacted` packages listed in the technologies used pertain to two privately published packages I wrote with the `@redacted/xr` package being the beating heart of virtual experience deployment. I spent approximately 1.5 years working closesly with the Extended Reality team as their go-to engineer.\n<br />\nIn an effort to standardize and streamline an otherwise tedious and time consuming process, I spent many weeks piecing together a comprehensive cli-based package that flexibly generated entire nextjs projects, including auth, analytics, the app directory, project metadata, the scripting required which varied on a project-to-project basis (asset-composition-depndent), and more. This involved programmatically offloading the bulk of the many thousands of files in any given project to an enterprise cloudinary cdn; these assets were carefully handled on upload as to mirror the filesystem structure of the virtual experience zip the project was handed off in. This was crucial for reliably generating asset manifests following upload which were then used for subsequent data transformations.\n<br />\nThe entire package operated off of a predefined `xr.config.yaml` file in the root of the current working directory. The only requirement to spin up a project was having the xr.config.yaml populated (linted via schema.org) and any referened secrets defined in `.env`. That said, each project consisted of anywhere from ~10,000 to 150,000+ media assets (high resolution panoramas are often comprisued of many hundreds of smaller constituent images and were often the culprit for such high counts). This project was a great learning experience collaborating not only across business units but across orgs, too. Shortly following the completion of this project I was assigned to oversee the development of a new PDT (plasma derived therapies) employee portal for BioLife which I served as lead on.\n"
  },
  {
    id: "4",
    title: "HILLSIDE TO HARBOR",
    description: "HELPING YOU NAVIGATE CHALLENGING SITUATIONS",
    imageUrl:
      "https://raw.githubusercontent.com/DopamineDriven/portfolio-2025/master/apps/web/public/hillsidetoharbor.png",
    link: "/projects/hillside-to-harbor",
    slug: "hillside-to-harbor",
    externalLink: "https://www.hillsidetoharbor.com",
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwindcss",
      "Headless WordPress",
      "Cloudfront",
      "WPGraphQL",
      "Gravity Forms",
      "Vercel",
      "Codegen"
    ],
    date: "2023",
    content:
      "Family-owned small business serving the Knoxville, TN area; helps homeowners in financial trouble navigate challenging situations by acquiring pre-foreclosed properties at fair prices and working with the current owner, not the bank, as an example. They buy fixer-uppers and help those in trouble have a chance at a fresh start financially.\n"
  }
];
