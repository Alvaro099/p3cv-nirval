import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const ITEMS = [
  { id: "i", badge: "I", title: "EVENTOS", subtitle: "EVENTOS EN LOS QUE HE PARTICIPADO", rank: 3 },
  { id: "ii", badge: "II", title: "JUEGOS", subtitle: "JUEGOS QUE CASTEO", rank: 4 },
  { id: "iii", badge: "III", title: "CANALES", subtitle: "CANALES DONDE APAREZCO", rank: 5 }
];

const EVENTS_ROWS = [
  { index: "01", title: "EVO 2025 - POOLS TEKKEN 8", status: "Complete", url: "https://www.youtube.com/watch?v=aJFtHLsQXb4" },
  { index: "02", title: "RED BULL KUMITE - 2025", status: "Complete", url: "https://www.twitch.tv/videos/2416125324" },
  { index: "03", title: "RAGNAROK 2025", status: "Complete", url: "https://www.youtube.com/watch?v=WbTpDXLQFAY" },
  { index: "04", title: "DARK WINTER 2026", status: "Complete", url: "https://www.youtube.com/watch?v=ELVuXdxaaWA" },
  { index: "05", title: "WW MEXICO 2026 FECHA 2 - TOP 16", status: "Complete", url: "https://www.youtube.com/watch?v=EJhEZDhH_-s" },
  { index: "06", title: "TORNEOS SEMANALES EN VALQUIRIA", status: "In Progress" },
  { index: "07", title: "PARTIDOS DE COPA DE IACC ESPORTS", status: "In Progress" },
  { index: "08", title: "RAGNAROK 2024", status: "Complete" },
  { index: "09", title: "RAGNAROK 2026", status: "Complete" },
];

const GAMES_ROWS = [
  { index: "01", title: "TEKKEN 8" },
  { index: "02", title: "STREET FIGHTER 6" },
  { index: "03", title: "MORTAL KOMBAT 1" },
  { index: "04", title: "2XKO" },
  { index: "05", title: "FIFA" },
  { index: "06", title: "Avatar Legends: The Fighting Game" },
  { index: "07", title: "Marvel Tōkon: Fighting Souls" },
  { index: "08", title: "VALORANT" },
];

const TEAMS_ROWS = [
  { index: "01", title: "Valquiria Esports", url: "https://www.youtube.com/@ValquiriaeSportsArgentina" },
  { index: "02", title: "Instituto Atletico Central Cordoba", url: "https://www.youtube.com/@InstitutoACC/streams" },
  { index: "03", title: "Mexican Mash Series", url: "https://www.youtube.com/@mexicanmashseries" },
  { index: "04", title: "Nuvy Community", url: "https://www.twitch.tv/nuvy_community" },
];

