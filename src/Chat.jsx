import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

const MESSAGES_COLLECTION = "chat_messages";
const MAX_MESSAGES = 80;
const NAME_KEY = "p3_chat_username";

// ─── Utilidades ──────────────────────────────────────────────
const adjectives = ["JIJO", "EMO", "NOSE", "ALEATORIO", "FURIOSO", "MÍSTICO", "OSCURO", "LUNAR"];
const nouns = ["ELPERSONA", "IRIS", "MAKOTO", "YAOI", "YAKUZA", "MALO8", "VERDE6"];
function randomName() {
  return `${adjectives[Math.floor(Math.random() * adjectives.length)]}_${nouns[Math.floor(Math.random() * nouns.length)]}`;
}

function formatTime(ts) {
  if (!ts) return "";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
}

// ─── Colores de usuario ──────────────────────────────────────
const USER_COLORS = ["#8df6ff", "#ff7aaa", "#ffd96a", "#9effa3", "#c4b5fd", "#fdba74"];
const colorCache = {};
function colorForUser(name) {
  if (!colorCache[name]) {
    let h = 0;
    for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % USER_COLORS.length;
    colorCache[name] = USER_COLORS[h];
  }
  return colorCache[name];
}

export default function Chat() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [username, setUsername] = useState(() => localStorage.getItem(NAME_KEY) || "");
  const [showNameModal, setShowNameModal] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [firebaseError, setFirebaseError] = useState(false);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const nameInputRef = useRef(null);

  // ── Montar ──────────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!username) {
      setShowNameModal(true);
    }
  }, []);

  // ── ESC para volver ─────────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      if (showNameModal) return;
      if (e.key === "Escape" && document.activeElement !== inputRef.current) {
        navigate(-1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate, showNameModal]);

  // ── Listener Firestore ───────────────────────────────────────
  useEffect(() => {
    let unsubscribe = () => { };
    try {
      const q = query(
        collection(db, MESSAGES_COLLECTION),
        orderBy("createdAt", "asc"),
        limit(MAX_MESSAGES)
      );
      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          setFirebaseError(false);
          setMessages(
            snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
          );
        },
        (err) => {
          console.error("Firestore error:", err);
          setFirebaseError(true);
        }
      );
    } catch (err) {
      console.error("Firebase init error:", err);
      setFirebaseError(true);
    }
    return () => unsubscribe();
  }, []);

  // ── Auto-scroll ──────────────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Enviar mensaje ───────────────────────────────────────────
  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || sending || !username) return;
    setSending(true);
    setInput("");
    try {
      await addDoc(collection(db, MESSAGES_COLLECTION), {
        text,
        username,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("Error sending message:", err);
      setFirebaseError(true);
    }
    setSending(false);
    inputRef.current?.focus();
  }, [input, sending, username]);

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  // ── Guardar nombre ───────────────────────────────────────────
  const saveName = () => {
    const name = nameInput.trim().toUpperCase().replace(/\s+/g, "_") || randomName();
    localStorage.setItem(NAME_KEY, name);
    setUsername(name);
    setShowNameModal(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleNameKey = (e) => {
    if (e.key === "Enter") saveName();
  };

  // ── Render ───────────────────────────────────────────────────
  return (
    <div id="menu-screen">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Bebas+Neue&family=Inter:wght@400;500;600&display=swap');

        /* ── Entry animation ── */
        .chat-entry-mask {
          position: absolute;
          inset: 0;
          z-index: 9;
          overflow: hidden;
          background: #0047FF;
          clip-path: polygon(0 0, 0 0, 0 100%, 0 100%);
          animation: chat-entry-reveal 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          pointer-events: none;
        }
        @keyframes chat-entry-reveal {
          from { clip-path: polygon(0 0, 0 0, 0 100%, 0 100%); }
          to   { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }
        }

        /* ── Layout ── */
        .chat-layout-grid {
          position: absolute;
          inset: 0;
          z-index: 10;
          display: grid;
          grid-template-columns: 1fr 1fr minmax(350px, 450px);
          padding: 5vh 5vw 4vh;
          gap: 24px;
          pointer-events: none;
        }

        .chat-column-placeholder {
          pointer-events: all;
          background: linear-gradient(180deg, rgba(15, 28, 105, 0.4) 0%, rgba(8, 16, 68, 0.6) 100%);
          clip-path: polygon(0 0, 100% 0, calc(100% - 22px) 100%, 0 100%);
          box-shadow: inset 0 0 0 1px rgba(133, 244, 255, 0.16);
          display: flex;
          flex-direction: column;
          padding: 24px;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.4s ease 0.3s, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1) 0.3s;
        }
        .chat-column-placeholder.mounted {
          opacity: 1; transform: translateY(0);
        }
        
        .chat-column-title {
          font-family: 'Anton', sans-serif;
          font-size: 28px;
          color: #8df6ff;
          margin-bottom: 16px;
        }

        .chat-column-content-hint {
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          color: rgba(133, 244, 255, 0.5);
          line-height: 1.5;
        }

        .chat-overlay {
          display: grid;
          grid-template-rows: auto 1fr auto;
          gap: 0;
          height: 100%;
          pointer-events: none;
        }

        /* ── Header ── */
        .chat-header {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 14px 28px;
          background: linear-gradient(90deg, #8ef5ff 0%, #d3fdff 100%);
          clip-path: polygon(0 0, 100% 0, calc(100% - 22px) 100%, 0 100%);
          box-shadow: 14px 0 0 rgba(255, 94, 136, 0.88);
          pointer-events: all;
          opacity: 0;
          transform: translateY(-20px);
          transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .chat-header.mounted { opacity: 1; transform: translateY(0); }
        .chat-header-index {
          font-family: 'Anton', sans-serif;
          font-size: 38px;
          line-height: 1;
          color: #08153f;
        }
        .chat-header-title {
          font-family: 'Anton', sans-serif;
          font-size: 34px;
          line-height: 0.92;
          letter-spacing: 1px;
          color: #08153f;
          flex: 1;
        }
        .chat-header-user {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 22px;
          letter-spacing: 2px;
          color: #06133b;
          background: rgba(5, 20, 80, 0.15);
          padding: 4px 14px;
          clip-path: polygon(0 0, 100% 0, calc(100% - 8px) 100%, 0 100%);
          cursor: pointer;
          transition: background 0.18s;
          display: flex;
          align-items: center;
          gap: 7px;
        }
        .chat-header-user:hover { background: rgba(5, 20, 80, 0.28); }

        /* ── Messages area ── */
        .chat-messages-wrap {
          overflow: hidden;
          margin-top: 14px;
          pointer-events: all;
          opacity: 0;
          transition: opacity 0.4s ease 0.15s;
          position: relative;
        }
        .chat-messages-wrap.mounted { opacity: 1; }

        .chat-messages-panel {
          height: 100%;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 20px 22px;
          background: linear-gradient(180deg, rgba(15, 28, 105, 0.93) 0%, rgba(8, 16, 68, 0.96) 100%);
          clip-path: polygon(0 0, 100% 0, calc(100% - 22px) 100%, 0 100%);
          box-shadow:
            inset 0 0 0 1px rgba(133, 244, 255, 0.16),
            16px 16px 0 rgba(0, 6, 30, 0.55);
          scrollbar-width: thin;
          scrollbar-color: rgba(140, 239, 255, 0.3) transparent;
        }

        /* ── Error banner ── */
        .chat-error-banner {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 20px;
          letter-spacing: 2px;
          color: #ff7aaa;
          background: rgba(60, 0, 20, 0.85);
          padding: 12px 18px;
          clip-path: polygon(0 0, 100% 0, calc(100% - 12px) 100%, 0 100%);
          border-left: 3px solid #ff2a6d;
          margin-bottom: 8px;
        }

        /* ── Messages ── */
        .chat-msg {
          display: flex;
          flex-direction: column;
          gap: 2px;
          animation: chat-msg-in 0.28s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @keyframes chat-msg-in {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .chat-msg.mine { align-self: flex-end; }

        .chat-msg-meta {
          display: flex;
          align-items: baseline;
          gap: 8px;
          padding: 0 6px;
        }
        .chat-msg.mine .chat-msg-meta { flex-direction: row-reverse; }

        .chat-msg-name {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 17px;
          letter-spacing: 2px;
        }
        .chat-msg-time {
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          color: rgba(133, 244, 255, 0.45);
        }

        .chat-msg-bubble {
          max-width: min(68vw, 560px);
          padding: 10px 16px;
          font-family: 'Inter', sans-serif;
          font-size: 15px;
          line-height: 1.55;
          word-break: break-word;
        }
        .chat-msg:not(.mine) .chat-msg-bubble {
          background: rgba(8, 18, 72, 0.97);
          color: #edfaff;
          clip-path: polygon(0 0, 100% 0, calc(100% - 12px) 100%, 0 100%);
          box-shadow: inset 0 0 0 1px rgba(140, 239, 255, 0.12);
        }
        .chat-msg.mine .chat-msg-bubble {
          background: #ffffff;
          color: #08153f;
          clip-path: polygon(12px 0, 100% 0, 100% 100%, 0 100%);
          box-shadow: -8px 6px 0 rgba(214, 50, 50, 0.75);
        }

        /* ── Online badge ── */
        .chat-online-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #3dffa0;
          box-shadow: 0 0 6px #3dffa0;
          display: inline-block;
          flex-shrink: 0;
        }

        /* ── Date divider ── */
        .chat-date-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 6px 0;
        }
        .chat-date-divider::before, .chat-date-divider::after {
          content: "";
          flex: 1;
          height: 1px;
          background: rgba(133, 244, 255, 0.14);
        }
        .chat-date-divider-label {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 15px;
          letter-spacing: 2px;
          color: rgba(133, 244, 255, 0.35);
        }

        /* ── Input bar ── */
        .chat-input-row {
          display: flex;
          gap: 10px;
          margin-top: 14px;
          pointer-events: all;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.4s ease 0.25s, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1) 0.25s;
        }
        .chat-input-row.mounted { opacity: 1; transform: translateY(0); }

        .chat-input {
          flex: 1;
          background: rgba(8, 18, 72, 0.97);
          border: 1px solid rgba(140, 239, 255, 0.22);
          color: #edfaff;
          font-family: 'Inter', sans-serif;
          font-size: 15px;
          padding: 13px 20px;
          outline: none;
          clip-path: polygon(0 0, 100% 0, calc(100% - 14px) 100%, 0 100%);
          transition: border-color 0.18s ease, background 0.18s ease;
        }
        .chat-input:focus {
          border-color: rgba(140, 239, 255, 0.6);
          background: rgba(12, 26, 94, 1);
        }
        .chat-input::placeholder { color: rgba(133, 244, 255, 0.35); }
        .chat-input:disabled { opacity: 0.5; }

        .chat-send {
          font-family: 'Anton', sans-serif;
          font-size: 22px;
          letter-spacing: 1px;
          color: #041238;
          background: #8df6ff;
          border: none;
          padding: 0 28px;
          clip-path: polygon(0 0, 100% 0, calc(100% - 12px) 100%, 0 100%);
          cursor: pointer;
          transition: background 0.18s, transform 0.18s, box-shadow 0.18s, opacity 0.18s;
        }
        .chat-send:hover:not(:disabled) {
          background: #ffffff;
          transform: translateX(4px);
          box-shadow: 8px 6px 0 rgba(214, 50, 50, 0.75);
        }
        .chat-send:disabled { opacity: 0.45; cursor: not-allowed; }

        /* ── Back hint ── */
        .chat-back-hint {
          position: absolute;
          bottom: 24px;
          right: 28px;
          z-index: 20;
          font-family: 'Anton', sans-serif;
          font-size: 13px;
          letter-spacing: 2px;
          color: rgba(255,255,255,0.28);
          display: flex;
          align-items: center;
          gap: 8px;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.5s ease 0.6s;
        }
        .chat-back-hint.mounted { opacity: 1; }
        .chat-back-hint-key {
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 3px;
          padding: 1px 6px;
          font-size: 11px;
        }

        /* ── Modal de nombre ── */
        .chat-modal-bg {
          position: fixed;
          inset: 0;
          z-index: 200;
          background: rgba(0, 6, 30, 0.88);
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(4px);
        }
        .chat-modal {
          background: linear-gradient(180deg, rgba(15, 28, 105, 0.98) 0%, rgba(8, 16, 68, 1) 100%);
          clip-path: polygon(0 0, 100% 0, calc(100% - 28px) 100%, 0 100%);
          box-shadow:
            inset 0 0 0 1px rgba(133, 244, 255, 0.18),
            20px 20px 0 rgba(0, 6, 30, 0.7);
          padding: 40px 44px 44px;
          width: min(520px, 90vw);
          animation: chat-msg-in 0.38s cubic-bezier(0.22, 1, 0.36, 1) both;
          position: relative;
        }
        .chat-modal::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(133, 244, 255, 0.07) 0 14%, transparent 14%);
          pointer-events: none;
        }
        .chat-modal-title {
          font-family: 'Anton', sans-serif;
          font-size: 44px;
          line-height: 0.92;
          letter-spacing: 1px;
          color: #edfaff;
          margin-bottom: 6px;
        }
        .chat-modal-sub {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 20px;
          letter-spacing: 2px;
          color: #94f4ff;
          margin-bottom: 28px;
        }
        .chat-modal-label {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 20px;
          letter-spacing: 2px;
          color: #94f4ff;
          margin-bottom: 8px;
          display: block;
        }
        .chat-modal-input {
          width: 100%;
          background: rgba(8, 18, 72, 0.97);
          border: 1px solid rgba(140, 239, 255, 0.3);
          color: #edfaff;
          font-family: 'Inter', sans-serif;
          font-size: 16px;
          padding: 12px 18px;
          outline: none;
          clip-path: polygon(0 0, 100% 0, calc(100% - 12px) 100%, 0 100%);
          margin-bottom: 22px;
          box-sizing: border-box;
          transition: border-color 0.18s;
        }
        .chat-modal-input:focus { border-color: rgba(140, 239, 255, 0.7); }
        .chat-modal-input::placeholder { color: rgba(133, 244, 255, 0.35); }
        .chat-modal-row {
          display: flex;
          gap: 12px;
        }
        .chat-modal-btn {
          font-family: 'Anton', sans-serif;
          font-size: 22px;
          letter-spacing: 1px;
          color: #041238;
          background: #8df6ff;
          border: none;
          padding: 12px 32px;
          clip-path: polygon(0 0, 100% 0, calc(100% - 12px) 100%, 0 100%);
          cursor: pointer;
          transition: background 0.18s, transform 0.18s, box-shadow 0.18s;
        }
        .chat-modal-btn:hover {
          background: #ffffff;
          transform: translateX(4px);
          box-shadow: 8px 6px 0 rgba(214, 50, 50, 0.75);
        }
        .chat-modal-btn-alt {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 20px;
          letter-spacing: 2px;
          color: #94f4ff;
          background: transparent;
          border: 1px solid rgba(140, 239, 255, 0.25);
          padding: 10px 24px;
          clip-path: polygon(0 0, 100% 0, calc(100% - 10px) 100%, 0 100%);
          cursor: pointer;
          transition: background 0.18s, color 0.18s;
        }
        .chat-modal-btn-alt:hover {
          background: rgba(133, 244, 255, 0.12);
          color: #edfaff;
        }
      `}</style>

      {/* Background */}
      <video src="" autoPlay loop muted playsInline style={{ filter: "brightness(0.3) saturate(0.6)" }} />

      {/* Entry sweep */}
      <div className="chat-entry-mask" aria-hidden="true" />

      {/* ── Modal de nombre ─────────────────────────────── */}
      {showNameModal && (
        <div className="chat-modal-bg">
          <div className="chat-modal">
            <div className="chat-modal-title">BIENVENIDO</div>
            <div className="chat-modal-sub">AL CHAT DE NIRVAL</div>
            <label className="chat-modal-label" htmlFor="chat-name-input">
              ¿CON QUÉ NOMBRE VAS A CHATEAR?
            </label>
            <input
              id="chat-name-input"
              ref={nameInputRef}
              className="chat-modal-input"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={handleNameKey}
              placeholder="TU NOMBRE (ej: SHADOW_WOLF)"
              maxLength={24}
              autoFocus
              autoComplete="off"
            />
            <div className="chat-modal-row">
              <button className="chat-modal-btn" onClick={saveName}>
                ENTRAR
              </button>
              <button
                className="chat-modal-btn-alt"
                onClick={() => {
                  setNameInput(randomName());
                }}
              >
                ALEATORIO
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Main chat layout grid ─────────────────────────────── */}
      <div className="chat-layout-grid">
        
        {/* Columna 1: Iframes o Widgets/Plugins */}
        <div className={`chat-column-placeholder${mounted ? " mounted" : ""}`}>
          <div className="chat-column-title">PLUGINS & IFRAMES</div>
          <div className="chat-column-content-hint">
            [ Espacio reservado para insertar iframes, widgets u otros plugins en el futuro ]
          </div>
        </div>

        {/* Columna 2: Textos o Imágenes */}
        <div className={`chat-column-placeholder${mounted ? " mounted" : ""}`} style={{ transitionDelay: "0.4s" }}>
          <div className="chat-column-title">MULTIMEDIA</div>
          <div className="chat-column-content-hint">
            [ Espacio reservado para insertar textos, imágenes o descripciones ]
          </div>
        </div>

        {/* Columna 3: El Chat */}
        <div className="chat-overlay">
        {/* Header */}
        <div className={`chat-header${mounted ? " mounted" : ""}`}>
          <div className="chat-header-index">05</div>
          <div className="chat-header-title">CHAT EN VIVO</div>
          <div
            className="chat-header-user"
            onClick={() => {
              setNameInput(username);
              setShowNameModal(true);
            }}
            title="Cambiar nombre"
          >
            <span className="chat-online-dot" />
            {username || "???"}
          </div>
        </div>

        {/* Messages */}
        <div className={`chat-messages-wrap${mounted ? " mounted" : ""}`}>
          <div className="chat-messages-panel">
            {firebaseError && (
              <div className="chat-error-banner">
                ⚠ ERROR AL CONECTAR — VERIFICÁ LA CONFIGURACIÓN DE FIREBASE
              </div>
            )}

            {messages.length === 0 && !firebaseError && (
              <div style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "20px",
                letterSpacing: "2px",
                color: "rgba(133,244,255,0.35)",
                textAlign: "center",
                marginTop: "auto",
                padding: "40px 0",
              }}>
                SÉ EL PRIMERO EN ESCRIBIR
              </div>
            )}

            {messages.map((msg, i) => {
              const isMine = msg.username === username;
              const color = colorForUser(msg.username || "???");

              // Date divider
              const showDivider =
                i === 0 ||
                (msg.createdAt &&
                  messages[i - 1]?.createdAt &&
                  msg.createdAt.toDate?.().toDateString() !==
                  messages[i - 1].createdAt.toDate?.().toDateString());

              return (
                <div key={msg.id}>
                  {showDivider && msg.createdAt && (
                    <div className="chat-date-divider">
                      <div className="chat-date-divider-label">
                        {msg.createdAt.toDate?.().toLocaleDateString("es-AR", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                  )}
                  <div className={`chat-msg${isMine ? " mine" : ""}`}>
                    <div className="chat-msg-meta">
                      <div className="chat-msg-name" style={{ color }}>
                        {msg.username || "???"}
                      </div>
                      <div className="chat-msg-time">{formatTime(msg.createdAt)}</div>
                    </div>
                    <div className="chat-msg-bubble">{msg.text}</div>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Input */}
        <form
          className={`chat-input-row${mounted ? " mounted" : ""}`}
          onSubmit={handleSubmit}
        >
          <input
            ref={inputRef}
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={username ? "ESCRIBÍ TU MENSAJE..." : "PRIMERO ELEGÍ UN NOMBRE..."}
            disabled={sending || !username}
            autoComplete="off"
            maxLength={300}
          />
          <button
            type="submit"
            className="chat-send"
            disabled={sending || !input.trim() || !username}
          >
            ENVIAR
          </button>
        </form>
        </div>
      </div>

      {/* Back hint */}
      <div className={`chat-back-hint${mounted ? " mounted" : ""}`}>
        <span className="chat-back-hint-key">ESC</span>
        <span>VOLVER</span>
      </div>
    </div>
  );
}
