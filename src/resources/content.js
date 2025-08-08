import { Logo } from "@once-ui-system/core";

const person = {
  firstName: "Bhanu",
  lastName: "P S S",
  get name() {
    return `${this.firstName} ${this.lastName}`;
  },
  role: "Community Educator & Full Stack Developer",
  avatar: "https://res.cloudinary.com/dhvkjanwa/image/upload/v1754584871/logo_ezkabm.png",
  email: "bhanucsx@gmail.com",
  location: "Asia/Kolkata",
  languages: ["English", "Hindi"],
};

const newsletter = {
  display: true,
  title: <>Subscribe to {person.firstName}'s Newsletter</>,
  description: (
    <>
      I share coding insights, project breakdowns, and community updates from CSX – no spam, just
      pure value for developers.
    </>
  ),
};

const social = [
  {
    name: "GitHub",
    icon: "github",
    link: "https://github.com/bhanupratapsingh21",
  },
  {
    name: "LinkedIn",
    icon: "linkedin",
    link: "https://www.linkedin.com/in/bhanupratapsingh21-bhanupratapsingh21/",
  },
  {
    name: "YouTube",
    icon: "youtube",
    link: "https://www.youtube.com/@CSExplained_official",
  },
  {
    name: "Email",
    icon: "email",
    link: `mailto:${person.email}`,
  },
];

const home = {
  path: "/",
  image: "https://res.cloudinary.com/dhvkjanwa/image/upload/v1754584871/logo_ezkabm.png",
  label: "Home",
  title: `CSX Learn. Build. Grow. `,
  description: `Portfolio of a tech educator and developer building CSX and open-source tools.`,
  headline: <>Simplifying CS concepts, building real devs 🚀</>,
  featured: {
    display: true,
    title: <>Featured: <strong className="ml-4">CSX Community</strong></>,
    href: "/work/building-csx",
  },
  subline: (
    <>
      I'm Bhanu, the person behind <strong>CS Explained</strong>. I create content that helps
      students break into tech via real-world learning, open-source, and full-stack builds.
    </>
  ),
};

const about = {
  path: "/about",
  label: "About",
  title: `About – ${person.name}`,
  description: `Learn more about ${person.name}, a full stack dev from ${person.location}`,
  tableOfContent: {
    display: false,
    subItems: false,
  },
  avatar: {
    display: false,
  },
  calendar: {
    display: false,
    link: "https://cal.com",
  },
  intro: {
    display: false,
    title: "Introduction",
    description: (
      <>
        Bhanu is a developer and content creator from India focused on CSX — a tech community for
        students. He simplifies computer science concepts through engaging YouTube content, community
        challenges, and real-world projects using tools like Next.js, TypeScript, and Firebase.
      </>
    ),
  },
  work: {
    display: true,
    title: "Work Experience",
    experiences: [
      {
        company: "CSX (CS Explained)",
        timeframe: "2023 - Present",
        role: "Founder & Educator",
        achievements: [
          <>Built a 10K+ subscriber tech education community on YouTube and Instagram.</>,
          <>Created hands-on full stack series using Next.js, Supabase, TypeScript, and Tailwind.</>,
        ],
        images: [
          {
            src: "/images/projects/project-01/cover-01.jpg",
            alt: "CSX Platform",
            width: 16,
            height: 9,
          },
        ],
      },
      {
        company: "Open Source & Freelance",
        timeframe: "2022 - Present",
        role: "Full Stack Developer",
        achievements: [
          <>Built portfolio templates, admin dashboards, and REST/GraphQL APIs with modern stacks.</>,
          <>Contributed to community tools & starter templates based on Once UI, Next.js, and Supabase.</>,
        ],
        images: [],
      },
    ],
  },
  studies: {
    display: true,
    title: "Studies",
    institutions: [
      {
        name: "CSX Self-Learning",
        description: <>Learning by building in public – projects, breakdowns, and shipping.</>,
      },
      {
        name: "B.Tech, Computer Science (2021–2025)",
        description: <>Currently in 2nd year. Focused on backend, full stack, and dev tooling.</>,
      },
    ],
  },
  technical: {
    display: true,
    title: "Technical Skills",
    skills: [
      {
        title: "Next.js + TypeScript",
        description: <>Building scalable apps with Next.js, TS, Tailwind & Supabase.</>,
        images: [
          {
            src: "/images/projects/project-01/cover-02.jpg",
            alt: "Next.js Project",
            width: 16,
            height: 9,
          },
        ],
      },
      {
        title: "Firebase & Supabase",
        description: <>Authentication, real-time DB, and serverless APIs.</>,
        images: [],
      },
      {
        title: "UI Systems (Once UI)",
        description: <>Rapid prototyping with component libraries & design systems.</>,
        images: [],
      },
    ],
  },
};

const blog = {
  path: "/blog",
  label: "Blog",
  title: "Tech posts, devlogs, and insights",
  description: `Read what ${person.name} has been sharing with the CSX community.`,
};

const work = {
  path: "/work",
  label: "Work",
  title: `Projects – ${person.name}`,
  description: `Personal and CSX-backed projects built by ${person.name}`,
};

const gallery = {
  path: "/gallery",
  label: "Gallery",
  title: `Behind the scenes – ${person.name}`,
  description: `Photos and moments from my dev journey, events, and community.`,
  images: [
    {
      src: "/images/gallery/horizontal-1.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/horizontal-2.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-1.jpg",
      alt: "image",
      orientation: "vertical",
    },
  ],
};

export { person, social, newsletter, home, about, blog, work, gallery };