export default function ResumePage({ src }) {
  const navigate = useNavigate();
  const [active, setActive] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [selectedLink, setSelectedLink] = useState(null);
  const detailPanelRef = useRef(null);
  const linkPanelRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    setSelectedLink(null);
  }, [active]);

  useEffect(() => {
    if (!selectedLink) return;

    const handlePointerDown = (event) => {
      const clickedInsidePanel = detailPanelRef.current?.contains(event.target);
      const clickedInsideLink = linkPanelRef.current?.contains(event.target);

      if (!clickedInsidePanel && !clickedInsideLink) {
        setSelectedLink(null);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [selectedLink]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowUp") setActive((i) => Math.max(0, i - 1));
      if (e.key === "ArrowDown") setActive((i) => Math.min(ITEMS.length - 1, i + 1));
      if (e.key === "ArrowLeft") navigate(-1);
      if (e.key === "Escape" || e.key === "Backspace") navigate(-1);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);

  return (
    <div id="menu-screen">
      <video src={src} autoPlay loop muted playsInline />
      <div className="resume-entry-mask" aria-hidden="true">
        <video className="resume-entry-video" src={src} autoPlay loop muted playsInline />
      </div>

      <button className={`back-arrow-btn${mounted ? " mounted" : ""}`} onClick={() => navigate(-1)}>
        <span className="back-arrow-icon">◄</span>
        <span className="back-arrow-text">VOLVER AL MENÚ</span>
      </button>

      <div className="resume-overlay">
        <div className="resume-stack">
          <div className={`resume-list-tag${mounted ? " mounted" : ""}`}>LISTA</div>
          {ITEMS.map((item, index) => (
            <div
              key={item.id}
              className={`resume-card-wrap${active === index ? " active" : ""}${mounted ? " mounted" : ""}`}
              style={{ transitionDelay: `${index * 55}ms` }}
              onMouseEnter={() => {
                setActive(index);
              }}
              onClick={() => {
                setActive(index);
              }}
            >
              <div className="resume-card">
                <div className="resume-badge">
                  <div className="resume-badge-text">{item.badge}</div>
                </div>
                <div className="resume-card-inner">
                  <div className="resume-title">{item.title}</div>
                  <div className="resume-rank">
                    <div className="resume-rank-label">RANK</div>
                    <div className="resume-rank-number">{item.rank}</div>
                  </div>
                </div>
                <div className="resume-subtitle-bar">
                  <div className="resume-subtitle">{item.subtitle}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {active === 0 && (
          <div className="resume-detail-panel" ref={detailPanelRef}>
            <div className="resume-detail-top">
              <div className="resume-detail-top-index">01</div>
              <div className="resume-detail-top-title">EVENTOS</div>
              <div className="resume-detail-top-progress">5/8</div>
            </div>

            <div className="resume-detail-list">
              {EVENTS_ROWS.map((row) => (
                <button
                  type="button"
                  className="resume-detail-row"
                  key={row.index}
                  onClick={() => {
                    if (!row.url) {
                      setSelectedLink(null);
                      return;
                    }
                    setSelectedLink({ title: row.title, url: row.url, type: "VIDEO" });
                  }}
                >
                  <div className="resume-detail-row-index">{row.index}</div>
                  <div className="resume-detail-row-title">{row.title}</div>
                  <div className="resume-detail-status">{row.status}</div>
                </button>
              ))}
            </div>

            {selectedLink && (
              <div className="resume-link-panel" ref={linkPanelRef}>
                <div className="resume-link-badge">{selectedLink.type}</div>
                <div className="resume-link-title">{selectedLink.title}</div>
                <a className="resume-link-button" href={selectedLink.url} target="_blank" rel="noreferrer">
                  ABRIR ENLACE
                </a>
              </div>
            )}
          </div>
        )}

        {active === 1 && (
          <div className="resume-detail-panel" ref={detailPanelRef}>
            <div className="resume-detail-top">
              <div className="resume-detail-top-index">02</div>
              <div className="resume-detail-top-title">JUEGOS</div>
              <div className="resume-detail-top-progress">4/4</div>
            </div>

            <div className="resume-detail-list">
              {GAMES_ROWS.map((row) => (
                <div className="resume-detail-row" key={row.index}>
                  <div className="resume-detail-row-index">{row.index}</div>
                  <div className="resume-detail-row-title">{row.title}</div>
                  <div className="resume-detail-status">{row.status}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {active === 2 && (
          <div className="resume-detail-panel" ref={detailPanelRef}>
            <div className="resume-detail-top">
              <div className="resume-detail-top-index">03</div>
              <div className="resume-detail-top-title">CANALES</div>
              <div className="resume-detail-top-progress">3/3</div>
            </div>

            <div className="resume-detail-list">
              {TEAMS_ROWS.map((row) => (
                <button
                  type="button"
                  className="resume-detail-row"
                  key={row.index}
                  onClick={() => {
                    if (!row.url) {
                      setSelectedLink(null);
                      return;
                    }
                    setSelectedLink({ title: row.title, url: row.url, type: "CANAL" });
                  }}
                >
                  <div className="resume-detail-row-index">{row.index}</div>
                  <div className="resume-detail-row-title">{row.title}</div>
                  <div className="resume-detail-status">{row.status}</div>
                </button>
              ))}
            </div>

            {selectedLink && (
              <div className="resume-link-panel" ref={linkPanelRef}>
                <div className="resume-link-badge">{selectedLink.type}</div>
                <div className="resume-link-title">{selectedLink.title}</div>
                <a className="resume-link-button" href={selectedLink.url} target="_blank" rel="noreferrer">
                  ABRIR CANAL
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
