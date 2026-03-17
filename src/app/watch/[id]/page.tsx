"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import WatchFace from "@/components/WatchFace";

const COLORS = [
  "#C9A84C",
  "#6B9FBD",
  "#4A7C6E",
  "#8B6F47",
  "#9B7DC4",
  "#C4A882",
  "#7A9BC4",
  "#B8C4D0",
];
const HOURS = [120, 60, 170, 320, 220, 80, 260, 140];
const MINS = [200, 300, 40, 90, 140, 250, 360, 60];

const MOCK_REVIEWS = [
  {
    initials: "RK",
    name: "Rohan K.",
    handle: "@rohan_k · London",
    verified: true,
    stars: 5,
    text: "The 41mm update was exactly what the Sub needed. Bracelet comfort is exceptional — the glidelock clasp adjusts so smoothly you forget you're wearing steel. The ceramic bezel has aged beautifully after two years.",
    date: "March 2025",
    helpful: 847,
  },
  {
    initials: "SM",
    name: "Sana M.",
    handle: "@sana.m · Dubai",
    verified: false,
    stars: 5,
    text: 'My first luxury watch and I have zero regrets. Wears beautifully on a 6.5" wrist, not too bulky. The lume is spectacular — bright green for hours.',
    date: "January 2025",
    helpful: 512,
  },
  {
    initials: "JP",
    name: "James P.",
    handle: "@jakep · New York",
    verified: false,
    stars: 4,
    text: "Objectively brilliant watch. Docking one star purely on principle — the AD allocation system makes ownership feel exclusionary. The watch itself is a 5/5.",
    date: "November 2024",
    helpful: 1203,
  },
];

const SENTIMENT = [
  { label: "Build Quality", pct: 96 },
  { label: "Dial Legibility", pct: 94 },
  { label: "Bracelet Comfort", pct: 91 },
  { label: "Lume Performance", pct: 98 },
  { label: "Value for Money", pct: 62, dim: true },
  { label: "Purchase Experience", pct: 34, dim: true },
  { label: "Daily Wearability", pct: 97 },
];

const LISTS = [
  { name: "The Perfect All-Rounders", meta: "by @marcus_ticks · 12 watches" },
  { name: "Tool Watches Worth Every Penny", meta: "by @arjun_v · 8 watches" },
  { name: "My Grail Collection", meta: "by @sana.m · 15 watches" },
  { name: "Best Divers Under £12K", meta: "by @jakep · 6 watches" },
  { name: "Watches I'd Buy Again", meta: "by @rohan_k · 9 watches" },
  { name: "Bond Watches Ranked", meta: "by @007_collector · 7 watches" },
];

