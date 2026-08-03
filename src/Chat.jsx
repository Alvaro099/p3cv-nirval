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
import makotowalk from "./assets/makotowalk.gif";

const MESSAGES_COLLECTION = "chat_messages";
const MAX_MESSAGES = 80;
const NAME_KEY = "p3_chat_username";
const Makoto = "./assets/makotowalk.gif";

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
    if (!db) {
      setFirebaseError(true);
      return;
    }
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
    if (!text || sending || !username || !db) return;
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
      {/* Background */}
      <video src="" autoPlay loop muted playsInline style={{ filter: "brightness(0.3) saturate(0.6)" }} />

      {/* Entry sweep */}
      <div className="chat-entry-mask" aria-hidden="true" />

      {/* Back Arrow Button */}
      <button className={`back-arrow-btn${mounted ? " mounted" : ""}`} onClick={() => navigate(-1)}>
        <span className="back-arrow-icon">◄</span>
        <span className="back-arrow-text">VOLVER AL MENÚ</span>
      </button>

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
          <div className="chat-column-title">SECCION DE NOTICIAS</div>
          <div className="chat-column-content-hint">
            [ Donde leo lo ultimo sobre cada juego que me gusta! ]
          </div>
          <div className="chat-column-title">NOTICIAS 2XKO</div>
          <a href="https://x.com/2XKOIntel" target="_blank" rel="noopener noreferrer">
            <button className="news-button">
              Click!
            </button>
          </a>
          <div className="chat-column-title">NOTICIAS TEKKEN 8</div>
          <a href="https://x.com/TEKKEN" target="_blank" rel="noopener noreferrer">
            <button className="news-button">
              Click!
            </button>
          </a>
          <div className="chat-column-title">NOTICIAS STREET FIGHTER</div>
          <a href="https://x.com/StreetFighter" target="_blank" rel="noopener noreferrer">
            <button className="news-button">
              Click!
            </button>
          </a>
          <div className="chat-column-title">NOTICIAS FGS</div>
          <a href="https://x.com/FGC_Daily" target="_blank" rel="noopener noreferrer">
            <button className="news-button">
              Click!
            </button>
          </a>
        </div>

        {/* Columna 2: Textos o Imágenes */}
        <div className={`chat-column-placeholder${mounted ? " mounted" : ""}`} style={{ transitionDelay: "0.4s" }}>
          <div className="chat-column-title">COSAS QUE ME GUSTAN</div>
          <div className="chat-column-content-hint">
            [ una makoto caminando ]
            <div className="makoto-walk-container">
              <img className="makoto-walk-img" src={makotowalk} alt="Makoto walking" />
            </div>
          </div>
          <div className="chat-column-title">MIS PROYECTOS DE GIT HUB</div>
          <a href="https://combomaker-ecru.vercel.app/" target="_blank" rel="noopener noreferrer">
            <button className="proyect-button">
              Proyecto - Combo Maker
            </button>
          </a>
          <a href="https://versushighligts-main.vercel.app/" target="_blank" rel="noopener noreferrer">
            <button className="proyect-button">
              Proyecto - Versus Highligts
            </button>
          </a>
          <a href="https://pf-ab.vercel.app/" target="_blank" rel="noopener noreferrer">
            <button className="proyect-button">
              Mi curriculum serio
            </button>
          </a>

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
      </div >

      {/* Back hint */}
      < div className={`chat-back-hint${mounted ? " mounted" : ""}`
      }>
        <span className="chat-back-hint-key">ESC</span>
        <span>VOLVER</span>
      </div >
    </div >
  );
}
