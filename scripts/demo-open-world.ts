import 'dotenv/config';
import { generateSceneOutlinesFromRequirements } from '@/lib/generation/outline-generator';
import type { UserRequirements } from '@/lib/types/generation';

type Scenario = {
  name: string;
  requirements: UserRequirements;
  sampleOutlines: unknown;
};

const GOOGLE_MODEL = process.env.GOOGLE_MODEL ?? 'models/text-bison-001';
const GOOGLE_KEY = process.env.GOOGLE_API_KEY;
if (!GOOGLE_KEY) throw new Error('Missing GOOGLE_API_KEY in environment');

const scenarios: Scenario[] = [
  {
    name: 'Product Launch Enablement',
    requirements: {
      requirement:
        'Design a product launch enablement briefing that covers customer pain points, key differentiators, demo checklist, and follow-up actions for the sales and customer success teams.',
      language: 'en-US',
      userNickname: 'Alex',
      userBio: 'Head of Enablement at Velocity Systems',
    },
    sampleOutlines: [
      {
        id: 'scene_vision',
        type: 'slide',
        title: 'Outcome Narrative',
        description: 'Set the stage: why the launch matters and what success looks like.',
        keyPoints: [
          'Target customers are enterprise teams automating collaboration',
          'Launch timeline: preview -> pilot -> global rollout',
          'Success = more qualified demos + faster onboarding',
        ],
        order: 1,
        suggestedImageIds: ['img_vision'],
      },
      {
        id: 'scene_demo',
        type: 'interactive',
        title: 'Demo Walkthrough',
        description: 'Guided demo checklist with callouts on differentiators.',
        keyPoints: ['Landing page tour', 'AI assistants vs competitors', 'Live Q&A strategy'],
        order: 2,
        interactiveConfig: {
          conceptName: 'Guided Demo Checklist',
          conceptOverview: 'Walk through the product experience with annotations on each differentiator.',
          designIdea:
            'Show a side-by-side comparison board that highlights where our AI assistants add value, with buttons that reveal scripts for reps.',
          subject: 'Product Positioning',
        },
      },
      {
        id: 'scene_action',
        type: 'slide',
        title: 'Post-launch Actions',
        description: 'Action plan for sales and success to keep momentum going.',
        keyPoints: [
          'Share battle-tested objection responses',
          'Assign owners for pilot support',
          'Schedule a replay + customer Q&A after week 1',
        ],
        order: 3,
        quizConfig: {
          questionCount: 2,
          difficulty: 'medium',
          questionTypes: ['single', 'short_answer'],
        },
      },
    ],
  },
  {
    name: 'Customer Onboarding Lab',
    requirements: {
      requirement:
        'Plan a customer onboarding lab for new analytics users, including setup tasks, success metrics, interactive walkthroughs, and accountability checkpoints.',
      language: 'en-US',
      userNickname: 'Jordan',
      userBio: 'Director of Customer Success at PulseMetrics',
    },
    sampleOutlines: [
      {
        id: 'scene_setup',
        type: 'slide',
        title: 'Launch Checklist',
        description: 'Checklist for account prep, data upload, and initial confirmation calls.',
        keyPoints: [
          'Send setup links + templates 48 hours before kickoff',
          'Map data sources and verify permissions',
          'Run pre-flight call with customer stakeholders',
        ],
        order: 1,
      },
      {
        id: 'scene_walkthrough',
        type: 'interactive',
        title: 'Guided Walkthrough',
        description: 'Interactive flow that steps reps through key onboarding actions and metrics.',
        keyPoints: ['Highlight onboarding dashboard', 'Annotate automation builders', 'Story map success metrics'],
        order: 2,
        interactiveConfig: {
          conceptName: 'Onboarding Navigator',
          conceptOverview:
            'Interactive checklist where reps can toggle between setup, operational tasks, and coaching prompts.',
          designIdea:
            'Render a three-column view (Setup / Enablement / Outcomes) with reveal panels that display scripts, playbooks, and follow-up KPIs.',
          subject: 'Customer Success',
        },
      },
      {
        id: 'scene_cadence',
        type: 'pbl',
        title: 'Cadence Playbook',
        description: 'Structured practice mission covering weekly cadences and escalation triggers.',
        keyPoints: [
          'Pair new reps with a mentor for the first two sprints',
          'Review onboarding metrics before every retrospective',
          'Define escalation paths for stalled automations',
        ],
        order: 3,
        pblConfig: {
          projectTopic: 'Onboarding Cadence',
          projectDescription: 'Plan and rehearse the first 30-day enablement sprints.',
          targetSkills: ['Stakeholder alignment', 'Automation troubleshooting', 'Impact storytelling'],
          issueCount: 3,
          language: 'en-US',
        },
      },
    ],
  },
  {
    name: 'Executive Briefing',
    requirements: {
      requirement:
        'Prepare an executive briefing that summarizes the AI roadmap, performance metrics, risks, and next decisions for the board.',
      language: 'en-US',
      userNickname: 'Morgan',
      userBio: 'VP of Strategy, Forward Systems',
    },
    sampleOutlines: [
      {
        id: 'scene_summary',
        type: 'slide',
        title: 'Strategic Summary',
        description: 'High-level narrative covering roadmap pillars, success signals, and key asks.',
        keyPoints: [
          'Roadmap pillars: automation, insights, trustworthiness',
          'Pilot wins + customer validation',
          'Request: approve next-phase investment and KPIs',
        ],
        order: 1,
      },
      {
        id: 'scene_metrics',
        type: 'slide',
        title: 'Impact Metrics',
        description: 'KPIs, cost savings, and adoption targets tied to the briefing.',
        keyPoints: ['Projected ROI', 'Retention lift', 'Mitigations for top 3 risks'],
        order: 2,
        suggestedImageIds: ['img_metrics'],
      },
      {
        id: 'scene_decision',
        type: 'interactive',
        title: 'Decision Workshop',
        description: 'Interactive decision tree showing trade-offs for each board option.',
        keyPoints: ['Approve investment', 'Delay pilot', 'Re-scope deliverables'],
        order: 3,
        interactiveConfig: {
          conceptName: 'Decision Tree',
          conceptOverview:
            'Model the outcomes of each decision path with annotations on value, risk, and next steps.',
          designIdea:
            'Render a horizontal tree with buttons that expand to show quantitative impact, risk, and follow-ups.',
          subject: 'Strategic Decision',
        },
      },
    ],
  },
  {
    name: 'Interview Readiness Lab',
    requirements: {
      requirement:
        'Design an interview readiness lab for senior product managers, including mock questions, behavioral scenarios, and immediate feedback guidance.',
      language: 'en-US',
      userNickname: 'Taylor',
      userBio: 'Product Recruiter at Signal Path',
    },
    sampleOutlines: [
      {
        id: 'scene_overview',
        type: 'slide',
        title: 'Interview Mission',
        description: 'Frame the goal, desired competencies, and success criteria.',
        keyPoints: ['Role summary', 'Focus competencies (strategy, communication)', 'What success looks like'],
        order: 1,
      },
      {
        id: 'scene_questions',
        type: 'interactive',
        title: 'Mock Questions',
        description: 'Walk through candidate responses with coaching annotations.',
        keyPoints: ['Behavioral prompts', 'Product case warm-up', 'Follow-up probes'],
        order: 2,
        interactiveConfig: {
          conceptName: 'Response Flow',
          conceptOverview: 'Simulated interview where each question can expand to best-practice notes.',
          designIdea:
            'Render cards with questions on the left and replaceable response guidance on the right, plus coach tips per question.',
          subject: 'Interview Coaching',
        },
      },
      {
        id: 'scene_feedback',
        type: 'slide',
        title: 'Feedback & Next Steps',
        description: 'Summarize scoring rubrics and recommended follow-ups.',
        keyPoints: ['Scorecard categories', 'Immediate practice suggestions', 'Reflection prompts'],
        order: 3,
        quizConfig: {
          questionCount: 1,
          difficulty: 'medium',
          questionTypes: ['short_answer'],
        },
      },
    ],
  },
];

