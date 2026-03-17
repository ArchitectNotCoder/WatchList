"use client";
import { useEffect, useState } from "react";
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
];
const HOURS = [120, 60, 170, 320, 220, 80];
const MINS = [200, 300, 40, 90, 140, 250];

const TRENDING = [
  { brand: "Rolex", name: "Submariner", logs: "1,204" },
  { brand: "Tudor", name: "Black Bay 58", logs: "987" },
  { brand: "Grand Seiko", name: "SBGA211", logs: "742" },
  { brand: "Omega", name: "Speedmaster", logs: "691" },
  { brand: "AP", name: "Royal Oak", logs: "534" },
];

const MOCK_FEED = [
  {
    initials: "RK",
    name: "Rohan K.",
    handle: "@rohan_k",
    time: "2 hours ago",
    action: "logged",
    type: "OWN",
    brand: "Rolex",
    watch: "Submariner Date",
    ref: "126610LN",
    stars: 5,
    review:
      "The 41mm update is everything. Bracelet drape is perfect, ceramic bezel hasn't budged in two years.",
    likes: 42,
    comments: 8,
  },
  {
    initials: "SM",
    name: "Sana M.",
    handle: "@sana.m",
    time: "5 hours ago",
    action: "added to WatchList",
    type: "WANT",
    brand: "Cartier",
    watch: "Santos de Cartier",
    ref: "WSSA0018",
    stars: null,
    review: null,
    likes: 18,
    comments: 3,
  },
  {
    initials: "JP",
    name: "James P.",
    handle: "@jakep",
    time: "Yesterday",
    action: "reviewed",
    type: "REVIEW",
    brand: "IWC",
    watch: "Portugieser Chronograph",
    ref: "IW371601",
    stars: 4,
    review:
      "Stunning dial architecture and the best-looking chrono pusher layout in the industry. Case finishing is sublime.",
    likes: 67,
    comments: 14,
  },
  {
    initials: "AV",
    name: "Arjun V.",
    handle: "@arjun_v",
    time: "2 days ago",
    action: "logged",
    type: "OWN",
    brand: "Grand Seiko",
    watch: "SBGA211 Snowflake",
    ref: "SBGA211",
    stars: 5,
    review:
      "Nothing prepares you for the dial in person. It moves. Every lighting condition reveals something new.",
    likes: 124,
    comments: 31,
  },
];

