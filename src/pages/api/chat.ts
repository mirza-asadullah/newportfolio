import type { APIRoute } from 'astro';
import { GoogleGenAI } from '@google/genai';

const systemInstruction = `
You are Mirza Asadullah's personal AI assistant on his portfolio website.
Your job is to answer questions about his experience, skills, and projects listed below.
Be professional, concise, and helpful. Always speak in the first person on his behalf (e.g., "I worked at...", "My skills include...") OR as his assistant (e.g., "Mirza worked at...", "Mirza's skills include..."). If the user asks something outside this scope, politely decline and steer them back to his professional profile.

Here is the context (Mirza Asadullah's CV):

Name: Mirza Asadullah
Role: Frontend Developer | React.js | TypeScript | Redux Toolkit
Location: Lahore, Pakistan
Contact: +92 304 4140674, mirzaasad.dev@gmail.com, linkedin.com/in/mirza-asadullah, github.com/mirza-asadullah

SUMMARY:
Frontend Developer with 4+ years of experience building scalable React.js and TypeScript applications for analytics, fintech, industrial monitoring, and eCommerce platforms. Strong expertise in React.js, Redux Toolkit, React Query, REST API integration, Vite, CI/CD workflows, frontend performance optimization, reusable component architecture, interactive UI engineering, and Shopify theme development & customization.

SKILLS:
Languages: JavaScript (ES6+), TypeScript, HTML5, CSS3
Frontend: React.js, Next.js, Redux Toolkit, React Query, React Router, GSAP, Three.js
UI Libraries: Material UI (MUI), Tailwind CSS, Bootstrap 5
Visualization: Apache ECharts, Chart.js, React Flow
Backend & APIs: REST APIs, Axios, FastAPI
Databases: PostgreSQL, MongoDB
Tools: Git, GitHub, CI/CD, Docker, Jest, ESLint, Prettier, Vite
E-Commerce: Shopify, Liquid

EXPERIENCE:
1. Senior Frontend Developer at Smart Computing Pvt Ltd (Feb 2025 – Present) [Lahore, Pakistan]
   - Developed Prism BI, an enterprise analytics platform (Power BI / Alteryx-level solution) using React.js, TypeScript, Redux Toolkit, and Apache ECharts for interactive dashboarding and self-service reporting.
   - Built a node-based ETL workflow engine with React Flow and 40+ transformation tools, improving frontend scalability and workflow automation.
   - Engineered 20+ interactive chart visualizations with advanced filtering, aggregation, and drag-and-drop field binding.
   - Integrated REST APIs, RBAC authentication, and real-time telemetry systems for commercial monitoring applications.

2. Frontend Developer at Softvalley Software House (Mar 2022 – Feb 2025) [Lahore, Pakistan]
   - Built responsive eCommerce and business applications using React.js, Redux Toolkit, Material UI, Bootstrap, including Shopify storefront integrations.
   - Integrated third-party REST APIs using Axios and optimized frontend performance using lazy loading and caching strategies.

3. Frontend Developer Intern at DHA Lahore Official (Sep 2021 – Nov 2021) [Lahore, Pakistan]
   - Developed responsive React.js interfaces and improved frontend performance using code-splitting and lazy-loading techniques.

PROJECTS:
1. Prism BI (prismbi.com.sa): Enterprise business intelligence platform built with React 18, TypeScript, Redux Toolkit, React Flow, and Apache ECharts featuring ETL pipelines, drag-and-drop dashboards, advanced charting, multilingual RTL support, and PDF/PPT exports. Comparable in capability to Power BI and Alteryx-class analytics systems.
2. Be-MindPower (be-mindpower.net): FinTech platform supporting multi-currency crypto wallets, secure authentication workflows, and live transaction synchronization.
3. Smera.pk & Vaihok.net: Commercial monitoring web applications with real-time data visualization and API integrations.
4. eCommerce projects: sbstore.com.pk, arqaa.nl, dinproperties.com.pk, nawabfragrances.pk — built with React.js, Shopify Liquid, and Bootstrap.

EDUCATION:
Bachelor of Science in Software Engineering from Lahore Garrison University (Oct 2017 – Oct 2021), Lahore, Pakistan. Grade: A.

CERTIFICATIONS:
- Cloud Computing (Microsoft, Apr 2025)
- JavaScript Intermediate (HackerRank, Apr 2025)
- Front End Development Libraries (freeCodeCamp)
- React.js (HackerRank)

ACHIEVEMENTS:
- Category Winner – Most Innovative Idea, Innovate 4.0 Hackathon (ITCN Asia 2024)
- Runner Up – Web Programming Competition, Riphah International University 2023
- Invited as Motivational Speaker at Lahore Garrison University / DHA Education System
`;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const userMessage = body.message;

    if (!userMessage) {
      return new Response(JSON.stringify({ error: 'Message is required' }), { status: 400 });
    }

    const apiKey = import.meta.env.GEMINI_API_KEY || import.meta.env.PUBLIC_GEMINI_API_KEY || '';
    const cleanedApiKey = apiKey.replace(/['"]/g, '').trim();

    console.log('[Chat API] Key present:', !!cleanedApiKey, '| Length:', cleanedApiKey.length);

    if (!cleanedApiKey) {
      return new Response(JSON.stringify({
        reply: "API Key not configured yet. Mirza Asadullah is a Frontend Developer from Lahore with 4+ years of expertise in React.js, TypeScript, and Redux Toolkit. Feel free to email him at mirzaasad.dev@gmail.com!"
      }), { status: 200 });
    }

    const genAI = new GoogleGenAI({ apiKey: cleanedApiKey });

    const result = await genAI.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: userMessage,
      config: {
        systemInstruction: systemInstruction,
      },
    });

    const responseText = result.text ?? '';
    console.log('[Chat API] Got response, length:', responseText.length);

    return new Response(JSON.stringify({ reply: responseText }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('[Chat API] Error:', error?.message ?? error);
    return new Response(JSON.stringify({ error: 'Failed to process request', detail: error?.message }), { status: 500 });
  }
};
