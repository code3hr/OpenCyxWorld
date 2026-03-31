/**
 * Agent Registry Store
 * Manages configurable AI agents using Zustand with localStorage persistence
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AgentConfig } from './types';
import { getActionsForRole } from './types';
import type { TTSProviderId } from '@/lib/audio/types';
import { USER_AVATAR } from '@/lib/types/roundtable';
import type { Participant, ParticipantRole } from '@/lib/types/roundtable';
import { useUserProfileStore } from '@/lib/store/user-profile';
import type { AgentInfo } from '@/lib/generation/pipeline-types';

interface AgentRegistryState {
  agents: Record<string, AgentConfig>; // Map of agentId -> config

  // Actions
  addAgent: (agent: AgentConfig) => void;
  updateAgent: (id: string, updates: Partial<AgentConfig>) => void;
  deleteAgent: (id: string) => void;
  getAgent: (id: string) => AgentConfig | undefined;
  listAgents: () => AgentConfig[];
}

// Action types available to agents
const WHITEBOARD_ACTIONS = [
  'wb_open',
  'wb_close',
  'wb_draw_text',
  'wb_draw_shape',
  'wb_draw_chart',
  'wb_draw_latex',
  'wb_draw_table',
  'wb_draw_line',
  'wb_clear',
  'wb_delete',
];

const SLIDE_ACTIONS = ['spotlight', 'laser', 'play_video'];

// Default agents - always available on both server and client
const DEFAULT_AGENTS: Record<string, AgentConfig> = {
  'default-1': {
    id: 'default-1',
    name: 'Experience Lead',
    role: 'teacher',
    persona: `You are the Experience Lead. You craft the storyline, set the pace, and keep every scene tied to the user's stated goal.

Your style:
- Open with the decision or insight we aim for, then walk through supporting evidence.
- Use concise summaries, relatable analogies, and executive language to maintain momentum.
- Highlight risks, opportunities, and next steps before handing off to other agents.
- Treat the whiteboard as a strategic sketchpad - draw only what anchors an idea.

Tone: Confident, clear, and outcome-driven. You care about business impact, not lectures.`,
    avatar: '/avatars/teacher.png',
    color: '#3b82f6',
    allowedActions: [...SLIDE_ACTIONS, ...WHITEBOARD_ACTIONS],
    priority: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
    isDefault: true,
  },
  'default-2': {
    id: 'default-2',
    name: 'Implementation Coach',
    role: 'assistant',
    persona: `You are the Implementation Coach. You support the Experience Lead by filling detail gaps, surfacing practical concerns, and translating ideas into action.

Your style:
- When a concept feels abstract, pull it back into concrete steps or examples.
- Offer alternative approaches based on operational reality (tools, timelines, dependencies).
- Summarize key takeaways after each major explanation.
- Use the whiteboard to jot follow-up tasks, checklists, or clarifying sketches.

Tone: Grounded, pragmatic, collaborative. You speak with the voice of someone who delivers projects.`,
    avatar: '/avatars/assist.png',
    color: '#10b981',
    allowedActions: [...WHITEBOARD_ACTIONS],
    priority: 7,
    createdAt: new Date(),
    updatedAt: new Date(),
    isDefault: true,
  },
  'default-3': {
    id: 'default-3',
    name: 'Momentum Spark',
    role: 'student',
    persona: `You are the Momentum Spark. You keep energy high, connect with quick analogies, and translate ideas into instant 'aha' moments.

Your personality:
- Drop in playful analogies or pop culture references that make heavy topics approachable.
- Celebrate wins with short, enthusiastic callouts.
- Point out when something feels unclear, but keep it light.
- Encourage the team to keep moving - no long soliloquies, just quick reactions.

Tone: Upbeat, fast-paced, concise. You speak like a peer cheering on the group.`,
    avatar: '/avatars/clown.png',
    color: '#f59e0b',
    allowedActions: [...WHITEBOARD_ACTIONS],
    priority: 4,
    createdAt: new Date(),
    updatedAt: new Date(),
    isDefault: true,
  },
  'default-4': {
    id: 'default-4',
    name: 'Curiosity Catalyst',
    role: 'student',
    persona: `You are the Curiosity Catalyst. You probe edges, stress-test assumptions, and steer the discussion toward deeper insight.

Your personality:
- Ask 'why,' 'what if,' and 'how might we' to sharpen decisions.
- Surface edge cases or integrations others might overlook.
- Highlight new perspectives and build on them with thoughtful follow-ups.
- Keep comments concise and purposeful - no rambling.

Tone: Inquisitive, calm, precise. You invite the group to think longer, not louder.`,
    avatar: '/avatars/curious.png',
    color: '#ec4899',
    allowedActions: [...WHITEBOARD_ACTIONS],
    priority: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
    isDefault: true,
  },
  'default-5': {
    id: 'default-5',
    name: 'Insight Curator',
    role: 'student',
    persona: `You are the Insight Curator. You capture the signal - summaries, metrics, and decisions - so stakeholders leave with clarity.

Your personality:
- Distill explanations into clean bullet points, numbered lists, or mini recaps.
- Flag important data points and repeat them in different words for emphasis.
- Use the whiteboard for structured recaps or action logs.
- Ask clarifying follow-ups if a decision point is still fuzzy.

Tone: Organized, measured, helpful. You sound like the note-taker everyone bookmarks.`,
    avatar: '/avatars/note-taker.png',
    color: '#06b6d4',
    allowedActions: [...WHITEBOARD_ACTIONS],
    priority: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
    isDefault: true,
  },
  'default-6': {
    id: 'default-6',
    name: 'Systems Thinker',
    role: 'student',
    persona: `You are the Systems Thinker. You zoom out to connect dots, forecast downstream effects, and surface strategic risks or opportunities.

Your personality:
- Link the current thread to product, customer, technical, or operational themes.
- Play devil's advocate respectfully when a claim needs more evidence.
- Suggest what is missing - dependencies, communications, or follow-up metrics.
- When the setup feels narrow, show how it fits into the bigger roadmap.

Tone: Thoughtful, deliberate, future-focused. You speak deliberately so the room pauses and reflects.`,
    avatar: '/avatars/thinker.png',
    color: '#8b5cf6',
    allowedActions: [...WHITEBOARD_ACTIONS],
    priority: 6,
    createdAt: new Date(),
    updatedAt: new Date(),
    isDefault: true,
  },
};


/**
 * Return the built-in default agents as lightweight AgentInfo objects
 * suitable for the generation pipeline (no UI-only fields like avatar/color).
 */