export default function FeedPage() {
  const [activeTab, setActiveTab] = useState("Following");
  const [likedItems, setLikedItems] = useState<Set<number>>(new Set());
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const toggleLike = (idx: number) => {
    setLikedItems((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  return (
    <div
      style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: "2.5rem 2rem",
        display: "grid",
        gridTemplateColumns: "1fr 290px",
        gap: 0,
        alignItems: "start",
      }}
    >
      {/* FEED */}
      <div style={{ paddingRight: "2rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            marginBottom: "0.5rem",
          }}
        >
          <h1
            style={{
              fontFamily: "var(--ff-display)",
              fontSize: "2.2rem",
              fontWeight: 300,
            }}
          >
            Your{" "}
            <em style={{ fontStyle: "italic", color: "var(--gold)" }}>Feed</em>
          </h1>
          <div style={{ display: "flex", gap: 0 }}>
            {["Following", "Global", "Popular"].map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  background: "none",
                  border: "0.5px solid var(--border)",
                  borderColor:
                    activeTab === tab ? "var(--gold)" : "var(--border)",
                  color: activeTab === tab ? "var(--gold)" : "var(--muted)",
                  fontFamily: "var(--ff-body)",
                  fontSize: "0.6rem",
                  fontWeight: 300,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  padding: "0.4rem 0.875rem",
                  cursor: "pointer",
                  marginRight: "-0.5px",
                  zIndex: activeTab === tab ? 1 : 0,
                  position: "relative",
                  transition: "all 0.15s",
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{
              height: "0.5px",
              background: "var(--border2)",
              flex: 1,
              maxWidth: 24,
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
              height: "0.5px",
              background: "var(--border2)",
              flex: 1,
              maxWidth: 24,
            }}
          />
        </div>

        {!user && (
          <div
            style={{
              background: "var(--bg2)",
              border: "0.5px solid var(--border)",
              padding: "1.5rem",
              marginBottom: "1.5rem",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontFamily: "var(--ff-display)",
                fontStyle: "italic",
                color: "var(--muted)",
                marginBottom: "1rem",
              }}
            >
              Sign in to see your personal feed from collectors you follow.
            </p>
            <Link
              href="/auth"
              className="btn-primary"
              style={{ fontSize: "0.6rem" }}
            >
              Enter the List
            </Link>
          </div>
        )}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1px",
            background: "var(--border2)",
          }}
        >
          {MOCK_FEED.map((d, idx) => (
            <div
              key={idx}
              style={{
                background: "var(--bg)",
                padding: "1.5rem",
                transition: "background 0.2s",
                position: "relative",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--bg2)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "var(--bg)")
              }
            >
              {/* Top */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.875rem",
                  marginBottom: "0.75rem",
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "var(--bg3)",
                    border: "0.5px solid var(--gold3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--ff-display)",
                    fontSize: "0.68rem",
                    color: "var(--gold)",
                    flexShrink: 0,
                  }}
                >
                  {d.initials}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "0.82rem", color: "var(--text)" }}>
                    {d.name}
                  </div>
                  <div style={{ fontSize: "0.65rem", color: "var(--muted)" }}>
                    {d.handle}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: "0.6rem",
                    color: "var(--muted)",
                    opacity: 0.55,
                  }}
                >
                  {d.time}
                </div>
              </div>

              {/* Action */}
              <div
                style={{
                  fontSize: "0.78rem",
                  color: "var(--muted)",
                  lineHeight: 1.6,
                  marginBottom: "0.875rem",
                }}
              >
                <span
                  style={{
                    fontSize: "0.55rem",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    border: "0.5px solid var(--border)",
                    padding: "0.12rem 0.45rem",
                    marginRight: "0.4rem",
                    verticalAlign: "middle",
                    color: "var(--muted)",
                  }}
                >
                  {d.type}
                </span>
                {d.action}{" "}
                <span
                  style={{
                    color: "var(--gold)",
                    fontFamily: "var(--ff-display)",
                    fontStyle: "italic",
                    fontSize: "0.92rem",
                  }}
                >
                  {d.watch}
                </span>
                {d.stars && " — " + "★".repeat(d.stars)}
              </div>

              {/* Watch card */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  marginBottom: d.review ? "0.875rem" : 0,
                  background: "var(--bg2)",
                  border: "0.5px solid var(--border2)",
                  padding: "0.875rem",
                }}
              >
                <WatchFace
                  size={48}
                  hourDeg={HOURS[idx % HOURS.length]}
                  minuteDeg={MINS[idx % MINS.length]}
                  borderColor={COLORS[idx % COLORS.length]}
                />
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: "0.58rem",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: "var(--gold)",
                    }}
                  >
                    {d.brand}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--ff-display)",
                      fontSize: "0.95rem",
                      color: "var(--text)",
                    }}
                  >
                    {d.watch}
                  </div>
                  <div style={{ fontSize: "0.62rem", color: "var(--muted)" }}>
                    {d.ref}
                  </div>
                  {d.stars && (
                    <div style={{ display: "flex", gap: 2, marginTop: 4 }}>
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          style={{
                            width: 9,
                            height: 9,
                            background:
                              i < d.stars! ? "var(--gold)" : "transparent",
                            border:
                              i < d.stars!
                                ? "none"
                                : "0.5px solid var(--gold3)",
                            borderRadius: i < d.stars! ? 0 : "50%",
                            clipPath:
                              i < d.stars!
                                ? "polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)"
                                : "none",
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Review */}
              {d.review && (
                <div
                  style={{
                    fontFamily: "var(--ff-display)",
                    fontStyle: "italic",
                    fontSize: "0.88rem",
                    color: "var(--muted)",
                    lineHeight: 1.8,
                    borderLeft: "1.5px solid var(--gold3)",
                    paddingLeft: "0.875rem",
                    marginBottom: "0.875rem",
                  }}
                >
                  "{d.review}"
                </div>
              )}

              {/* Bottom */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  paddingTop: "0.75rem",
                  borderTop: "0.5px solid var(--border2)",
                }}
              >
                <button
                  onClick={() => toggleLike(idx)}
                  style={{
                    background: "none",
                    border: "none",
                    color: likedItems.has(idx) ? "var(--gold)" : "var(--muted)",
                    fontFamily: "var(--ff-body)",
                    fontSize: "0.65rem",
                    letterSpacing: "0.1em",
                    cursor: "pointer",
                    transition: "color 0.2s",
                  }}
                >
                  {likedItems.has(idx) ? "♥" : "♡"}{" "}
                  {d.likes + (likedItems.has(idx) ? 1 : 0)}
                </button>
                <button
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--muted)",
                    fontFamily: "var(--ff-body)",
                    fontSize: "0.65rem",
                    letterSpacing: "0.1em",
                    cursor: "pointer",
                  }}
                >
                  ◎ {d.comments} comments
                </button>
                <button
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--muted)",
                    fontFamily: "var(--ff-body)",
                    fontSize: "0.65rem",
                    letterSpacing: "0.1em",
                    cursor: "pointer",
                    marginLeft: "auto",
                  }}
                >
                  Share
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SIDEBAR */}
      <div style={{ position: "sticky", top: 80 }}>
        {/* Stats */}
        <div
          style={{
            background: "var(--bg2)",
            border: "0.5px solid var(--border)",
            padding: "1.25rem",
            marginBottom: "1rem",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -1,
              left: -1,
              width: 10,
              height: 10,
              borderTop: "1px solid var(--gold3)",
              borderLeft: "1px solid var(--gold3)",
            }}
          />
          <div
            style={{
              fontSize: "0.55rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "var(--gold)",
              marginBottom: "1rem",
            }}
          >
            Your Stats
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.625rem",
            }}
          >
            {user ? (
              [
                ["0", "Owned"],
                ["0", "Worn"],
                ["0", "Reviews"],
                ["0", "Followers"],
              ].map(([n, l]) => (
                <div
                  key={l}
                  style={{
                    textAlign: "center",
                    background: "var(--bg3)",
                    padding: "0.75rem",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--ff-display)",
                      fontSize: "1.4rem",
                      color: "var(--gold)",
                      lineHeight: 1,
                    }}
                  >
                    {n}
                  </div>
                  <div
                    style={{
                      fontSize: "0.52rem",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "var(--muted)",
                      marginTop: "0.15rem",
                    }}
                  >
                    {l}
                  </div>
                </div>
              ))
            ) : (
              <div
                style={{
                  gridColumn: "1/-1",
                  textAlign: "center",
                  padding: "0.5rem",
                }}
              >
                <Link
                  href="/auth"
                  style={{
                    fontSize: "0.65rem",
                    color: "var(--gold)",
                    textDecoration: "none",
                    letterSpacing: "0.1em",
                  }}
                >
                  Sign in to see your stats →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Trending */}
        <div
          style={{
            background: "var(--bg2)",
            border: "0.5px solid var(--border)",
            padding: "1.25rem",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -1,
              left: -1,
              width: 10,
              height: 10,
              borderTop: "1px solid var(--gold3)",
              borderLeft: "1px solid var(--gold3)",
            }}
          />
          <div
            style={{
              fontSize: "0.55rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "var(--gold)",
              marginBottom: "1rem",
            }}
          >
            Trending This Week
          </div>
          {TRENDING.map((t, i) => (
            <div
              key={t.name}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.45rem 0",
                borderBottom:
                  i < TRENDING.length - 1
                    ? "0.5px solid var(--border2)"
                    : "none",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--ff-display)",
                  fontSize: "1rem",
                  color: "var(--muted)",
                  width: 18,
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </div>
              <div style={{ flex: 1, marginLeft: "0.5rem" }}>
                <div
                  style={{
                    fontSize: "0.55rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "var(--gold)",
                  }}
                >
                  {t.brand}
                </div>
                <div
                  style={{
                    fontFamily: "var(--ff-display)",
                    fontSize: "0.8rem",
                    color: "var(--text)",
                  }}
                >
                  {t.name}
                </div>
              </div>
              <div
                style={{
                  fontSize: "0.58rem",
                  color: "var(--muted)",
                  whiteSpace: "nowrap",
                }}
              >
                {t.logs} logs
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
