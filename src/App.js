import React, { useState, useRef, useEffect } from "react";
import "./App.css";

const SAD_MESSAGES = [
  "nope. try again aug.",
  "your cursor is lying to you.",
  "that button has trust issues too, apparently.",
  "bold of you to think that'd work.",
  "the no button is also going through something rn.",
  "even the button doesn't want to say no.",
  "error 404: rejection not found.",
  "lol nice try tho.",
  "the universe said absolutely not.",
  "that's not how this works. that's not how any of this works.",
  "ok but have you considered... yes?",
  "your mouse needs to reconsider its life choices.",
  "the no button is on a walk. it'll be back never.",
  "ma'am this is a friendship acceptance form.",
];

const PARTICLES = ["✦", "◈", "◇", "✧", "⬡", "△", "○"];

function FloatingParticle({ style, char }) {
  return (
    <span className="particle" style={style}>
      {char}
    </span>
  );
}

function App() {
  const [accepted, setAccepted] = useState(false);
  const [noPos, setNoPos] = useState({ x: null, y: null });
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);
  const [particles, setParticles] = useState([]);
  const [yesClicked, setYesClicked] = useState(false);

  const escapeCount = useRef(0);
  const messageTimer = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const ps = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      char: PARTICLES[i % PARTICLES.length],
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animDuration: `${6 + Math.random() * 10}s`,
      animDelay: `${Math.random() * 5}s`,
      fontSize: `${10 + Math.random() * 14}px`,
      opacity: 0.08 + Math.random() * 0.12,
    }));
    setParticles(ps);
  }, []);

  // The No button now positions itself with `position: fixed`, so it lives in
  // viewport coordinates. We measure the viewport (not a 600px card) so the
  // button can never fly off-screen, and we keep it out of the bottom strip
  // where the sad message lives.
  const evadeNo = () => {
    const btnW = 140;
    const btnH = 52;
    const margin = 24;
    const bottomSafeZone = 120; // reserve space for the toast message

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const minX = margin;
    const maxX = vw - btnW - margin;
    const minY = margin;
    const maxY = vh - btnH - bottomSafeZone;

    const curX = noPos.x ?? vw * 0.55;
    const curY = noPos.y ?? vh * 0.5;

    let newX, newY, tries = 0;
    do {
      newX = minX + Math.random() * Math.max(1, maxX - minX);
      newY = minY + Math.random() * Math.max(1, maxY - minY);
      tries++;
    } while (tries < 25 && Math.hypot(newX - curX, newY - curY) < 160);

    setNoPos({ x: newX, y: newY });

    // Cycle messages in order using a ref so the value is never stale.
    const idx = escapeCount.current % SAD_MESSAGES.length;
    setMessage(SAD_MESSAGES[idx]);
    escapeCount.current += 1;

    setShowMessage(true);
    clearTimeout(messageTimer.current);
    messageTimer.current = setTimeout(() => setShowMessage(false), 2400);
  };

  const handleYes = () => {
    setYesClicked(true);
    setTimeout(() => setAccepted(true), 600);
  };

  const noStyle =
    noPos.x !== null
      ? {
          position: "fixed",
          left: noPos.x,
          top: noPos.y,
          margin: 0,
          zIndex: 50,
          transition:
            "left 0.18s cubic-bezier(.22,1.2,.5,1), top 0.18s cubic-bezier(.22,1.2,.5,1)",
        }
      : {};

  if (accepted) {
    return (
      <div className="app accepted-screen">
        {particles.map((p) => (
          <FloatingParticle
            key={p.id}
            char={p.char}
            style={{
              "--p-opacity": p.opacity,
              top: p.top,
              left: p.left,
              animationDuration: p.animDuration,
              animationDelay: p.animDelay,
              fontSize: p.fontSize,
            }}
          />
        ))}
        <div className="accepted-content">
          <div className="accepted-badge">✦</div>
          <h1 className="accepted-title">
            <span className="line1">friendship</span>
            <span className="line2">renewed.</span>
          </h1>
          <div className="accepted-divider" />
          <p className="accepted-sub">
            thanks for trusting me.
            <br />
            <span className="accepted-small">that took guts. i see you.</span>
          </p>
          <div className="accepted-stamp">note: this was built in 10 mins by claude pro, it took me another 1 hour to fix javascript, just so yk, ik didnt overdo or overkill anything</div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {particles.map((p) => (
        <FloatingParticle
          key={p.id}
          char={p.char}
          style={{
            "--p-opacity": p.opacity,
            top: p.top,
            left: p.left,
            animationDuration: p.animDuration,
            animationDelay: p.animDelay,
            fontSize: p.fontSize,
          }}
        />
      ))}

      <div className="noise" />

      <div className="main-card">
        <div className="tag-line">a formal inquiry</div>

        <h1
          className={`question ${glitchActive ? "glitch" : ""}`}
          data-text="friends again?"
        >
          friends<br />again?
        </h1>

        <p className="subtext">
          yeah i know. things got weird.
          <br />
          but here we are.
          <br />
          <span className="subtext-em">for real this time.</span>
        </p>

        <div className="buttons-area">
          <button
            className={`btn btn-yes ${yesClicked ? "btn-yes--clicked" : ""}`}
            onClick={handleYes}
          >
            <span className="btn-text">yes ✦</span>
          </button>

          <button
            className="btn btn-no"
            style={noStyle}
            onMouseEnter={evadeNo}
            onTouchStart={evadeNo}
            onClick={evadeNo}
          >
            <span className="btn-text">no 😢</span>
          </button>
        </div>
      </div>

      {/* Toast lives OUTSIDE .main-card so the bright Yes button can never */}
      {/* cover it — it sits in its own top-level stacking layer.           */}
      {showMessage && (
        <div className="sad-message" key={escapeCount.current}>
          {message}
        </div>
      )}

      <div className="corner-deco top-left">◈</div>
      <div className="corner-deco top-right">◈</div>
      <div className="corner-deco bottom-left">◈</div>
      <div className="corner-deco bottom-right">◈</div>
    </div>
  );
}

export default App;
