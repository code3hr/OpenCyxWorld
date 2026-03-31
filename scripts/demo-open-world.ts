import { generateSceneOutlinesFromRequirements } from '@/lib/generation/outline-generator';
import type { UserRequirements } from '@/lib/types/generation';

type Scenario = {
  name: string;
  requirements: UserRequirements;
  sampleOutlines: unknown;
};

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
];

function createAiCall(sampleOutlines: unknown) {
  return async (_system: string, _user: string) => {
    console.log('---SYSTEM PROMPT---');
    console.log(_system);
    console.log('---USER PROMPT---');
    console.log(_user);
    return JSON.stringify(sampleOutlines, null, 2);
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
