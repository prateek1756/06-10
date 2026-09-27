import React, { useState, useRef, useCallback, useEffect } from 'react';
import { BIRTHDAY_CONFIG } from '../data/birthdayConfig';
import { ParticleBG } from '../components/ParticleBG';
import { soundManager } from '../audio/soundManager';
import confetti from 'canvas-confetti';
import { ArrowRight, Wind } from 'lucide-react';

interface Props {
  onDone: () => void;
}

type CakeState = 'idle' | 'holding' | 'blown' | 'ready_to_cut' | 'cutting' | 'cut';

interface SmokePuff {
  id: number;
  size: number;
  dx: number;
  dur: number;
  delay: number;
}

export const CakeScene: React.FC<Props> = ({ onDone }) => {
  const [state, setState] = useState<CakeState>('idle');
  const [progress, setProgress] = useState(0); // 0–100
  const [smokes, setSmokes] = useState<SmokePuff[]>([]);
  const holdRef = useRef<number | null>(null);
  const progressRef = useRef(0);

  // ── Blow progress loop ────────────────────────────────────
  const startHold = useCallback(() => {
    if (state !== 'idle') return;
    setState('holding');
    soundManager.playHover();
    holdRef.current = window.setInterval(() => {
      progressRef.current = Math.min(progressRef.current + 5, 100);
      setProgress(progressRef.current);
      if (progressRef.current >= 100) extinguish();
    }, 45);
  }, [state]);

  const stopHold = useCallback(() => {
    if (holdRef.current) {
      clearInterval(holdRef.current);
      holdRef.current = null;
    }
    if (state === 'holding') {
      setState('idle');
      progressRef.current = 0;
      setProgress(0);
    }
  }, [state]);

  const extinguish = useCallback(() => {
    if (holdRef.current) clearInterval(holdRef.current);
    setState('blown');
    soundManager.playCandleBlow();

    // Smoke puffs
    setSmokes(
      Array.from({ length: 9 }, (_, i) => ({
        id: i,
        size: 10 + Math.random() * 14,
        dx: (Math.random() - 0.5) * 50,
        dur: 1.6 + Math.random() * 1.2,
        delay: i * 0.07,
      }))
    );

    // Big celebration fanfare + confetti burst
    setTimeout(() => {
      soundManager.playCelebrationBurst();
      confetti({
        particleCount: 140,
        spread: 100,
        origin: { y: 0.52 },
        startVelocity: 48,
        colors: ['#f0cc6a', '#ff69b4', '#ff9f43', '#a29bfe', '#ffffff', '#e74c3c'],
      });
    }, 350);

    // Transition to ready to cut after wish celebration
    setTimeout(() => setState('ready_to_cut'), 1600);
  }, []);

  const cutCake = useCallback(() => {
    setState('cutting');
    soundManager.playClick();
    soundManager.playCakeSlice();

    // Slicing top tier (Tier 2) - knife presses into chocolate sponge
    setTimeout(() => {
      soundManager.playCakeSlice();
      soundManager.playChime(1.1);
    }, 1100);

    // Slicing bottom tier (Tier 1) - knife cuts down to the plate
    setTimeout(() => {
      soundManager.playCakeSlice();
      soundManager.playChime(1.35);
    }, 2100);

    // Celebration burst & confetti as slice separates onto server plate
    setTimeout(() => {
      soundManager.playCelebrationBurst();
      confetti({
        particleCount: 120,
        spread: 95,
        origin: { y: 0.54 },
        colors: ['#ff7675', '#f0cc6a', '#ffffff', '#fd79a8', '#e84393'],
      });
    }, 3200);

    // Settle into cut state once knife has lifted away
    setTimeout(() => {
      setState('cut');
    }, 3800);
  }, []);

  // Mic support (blow into microphone)
  useEffect(() => {
    if (typeof navigator.mediaDevices?.getUserMedia !== 'function') return;
    let analyser: AnalyserNode, ctx: AudioContext, stream: MediaStream;
    let running = true;

    navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then((s) => {
        if (!running) {
          s.getTracks().forEach((t) => t.stop());
          return;
        }
        stream = s;
        ctx = new AudioContext();
        analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        const mic = ctx.createMediaStreamSource(s);
        mic.connect(analyser);

        const data = new Uint8Array(analyser.frequencyBinCount);
        const check = () => {
          if (!running || state !== 'idle') return;
          analyser.getByteFrequencyData(data);
          const avg = data.reduce((a, b) => a + b, 0) / data.length;
          if (avg > 32) extinguish();
          else requestAnimationFrame(check);
        };
        requestAnimationFrame(check);
      })
      .catch(() => {});

    return () => {
      running = false;
      stream?.getTracks().forEach((t) => t.stop());
      ctx?.close();
    };
  }, [state, extinguish]);

  const isBlown = state !== 'idle' && state !== 'holding';

  return (
    <section className="scene cake-scene" aria-label="Make a wish">
      <ParticleBG color="#8b3a00" count={25} />
      <div className="vignette" />

      {/* Floating Star Balloons matching video */}
      <div className="star-balloons-cluster" aria-hidden>
        <div className="star-balloon balloon-1">★</div>
        <div className="star-balloon balloon-2">★</div>
        <div className="star-balloon balloon-3">★</div>
        <div className="balloon-ribbon" />
      </div>

      <div className="z1 cake-content-wrap">
        {/* Header from video */}
        <div className="cake-header">
          <h1 className="cake-title">{BIRTHDAY_CONFIG.cakeTitle}</h1>
          <p className="cake-sub">{BIRTHDAY_CONFIG.cakeSub}</p>
        </div>

        {/* Romantic quote above cake */}
        <p className="cake-quote-top">
          "{BIRTHDAY_CONFIG.cakeQuotes[0]}"
        </p>

        {/* 3D Cake Structure */}
        <div
          className={`cake-wrap ${state === 'cutting' || state === 'cut' ? 'is-cut' : ''}`}
          onClick={!isBlown ? extinguish : undefined}
          title={!isBlown ? "Tap candle to blow!" : undefined}
        >
          {/* Animated Realistic Chef/Cake Knife */}
          {state === 'cutting' && (
            <div className="real-cake-knife" aria-hidden>
              <svg viewBox="0 0 160 48" className="knife-svg-detailed">
                <defs>
                  <linearGradient id="knifeSteel" x1="100%" y1="0%" x2="0%" y2="80%">
                    <stop offset="0%" stopColor="#94a3b8" />
                    <stop offset="25%" stopColor="#f8fafc" />
                    <stop offset="50%" stopColor="#cbd5e1" />
                    <stop offset="75%" stopColor="#e2e8f0" />
                    <stop offset="100%" stopColor="#ffffff" />
                  </linearGradient>
                  <linearGradient id="knifeBevel" x1="100%" y1="0%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="#cbd5e1" />
                    <stop offset="50%" stopColor="#ffffff" />
                    <stop offset="100%" stopColor="#ffffff" />
                  </linearGradient>
                  <linearGradient id="rosewoodHandle" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#582912" />
                    <stop offset="35%" stopColor="#78350f" />
                    <stop offset="70%" stopColor="#451a03" />
                    <stop offset="100%" stopColor="#240c02" />
                  </linearGradient>
                  <linearGradient id="brassBolster" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#d4a843" />
                    <stop offset="50%" stopColor="#fff6d6" />
                    <stop offset="100%" stopColor="#b38728" />
                  </linearGradient>
                </defs>
                <g>
                  {/* Blade pointing LEFT into cake */}
                  <path
                    d="M98,14 L34,14 Q20,16 10,27 Q20,32 30,32 L98,32 Z"
                    fill="url(#knifeSteel)"
                    stroke="#94a3b8"
                    strokeWidth="0.8"
                  />
                  {/* Razor cutting edge shine */}
                  <path
                    d="M98,29 L30,29 Q20,30 11,27"
                    fill="none"
                    stroke="url(#knifeBevel)"
                    strokeWidth="1.8"
                  />
                  {/* Blade spine reflection highlight */}
                  <path
                    d="M98,14 L34,14 Q22,16 12,27"
                    fill="none"
                    stroke="rgba(255,255,255,0.85)"
                    strokeWidth="1"
                  />
                  {/* Specular light flash */}
                  <line
                    x1="46" y1="17" x2="36" y2="29"
                    stroke="rgba(255,255,255,0.7)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  {/* Brass bolster */}
                  <rect x="98" y="12" width="7" height="22" rx="2" fill="url(#brassBolster)" stroke="#a16207" strokeWidth="0.5" />
                  {/* Rosewood ergonomic handle */}
                  <path
                    d="M105,15 L146,17 Q154,18 154,23 Q154,28 146,29 L105,31 Z"
                    fill="url(#rosewoodHandle)"
                    stroke="#d4a843"
                    strokeWidth="0.8"
                  />
                  {/* Brass Rivets on handle */}
                  <circle cx="116" cy="23" r="1.8" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.6" />
                  <circle cx="128" cy="23" r="1.8" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.6" />
                  <circle cx="140" cy="23" r="1.8" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.6" />
                </g>
              </svg>
            </div>
          )}

          {/* Slicing crumbs bursting during cutting */}
          {state === 'cutting' && (
            <div className="cutting-crumbs-wrap" aria-hidden>
              <span className="crumb crumb-1" />
              <span className="crumb crumb-2" />
              <span className="crumb crumb-3" />
              <span className="crumb crumb-4" />
              <span className="crumb crumb-5" />
              <span className="crumb crumb-6" />
            </div>
          )}

          {/* Incision line along cut */}
          {(state === 'cutting' || state === 'cut') && (
            <div className="cake-cut-incision" aria-hidden />
          )}

          {/* Real cut-out cake slice separating and sliding out */}
          {(state === 'cutting' || state === 'cut') && (
            <div
              className={`real-cut-cake-slice ${state === 'cut' ? 'is-settled' : 'is-slicing'}`}
              aria-label="A cut slice of birthday cake"
            >
              {/* Spatula / serving dessert plate under slice */}
              <div className="slice-server-spatula" />

              {/* Top tier piece of the slice */}
              <div className="slice-mini-tier-2">
                <span className="slice-berry">🍓</span>
                <div className="slice-frosting" />
                <div className="slice-crumb-face">
                  <div className="slice-sponge" />
                  <div className="slice-cream" />
                  <div className="slice-sponge" />
                </div>
              </div>

              {/* Bottom tier piece of the slice */}
              <div className="slice-mini-tier-1">
                <div className="slice-frosting" />
                <div className="slice-crumb-face">
                  <div className="slice-sponge" />
                  <div className="slice-cream" />
                  <div className="slice-sponge" />
                </div>
              </div>

              {/* First Bite Tag */}
              <div className="served-slice-tag">
                First Bite ✨ 🍰
              </div>
            </div>
          )}

          {/* Candle */}
          <div className="candle-wrap">
            {!isBlown ? (
              <div className="flame-wrap">
                <div className="flame-outer" />
                <div className="flame-mid" />
                <div className="flame-core" />
                <div className="flame-glow" />
              </div>
            ) : (
              <div className="smokes-container">
                {smokes.map((s) => (
                  <div
                    key={s.id}
                    className="smoke-particle"
                    style={
                      {
                        width: s.size,
                        height: s.size,
                        left: `calc(50% - ${s.size / 2}px)`,
                        bottom: 0,
                        '--dx': `${s.dx}px`,
                        '--dur': `${s.dur}s`,
                        animationDelay: `${s.delay}s`,
                      } as React.CSSProperties
                    }
                  />
                ))}
              </div>
            )}
            <div className="candle-wick" />
            <div className="candle-body">
              <div className="candle-wax" />
            </div>
          </div>

          {/* Top Tier */}
          <div className="cake-tier-2">
            <div className="cake-frosting-2" />
            <div className="cake-decorations">
              <span className="cake-deco-berry">🍓</span>
              <span className="cake-deco-berry">🍓</span>
              {!(state === 'cutting' || state === 'cut') && (
                <span className="cake-deco-berry">🍓</span>
              )}
            </div>
            {/* Cut cavity revealing inner layers when cut */}
            {(state === 'cutting' || state === 'cut') && (
              <div className="tier-cut-cavity cavity-tier-2" aria-hidden>
                <div className="sponge-layer sponge-top" />
                <div className="cream-filling" />
                <div className="sponge-layer sponge-bot" />
              </div>
            )}
          </div>

          {/* Bottom Tier */}
          <div className="cake-tier-1">
            <div className="cake-frosting-1" />
            {[18, 42, 66, 90, 114, 138, 162].map((l) => (
              <div key={l} className="cake-drip" style={{ left: l }} />
            ))}
            {/* Cut cavity revealing inner layers when cut */}
            {(state === 'cutting' || state === 'cut') && (
              <div className="tier-cut-cavity cavity-tier-1" aria-hidden>
                <div className="sponge-layer sponge-top" />
                <div className="cream-filling" />
                <div className="sponge-layer sponge-bot" />
              </div>
            )}
          </div>

          {/* Cake Stand / Plate */}
          <div className="cake-plate" />
        </div>

        {/* Lower wish quote */}
        <p className="cake-quote-bottom">
          {BIRTHDAY_CONFIG.cakeQuotes[1]}
        </p>

        {/* Interactive Controls */}
        {!isBlown ? (
          <div className="blow-controls">
            <p className="blow-instruction">
              <Wind size={16} /> Tap flame, blow into mic 🎤, or hold below ↓
            </p>

            {/* Circular Hold Progress Ring */}
            <div className="hold-ring-container">
              <svg width="90" height="90" className="hold-ring-svg">
                <circle cx="45" cy="45" r="40" fill="none" stroke="rgba(212,168,67,0.2)" strokeWidth="4" />
                <circle
                  cx="45"
                  cy="45"
                  r="40"
                  fill="none"
                  stroke="var(--gold-light)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress / 100)}`}
                  style={{ transition: 'stroke-dashoffset 0.04s linear' }}
                />
              </svg>
              <button
                className="hold-ring-button"
                onPointerDown={startHold}
                onPointerUp={stopHold}
                onPointerLeave={stopHold}
                aria-label="Hold to blow candle"
                aria-pressed={state === 'holding'}
              >
                <div className="hold-ring-inner">
                  {state === 'holding' ? '💨' : '🕯️'}
                </div>
              </button>
            </div>
          </div>
        ) : state === 'ready_to_cut' ? (
          <div className="wish-granted-wrap">
            <p className="wish-granted-text">
              ✨ Wish Made & Sent To The Stars ✨
            </p>
            <p className="cake-cut-instruction">
              Now make the official birthday cut! 🎂
            </p>
            <button
              className="proceed-btn cake-cut-btn"
              onClick={cutCake}
              aria-label="Cut the birthday cake"
            >
              <span>Cut The Cake 🎂 🔪</span>
            </button>
          </div>
        ) : state === 'cutting' ? (
          <div className="wish-granted-wrap">
            <p className="wish-granted-text cutting-pulse-text">
              🔪 Slicing the sweetest birthday cake...
            </p>
          </div>
        ) : state === 'cut' ? (
          <div className="wish-granted-wrap">
            <p className="wish-granted-text">
              ✨ The Cake Is Cut! Happy Birthday! 🍰 ✨
            </p>
            <p className="cake-cut-instruction">
              Here's the first sweet slice made with love 🤍
            </p>
            <button
              className="proceed-btn cake-proceed-btn"
              onClick={() => {
                soundManager.playClick();
                onDone();
              }}
              aria-label="Continue to your gifts"
            >
              <span>Unwrap Your Gifts 🎁</span>
              <ArrowRight size={18} />
            </button>
          </div>
        ) : (
          <p className="wish-blown-interim">
            ✨ Exhaling... May your wish shine bright!
          </p>
        )}
      </div>
    </section>
  );
};
