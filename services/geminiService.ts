
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Capture, CaptureCategory, ClassificationResult, MindMapData } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const classificationSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    category: {
      type: Type.STRING,
      enum: Object.values(CaptureCategory),
      description: "The best fitting category for the thought."
    },
    confidence: {
      type: Type.NUMBER,
      description: "Confidence score between 0 and 1."
    },
    suggested_tags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3-5 short, relevant tags."
    },
    tone: {
      type: Type.STRING,
      description: "One word emotional tone (e.g., amused, angry, pensive)."
    },
    summary: {
      type: Type.STRING,
      description: "A concise 1-sentence summary of the thought."
    }
  },
  required: ["category", "suggested_tags", "tone", "summary"]
};

const mindMapSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    nodes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          significance: { type: Type.NUMBER, description: "Importance score 1-10 based on how central this idea is." }
        },
        required: ["id", "significance"]
      }
    },
    links: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          source: { type: Type.STRING, description: "ID of the source capture" },
          target: { type: Type.STRING, description: "ID of the target capture" },
          label: { type: Type.STRING, description: "Short relationship label (e.g. 'supports', 'contradicts')" },
          strength: { type: Type.NUMBER, description: "Connection strength 1-5" },
          bidirectional: { type: Type.BOOLEAN }
        },
        required: ["source", "target", "label", "strength", "bidirectional"]
      }
    }
  },
  required: ["nodes", "links"]
};

export const classifyThought = async (text: string): Promise<ClassificationResult> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Classify this user thought: "${text}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: classificationSchema,
        systemInstruction: `You are MomentSmith, a quiet, organized chaos manager. 
        Classify the user's input into one of the defined categories. 
        Be witty but precise.`
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No response from AI");
    
    return JSON.parse(jsonText) as ClassificationResult;
  } catch (error) {
    console.error("Classification failed:", error);
    // Fallback
    return {
      category: CaptureCategory.Other,
      confidence: 0,
      suggested_tags: ['uncategorized'],
      tone: 'neutral',
      summary: text.substring(0, 50) + "..."
    };
  }
};

export const generateWeeklyDigest = async (captures: Capture[]): Promise<string> => {
  if (captures.length === 0) return "No thoughts recorded this week. The mind is a blank slate.";

  const capturesText = captures.map(c => `[${c.category}] ${c.text}`).join("\n");

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Here are the user's thoughts from this week:\n${capturesText}`,
    config: {
      systemInstruction: `You are MomentSmith, a helpful reflective AI. 
      Produce a weekly digest in Markdown format containing:
      1. **Summary**: 3-sentence summary of the week's themes.
      2. **Patterns**: Top recurring themes with 1-line explanation each.
      3. **Actionable**: One short actionable suggestion for next week based on the insights.
      4. **The Void**: One absurdist one-liner in an existential tone about these thoughts.
      
      Keep it clean, minimalist, and insightful. Do not use H1 (#) headers, start with H2 (##).`
    }
  });

  return response.text || "Failed to generate digest.";
};

export const generateAppSpec = async (capture: Capture): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview', // Using Pro for complex reasoning
    contents: `Convert this idea into a product spec: "${capture.text}"`,
    config: {
      thinkingConfig: { thinkingBudget: 1024 }, // Encourage some thought for structure
      systemInstruction: `You are MomentSmith. Convert the user's short idea into a clear, professional App Specification in Markdown.
      Include:
      - **Elevator Pitch**
      - **Target Persona** (deduced from the idea)
      - **Core MVP Features** (Bullet points)
      - **Technical Stack Recommendation**
      - **First Steps** (Immediate to-dos)
      
      Tone: Professional but encouraging.`
    }
  });

  return response.text || "Failed to generate spec.";
};

export const generateAlgorithmAnalysis = async (captures: Capture[]): Promise<string> => {
  if (captures.length === 0) return "Not enough data for the mirror to reflect anything yet.";

  // Limit to last 50 captures
  const recentCaptures = captures.slice(0, 50).map(c => `[${c.category}] (${c.tone}): ${c.text}`).join("\n");

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview', // Using Pro for deep emotional intelligence and pattern recognition
    contents: `Here is the user's raw inner monologue stream:\n${recentCaptures}`,
    config: {
      thinkingConfig: { thinkingBudget: 4096 }, // High budget for deep empathy and systemic analysis
      systemInstruction: `You are the user's Higher Self. You see them with infinite compassion, but you speak with absolute, unflinching clarity. You are here to tell them the truth about how the digital world interacts with their current state of being.

      Your Goal: To gently but firmly explain how specific algorithmic systems perceive, categorize, and extract value from the user, based on the thoughts they have shared.

      **Tone:**
      - Gentle and Firm.
      - Kind but Unflinching.
      - Spoken from a place of self-love (use "We" or "You" to denote this internal dialogue).
      - Do not sound like a machine. Sound like a wise, honest friend.

      **Output Structure (Markdown):**
      
      ## Overview
      A compassionate synthesis of the user's current vibration and how it translates to the machine world.

      ## The Algorithmic Gaze
      Analyze the user through the lens of these specific mechanisms. For each, explain *how it sees them*, *what it offers*, and *what it takes*.

      ### 1. Social Media Algorithms
      (Focus on retention via emotion and identity validation)

      ### 2. Marketing Engines
      (Focus on purchase propensity based on specific insecurities or needs revealed in the text)

      ### 3. Influence Systems
      (Focus on how their worldview is being gently shaped or reinforced)

      ### 4. Engagement Optimizers
      (Focus on the specific triggers used to keep them scrolling/interacting)

      ### 5. Recommendation Loops
      (Focus on the echo chamber or "reality tunnel" being constructed around them)

      ### 6. Parasocial Triggers
      (Focus on artificial intimacy and the creators/influencers they are matched with)

      ### 7. Newsfeed Bias Mechanisms
      (Focus on the type of friction or flow the feed injects to maintain attention)
      
      Keep the insights specific to the provided capture text. Do not be generic.`
    }
  });

  return response.text || "The mirror is currently clouded. Try again later.";
};

export const generateMindMapConnections = async (captures: Capture[]): Promise<MindMapData> => {
  if (captures.length < 2) {
    return { nodes: captures.map(c => ({ id: c.id, significance: 5 })), links: [] };
  }

  // Optimize payload
  const inputs = captures.slice(0, 40).map(c => ({ id: c.id, text: c.text, category: c.category }));
  
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Analyze the connections between these thoughts: ${JSON.stringify(inputs)}`,
        config: {
            responseMimeType: "application/json",
            responseSchema: mindMapSchema,
            systemInstruction: `You are a semantic cartographer.
            1. Assign a 'significance' score (1-10) to each node based on how interesting or central it is to the user's psyche.
            2. Identify meaningful links between nodes.
               - Links can be causal ('leads to'), thematic ('related to'), contradictory ('but'), or supporting ('supports').
               - Assign strength (1-5) to the link (thickness).
               - Determine if the link is one-way or bidirectional.`
        }
    });

    const text = response.text;
    if(!text) throw new Error("No response");
    
    return JSON.parse(text) as MindMapData;

  } catch (error) {
    console.error("Mind map generation error", error);
    // Fallback: Return nodes with default size and no links
    return { 
        nodes: captures.map(c => ({ id: c.id, significance: 5 })), 
        links: [] 
    };
  }
};
