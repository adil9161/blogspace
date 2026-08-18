import type { Blog } from '../types';
import { MOCK_USERS } from './mockUsers';

export const MOCK_BLOGS: Blog[] = [
  {
    id: 'blog-1',
    title: 'The Architecture of Autonomous AI Agents in Production',
    slug: 'the-architecture-of-autonomous-ai-agents-in-production',
    description: 'A comprehensive technical deep-dive into orchestrating multi-agent LLM systems with tool calling, memory layers, and deterministic fallback loops.',
    category: 'AI',
    tags: ['Artificial Intelligence', 'LLM', 'System Design', 'Agents', 'Python'],
    featuredImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    authorId: 'user-2',
    author: {
      id: MOCK_USERS[1].id,
      name: MOCK_USERS[1].name,
      username: MOCK_USERS[1].username,
      avatar: MOCK_USERS[1].avatar,
      bio: MOCK_USERS[1].bio,
    },
    status: 'published',
    views: 14820,
    likes: 486,
    readingTime: 6,
    featured: true,
    createdAt: '2025-02-10T14:20:00Z',
    updatedAt: '2025-02-12T09:10:00Z',
    content: `
      <h2>The Shift From Chatbots to Autonomous Decision Engines</h2>
      <p>Over the past year, the industry has experienced a tectonic shift: moving past simple conversational wrappers toward autonomous software agents capable of breaking down complex high-level goals, calling external APIs, reasoning over tool outputs, and autonomously recovering from failures.</p>
      
      <blockquote>
        "The true frontier of AI isn't simply larger models—it is reliable orchestration, structured memory, and deterministic guardrails around probabilistic intelligence."
      </blockquote>

      <h3>Key Architectural Pillars</h3>
      <p>When engineering an enterprise agentic pipeline, three primary abstractions dictate success:</p>
      <ul>
        <li><strong>Planning & Task Decomposition:</strong> Splitting ambiguous user prompts into structured dependency trees (DAGs).</li>
        <li><strong>Episodic & Semantic Memory:</strong> Using low-latency vector embeddings paired with exact key-value session stores.</li>
        <li><strong>ReAct Execution Loop:</strong> Interleaving thought generation with real-time tool execution to ground responses in verified reality.</li>
      </ul>

      <h3>Handling Non-Deterministic Failures</h3>
      <p>Deterministic validation is non-negotiable. Always validate tool outputs against strict JSON schemas before feeding them back into the LLM context window. When an execution fails, use exponential backoff and dynamic prompt re-anchoring:</p>

      <pre><code>// Example TypeScript Agent Guardrail Loop
async function executeAgentStep(goal: string, context: AgentContext): Promise<AgentResult> {
  const plan = await planner.generateExecutionDAG(goal);
  
  for (const step of plan.steps) {
    const response = await toolRegistry.invoke(step.tool, step.args);
    if (!schemaValidator.safeParse(response).success) {
      return fallbackHandler.recover(step, response);
    }
  }
  return { success: true, state: context.state };
}</code></pre>

      <p>As LLM context windows expand and inference latencies drop, multi-agent collaboration will become the default architecture for backend automation, automated QA, and dynamic workflows.</p>
    `
  },
  {
    id: 'blog-2',
    title: 'Building Resilient Frontend Architectures with Modern React & TypeScript',
    slug: 'building-resilient-frontend-architectures-with-modern-react-and-typescript',
    description: 'Practical patterns for organizing large-scale React applications: separation of concerns, declarative state machines, and resilient caching strategies.',
    category: 'Programming',
    tags: ['React', 'TypeScript', 'Web Development', 'Architecture', 'Frontend'],
    featuredImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80',
    authorId: 'user-1',
    author: {
      id: MOCK_USERS[0].id,
      name: MOCK_USERS[0].name,
      username: MOCK_USERS[0].username,
      avatar: MOCK_USERS[0].avatar,
      bio: MOCK_USERS[0].bio,
    },
    status: 'published',
    views: 11240,
    likes: 395,
    readingTime: 5,
    featured: true,
    createdAt: '2025-02-14T10:30:00Z',
    updatedAt: '2025-02-14T10:30:00Z',
    content: `
      <h2>The Perils of Accidental Complexity in Modern UI</h2>
      <p>As web applications scale beyond simple prototypes, frontend codebases frequently fall prey to state tangles, brittle prop drilling, and tightly coupled business logic embedded directly in presentational markup.</p>

      <h3>The Layered Architecture Approach</h3>
      <p>A clean web architecture isolates concerns into four distinct tiers:</p>
      <ol>
        <li><strong>Presentation Layer:</strong> Pure dumb components focused exclusively on styling, layout, and user event dispatching.</li>
        <li><strong>Application Layer:</strong> Custom React hooks encapsulating UI state machines and lifecycle orchestration.</li>
        <li><strong>Domain Service Layer:</strong> Framework-agnostic TypeScript services communicating with backend APIs and storage.</li>
        <li><strong>Data Model Layer:</strong> Strict TypeScript interfaces and schemas establishing single sources of truth.</li>
      </ol>

      <blockquote>
        "Write components that know how to render UI, and custom hooks that know how to think."
      </blockquote>

      <p>By enforcing this separation, testing becomes trivial, refactoring carries minimal risk, and onboarding new engineers is streamlined across the team.</p>
    `
  },
  {
    id: 'blog-3',
    title: 'Mastering Modern UI/UX: Why Micro-Interactions Make or Break SaaS',
    slug: 'mastering-modern-ui-ux-why-micro-interactions-make-or-break-saas',
    description: 'How subtle animation timings, haptic feedback, and thoughtful empty states transform an ordinary tool into a delightful product people love.',
    category: 'Design',
    tags: ['Design', 'UI/UX', 'Product Design', 'Micro-interactions', 'Typography'],
    featuredImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200&auto=format&fit=crop&q=80',
    authorId: 'user-3',
    author: {
      id: MOCK_USERS[2].id,
      name: MOCK_USERS[2].name,
      username: MOCK_USERS[2].username,
      avatar: MOCK_USERS[2].avatar,
      bio: MOCK_USERS[2].bio,
    },
    status: 'published',
    views: 8930,
    likes: 312,
    readingTime: 4,
    featured: true,
    createdAt: '2025-02-15T08:15:00Z',
    updatedAt: '2025-02-15T08:15:00Z',
    content: `
      <h2>The Hidden Science of Perceived Quality</h2>
      <p>When users open an application, their subconscious evaluates polish within milliseconds. It is rarely the color palette alone; it is the spring in a button depress, the subtle elevation change on hover, and the seamless transition between view states.</p>

      <h3>Core Principles of Micro-Interactions</h3>
      <ul>
        <li><strong>Speed over Showmanship:</strong> Keep animation durations under 200ms for UI actions. Anything over 300ms feels sluggish.</li>
        <li><strong>Consistent Easing:</strong> Use natural bezier curves (like cubic-bezier(0.16, 1, 0.3, 1)) rather than linear interpolation.</li>
        <li><strong>Intentional Feedback:</strong> Every interactive affordance should acknowledge user intent instantly.</li>
      </ul>

      <blockquote>
        "Good design is obvious. Great design is transparent."
      </blockquote>
    `
  },
  {
    id: 'blog-4',
    title: 'The Engineering Leader’s Playbook: Navigating Senior & Staff Roles',
    slug: 'the-engineering-leaders-playbook-navigating-senior-and-staff-roles',
    description: 'Key mental shifts required when transitioning from writing code every day to multiplying team impact, driving alignment, and shaping technical roadmap.',
    category: 'Career',
    tags: ['Career', 'Leadership', 'Management', 'Engineering', 'Mentorship'],
    featuredImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80',
    authorId: 'user-4',
    author: {
      id: MOCK_USERS[3].id,
      name: MOCK_USERS[3].name,
      username: MOCK_USERS[3].username,
      avatar: MOCK_USERS[3].avatar,
      bio: MOCK_USERS[3].bio,
    },
    status: 'published',
    views: 13420,
    likes: 520,
    readingTime: 7,
    featured: false,
    createdAt: '2025-02-16T11:00:00Z',
    updatedAt: '2025-02-16T11:00:00Z',
    content: `
      <h2>Beyond Pull Requests: The Staff Engineer Archetype</h2>
      <p>Moving from Senior to Staff Engineer is rarely about typing faster or mastering another framework. It is fundamentally about scope, strategic influence, and ambiguity resolution.</p>

      <h3>The Four Staff Archetypes</h3>
      <ul>
        <li><strong>The Tech Lead:</strong> Guides the execution and architecture of a high-priority squad or domain.</li>
        <li><strong>The Architect:</strong> Holds ownership over cross-cutting organizational standards and system boundaries.</li>
        <li><strong>The Solver:</strong> Tackles complex, high-risk deep technical bottlenecks that halt product milestones.</li>
        <li><strong>The Right Hand:</strong> Partners closely with executive engineering leadership to execute organizational transformations.</li>
      </ul>

      <h3>Cultivating Influence Without Authority</h3>
      <p>Leadership at this level relies on clear RFC documentation, empathetic listening, and setting technical compasses that empower teams rather than create bottlenecks.</p>
    `
  },
  {
    id: 'blog-5',
    title: 'Why Edge Computing and Distributed Databases are the Future of Web Speed',
    slug: 'why-edge-computing-and-distributed-databases-are-the-future-of-web-speed',
    description: 'Exploring globally distributed SQL, serverless edge runtimes, and caching paradigms that reduce time-to-first-byte to under 20 milliseconds worldwide.',
    category: 'Technology',
    tags: ['Edge Computing', 'Databases', 'Cloud', 'Performance', 'DevOps'],
    featuredImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80',
    authorId: 'user-5',
    author: {
      id: MOCK_USERS[4].id,
      name: MOCK_USERS[4].name,
      username: MOCK_USERS[4].username,
      avatar: MOCK_USERS[4].avatar,
      bio: MOCK_USERS[4].bio,
    },
    status: 'published',
    views: 7450,
    likes: 245,
    readingTime: 5,
    featured: false,
    createdAt: '2025-02-16T16:45:00Z',
    updatedAt: '2025-02-16T16:45:00Z',
    content: `
      <h2>The Global Latency Problem</h2>
      <p>For decades, cloud architectures followed a centralized paradigm: a primary database in us-east-1 and caching layers scattered globally. While static assets were fast, dynamic user queries still incurred hundreds of milliseconds of cross-continental round trips.</p>

      <h3>The Edge Revolution</h3>
      <p>Modern edge platforms allow stateless compute to execute at hundreds of points-of-presence (PoPs) within 10ms of end users. When combined with geo-replicated read-replicas, queries execute almost instantaneously regardless of geographic origin.</p>
    `
  },
  {
    id: 'blog-6',
    title: 'Designing Deep Work Rituals: A Software Engineer’s Guide to Focus',
    slug: 'designing-deep-work-rituals-a-software-engineers-guide-to-focus',
    description: 'Practical strategies for protecting cognitive bandwidth, eliminating asynchronous noise, and creating flow states in modern remote engineering teams.',
    category: 'Lifestyle',
    tags: ['Productivity', 'Deep Work', 'Remote Work', 'Mindset', 'Wellness'],
    featuredImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&auto=format&fit=crop&q=80',
    authorId: 'user-1',
    author: {
      id: MOCK_USERS[0].id,
      name: MOCK_USERS[0].name,
      username: MOCK_USERS[0].username,
      avatar: MOCK_USERS[0].avatar,
      bio: MOCK_USERS[0].bio,
    },
    status: 'published',
    views: 9280,
    likes: 410,
    readingTime: 4,
    featured: false,
    createdAt: '2025-02-17T07:20:00Z',
    updatedAt: '2025-02-17T07:20:00Z',
    content: `
      <h2>The High Cost of Context Switching</h2>
      <p>Studies consistently reveal that recovering from a single Slack interruption takes upwards of 23 minutes. In an industry where solving complex logic requires holding intricate mental models, fragmented focus directly undermines engineering quality.</p>

      <h3>Building Your Focus Protocol</h3>
      <ol>
        <li><strong>Time-block Non-Negotiable Maker Blocks:</strong> Reserve 9 AM - 12 PM solely for creative problem solving with notifications paused.</li>
        <li><strong>Batch Asynchronous Communication:</strong> Check pull requests and communications in dedicated 30-minute windows.</li>
        <li><strong>Shutdown Ceremonies:</strong> Close open mental loops at the end of the workday by writing down tomorrow's primary objective.</li>
      </ol>
    `
  },
  {
    id: 'blog-7',
    title: 'Demystifying WebAssembly: Running High-Performance Code in the Browser',
    slug: 'demystifying-webassembly-running-high-performance-code-in-the-browser',
    description: 'How WebAssembly (WASM) enables near-native compute speeds inside client web browsers for video editing, 3D graphics, and cryptographic verification.',
    category: 'Technology',
    tags: ['WebAssembly', 'Rust', 'Performance', 'JavaScript', 'Web Standards'],
    featuredImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
    authorId: 'user-5',
    author: {
      id: MOCK_USERS[4].id,
      name: MOCK_USERS[4].name,
      username: MOCK_USERS[4].username,
      avatar: MOCK_USERS[4].avatar,
      bio: MOCK_USERS[4].bio,
    },
    status: 'published',
    views: 6310,
    likes: 218,
    readingTime: 5,
    featured: false,
    createdAt: '2025-02-17T14:10:00Z',
    updatedAt: '2025-02-17T14:10:00Z',
    content: `
      <h2>The Evolution of Browser Capabilities</h2>
      <p>For over twenty years, JavaScript stood alone as the execution language of the browser. With the advent of WebAssembly, engineers can now compile C++, Rust, and Go binaries directly into a portable binary format executing with near-native CPU efficiency.</p>
    `
  },
  {
    id: 'blog-8',
    title: 'The Future of Design Tokens: Bridging the Gap Between Figma and React',
    slug: 'the-future-of-design-tokens-bridging-the-gap-between-figma-and-react',
    description: 'How to automate synchronized design tokens across design systems, CSS variables, and component libraries using automated CI/CD pipelines.',
    category: 'Design',
    tags: ['Design Systems', 'Figma', 'CSS', 'React', 'Tokens'],
    featuredImage: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=1200&auto=format&fit=crop&q=80',
    authorId: 'user-3',
    author: {
      id: MOCK_USERS[2].id,
      name: MOCK_USERS[2].name,
      username: MOCK_USERS[2].username,
      avatar: MOCK_USERS[2].avatar,
      bio: MOCK_USERS[2].bio,
    },
    status: 'published',
    views: 5120,
    likes: 184,
    readingTime: 4,
    featured: false,
    createdAt: '2025-02-18T09:00:00Z',
    updatedAt: '2025-02-18T09:00:00Z',
    content: `
      <h2>Eliminating the Design Handoff Friction</h2>
      <p>Design token architecture has matured from simple color constants into dynamic semantic layers supporting multi-brand theming, high-contrast modes, and automated code generation.</p>
    `
  },
  {
    id: 'blog-9',
    title: 'Mastering SQL Indexing: From B-Trees to Query Optimization',
    slug: 'mastering-sql-indexing-from-b-trees-to-query-optimization',
    description: 'A deep look into relational database query planners, compound indexes, execution plans, and how to eliminate slow query alerts.',
    category: 'Programming',
    tags: ['PostgreSQL', 'SQL', 'Databases', 'Backend', 'Performance'],
    featuredImage: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=1200&auto=format&fit=crop&q=80',
    authorId: 'user-1',
    author: {
      id: MOCK_USERS[0].id,
      name: MOCK_USERS[0].name,
      username: MOCK_USERS[0].username,
      avatar: MOCK_USERS[0].avatar,
      bio: MOCK_USERS[0].bio,
    },
    status: 'draft',
    views: 120,
    likes: 12,
    readingTime: 6,
    featured: false,
    createdAt: '2025-02-18T15:30:00Z',
    updatedAt: '2025-02-18T16:00:00Z',
    content: `
      <h2>Draft: Indexing Strategies in High-Throughput Databases</h2>
      <p>When query traffic scales into millions of records, sequential table scans degrade performance exponentially. This article outlines optimal compound indexing rules, covering index design, and avoiding index bloat.</p>
    `
  },
  {
    id: 'blog-10',
    title: 'The AI-Powered Developer: Transforming Productivity Without Losing Craft',
    slug: 'the-ai-powered-developer-transforming-productivity-without-losing-craft',
    description: 'How to pair program effectively with AI code models while maintaining rigorous architectural oversight and deep foundational understanding.',
    category: 'AI',
    tags: ['AI Coding', 'Copilot', 'Developer Productivity', 'Future of Work'],
    featuredImage: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&auto=format&fit=crop&q=80',
    authorId: 'user-2',
    author: {
      id: MOCK_USERS[1].id,
      name: MOCK_USERS[1].name,
      username: MOCK_USERS[1].username,
      avatar: MOCK_USERS[1].avatar,
      bio: MOCK_USERS[1].bio,
    },
    status: 'published',
    views: 16890,
    likes: 642,
    readingTime: 6,
    featured: false,
    createdAt: '2025-02-18T18:00:00Z',
    updatedAt: '2025-02-18T18:00:00Z',
    content: `
      <h2>AI As Thought Partner, Not Black Box</h2>
      <p>Modern AI coding assistants have eliminated boilerplate friction. However, treating AI outputs with critical skepticism and verifying boundary conditions remains the hallmark of true senior engineering.</p>
    `
  }
];

export const BLOG_CATEGORIES = [
  'All',
  'Technology',
  'AI',
  'Programming',
  'Design',
  'Career',
  'Lifestyle'
] as const;

export const POPULAR_TAGS = [
  'Artificial Intelligence',
  'React',
  'TypeScript',
  'System Design',
  'UI/UX',
  'Career',
  'Leadership',
  'Performance',
  'PostgreSQL',
  'Cloud',
  'Deep Work'
];
