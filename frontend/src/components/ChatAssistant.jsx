import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { travelService } from "../services/travelService";

export default function ChatAssistant({ preferences, onResults }) {
  const [message, setMessage] = useState("");

  const [chat, setChat] = useState([
    {
      role: "assistant",
      text: "Ask me for trips by budget, mood, weather, group type, or hidden gems."
    }
  ]);

  const [loading, setLoading] = useState(false);

  async function send() {
    if (!message.trim()) return;

    const userMessage = message;

    const assistantId = `assistant-${Date.now()}`;

    setMessage("");

    setChat((current) => [
      ...current,
      { role: "user", text: userMessage },
      {
        id: assistantId,
        role: "assistant",
        text: "",
        streaming: true
      }
    ]);

    setLoading(true);

    try {
      await travelService.streamChat(
        {
          message: userMessage,
          preferences
        },
        {
          onMeta: (data) => {
            onResults?.(data.recommendations);
          },

          onDelta: (text) => {
            setChat((current) =>
              current.map((item) =>
                item.id === assistantId
                  ? {
                      ...item,
                      text: `${item.text}${text}`
                    }
                  : item
              )
            );
          },

          onDone: (data) => {
            setChat((current) =>
              current.map((item) =>
                item.id === assistantId
                  ? {
                      ...item,
                      streaming: false,
                      text:
                        item.text ||
                        "I found travel recommendations for you."
                    }
                  : item
              )
            );

            onResults?.(data.recommendations);
          },

          onError: (data) => {
            throw new Error(
              data.message || "Streaming failed"
            );
          }
        }
      );
    } catch (error) {
      try {
        const data = await travelService.chat({
          message: userMessage,
          preferences
        });

        setChat((current) =>
          current.map((item) =>
            item.id === assistantId
              ? {
                  ...item,
                  streaming: false,
                  text: data.answer
                }
              : item
          )
        );

        onResults?.(data.recommendations);

      } catch (_fallbackError) {

        setChat((current) =>
          current.map((item) =>
            item.id === assistantId
              ? {
                  ...item,
                  streaming: false,
                  text:
                    "Start the backend server, then try again."
                }
              : item
          )
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.16 }}
      className="glass rounded-lg p-5"
    >
      <h2 className="mb-4 text-2xl font-black">
        AI Travel Chat
      </h2>

      <div className="max-h-80 space-y-3 overflow-auto pr-1">
        <AnimatePresence initial={false}>
          {chat.map((item, index) => (
            <motion.div
              key={
                item.id ||
                `${item.role}-${index}-${item.text.slice(0, 8)}`
              }
              initial={{
                opacity: 0,
                y: 12,
                scale: 0.98
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1
              }}
              exit={{
                opacity: 0,
                y: -8
              }}
              transition={{
                duration: 0.24
              }}
              className={`rounded-lg p-3 text-sm ${
                item.role === "user"
                  ? "ml-auto bg-coral text-night"
                  : "bg-white/10 text-white/80"
              }`}
            >
              {item.text}

              {item.streaming && (
                <span className="ml-1 inline-block h-4 w-1 animate-pulse rounded bg-aqua align-middle" />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-4 flex gap-2">
        <input
          className="input"
          value={message}
          placeholder="Ask for beaches, mountains, luxury, peaceful trips..."
          onChange={(event) =>
            setMessage(event.target.value)
          }
          onKeyDown={(event) =>
            event.key === "Enter" && send()
          }
        />

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={send}
          disabled={loading}
          className="btn-primary"
        >
          {loading ? "..." : "Send"}
        </motion.button>
      </div>
    </motion.section>
  );
}