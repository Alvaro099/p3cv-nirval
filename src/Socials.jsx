import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import char1 from "./assets/char1.png";
import char2 from "./assets/char2.png";
import char3 from "./assets/char3.png";
import bgVideo from "./assets/main3.mp4";
import newsign from "./assets/newsign.png";
import icon1 from "./assets/icon1.png";
import icon2 from "./assets/icon2.png";
import icon3 from "./assets/icon3.png";

const CHARS = [char1, char2, char3, char2];

const ROLES = [
  { text: "LEADER", color: "#e8c100", bg: "rgba(232,193,0,0.12)", border: "rgba(232,193,0,0.5)" },
  { text: "PARTY", color: "#4a8fff", bg: "rgba(74,143,255,0.12)", border: "rgba(74,143,255,0.5)" },
  { text: "PARTY", color: "#4a8fff", bg: "rgba(74,143,255,0.12)", border: "rgba(74,143,255,0.5)" },
  { text: "PARTY", color: "#4a8fff", bg: "rgba(74,143,255,0.12)", border: "rgba(74,143,255,0.5)" },
];

const ITEMS = [
  {
    id: "youtube", label: "YOUTUBE", handle: "@yourname", href: "https://www.youtube.com/@nirval099", icon: "🎮", barIcon: icon1, bars: 5, newBars: [0], counts: ["1,3k", "1,2k", "991", "1,6k", "781"],
    links: ["youtube.com/shorts/Nyl3s4i8-Gk", "youtube.com/shorts/kGwnbRPDAM8",
      "youtube.com/shorts/7hi7VNbJpSg", "youtube.com/shorts/vI7V8WHYoiM", "youtube.com/shorts/2t5RRBDnVVA"],
    stats: [
      { tag: "FOL", value: "1.2K", color: "#9147ff" },
      { tag: "VWR", value: "042", color: "#bf94ff" },
    ],
  },
  {
    id: "twitter", label: "TWITTER / X", handle: "@yourhandle", href: "https://x.com/N1rval099", icon: "🎮", barIcon: icon2, bars: 5, newBars: [0], counts: ["8.5k", "4.2k", "3k", "1.2k", "950"],
    links: [
      "x.com/N1rval099/status/2042419113239130287",
      "x.com/N1rval099/status/2042419113239130287",
      "x.com/N1rval099/status/1964586161604874591",
      "x.com/N1rval099/status/2031802524098052115",

    ],
    stats: [
      { tag: "FOL", value: "3.4K", color: "#e1306c" },
      { tag: "PST", value: "128", color: "#f77737" },
    ],
  },
  {
    id: "tiktok", label: "TIKTOK", handle: "@yourhandle", href: "https://www.tiktok.com/@nirval099", icon: "🎮", barIcon: icon3, bars: 4, newBars: [0, 3, 5, 6], counts: ["5.1k", "3.7k", "2.2k", "1.4k", "831k", "490k", "217k"],
    links: [
      "tiktok.com/@nirval099/video/7625644893003599111",
      "tiktok.com/@nirval099/video/7596220967668518200",
      "tiktok.com/@nirval099/video/7587408602336464184",
      "tiktok.com/@nirval099/video/7587408312946167052"

    ],
    stats: [
      { tag: "FOL", value: "8.9K", color: "#00f2ea" },
      { tag: "LKS", value: "52K", color: "#ff0050" },
    ],
  },
  {
    id: "gmail", label: "GMAIL", handle: "@yourhandle", href: "[EMAIL_ADDRESS]", icon: "📧", barIcon: icon3, bars: 0, newBars: [], counts: [], links: [],
    stats: [
      { tag: "FOL", value: "10K", color: "#00f2ea" },
      { tag: "LKS", value: "66K", color: "#ff0050" },
    ],
  },
];

