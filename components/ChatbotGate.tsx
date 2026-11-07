import { ChatbotWidget } from "@wp-chatbot/nextjs";

/**
 * Shows the chat widget only when NEXT_PUBLIC_WPC_ENABLED is "true".
 * Set it for Vercel Preview first. Leave it unset for Production until the store agrees.
 * The widget reads NEXT_PUBLIC_WPC_API_BASE, NEXT_PUBLIC_WPC_PUBLISHABLE_KEY and
 * NEXT_PUBLIC_WPC_SITE_URL itself.
 */
export function ChatbotGate() {
  if (process.env.NEXT_PUBLIC_WPC_ENABLED !== "true") return null;
  return <ChatbotWidget displayName="Alex" />;
}
