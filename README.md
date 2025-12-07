
# MomentSmith
**Quietly organized chaos for the digital mind.**

Ever feel like your brain is a browser with 500 tabs open, playing three different songs, while you try to write a single email?

**MomentSmith** is a capture tool for thinkers, tinkerers, and the delightfully scattered. It takes your fleeting thoughts—text or voice—and uses Google's Gemini API to automatically classify, tag, and organize them into a visual mind map.

But it goes deeper. It acts as a mirror, analyzing your patterns to reveal how algorithms see you, and helps you synthesize your noise into actionable specs or weekly reflections.

---

### See it in action

**The Input:**
> "App idea: A social network that only works when you are physically alone. GPS checks for isolation. It's called Anti-Social."

**The MomentSmith Output:**
*   **Category:** `App Idea`
*   **Tags:** `#irony` `#social-media` `#mvp`
*   **Tone:** `Creative`
*   **Mind Map:** Automatically clustered near your other cynical tech ideas.
*   **Action:** One click converts this sentence into a full **Product Requirements Document (PRD)**.

---

## ✨ Features

### 🎙️ Frictionless Capture
Type it or say it. MomentSmith uses browser-native speech recognition to catch your rant before it evaporates.

### 🧠 Auto-Classification (Gemini 2.5 Flash)
No more manual tagging. The AI detects if you are `Venting`, having a `Philosophy` breakthrough, or noting a `Parenting` win. It assigns tags, tone, and a summary instantly.

### 🕸️ Dynamic Mind Map
Watch your thoughts cluster together naturally. Use D3.js physics to visualize how your "Work Frustrations" are alarmingly close to your "Escape Plan" ideas.

### 👁️ The Algorithm Mirror (Gemini 3 Pro)
A gentle, unflinching reflection from your "Higher Self". It analyzes your cognitive patterns to reveal exactly how digital systems (social media, marketing engines, influence loops) perceive and extract value from you. It speaks truth with compassion, helping you reclaim agency from the machine.

### 📄 Full HTML Dossier
Export your entire brain dump, including your Weekly Digest and Algorithm Profile, into a beautiful, standalone HTML report. Keep it forever. No cloud lock-in.

---

## 🚀 Getting Started

1.  **Clone the repo:**
    ```bash
    git clone https://github.com/yourname/momentsmith
    cd momentsmith
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set your API Key:**
    Ensure your environment variables are set up with a valid Google Gemini API Key.

4.  **Run locally:**
    ```bash
    npm start
    ```

---

## 📚 How it Works

1.  **Capture:** You input raw text/audio.
2.  **Process:** We send it to `gemini-2.5-flash` with a structured schema prompt. It returns a JSON object containing the category, sentiment, and tags.
3.  **Store:** Data is stored locally in your browser (LocalStorage).
4.  **Reflect:**
    *   **Weekly Digest:** `gemini-2.5-flash` reads your week's history and writes a summary, finds patterns, and offers one absurdist observation.
    *   **App Spec:** `gemini-3-pro-preview` takes a simple one-liner and expands it into a full technical specification with stack recommendations.

---

## 🔒 Privacy First

MomentSmith is **Local-First**. 
*   Your notes live in your browser.
*   They are sent to the AI API *only* for processing.
*   They are never saved to a central MomentSmith database.
*   Export your data as JSON or HTML at any time.

---

## 🎉 Why?

Because the friction between "having a thought" and "organizing a thought" is where good ideas die. MomentSmith removes the friction and adds a little bit of magic (and radical clarity) to the process.
