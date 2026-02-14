# Ryze AI : UI Generator

A deterministic AI-powered UI generator that converts natural language intent into working React code using an immutable component library.

## Architecture Overview

The system uses a strict 4-step agent workflow to ensure safety, predictability, and visual consistency.

### Agent Design (Prompts)

1.  **PLANNER**: Interprets the user's intent and produces a structured JSON layout plan.
2.  **VALIDATOR**: Verifies that only components from the allowed library are used and that props are valid.
3.  **GENERATOR**: Converts the validated plan into actual React JSX code.
4.  **EXPLAINER**: Provides a plain-English summary of the changes and the rationale behind the UI structure.

## Component System Design

The component library is **immutable**. The AI can set props and compose layouts but cannot change the internal implementation or styling of the components.

- **Button**: `label`, `variant`
- **Card**: `title`, `children`
- **Input**: `label`, `placeholder`
- **Table**: `columns`, `data`
- **Modal**: `title`, `isOpen`, `children`
- **Sidebar**: `items`
- **Navbar**: `title`, `actions`
- **Chart**: `type`, `data`

## Known Limitations

- **State Sync**: Currently uses in-memory versioning which resets on page reload.
- **Complex Logic**: The agent primarily handles layout and structure; complex event handling is out of scope for the deterministic library.
- **Preview Rendering**: Uses a placeholder preview in the manual implementation.

## Improvements with More Time

- **Safe Eval**: Implement a secure sandbox for live-rendering the generated JSX code in real-time.
- **Persistent History**: Use a database to store versions and chat history.
- **Interactive Props**: Allow the user to click components in the preview to edit their props directly.
- **Multi-Agent Collaboration**: Use separate LLM deployments for each agent step to optimize performance.

## Deployment

To deploy this project to Vercel:

1.  Push your code to a GitHub repository.
2.  Import the project into Vercel.
3.  **Crucial Step:** In the Vercel project settings, go to **Settings > Environment Variables**.
4.  Add the following environment variable:
    -   `GROQ_API_KEY`: Your Groq API key (same as in your `.env.local` file).
5.  Deploy.

Without the `GROQ_API_KEY`, the chatbot will not respond.