export default function Socials() {
  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [activeInfoBar, setActiveInfoBar] = useState(0);
  const [focus, setFocus] = useState("left"); // "left" | "right"
  const [showMailModal, setShowMailModal] = useState(false);
  const [mailSubject, setMailSubject] = useState("");
  const [mailBody, setMailBody] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (showMailModal) {
        if (e.key === "Escape") setShowMailModal(false);
        return;
      }

      if (focus === "left") {
        if (e.key === "ArrowUp") setActive(i => Math.max(0, i - 1));
        if (e.key === "ArrowDown") setActive(i => Math.min(ITEMS.length - 1, i + 1));
        if (e.key === "ArrowRight") { setFocus("right"); setActiveInfoBar(0); }
        if (e.key === "Enter") {
          if (ITEMS[active].id === "gmail") setShowMailModal(true);
          else window.open(ITEMS[active].href, "_blank");
        }
      } else {
        const barCount = ITEMS[active].bars;
        if (e.key === "ArrowUp") setActiveInfoBar(i => Math.max(0, i - 1));
        if (e.key === "ArrowDown") setActiveInfoBar(i => Math.min(barCount - 1, i + 1));
        if (e.key === "ArrowLeft") setFocus("left");
        if (e.key === "Enter") {
          const link = ITEMS[active].links[activeInfoBar];
          if (link) window.open(link.startsWith('http') ? link : 'https://' + link, '_blank');
        }
      }
      if ((e.key === "ArrowLeft" && focus === "left") || e.key === "Escape" || e.key === "Backspace") navigate(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, navigate, focus]);

  return (
    <div id="menu-screen">
      <video src={bgVideo} autoPlay loop muted playsInline />

      <button className={`back-arrow-btn${mounted ? " mounted" : ""}`} onClick={() => navigate(-1)}>
        <span className="back-arrow-icon">◄</span>
        <span className="back-arrow-text">VOLVER AL MENÚ</span>
      </button>

      <div className="sc-root" role="navigation">
        {ITEMS.map((item, i) => (
          <div
            key={item.id}
            className={`sc-bar-outer${active === i ? " active" : ""}${mounted ? " mounted" : ""}`}
            onClick={() => {
              if (active === i) {
                if (item.id === "gmail") setShowMailModal(true);
                else window.open(item.href, "_blank");
              }
              else {
                setActive(i);
                setFocus("left");
              }
            }}
            onMouseEnter={() => setActive(i)}
          >
            <div className="sc-bar-red" />
            <div className="sc-bar">
              <img className="sc-char" src={CHARS[i]} alt="" />
              <div className="sc-bar-fill" />
              <div className="sc-bar-shade" />
              <div className="sc-bar-content">
                <div className="sc-role">{ROLES[i].text}</div>
                <div className="sc-main">
                  <div className="sc-main-top">
                    <div className="sc-icon">{item.icon}</div>
                    <div className="sc-label">{item.label}</div>
                  </div>
                </div>
                <div className="sc-stats">
                  {item.stats.map(s => (
                    <div className="sc-stat" key={s.tag}>
                      <div className="sc-stat-top">
                        <span className="sc-stat-tag" style={{ color: s.color, borderColor: s.color }}>{s.tag}</span>
                        <span className="sc-stat-num">{s.value}</span>
                      </div>
                      <div className="sc-stat-bars">
                        <div className="sc-stat-bar-color" style={{ background: s.color }} />
                        <div className="sc-stat-bar-black" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {mounted && (
        <div className="sc-right-nav" key={active}>
          <span className="sc-nav-arrow left">◄</span>
          <span className="sc-nav-btn">LB</span>
          <span className="sc-nav-label">{ITEMS[active].label}</span>
          <span className="sc-nav-btn">RB</span>
          <span className="sc-nav-arrow right">►</span>
        </div>
      )}

      {mounted && Array.from({ length: ITEMS[active].bars || 0 }).map((_, i) => (
        <div
          className={`sc-info-bar-wrap${activeInfoBar === i ? " selected" : ""}`}
          key={`bar-${active}-${i}`}
          style={{ top: `${155 + i * 52}px`, animationDelay: `${i * 50}ms` }}
          onClick={() => {
            setActiveInfoBar(i);
            const link = ITEMS[active].links && ITEMS[active].links[i];
            if (link) window.open(link.startsWith('http') ? link : 'https://' + link, '_blank');
          }}
          onMouseEnter={() => setActiveInfoBar(i)}
        >
          {ITEMS[active].newBars && ITEMS[active].newBars.includes(i) && (
            <img className="sc-info-bar-new" src={newsign} alt="" />
          )}
          <div className="sc-info-bar">
            <img className="sc-info-bar-icon" src={ITEMS[active].barIcon} alt="" />
            <span className="sc-info-bar-text">{(ITEMS[active].links && ITEMS[active].links[i]) ? ITEMS[active].links[i].slice(0, 10) : ""}...</span>
            <span className="sc-info-bar-box">VIEWS</span>
            <span className="sc-info-bar-count">{(ITEMS[active].counts && ITEMS[active].counts[i]) ? ITEMS[active].counts[i] : ""}</span>
          </div>
        </div>
      ))}

      {/* ── Modal de Correo ── */}
      {showMailModal && (
        <div className="sc-mail-modal-bg">
          <div className="sc-mail-modal">
            <div className="sc-mail-modal-title">REDACTAR</div>
            <div className="sc-mail-modal-sub">NUEVO MENSAJE PARA NIRVAL</div>

            <label className="sc-mail-modal-label">ASUNTO</label>
            <input
              className="sc-mail-modal-input"
              value={mailSubject}
              onChange={(e) => setMailSubject(e.target.value)}
              placeholder="Escribe el asunto aquí..."
              autoFocus
            />

            <label className="sc-mail-modal-label">MENSAJE</label>
            <textarea
              className="sc-mail-modal-textarea"
              value={mailBody}
              onChange={(e) => setMailBody(e.target.value)}
              placeholder="¡Hola Nirval! Quería decirte que..."
              rows={4}
            />

            <div className="sc-mail-modal-row">
              <button
                className="sc-mail-modal-btn"
                onClick={() => {
                  window.location.href = `mailto:soiialvaro@gmail.com?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;
                  setShowMailModal(false);
                  setMailSubject("");
                  setMailBody("");
                }}
              >
                ENVIAR EMAIL
              </button>
              <button
                className="sc-mail-modal-btn-alt"
                onClick={() => setShowMailModal(false)}
              >
                CANCELAR
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`sc-footer${mounted ? " mounted" : ""}`}>
        <div className="sc-footer-row"><span className="sc-footer-key">↑↓</span><span>SELECCION</span></div>
        <div className="sc-footer-row"><span className="sc-footer-key">↵</span><span>ABRIR</span></div>
        <div className="sc-footer-row"><span className="sc-footer-key">ESC</span><span>ATRAS</span></div>
      </div>
    </div>
  );
}
