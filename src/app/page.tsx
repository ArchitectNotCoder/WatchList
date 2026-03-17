"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import WatchFace from "@/components/WatchFace";
import { createClient } from "@/lib/supabase";
import { useState } from "react";

const WATCHES = [
  {
    brand: "Rolex",
    name: "Submariner Date",
    hourDeg: 120,
    minuteDeg: 200,
    color: "#C9A84C",
  },
  {
    brand: "Omega",
    name: "Speedmaster",
    hourDeg: 60,
    minuteDeg: 300,
    color: "#6B9FBD",
  },
  {
    brand: "Grand Seiko",
    name: "SBGA211 Snowflake",
    hourDeg: 170,
    minuteDeg: 40,
    color: "#4A7C6E",
  },
  {
    brand: "Patek Philippe",
    name: "Nautilus 5711",
    hourDeg: 320,
    minuteDeg: 90,
    color: "#8B6F47",
  },
];

const TICKER_ITEMS = [
  "Rolex Submariner Date · 41mm",
  "Patek Philippe Nautilus 5711",
  "Audemars Piguet Royal Oak",
  "Omega Speedmaster Moonwatch",
  "Grand Seiko SBGA211 Snowflake",
  "IWC Portugieser Chronograph",
  "Tudor Black Bay 58",
  "Cartier Santos de Cartier",
  "Jaeger-LeCoultre Reverso Classic",
];