async function callGoogle(promptText: string): Promise<string> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/${GOOGLE_MODEL}:generateText?key=${GOOGLE_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: {
          text: promptText,
        },
        temperature: 0.4,
        candidateCount: 1,
      }),
    },
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Google GenAI error: ${error}`);
  }

  const json = await response.json();
  const output = json.candidates?.[0]?.output;
  const reasoningTokens = json.usage?.reasoningTokens;
  if (reasoningTokens != null) {
    console.log('Reasoning tokens:', reasoningTokens);
  }

  if (!output) throw new Error('No output from Google model');
  return output;
}

function createAiCall(sampleOutlines: unknown) {
  return async (system: string, user: string) => {
    console.log('---SYSTEM PROMPT---');
    console.log(system);
    console.log('---USER PROMPT---');
    console.log(user);

    const promptText = `System:\n${system}\n\nUser:\n${user}`;
    try {
      const text = await callGoogle(promptText);
      return text;
    } catch (error) {
      console.error('Google call failed, using sample outlines', error);
      return JSON.stringify(sampleOutlines, null, 2);
    }
  };
}

async function run() {
  for (const scenario of scenarios) {
    console.log(`\n=== Scenario: ${scenario.name} ===`);
    const result = await generateSceneOutlinesFromRequirements(
      scenario.requirements,
      undefined,
      undefined,
      createAiCall(scenario.sampleOutlines),
    );

    if (result.success && result.data) {
      console.log('---GENERATED OUTLINES---');
      console.log(JSON.stringify(result.data, null, 2));
    } else {
      console.error('generation failed', result.error);
    }
  }
}

run().catch((err) => console.error('Script error', err));