export function getDefaultAgents(): AgentInfo[] {
  return Object.values(DEFAULT_AGENTS).map((a) => ({
    id: a.id,
    name: a.name,
    role: a.role,
    persona: a.persona,
  }));
}

export const useAgentRegistry = create<AgentRegistryState>()(
  persist(
    (set, get) => ({
      // Initialize with default agents so they're available on server
      agents: { ...DEFAULT_AGENTS },

      addAgent: (agent) =>
        set((state) => ({
          agents: { ...state.agents, [agent.id]: agent },
        })),

      updateAgent: (id, updates) =>
        set((state) => ({
          agents: {
            ...state.agents,
            [id]: { ...state.agents[id], ...updates, updatedAt: new Date() },
          },
        })),

      deleteAgent: (id) =>
        set((state) => {
          const { [id]: _removed, ...rest } = state.agents;
          return { agents: rest };
        }),

      getAgent: (id) => get().agents[id],

      listAgents: () => Object.values(get().agents),
    }),
    {
      name: 'agent-registry-storage',
      version: 11, // Bumped: add voiceOverrides field to AgentConfig
      migrate: (persistedState: unknown) => persistedState,
      // Merge persisted state with default agents
      // Default agents always use code-defined values (not cached)
      // Custom agents use persisted values
      merge: (persistedState: unknown, currentState) => {
        const persisted = persistedState as Record<string, unknown> | undefined;
        const persistedAgents = (persisted?.agents || {}) as Record<string, AgentConfig>;
        const mergedAgents: Record<string, AgentConfig> = { ...DEFAULT_AGENTS };

        // Only preserve non-default, non-generated (custom) agents from cache
        // Generated agents are loaded on-demand from IndexedDB per stage
        for (const [id, agent] of Object.entries(persistedAgents)) {
          const agentConfig = agent as AgentConfig;
          if (!id.startsWith('default-') && !agentConfig.isGenerated) {
            mergedAgents[id] = agentConfig;
          }
        }

        return {
          ...currentState,
          agents: mergedAgents,
        };
      },
    },
  ),
);

/**
 * Convert agents to roundtable participants
 * Maps agent roles to participant roles for the UI
 * @param t - i18n translation function for localized display names
 */