export default function WatchDetailPage() {
  const params = useParams();
  const [watch, setWatch] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("reviews");
  const [actions, setActions] = useState({
    own: true,
    worn: false,
    want: false,
    wishlist: false,
  });
  const [colorIdx] = useState(Math.floor(Math.random() * COLORS.length));

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("watches")
      .select("*")
      .eq("id", params.id)
      .single()
      .then(({ data }) => {
        setWatch(data);
        setLoading(false);
      });
  }, [params.id]);

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
        }}
      >
        <p
          style={{
            fontFamily: "var(--ff-display)",
            fontStyle: "italic",
            color: "var(--muted)",
            fontSize: "1.2rem",
          }}
        >
          Loading from the archive...
        </p>
      </div>
    );

  if (!watch)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
        }}
      >
        <p
          style={{
            fontFamily: "var(--ff-display)",
            fontStyle: "italic",
            color: "var(--muted)",
            fontSize: "1.2rem",
          }}
        >
          Watch not found.
        </p>
      </div>
    );

  const specs = [
    ["Case", watch.case_size],
    ["Movement", watch.movement],
    ["Water Resist.", watch.water_resistance],
    ["Crystal", watch.crystal],
    ["Power Reserve", watch.power_reserve],
    ["Dial", watch.dial],
    ["Bezel", watch.bezel],
    [
      "RRP",
      watch.rrp_gbp
        ? `£${watch.rrp_gbp.toLocaleString()} / $${watch.rrp_usd?.toLocaleString()}`
        : "—",
    ],
  ];

  const btnStyle = (on: boolean) => ({
    background: on ? "rgba(201,168,76,0.08)" : "transparent",
    border: `0.5px solid ${on ? "var(--gold)" : "var(--border)"}`,
    color: on ? "var(--gold)" : "var(--muted)",
    padding: "0.5rem 0.875rem",
    fontFamily: "var(--ff-body)",
    fontSize: "0.6rem",
    fontWeight: 400,
    letterSpacing: "0.18em",
    textTransform: "uppercase" as const,
    cursor: "pointer",
    transition: "all 0.2s",
  });

  const tabBtn = (id: string, label: string) => (
    <button
      key={id}
      onClick={() => setTab(id)}
      style={{
        background: "none",
        border: "none",
        borderBottom:
          tab === id ? "1.5px solid var(--gold)" : "1.5px solid transparent",
        color: tab === id ? "var(--gold)" : "var(--muted)",
        fontFamily: "var(--ff-body)",
        fontSize: "0.62rem",
        fontWeight: 400,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        padding: "1rem 1.25rem",
        cursor: "pointer",
        transition: "color 0.2s, border-color 0.2s",
      }}
    >
      {label}
    </button>
  );

  return (
    <>
      {/* Breadcrumb */}
      <div
        style={{
          padding: "0.875rem 2.5rem",
          fontSize: "0.6rem",
          color: "var(--muted)",
          letterSpacing: "0.1em",
          borderBottom: "0.5px solid var(--border2)",
        }}
      >
        <Link
          href="/explore"
          style={{ color: "var(--muted)", textDecoration: "none" }}
        >
          Explore
        </Link>
        <span style={{ margin: "0 0.4rem", color: "var(--gold3)" }}>›</span>
        <Link
          href="/explore"
          style={{ color: "var(--muted)", textDecoration: "none" }}
        >
          {watch.brand}
        </Link>
        <span style={{ margin: "0 0.4rem", color: "var(--gold3)" }}>›</span>
        {watch.model}
      </div>

      {/* Hero */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr" }}>
        {/* Showcase */}
        <div
          style={{
            background: "var(--bg2)",
            borderRight: "0.5px solid var(--border)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "3rem",
            gap: "2rem",
            minHeight: 480,
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              width: 300,
              height: 300,
              background:
                "radial-gradient(circle,rgba(201,168,76,0.05) 0%,transparent 65%)",
              pointerEvents: "none",
            }}
          />
          <WatchFace
            size={180}
            hourDeg={HOURS[colorIdx]}
            minuteDeg={MINS[colorIdx]}
            borderColor={COLORS[colorIdx]}
          />
          <div
            style={{
              display: "flex",
              gap: "0.625rem",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {[
              { key: "own", label: "◎ Own It" },
              { key: "worn", label: "◈ Worn It" },
              { key: "want", label: "◐ Want It" },
              { key: "wishlist", label: "♡ Wishlist" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() =>
                  setActions((prev) => ({
                    ...prev,
                    [key]: !prev[key as keyof typeof prev],
                  }))
                }
                style={btnStyle(actions[key as keyof typeof actions])}
              >
                {label}
              </button>
            ))}
          </div>
          <Link
            href="/log"
            style={{
              ...btnStyle(false),
              textDecoration: "none",
              display: "inline-block",
              textAlign: "center",
              padding: "0.625rem 2rem",
              marginTop: "-0.5rem",
            }}
          >
            + Log This Watch
          </Link>
        </div>

        {/* Info */}
        <div style={{ padding: "3rem" }}>
          <div
            style={{
              fontSize: "0.55rem",
              fontWeight: 400,
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "var(--gold)",
              marginBottom: "0.75rem",
            }}
          >
            {watch.brand}
          </div>
          <h1
            style={{
              fontFamily: "var(--ff-display)",
              fontSize: "3.2rem",
              fontWeight: 300,
              lineHeight: 1.08,
              marginBottom: "0.5rem",
            }}
          >
            {watch.model}
          </h1>
          <div
            style={{
              fontSize: "0.68rem",
              color: "var(--muted)",
              letterSpacing: "0.15em",
              marginBottom: "1.5rem",
            }}
          >
            Ref. {watch.reference} · {watch.case_size}
          </div>

          {/* Rating */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "1.5rem",
            }}
          >
            <div style={{ display: "flex", gap: 4 }}>
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: 18,
                    height: 18,
                    background: "var(--gold)",
                    clipPath:
                      "polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)",
                  }}
                />
              ))}
            </div>
            <div
              style={{
                fontFamily: "var(--ff-display)",
                fontSize: "2rem",
                color: "var(--gold)",
              }}
            >
              4.8
            </div>
            <div style={{ fontSize: "0.68rem", color: "var(--muted)" }}>
              from 2,841 reviews
            </div>
          </div>

          {/* Pills */}
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              flexWrap: "wrap",
              marginBottom: "1.75rem",
            }}
          >
            {[
              ["18.4K", "Own It"],
              ["31.2K", "Worn It"],
              ["9.1K", "Want It"],
              ["142", "Lists"],
            ].map(([n, l]) => (
              <div
                key={l}
                style={{
                  background: "rgba(201,168,76,0.06)",
                  border: "0.5px solid var(--border)",
                  padding: "0.3rem 0.75rem",
                  fontSize: "0.6rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                }}
              >
                <strong style={{ color: "var(--text)", fontWeight: 400 }}>
                  {n}
                </strong>{" "}
                {l}
              </div>
            ))}
          </div>

          <div
            style={{
              display: "block",
              width: 36,
              height: 1,
              background: "var(--gold)",
              margin: "1.25rem 0",
            }}
          />

          {/* Specs */}
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}
          >
            {specs.map(
              ([k, v]) =>
                v && (
                  <div
                    key={k}
                    style={{
                      padding: "0.625rem 0",
                      borderBottom: "0.5px solid var(--border2)",
                      display: "flex",
                      gap: "1rem",
                      alignItems: "baseline",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.58rem",
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        color: "var(--muted)",
                        minWidth: 110,
                        flexShrink: 0,
                      }}
                    >
                      {k}
                    </span>
                    <span style={{ fontSize: "0.82rem", color: "var(--text)" }}>
                      {v}
                    </span>
                  </div>
                ),
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ borderTop: "0.5px solid var(--border)" }}>
        <div
          style={{
            display: "flex",
            borderBottom: "0.5px solid var(--border)",
            background: "var(--bg2)",
            padding: "0 2.5rem",
          }}
        >
          {tabBtn("reviews", `Reviews (${MOCK_REVIEWS.length})`)}
          {tabBtn("sentiment", "Sentiment")}
          {tabBtn("lists", `In Lists (${LISTS.length})`)}
        </div>

        <div style={{ padding: "2.5rem" }}>
          {tab === "reviews" && (
            <div>
              {MOCK_REVIEWS.map((r, i) => (
                <div
                  key={i}
                  style={{
                    background: "var(--bg2)",
                    border: "0.5px solid var(--border2)",
                    padding: "1.5rem",
                    marginBottom: "1rem",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: -1,
                      left: -1,
                      width: 12,
                      height: 12,
                      borderTop: "1px solid var(--gold3)",
                      borderLeft: "1px solid var(--gold3)",
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.875rem",
                      marginBottom: "0.875rem",
                    }}
                  >
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: "50%",
                        background: "var(--bg3)",
                        border: "0.5px solid var(--gold3)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.65rem",
                        color: "var(--gold)",
                        fontFamily: "var(--ff-display)",
                        flexShrink: 0,
                      }}
                    >
                      {r.initials}
                    </div>
                    <div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text)" }}>
                        {r.name}{" "}
                        {r.verified && (
                          <span
                            style={{
                              fontSize: "0.55rem",
                              color: "var(--gold)",
                              marginLeft: "0.4rem",
                              letterSpacing: "0.1em",
                            }}
                          >
                            VERIFIED OWNER
                          </span>
                        )}
                      </div>
                      <div
                        style={{ fontSize: "0.65rem", color: "var(--muted)" }}
                      >
                        {r.handle}
                      </div>
                    </div>
                    <div
                      style={{ display: "flex", gap: 2, marginLeft: "auto" }}
                    >
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          style={{
                            width: 9,
                            height: 9,
                            background:
                              i < r.stars ? "var(--gold)" : "transparent",
                            border:
                              i < r.stars ? "none" : "0.5px solid var(--gold3)",
                            borderRadius: i < r.stars ? 0 : "50%",
                            clipPath:
                              i < r.stars
                                ? "polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)"
                                : "none",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <p
                    style={{
                      fontFamily: "var(--ff-display)",
                      fontStyle: "italic",
                      fontSize: "0.9rem",
                      color: "var(--muted)",
                      lineHeight: 1.8,
                    }}
                  >
                    "{r.text}"
                  </p>
                  <div
                    style={{
                      fontSize: "0.6rem",
                      color: "var(--muted)",
                      marginTop: "0.625rem",
                      opacity: 0.55,
                    }}
                  >
                    {r.date} · {r.helpful.toLocaleString()} found this helpful
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "sentiment" && (
            <div style={{ maxWidth: 580 }}>
              <p
                style={{
                  fontFamily: "var(--ff-display)",
                  fontStyle: "italic",
                  fontSize: "0.9rem",
                  color: "var(--muted)",
                  marginBottom: "2rem",
                  lineHeight: 1.8,
                }}
              >
                Based on 2,841 community reviews.
              </p>
              {SENTIMENT.map((s) => (
                <div key={s.label} style={{ marginBottom: "1.5rem" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "0.62rem",
                      color: "var(--muted)",
                      marginBottom: "0.35rem",
                      letterSpacing: "0.1em",
                    }}
                  >
                    <span>{s.label}</span>
                    <span>{s.pct}%</span>
                  </div>
                  <div style={{ height: 3, background: "var(--bg3)" }}>
                    <div
                      style={{
                        height: "100%",
                        width: `${s.pct}%`,
                        background: s.dim ? "var(--gold3)" : "var(--gold)",
                        transition: "width 1s ease",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "lists" && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))",
                gap: "1rem",
              }}
            >
              {LISTS.map((l) => (
                <div
                  key={l.name}
                  style={{
                    background: "var(--bg2)",
                    border: "0.5px solid var(--border2)",
                    padding: "1.25rem",
                    cursor: "pointer",
                    transition: "border-color 0.2s",
                    position: "relative",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--gold)";
                    (
                      e.currentTarget.querySelector(".cc") as HTMLElement
                    ).style.borderColor = "var(--gold)";
                    (
                      e.currentTarget.querySelector(".cc") as HTMLElement
                    ).style.borderTopColor = "var(--gold)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border2)";
                  }}
                >
                  <div
                    className="cc"
                    style={{
                      position: "absolute",
                      top: -1,
                      left: -1,
                      width: 10,
                      height: 10,
                      borderTop: "1px solid transparent",
                      borderLeft: "1px solid transparent",
                      transition: "border-color 0.3s",
                    }}
                  />
                  <div
                    style={{
                      fontFamily: "var(--ff-display)",
                      fontSize: "0.95rem",
                      marginBottom: "0.3rem",
                      color: "var(--text)",
                    }}
                  >
                    {l.name}
                  </div>
                  <div style={{ fontSize: "0.62rem", color: "var(--muted)" }}>
                    {l.meta}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
