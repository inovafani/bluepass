"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const GREETING: Message = {
  role: "assistant",
  content:
    "Hey, I'm Kai. Tell me what kind of ocean experience you're looking for — diving, liveaboards, sailing, eco resorts, or something more remote.",
};

const LS_KEY = "bluepass:kaiSessionId";
const WA_HREF = "https://wa.me/628213143342";

export function KaiWebChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // sessionId drives no rendering — ref avoids synchronous setState in effects
  const sessionIdRef = useRef<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const didInit = useRef(false);

  // On mount: restore session from localStorage and fetch history.
  // All setState calls happen inside async .then()/.catch() — not synchronously
  // in the effect body — satisfying the react-hooks/set-state-in-effect rule.
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    const stored = localStorage.getItem(LS_KEY);
    if (!stored) return;

    sessionIdRef.current = stored;

    fetch(`/api/kai/web-chat/history?sessionId=${encodeURIComponent(stored)}`)
      .then((res) => {
        if (!res.ok) throw new Error("history unavailable");
        return res.json() as Promise<{
          sessionId: string;
          messages: Array<{ role: string; content: string; createdAt: string }>;
        }>;
      })
      .then((data) => {
        const visible = data.messages
          .filter((m) => m.role === "user" || m.role === "assistant")
          .map((m) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
          }));
        if (visible.length > 0) setMessages(visible);
      })
      .catch(() => {
        // History unavailable; messages stays as [GREETING]
      });
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending, isOpen]);

  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => textareaRef.current?.focus(), 80);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || isSending) return;
    const recentMessages = messages.slice(-10).map((message) => ({
      role: message.role,
      content: message.content,
    }));

    setInput("");
    setError(null);
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setIsSending(true);

    if (textareaRef.current) textareaRef.current.style.height = "auto";

    try {
      const res = await fetch("/api/kai/web-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionIdRef.current ?? undefined,
          message: text,
          recentMessages,
        }),
      });

      if (!res.ok) throw new Error("non-ok response");

      const data: { sessionId: string; reply: string } = await res.json();

      if (data.sessionId !== sessionIdRef.current) {
        sessionIdRef.current = data.sessionId;
        localStorage.setItem(LS_KEY, data.sessionId);
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch {
      setError("Couldn't reach Kai right now. Please try again.");
    } finally {
      setIsSending(false);
    }
  }, [input, isSending, messages]);

  function startNewChat() {
    localStorage.removeItem(LS_KEY);
    sessionIdRef.current = null;
    setMessages([GREETING]);
    setInput("");
    setError(null);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
  }

  function handleTextareaInput(e: React.FormEvent<HTMLTextAreaElement>) {
    const t = e.currentTarget;
    t.style.height = "auto";
    t.style.height = `${Math.min(t.scrollHeight, 120)}px`;
  }

  return (
    <div className="fixed bottom-4 right-4 z-[90] flex flex-col items-end gap-3 md:bottom-6 md:right-6">
      {/* ── Chat panel ────────────────────────────────────────── */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Chat with Kai"
          aria-modal="true"
          className="flex w-[390px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-white/16 bg-[#03111d] shadow-[0_28px_100px_rgba(0,0,0,0.62)]"
          style={{ height: "min(560px, calc(100svh - 9rem))" }}
        >
          {/* Header */}
          <div className="flex flex-shrink-0 items-center gap-3 border-b border-white/10 px-4 py-3.5">
            <span
              aria-hidden="true"
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#d9fdd3] text-[11px] font-semibold text-[#075e54]"
            >
              K
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold leading-none text-white">
                Chat with Kai
              </p>
              <p className="mt-[5px] text-[11px] leading-none text-white/50">
                Your BluePass marine travel concierge
              </p>
            </div>
            <button
              onClick={startNewChat}
              aria-label="Start new chat"
              title="New chat"
              className="bp-focus-ring flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-white/35 transition-colors hover:bg-white/10 hover:text-white/75"
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              className="bp-focus-ring flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-white/35 transition-colors hover:bg-white/10 hover:text-white/75"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M1 1l10 10M11 1L1 11" />
              </svg>
            </button>
          </div>

          {/* Message list */}
          <div className="kai-messages flex-1 overflow-y-auto px-4 py-5">
            <div className="flex flex-col gap-4 pb-2">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex items-end gap-2 ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.role === "assistant" && (
                    <span
                      aria-hidden="true"
                      className="mb-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#d9fdd3] text-[9px] font-semibold text-[#075e54]"
                    >
                      K
                    </span>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-[1.6] ${
                      msg.role === "user"
                        ? "rounded-br-md bg-[#075e54] text-white"
                        : "rounded-bl-md bg-[#0e3250] text-white"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {isSending && (
                <div className="flex items-end gap-2">
                  <span
                    aria-hidden="true"
                    className="mb-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#d9fdd3] text-[9px] font-semibold text-[#075e54]"
                  >
                    K
                  </span>
                  <div className="rounded-2xl rounded-bl-md bg-[#0e3250] px-4 py-3">
                    <span
                      className="flex items-center gap-1"
                      aria-label="Kai is typing"
                    >
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/60 [animation-delay:0ms]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/60 [animation-delay:150ms]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/60 [animation-delay:300ms]" />
                    </span>
                  </div>
                </div>
              )}

              {error && (
                <p className="px-2 text-center text-[11px] text-red-400/80">
                  {error}
                </p>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input area */}
          <div className="flex-shrink-0 border-t border-white/10 px-3 pb-2.5 pt-3">
            <div className="flex items-end gap-2">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onInput={handleTextareaInput}
                placeholder="Ask Kai about Komodo, diving, liveaboards, sailing..."
                rows={1}
                aria-label="Message to Kai"
                disabled={isSending}
                className="kai-textarea flex-1 resize-none rounded-xl border border-white/20 px-3.5 py-2.5 text-[13px] placeholder-white/40 outline-none transition-colors focus:border-white/35 disabled:opacity-50"
                style={{
                  minHeight: "40px",
                  maxHeight: "120px",
                  backgroundColor: "#0a1f32",
                  color: "#ffffff",
                }}
              />
              <button
                onClick={() => void sendMessage()}
                disabled={!input.trim() || isSending}
                aria-label="Send message"
                className="bp-focus-ring flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#075e54] text-white transition-all hover:bg-[#0b6f63] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
              </button>
            </div>
            <p className="mt-2 text-center text-[10px] text-white/22">
              Kai is currently in early preview.
            </p>
          </div>
        </div>
      )}

      {/* ── Launcher row ─────────────────────────────────────── */}
      <div className="flex items-center gap-2.5">
        <a
          href={WA_HREF}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with Kai on WhatsApp"
          className="bp-focus-ring flex h-14 items-center gap-2.5 rounded-full border border-white/15 bg-[#075e54]/80 px-4 text-white shadow-[0_18px_60px_rgba(0,0,0,0.35)] transition-transform hover:scale-[1.02] hover:bg-[#0b6f63]"
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-[18px] w-[18px] flex-shrink-0"
            aria-hidden="true"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          <span className="text-[13px] font-semibold">WhatsApp</span>
        </a>

        <button
          onClick={() => setIsOpen((v) => !v)}
          aria-label={isOpen ? "Close Kai chat" : "Chat with Kai on bluepass.co"}
          aria-expanded={isOpen}
          className="bp-focus-ring flex h-14 min-w-[172px] items-center gap-3 rounded-full border border-white/15 bg-[#075e54] px-4 text-white shadow-[0_18px_60px_rgba(0,0,0,0.35)] transition-transform hover:scale-[1.02] hover:bg-[#0b6f63]"
        >
          <span
            aria-hidden="true"
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#d9fdd3] text-sm font-semibold text-[#075e54]"
          >
            {isOpen ? (
              <svg
                width="13"
                height="13"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M1 1l12 12M13 1L1 13" />
              </svg>
            ) : (
              "K"
            )}
          </span>
          <span className="block text-left">
            <span className="block text-[13px] font-semibold leading-none">
              {isOpen ? "Close" : "Ask Kai"}
            </span>
            <span className="mt-1 block text-[11px] text-white/65">
              {isOpen ? "Chat with Kai" : "Chat on bluepass.co"}
            </span>
          </span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="h-4 w-4"
          >
            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