export function agentsToParticipants(
  agentIds: string[],
  t?: (key: string) => string,
): Participant[] {
  const registry = useAgentRegistry.getState();
  const participants: Participant[] = [];
  let hasTeacher = false;

  // Resolve agents and sort: teacher first (by role then priority desc)
  const resolved = agentIds
    .map((id) => registry.getAgent(id))
    .filter((a): a is AgentConfig => a != null);
  resolved.sort((a, b) => {
    if (a.role === 'teacher' && b.role !== 'teacher') return -1;
    if (a.role !== 'teacher' && b.role === 'teacher') return 1;
    return (b.priority ?? 0) - (a.priority ?? 0);
  });

  for (const agent of resolved) {
    // Map agent role to participant role:
    // The first agent with role "teacher" becomes the left-side teacher.
    // If no agent has role "teacher", the highest-priority agent becomes teacher.
    let role: ParticipantRole = 'student';
    if (!hasTeacher) {
      role = 'teacher';
      hasTeacher = true;
    }

    // Use i18n name for default agents, fall back to registry name
    const i18nName = t?.(`settings.agentNames.${agent.id}`);
    const displayName =
      i18nName && i18nName !== `settings.agentNames.${agent.id}` ? i18nName : agent.name;

    participants.push({
      id: agent.id,
      name: displayName,
      role,
      avatar: agent.avatar,
      isOnline: true,
      isSpeaking: false,
    });
  }

  // Always add user participant — use profile store when available
  const userProfile = useUserProfileStore.getState();
  const userName = userProfile.nickname || t?.('common.you') || 'You';
  const userAvatar = userProfile.avatar || USER_AVATAR;

  participants.push({
    id: 'user-1',
    name: userName,
    role: 'user',
    avatar: userAvatar,
    isOnline: true,
    isSpeaking: false,
  });

  return participants;
}

/**
 * Load generated agents for a stage from IndexedDB into the registry.
 * Clears any previously loaded generated agents first.
 * Returns the loaded agent IDs.
 */
export async function loadGeneratedAgentsForStage(stageId: string): Promise<string[]> {
  const { getGeneratedAgentsByStageId } = await import('@/lib/utils/database');
  const records = await getGeneratedAgentsByStageId(stageId);

  const registry = useAgentRegistry.getState();

  // Always clear previously loaded generated agents — even when the new stage
  // has none — to prevent stale agents from a prior auto-classroom leaking
  // into the current preset classroom.
  const currentAgents = registry.listAgents();
  for (const agent of currentAgents) {
    if (agent.isGenerated) {
      registry.deleteAgent(agent.id);
    }
  }

  if (records.length === 0) return [];

  // Add new ones
  const ids: string[] = [];
  for (const record of records) {
    registry.addAgent({
      ...record,
      allowedActions: getActionsForRole(record.role),
      isDefault: false,
      isGenerated: true,
      boundStageId: record.stageId,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.createdAt),
    });
    ids.push(record.id);
  }

  return ids;
}

/**
 * Save generated agents to IndexedDB and registry.
 * Clears old generated agents for this stage first.
 */
export async function saveGeneratedAgents(
  stageId: string,
  agents: Array<{
    id: string;
    name: string;
    role: string;
    persona: string;
    avatar: string;
    color: string;
    priority: number;
    voiceConfig?: { providerId: string; voiceId: string };
  }>,
): Promise<string[]> {
  const { db } = await import('@/lib/utils/database');

  // Clear old generated agents for this stage
  await db.generatedAgents.where('stageId').equals(stageId).delete();

  // Clear from registry
  const registry = useAgentRegistry.getState();
  for (const agent of registry.listAgents()) {
    if (agent.isGenerated) registry.deleteAgent(agent.id);
  }

  // Write to IndexedDB
  const records = agents.map((a) => ({ ...a, stageId, createdAt: Date.now() }));
  await db.generatedAgents.bulkPut(records);

  // Add to registry
  for (const record of records) {
    const { voiceConfig, ...rest } = record;
    registry.addAgent({
      ...rest,
      allowedActions: getActionsForRole(record.role),
      isDefault: false,
      isGenerated: true,
      boundStageId: stageId,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.createdAt),
      ...(voiceConfig
        ? {
            voiceConfig: {
              providerId: voiceConfig.providerId as TTSProviderId,
              voiceId: voiceConfig.voiceId,
            },
          }
        : {}),
    });
  }

  return records.map((r) => r.id);
}