export default function Home() {
  const [watches, setWatches] = useState<any[]>([]);
  const revealRefs = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("watches")
      .select("*")
      .limit(4)
      .then(({ data }) => {
        if (data) setWatches(data);
      });

    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e, i) => {
          if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add("visible"), i * 80);
            observer.unobserve(e.target);
          }
        }),
      { threshold: 0.1 },
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const tickerItems = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <>
      {/* HERO */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "8rem 2rem 5rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Rays */}
        <div
          className="hero-rays"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: 900,
            height: 900,
            pointerEvents: "none",
          }}
        />
        {/* Glow */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: 500,
            height: 500,
            background:
              "radial-gradient(circle,rgba(201,168,76,0.06) 0%,transparent 65%)",
            pointerEvents: "none",
          }}
        />

        {/* Top ornament */}
        <div
          style={{
            position: "absolute",
            top: 88,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            whiteSpace: "nowrap",
          }}
        >
          <div
            style={{
              width: 100,
              height: "0.5px",
              background: "linear-gradient(90deg,transparent,var(--gold3))",
            }}
          />
          <div
            style={{
              width: 5,
              height: 5,
              background: "var(--gold)",
              transform: "rotate(45deg)",
            }}
          />
          <span
            style={{
              fontFamily: "var(--ff-body)",
              fontSize: "0.52rem",
              fontWeight: 100,
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              color: "var(--gold3)",
            }}
          >
            Est. MMX · The Collector's Society
          </span>
          <div
            style={{
              width: 5,
              height: 5,
              background: "var(--gold)",
              transform: "rotate(45deg)",
            }}
          />
          <div
            style={{
              width: 100,
              height: "0.5px",
              background: "linear-gradient(90deg,var(--gold3),transparent)",
            }}
          />
        </div>

        <p
          className="fade-up-1"
          style={{
            fontFamily: "var(--ff-body)",
            fontSize: "0.58rem",
            fontWeight: 100,
            letterSpacing: "0.5em",
            textTransform: "uppercase",
            color: "var(--gold)",
            marginBottom: "2rem",
          }}
        >
          For the obsessed collector
        </p>

        <h1
          className="fade-up-2"
          style={{
            fontFamily: "var(--ff-display)",
            fontSize: "clamp(3rem,8vw,7rem)",
            fontWeight: 300,
            lineHeight: 1.08,
            color: "var(--text)",
            letterSpacing: "0.02em",
            marginBottom: "1rem",
          }}
        >
          Are you on the
          <br />
          <em style={{ fontStyle: "italic", color: "var(--gold)" }}>
            WatchList<span style={{ color: "var(--gold3)" }}>?</span>
          </em>
        </h1>

        {/* Deco rule */}
        <div
          className="fade-up-3"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            justifyContent: "center",
            margin: "1.5rem auto",
            maxWidth: 280,
          }}
        >
          <div
            style={{
              flex: 1,
              height: "0.5px",
              background:
                "linear-gradient(90deg,transparent,var(--gold3),transparent)",
            }}
          />
          <div
            style={{
              width: 3,
              height: 3,
              border: "0.5px solid var(--gold3)",
              transform: "rotate(45deg)",
            }}
          />
          <div
            style={{
              width: 5,
              height: 5,
              background: "var(--gold)",
              transform: "rotate(45deg)",
            }}
          />
          <div
            style={{
              width: 3,
              height: 3,
              border: "0.5px solid var(--gold3)",
              transform: "rotate(45deg)",
            }}
          />
          <div
            style={{
              flex: 1,
              height: "0.5px",
              background:
                "linear-gradient(90deg,transparent,var(--gold3),transparent)",
            }}
          />
        </div>

        <p
          className="fade-up-4"
          style={{
            fontFamily: "var(--ff-display)",
            fontStyle: "italic",
            fontSize: "1.1rem",
            fontWeight: 300,
            color: "var(--muted)",
            maxWidth: 480,
            margin: "0 auto 2.5rem",
            letterSpacing: "0.04em",
          }}
        >
          Log the watches you own, review the ones you've worn,
          <br />
          and discover what the world's finest collectors are wearing.
        </p>

        <div
          className="fade-up-5"
          style={{
            display: "flex",
            gap: "1.25rem",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link href="/auth" className="btn-primary">
            Join the List
          </Link>
          <Link href="/explore" className="btn-ghost">
            Browse the Archive
          </Link>
        </div>

        {/* Ticker */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            borderTop: "0.5px solid var(--border)",
            borderBottom: "0.5px solid var(--border)",
            background: "var(--bg2)",
            overflow: "hidden",
            padding: "0.75rem 0",
          }}
        >
          <div
            className="ticker-animate"
            style={{ display: "flex", gap: "2.5rem", whiteSpace: "nowrap" }}
          >
            {tickerItems.map((item, i) => (
              <span
                key={i}
                style={{
                  fontFamily: "var(--ff-display)",
                  fontStyle: "italic",
                  fontSize: "0.8rem",
                  color: "var(--muted)",
                  letterSpacing: "0.06em",
                  flexShrink: 0,
                }}
              >
                <b
                  style={{
                    color: "var(--gold)",
                    fontStyle: "normal",
                    fontWeight: 400,
                    marginRight: "0.4rem",
                    fontSize: "0.6rem",
                  }}
                >
                  ✦
                </b>
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <div
        className="reveal"
        style={{
          background: "var(--bg2)",
          padding: "4rem 2rem",
          borderBottom: "0.5px solid var(--border)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                flex: 1,
                maxWidth: 160,
                height: "0.5px",
                background: "linear-gradient(90deg,transparent,var(--border))",
              }}
            />
            <span
              style={{
                fontFamily: "var(--ff-body)",
                fontSize: "0.55rem",
                fontWeight: 300,
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                color: "var(--gold3)",
              }}
            >
              The Numbers
            </span>
            <div
              style={{
                flex: 1,
                maxWidth: 160,
                height: "0.5px",
                background: "linear-gradient(90deg,var(--border),transparent)",
              }}
            />
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            maxWidth: 900,
            margin: "0 auto",
          }}
        >
          {[
            ["48K", "Members"],
            ["312K", "Watches Logged"],
            ["89K", "Reviews Written"],
            ["6.2K", "References Listed"],
          ].map(([num, label]) => (
            <div
              key={label}
              style={{
                textAlign: "center",
                padding: "1.5rem",
                borderRight: "0.5px solid var(--border2)",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--ff-display)",
                  fontSize: "2.8rem",
                  fontWeight: 300,
                  color: "var(--gold)",
                  lineHeight: 1,
                  marginBottom: "0.4rem",
                }}
              >
                {num}
              </div>
              <div
                style={{
                  fontFamily: "var(--ff-body)",
                  fontSize: "0.55rem",
                  fontWeight: 300,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <section style={{ padding: "6rem 2rem" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div
            className="reveal section-header"
            style={{ textAlign: "center", marginBottom: "4rem" }}
          >
            <p className="s-eyebrow">What We Offer</p>
            <h2 className="s-title">
              Your collection,
              <br />
              <em>finally archived.</em>
            </h2>
            <div style={{ marginTop: "1.5rem" }}>
              <div className="deco-rule">
                <div className="dl" />
                <div className="ds" />
                <div className="dd" />
                <div className="ds" />
                <div className="dl" />
              </div>
            </div>
          </div>
          <div
            className="reveal"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              border: "0.5px solid var(--border)",
            }}
          >
            {[
              [
                "◎",
                "Log & Rate",
                "Add any reference. Rate it, review it, mark it as owned, worn, or wanted.",
              ],
              [
                "◈",
                "Deep Specs",
                "Full technical details — movement, complications, dimensions, water resistance.",
              ],
              [
                "◉",
                "Follow Collectors",
                "Real-time feed of what the community is logging and writing about.",
              ],
              [
                "◐",
                "Curate Lists",
                '"My Grails", "Best Under £2K" — build and share your taste.',
              ],
              ["⊕", "Wear Diary", "Chronicle what's on your wrist day by day."],
              [
                "◫",
                "Market Sentiment",
                "Track how community perception shifts for any reference over time.",
              ],
            ].map(([icon, title, text], i) => (
              <div
                key={title}
                style={{
                  padding: "2.5rem 2rem",
                  borderRight:
                    i % 3 !== 2 ? "0.5px solid var(--border2)" : "none",
                  borderBottom: i < 3 ? "0.5px solid var(--border2)" : "none",
                  transition: "background 0.3s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "var(--bg2)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <div
                  style={{
                    width: 30,
                    height: 30,
                    border: "0.5px solid var(--gold3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.7rem",
                    color: "var(--gold)",
                    marginBottom: "1.5rem",
                    transform: "rotate(45deg)",
                  }}
                >
                  <span style={{ transform: "rotate(-45deg)" }}>{icon}</span>
                </div>
                <div
                  style={{
                    fontFamily: "var(--ff-display)",
                    fontSize: "1.2rem",
                    fontWeight: 400,
                    color: "var(--text)",
                    marginBottom: "0.5rem",
                  }}
                >
                  {title}
                </div>
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--muted)",
                    lineHeight: 1.8,
                    fontWeight: 300,
                  }}
                >
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WATCHES */}
      <section
        style={{
          background: "var(--bg2)",
          padding: "6rem 2rem",
          borderTop: "0.5px solid var(--border)",
        }}
      >
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div
            className="reveal"
            style={{ textAlign: "center", marginBottom: "3rem" }}
          >
            <p className="s-eyebrow">Trending This Week</p>
            <h2 className="s-title">
              On the <em>WatchList.</em>
            </h2>
            <div style={{ marginTop: "1.5rem" }}>
              <div className="deco-rule">
                <div className="dl" />
                <div className="ds" />
                <div className="dd" />
                <div className="ds" />
                <div className="dl" />
              </div>
            </div>
          </div>
          <div
            className="reveal"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: "1px",
              background: "var(--border)",
              border: "0.5px solid var(--border)",
            }}
          >
            {WATCHES.map((w) => (
              <Link
                key={w.brand}
                href="/explore"
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    background: "var(--bg2)",
                    padding: "2rem 1.5rem",
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--bg3)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "var(--bg2)")
                  }
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginBottom: "1.25rem",
                    }}
                  >
                    <WatchFace
                      size={90}
                      hourDeg={w.hourDeg}
                      minuteDeg={w.minuteDeg}
                      borderColor={w.color}
                    />
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--ff-body)",
                      fontSize: "0.55rem",
                      fontWeight: 300,
                      letterSpacing: "0.3em",
                      textTransform: "uppercase",
                      color: "var(--gold)",
                      marginBottom: "0.3rem",
                    }}
                  >
                    {w.brand}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--ff-display)",
                      fontSize: "1rem",
                      fontWeight: 400,
                      color: "var(--text)",
                      marginBottom: "0.625rem",
                      lineHeight: 1.2,
                    }}
                  >
                    {w.name}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 2,
                      justifyContent: "center",
                    }}
                  >
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="star" />
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          textAlign: "center",
          padding: "8rem 2rem",
          background: "var(--bg2)",
          borderTop: "0.5px solid var(--border)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: 600,
            height: 600,
            background:
              "radial-gradient(circle,rgba(201,168,76,0.05) 0%,transparent 65%)",
            pointerEvents: "none",
          }}
        />
        <div className="reveal" style={{ marginBottom: "2rem" }}>
          <div className="deco-rule">
            <div className="dl" style={{ maxWidth: 120 }} />
            <div className="ds" />
            <div className="dd" />
            <div className="ds" />
            <div className="dl" style={{ maxWidth: 120 }} />
          </div>
        </div>
        <h2
          className="reveal"
          style={{
            fontFamily: "var(--ff-display)",
            fontSize: "clamp(2.5rem,6vw,5rem)",
            fontWeight: 300,
            lineHeight: 1.1,
            marginBottom: "1rem",
          }}
        >
          Join the
          <br />
          <em style={{ fontStyle: "italic", color: "var(--gold)" }}>
            WatchList.
          </em>
        </h2>
        <p
          className="reveal"
          style={{
            fontFamily: "var(--ff-display)",
            fontStyle: "italic",
            fontSize: "1rem",
            color: "var(--muted)",
            marginBottom: "2.5rem",
          }}
        >
          Free to join. No ads. Just collectors.
        </p>
        <div className="reveal">
          <Link href="/auth" className="btn-primary">
            Are you on the list?
          </Link>
        </div>
      </section>
    </>
  );
}
