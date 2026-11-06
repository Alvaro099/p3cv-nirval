import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import char1 from "./assets/about1.webp";
import char2 from "./assets/about2.png";
import char3 from "./assets/about3.webp";
import bgVideo from "./assets/aboutmemenu.mp4";
import icon1 from "./assets/socialicon.png";
import icon2 from "./assets/socialicon.png";
import icon3 from "./assets/socialicon.png";

const CHARS = [char1, char2, char3];

const REVEAL_CONTENT = [
  {
    upper: ["nombre : Nirval", "edad:27", "TEKKEN 8 , 2XKO , MORTAL KOMBAT , STREET FIGHTER 6, AVATAR LEGENDS"],
    lower: "RELATOR DE FIGHTING GAMES / TO",
  },
  {
    upper: [
      "jpop , jrock , metal , hiperpop , pop, punk , postpunk",
    ],
    lower: "Bajista por diversion, subo covers a veces asi que veanlos.",
  },
  {
    upper: [
      "Fanatico de los FGs, mi saga favorita es Mortal Kombat pero le agarre amor a TEKKEN. Desde chico me criaron los RTS como Starcraft y Age of Empire. Mi primer consola fue un Sega genesis",
    ],
    lower: "Los invito a agregarme a steam (? : N1rval",
  },
];

const ROLES = [
  { text: "LIU", color: "#e8c100", bg: "rgba(232,193,0,0.12)", border: "rgba(232,193,0,0.5)" },
  { text: "SCORPION", color: "#4a8fff", bg: "rgba(74,143,255,0.12)", border: "rgba(74,143,255,0.5)" },
  { text: "SUB-ZERO", color: "#4a8fff", bg: "rgba(74,143,255,0.12)", border: "rgba(74,143,255,0.5)" },
];

const ITEMS = [
  {
    id: "twitch", label: "SOBRE MI", handle: "@yourname", href: "https://twitch.tv/yourname", icon: "🎮", barIcon: icon1, bars: 1, newBars: [0], counts: ["56"],
    links: ["twitch.tv/videos/2041837265"],
    stats: [
      { tag: "FOL", value: "1.2K", color: "#9147ff" },
      { tag: "VWR", value: "042", color: "#bf94ff" },
    ],
  },
  {
    id: "instagram", label: "MUSICA", handle: "@yourhandle", href: "https://instagram.com/yourhandle", icon: "📷", barIcon: icon2, bars: 5, newBars: [1, 2], counts: ["3.4M", "2.5M", "676K", "412K", "198K"],
    links: ["instagram.com/p/C4xQmRrNk2a", "instagram.com/p/C3wLpBsOj7f", "instagram.com/reel/C2vKoArMi6e", "instagram.com/p/C1uJnZqLh5d", "instagram.com/reel/C0tImYpKg4c"],
    stats: [
      { tag: "FOL", value: "3.4K", color: "#e1306c" },
      { tag: "PST", value: "128", color: "#f77737" },
    ],
  },
  {
    id: "tiktok", label: "JUEGOS DE ESTE AÑO", handle: "@yourhandle", href: "https://tiktok.com/@yourhandle", icon: "🎵", barIcon: icon3, bars: 7, newBars: [0, 3, 5, 6], counts: ["5.1M", "3.7M", "2.2M", "1.4M", "831K", "490K", "217K"],
    links: ["tiktok.com/@yourhandle/video/7318492016374859054", "tiktok.com/@yourhandle/video/7305837261940183342", "tiktok.com/@yourhandle/video/7291046385720348974", "tiktok.com/@yourhandle/video/7278392047163820334", "tiktok.com/@yourhandle/video/7264819203847165742", "tiktok.com/@yourhandle/video/7251047382916430126", "tiktok.com/@yourhandle/video/7237294018463851822"],
    stats: [
      { tag: "FOL", value: "8.9K", color: "#00f2ea" },
      { tag: "LKS", value: "52K", color: "#ff0050" },
    ],
  },
];

export default function AboutMe() {
  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowUp") setActive(i => Math.max(0, i - 1));
      if (e.key === "ArrowDown") setActive(i => Math.min(ITEMS.length - 1, i + 1));
      if (e.key === "Enter") setRevealed(true);
      if (e.key === "ArrowRight") setRevealed(true);
      if (e.key === "ArrowLeft") {
        if (revealed) setRevealed(false);
        else navigate(-1);
      }
      if (e.key === "Escape" || e.key === "Backspace") navigate(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, navigate, revealed]);

  return (
    <div id="menu-screen" className="aboutme-page">
      <video src={bgVideo} autoPlay loop muted playsInline />

      <button
        className={`back-arrow-btn${mounted ? " mounted" : ""}`}
        onClick={() => {
          if (revealed) setRevealed(false);
          else navigate(-1);
        }}
      >
        <span className="back-arrow-icon">◄</span>
        <span className="back-arrow-text">{revealed ? "CERRAR INFO" : "VOLVER AL MENÚ"}</span>
      </button>

      {revealed && <div key={`dim-${active}`} className="sc-dim" />}
      {revealed && (
        <div
          key={`panel-${active}`}
          className={`sc-reveal-panel${mounted ? " mounted" : ""}`}
          style={{ pointerEvents: "all", cursor: "pointer" }}
          onClick={() => setRevealed(false)}
        >
          <div className="sc-reveal-upper-bar">
            {REVEAL_CONTENT[active].upper.map((line) => (
              <div className="sc-reveal-upper-line" key={line}>{line}</div>
            ))}
          </div>
          <div className="sc-reveal-lower-bar">{REVEAL_CONTENT[active].lower}</div>
        </div>
      )}
      {revealed && (
        <div key={`nav-${active}`} className="sc-right-nav">
          <span className="sc-nav-arrow left">◄</span>
          <span className="sc-nav-btn">L1</span>
          <span className="sc-nav-dot" />
          <span className="sc-nav-btn">R1</span>
          <span className="sc-nav-arrow right">►</span>
        </div>
      )}

      <div className="sc-root" role="navigation">
        {ITEMS.map((item, i) => (
          <div
            key={item.id}
            className={`sc-bar-outer${active === i ? " active" : ""}${mounted ? " mounted" : ""}`}
            onClick={() => {
              setActive(i);
              setRevealed(true);
            }}
            onMouseEnter={() => {
              setActive(i);
            }}
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
                    <div className="sc-label">{item.label}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={`sc-footer${mounted ? " mounted" : ""}`}>
        <div className="sc-footer-row"><span className="sc-footer-key">↑↓</span><span>SELECCIONAR</span></div>
        <div className="sc-footer-row"><span className="sc-footer-key">↵</span><span>MOSTRAR</span></div>
        <div className="sc-footer-row"><span className="sc-footer-key">ESC</span><span>ATRAS</span></div>
      </div>
    </div>
  );
}
