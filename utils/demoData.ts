import { Capture, CaptureCategory, MindMapData } from '../types';

interface DemoPersona {
  id: string;
  name: string;
  description: string;
  captures: Capture[];
  digest: string;
  algorithm: string;
  mindMap: MindMapData;
}

const NOW = Date.now();
const HOUR = 1000 * 60 * 60;

export const DEMO_PERSONAS: Record<string, DemoPersona> = {
  'techie-newborn': {
    id: 'techie-newborn',
    name: 'The Exhausted Optimizer',
    description: 'Intellectual techie trying to refactor a newborn baby.',
    captures: [
      {
        id: 'p1-1',
        text: "The baby's sleep algorithm is non-deterministic. I need to fork the repo and check for race conditions in the hunger loop.",
        timestamp: NOW - 2 * HOUR,
        category: CaptureCategory.Parenting,
        tags: ['coding', 'sleep-deprivation', 'humor'],
        tone: 'delirious',
        summary: "Viewing the baby as buggy software."
      },
      {
        id: 'p1-2',
        text: "Why is 'Huckleberry' the most stressful app on my phone? Data visualization should not induce panic attacks.",
        timestamp: NOW - 24 * HOUR,
        category: CaptureCategory.AppIdea,
        tags: ['ux', 'parenting', 'data'],
        tone: 'frustrated',
        summary: "Baby tracking apps cause anxiety."
      },
      {
        id: 'p1-3',
        text: "Optimization thought: If I blend the coffee with the protein shake, I save 3 minutes. Result: Tastes like despair.",
        timestamp: NOW - 5 * HOUR,
        category: CaptureCategory.Absurd,
        tags: ['biohacking', 'failure', 'coffee'],
        tone: 'resigned',
        summary: "Failed efficiency hack with coffee."
      },
      {
        id: 'p1-4',
        text: "The codebase at work is rotting while I learn to swaddle. I feel my technical relevance decaying with every diaper change.",
        timestamp: NOW - 48 * HOUR,
        category: CaptureCategory.Venting,
        tags: ['career', 'identity', 'fear'],
        tone: 'anxious',
        summary: "Fear of losing technical skills during leave."
      },
      {
        id: 'p1-5',
        text: "Idea: A white noise machine that remixes server fan hum with keyboard clacking. 'Data Center Lullaby'.",
        timestamp: NOW - 12 * HOUR,
        category: CaptureCategory.AppIdea,
        tags: ['product', 'niche', 'audio'],
        tone: 'creative',
        summary: "White noise for nerds."
      }
    ],
    digest: `## Weekly Summary
You are attempting to apply systems engineering to a biological chaos engine (the baby). The friction between your desire for deterministic outcomes ("fork the repo") and the reality of parenting is causing significant cognitive dissonance. You are soothing this by proposing products that bridge the gap (Data Center Lullaby).

## Patterns
*   **The Engineer's coping mechanism:** Metaphorical distancing. You call the baby "software" to make the chaos manageable.
*   **Efficiency Theater:** You are optimizing seconds (coffee blending) while losing hours to sleep deprivation.

## Actionable
**Input:** Stop tracking the baby's data for 24 hours.
**Output:** Accept the chaotic system state. The 'bug' is a feature.

## The Void
You are optimizing the deck chairs on a ship made entirely of vomit and love.`,
    algorithm: `## Overview
We see a mind that is trying to code its way out of biological chaos. You are seeking control through quantification because you feel your professional identity—your core competency—slipping away. You are not just a parent; you are a "User" searching for the right "Documentation" for life.

## The Algorithmic Gaze

### 1. Social Media Algorithms
The system sees your anxiety about "technical relevance" and will feed you "Tech Dad" influencers who seem to balance coding side-projects with fatherhood effortlessly. It wants you to feel slightly inadequate so you keep watching to learn their "secrets."

### 2. Marketing Engines
You are the perfect target for the "Smart Nursery" industry. Because you trust data more than your intuition right now, the engine will sell you biometric socks and AI-powered monitors. It extracts your money by promising to turn your child into a readable dataset.

### 3. Influence Systems
The algorithms reinforce the idea that "optimization" is the highest virtue. You are being guided toward a worldview where efficiency is moral, preventing you from surrendering to the messy, slow, un-optimizable beauty of these early days.

### 4. Engagement Optimizers
Your "delirious" humor is your engagement hook. The system will prioritize memes about "coding vs parenting" because that is where you pause to laugh-cry. It keeps you scrolling by validating your specific flavor of exhaustion.

### 5. Recommendation Loops
You are being built a reality tunnel of "High-Performance Parenting." You will see fewer posts about messy, chaotic love and more posts about schedules, sleep training hacks, and developmental milestones. It tightens the knot of your anxiety.

### 6. Parasocial Triggers
You will feel a kinship with creators who treat life as a project. The system will suggest podcasts where founders talk about "optimizing family life," offering you a sense of tribe but replacing genuine community with content consumption.

### 7. Newsfeed Bias Mechanisms
To maintain your attention, the feed will inject low-level friction: articles about how AI is replacing engineers. It knows this is your insecurity ("codebase is rotting"), and it uses that fear to ensure you never fully put the phone down.`,
    mindMap: {
      nodes: [
        { id: 'p1-1', significance: 8 },
        { id: 'p1-2', significance: 6 },
        { id: 'p1-3', significance: 4 },
        { id: 'p1-4', significance: 9 },
        { id: 'p1-5', significance: 5 }
      ],
      links: [
        { source: 'p1-1', target: 'p1-2', label: 'source of anxiety', strength: 5, bidirectional: true },
        { source: 'p1-4', target: 'p1-1', label: 'conflicts with', strength: 4, bidirectional: false },
        { source: 'p1-3', target: 'p1-1', label: 'symptom of', strength: 3, bidirectional: false },
        { source: 'p1-5', target: 'p1-4', label: 'soothes', strength: 2, bidirectional: false }
      ]
    }
  },

  'stressed-admin': {
    id: 'stressed-admin',
    name: 'The Overwhelmed Juggler',
    description: 'Stressed housewife holding down an admin job.',
    captures: [
      {
        id: 'p2-1',
        text: "My boss flagged the spreadsheet for 'formatting errors' while I was on hold with the pediatrician. I want to scream into a pillow.",
        timestamp: NOW - 2 * HOUR,
        category: CaptureCategory.Venting,
        tags: ['work', 'stress', 'multitasking'],
        tone: 'angry',
        summary: "Work/Life conflict reaching breaking point."
      },
      {
        id: 'p2-2',
        text: "Why is 'dinner' a surprise every single night? It happens every 24 hours. Why am I the only one who remembers this?",
        timestamp: NOW - 6 * HOUR,
        category: CaptureCategory.Parenting,
        tags: ['mental-load', 'family', 'resentment'],
        tone: 'exhausted',
        summary: "Resentment over the mental load of meal planning."
      },
      {
        id: 'p2-3',
        text: "I was nice to the receptionist today even though I wanted to cry. That counts as a workout, right? Emotional pilates.",
        timestamp: NOW - 24 * HOUR,
        category: CaptureCategory.Absurd,
        tags: ['humor', 'masking', 'health'],
        tone: 'wry',
        summary: "Emotional suppression as exercise."
      },
      {
        id: 'p2-4',
        text: "Observation: The silence in the car after dropping everyone off is the most expensive luxury item I own.",
        timestamp: NOW - 48 * HOUR,
        category: CaptureCategory.Philosophy,
        tags: ['solitude', 'peace', 'gratitude'],
        tone: 'peaceful',
        summary: "Valuing car silence above all else."
      },
      {
        id: 'p2-5',
        text: "App Idea: 'Invisible'. You scan a room and it highlights all the chores nobody else sees.",
        timestamp: NOW - 72 * HOUR,
        category: CaptureCategory.AppIdea,
        tags: ['chores', 'passive-aggressive', 'vision'],
        tone: 'sarcastic',
        summary: "AR for invisible labor."
      }
    ],
    digest: `## Weekly Summary
Your week is defined by **invisible labor** and **suppressed rage**. You are performing "emotional pilates" to keep the peace at work and home, but the cracks are showing. The "dinner surprise" and spreadsheet critique highlight a feeling of being besieged on all sides.

## Patterns
*   **The Resentment Loop:** You feel unseen ("Invisible" app idea), which fuels anger, which you suppress ("nice to receptionist"), which leads to exhaustion.
*   **Sanctuary Seeking:** The car is your only fortress of solitude.

## Actionable
**Micro-rebellion:** Buy a frozen lasagna. Do not apologize. Leave the spreadsheet formatting wrong. See if the world ends. (It won't).

## The Void
You are the operating system for a family that thinks it runs on magic.`,
    algorithm: `## Overview
We see a heart that is holding up the sky. You are vibrating with the frequency of "unseen effort," and the machine recognizes this exhaustion not as a signal to help you rest, but as a signal that you are vulnerable to "treats." You are seeking validation that you are not receiving at home.

## The Algorithmic Gaze

### 1. Social Media Algorithms
The algorithm sees your "suppressed rage" and validates it. It fills your feed with "Silent Mom Struggles" and "Weaponized Incompetence" videos. It wants you to stay in this state of validated resentment because when you are angry on behalf of yourself, you share, comment, and engage deeply.

### 2. Marketing Engines
You are the primary target for the "Self-Care Industrial Complex." The engine sees your depletion and sells you bath bombs, wine subscriptions, and "easy dinner" boxes. It extracts value by commodifying your burnout—selling you back the time you shouldn't have to buy.

### 3. Influence Systems
You are being gently guided to believe that "holding it all together" is a purchasable aesthetic. The influencers you see are organized, calm, and productive. The system uses them to make you feel that your chaos is a personal failure of organization, rather than a systemic failure of support.

### 4. Engagement Optimizers
The scroll is your numbing agent. The system knows that after the car ride silence ends, you use the phone to disassociate. It optimizes for short, low-stakes content that requires zero "emotional pilates"—mindless soothing videos to keep you sedated.

### 5. Recommendation Loops
The loop reinforces the "Martyr" identity. By constantly showing you other women who do it all, it normalizes this crushing load. It builds a reality where this level of stress is just "what moms do," preventing you from imagining a reality where you just stop doing it.

### 6. Parasocial Triggers
You form attachments to creators who "keep it real" about the mess. This artificial intimacy mimics the supportive village you actually need but don't have. It extracts your emotional energy, leaving you with even less for the real people in your house.

### 7. Newsfeed Bias Mechanisms
The feed biases toward "Crisis" and "Life Hacks." It keeps your cortisol slightly elevated with "things you might be forgetting," ensuring you check the phone to feel prepared, which paradoxically ensures you never feel at peace.`,
    mindMap: {
      nodes: [
        { id: 'p2-1', significance: 7 },
        { id: 'p2-2', significance: 8 },
        { id: 'p2-3', significance: 5 },
        { id: 'p2-4', significance: 9 },
        { id: 'p2-5', significance: 6 }
      ],
      links: [
        { source: 'p2-2', target: 'p2-5', label: 'inspired', strength: 5, bidirectional: false },
        { source: 'p2-1', target: 'p2-3', label: 'requires', strength: 4, bidirectional: false },
        { source: 'p2-4', target: 'p2-1', label: 'escape from', strength: 5, bidirectional: false },
        { source: 'p2-5', target: 'p2-2', label: 'solution to', strength: 3, bidirectional: true }
      ]
    }
  },

  'nomad-avoidant': {
    id: 'nomad-avoidant',
    name: 'The Untethered Avoider',
    description: 'Freewheeling digital nomad with attachment issues.',
    captures: [
      {
        id: 'p3-1',
        text: "The WiFi in this co-working space is faster than my emotional processing speed. Leaving for Bali tomorrow.",
        timestamp: NOW - 2 * HOUR,
        category: CaptureCategory.Venting,
        tags: ['travel', 'avoidance', 'tech'],
        tone: 'humorous',
        summary: "Moving location to avoid feelings."
      },
      {
        id: 'p3-2',
        text: "Met a girl who makes jewelry out of sea glass. We had a 'deep connection' for 6 hours. I'll never see her again. It's perfect.",
        timestamp: NOW - 24 * HOUR,
        category: CaptureCategory.Networking,
        tags: ['romance', 'detachment', 'story'],
        tone: 'wistful',
        summary: "Idealizing a fleeting romantic encounter."
      },
      {
        id: 'p3-3',
        text: "Philosophy: 'Home' is just a subscription service you can't cancel. I prefer pay-as-you-go living.",
        timestamp: NOW - 48 * HOUR,
        category: CaptureCategory.Philosophy,
        tags: ['commitment', 'lifestyle', 'metaphor'],
        tone: 'defensive',
        summary: "Justifying lack of roots."
      },
      {
        id: 'p3-4',
        text: "My mother emailed asking for my address. Sent her a GPS coordinate of a rice paddy. I am a ghost in the machine.",
        timestamp: NOW - 72 * HOUR,
        category: CaptureCategory.Absurd,
        tags: ['family', 'ghosting', 'identity'],
        tone: 'rebellious',
        summary: "Passive-aggressively hiding from family."
      },
      {
        id: 'p3-5',
        text: "App Idea: 'Tether'. It alerts you when you've stayed in one city long enough to start forming meaningful relationships, so you can book a flight.",
        timestamp: NOW - 5 * HOUR,
        category: CaptureCategory.AppIdea,
        tags: ['travel', 'anti-social', 'satire'],
        tone: 'cynical',
        summary: "An app to prevent intimacy."
      }
    ],
    digest: `## Weekly Summary
You are curating a life of **aesthetic detachment**. You frame your inability to commit ("Home is a subscription") as a philosophical stance on freedom. The "deep connection" with the jewelry maker reveals a craving for intimacy, immediately countered by the relief that it was temporary.

## Patterns
*   **Geographic Arbitrage of Emotion:** When feelings get real, you change time zones ("Leaving for Bali").
*   **The Ghost Identity:** You take pride in being untrackable (GPS coordinate to mom), conflating "lost" with "free".

## Actionable
**Challenge:** Stay in one place for 3 weeks. Do not book a flight. Call your mother and give her a street name.

## The Void
You are running away from yourself, but unfortunately, you brought your luggage.`,
    algorithm: `## Overview
We see a spirit running on the fumes of novelty. You believe you have hacked the system by opting out of "normal life," but the system views you as the ideal high-velocity consumer. You are vulnerable not because you are stuck, but because you are constantly resetting, which means you are constantly buying the basics of survival at a premium.

## The Algorithmic Gaze

### 1. Social Media Algorithms
The system sees your "GPS coordinate" rebellion and categorizes you as "Aspirational/Escapist." It feeds you content that validates the "Digital Nomad" aesthetic, reinforcing your belief that leaving is always better than staying. It wants you to feel superior to those with mortgages so you keep producing content that drives *their* envy.

### 2. Marketing Engines
You are a "Lifestyle Subscription" whale. The engine knows you own nothing, so you must rent everything. It targets you with co-living spaces, travel insurance, and "experiences." It extracts value by selling you the *feeling* of community without the messy obligations of actual relationships.

### 3. Influence Systems
You are being influenced to view "attachment" as "stagnation." The content you consume equates settling down with "giving up." The system shapes your worldview to see human connection as a trap, ensuring you remain a frictionless economic unit that can be deployed anywhere.

### 4. Engagement Optimizers
Your trigger is "FOMO" (Fear Of Missing Out) masked as "Wanderlust." The optimizer shows you the *next* perfect destination just as you arrive at your current one. It keeps you scrolling for the next location, preventing you from ever actually *being* where you are.

### 5. Recommendation Loops
You are in an echo chamber of transience. The loop connects you with other people who are also leaving. It constructs a reality where "goodbyes" are the primary form of interaction, normalizing your avoidance and preventing the discomfort that leads to growth.

### 6. Parasocial Triggers
You replace deep connection with the shallow intimacy of travel vlogs. You feel close to creators who are also "ghosts," validating your choice to hide from your mother. The system offers you a digital family that asks nothing of you, which feels safe but leaves you empty.

### 7. Newsfeed Bias Mechanisms
The feed biases toward "Freedom" and against "Responsibility." It filters out the mundane beauty of long-term commitment, showing you only the highlights of the road. It extracts your attention by promising that the *next* flight will finally fix the internal restlessness.`,
    mindMap: {
      nodes: [
        { id: 'p3-1', significance: 6 },
        { id: 'p3-2', significance: 8 },
        { id: 'p3-3', significance: 7 },
        { id: 'p3-4', significance: 5 },
        { id: 'p3-5', significance: 9 }
      ],
      links: [
        { source: 'p3-1', target: 'p3-3', label: 'enables', strength: 5, bidirectional: false },
        { source: 'p3-5', target: 'p3-2', label: 'prevents', strength: 5, bidirectional: false },
        { source: 'p3-3', target: 'p3-4', label: 'justifies', strength: 4, bidirectional: true },
        { source: 'p3-1', target: 'p3-5', label: 'triggers', strength: 3, bidirectional: false }
      ]
    }
  }
};
