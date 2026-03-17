"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import WatchFace from "@/components/WatchFace";

const COLORS = [
  "#C9A84C",
  "#4A7C6E",
  "#C9A84C",
  "#9B7DC4",
  "#7A9BC4",
  "#6B9FBD",
  "#C4A882",
  "#B8C4D0",
];
const HOURS = [120, 170, 30, 220, 260, 60, 80, 140];
const MINS = [200, 40, 150, 140, 360, 300, 250, 60];

const MOCK_COLLECTION = [
  { brand: "Rolex", name: "Sub Date", stars: 5 },
  { brand: "Grand Seiko", name: "SBGA211", stars: 5 },
  { brand: "Tudor", name: "Black Bay 58", stars: 5 },
  { brand: "IWC", name: "Portugieser", stars: 4 },
  { brand: "JLC", name: "Reverso", stars: 5 },
  { brand: "Omega", name: "Speedmaster", stars: 4 },
  { brand: "Cartier", name: "Santos", stars: 4 },
  { brand: "AP", name: "Royal Oak", stars: 5 },
];

const MOCK_ACTIVITY = [
  {
    text: "Logged",
    watch: "Grand Seiko SBGA211",
    suffix: "— ★★★★★",
    time: "2 days ago",
  },
  {
    text: "Added",
    watch: "JLC Reverso",
    suffix: "to wishlist",
    time: "4 days ago",
  },
  {
    text: "Created list",
    watch: '"Tool Watches Worth Owning"',
    suffix: "",
    time: "1 week ago",
  },
  { text: "Followed", watch: "@arjun_v", suffix: "", time: "1 week ago" },
  {
    text: "Reviewed",
    watch: "Tudor Black Bay 58",
    suffix: "— ★★★★★",
    time: "2 weeks ago",
  },
];

export default function ProfilePage() {
  const [tab, setTab] = useState("collection");
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [tags, setTags] = useState(["Divers", "Grand Seiko", "Tool Watches"]);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user);
      if (data.user) {
        const { data: p } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single();
        setProfile(p);
      }
    });
  }, []);

  const displayName =
    profile?.full_name || user?.user_metadata?.full_name || "Collector";
  const displayHandle = profile?.username
    ? `@${profile.username}`
    : user?.email?.split("@")[0] || "member";

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
        padding: "0.75rem 1rem",
        cursor: "pointer",
        transition: "color 0.2s, border-color 0.2s",
      }}
    >
      {label}
    </button>
  );

  if (!user)
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          gap: "1rem",
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
          You need to be signed in to view your profile.
        </p>
        <Link href="/auth" className="btn-primary">
          Enter the List
        </Link>
      </div>
    );

  return (
    <>
      {/* Profile Hero */}
      <div
        style={{
          background: "var(--bg2)",
          borderBottom: "0.5px solid var(--border)",
          padding: "3rem 2.5rem 0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            right: -50,
            transform: "translateY(-50%)",
            width: 400,
            height: 400,
            background:
              "radial-gradient(circle,rgba(201,168,76,0.04) 0%,transparent 65%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: "2rem",
            marginBottom: "2rem",
          }}
        >
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: "50%",
              background: "var(--bg3)",
              border: "1px solid var(--gold)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--ff-display)",
              fontSize: "2rem",
              color: "var(--gold)",
              flexShrink: 0,
            }}
          >
            {displayName
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)}
          </div>
          <div style={{ flex: 1 }}>
            <h1
              style={{
                fontFamily: "var(--ff-display)",
                fontSize: "2.2rem",
                fontWeight: 300,
                marginBottom: "0.2rem",
              }}
            >
              {displayName}
            </h1>
            <div
              style={{
                fontSize: "0.62rem",
                color: "var(--muted)",
                letterSpacing: "0.12em",
                marginBottom: "0.625rem",
              }}
            >
              {displayHandle} · Member since 2025
            </div>
            <p
              style={{
                fontFamily: "var(--ff-display)",
                fontStyle: "italic",
                fontSize: "0.9rem",
                color: "var(--muted)",
                maxWidth: 480,
                marginBottom: "0.625rem",
                lineHeight: 1.7,
              }}
            >
              {profile?.bio ||
                "Collector of fine timepieces. Add a bio in your settings."}
            </p>
            <div
              style={{
                fontSize: "0.6rem",
                color: "var(--muted)",
                letterSpacing: "0.15em",
              }}
            >
              <span style={{ color: "var(--gold3)", marginRight: "0.3rem" }}>
                ✦
              </span>
              {profile?.location || "Location not set"}
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.625rem" }}>
            <Link
              href="/log"
              style={{
                background: "var(--gold)",
                color: "var(--bg)",
                border: "none",
                padding: "0.5rem 1.5rem",
                fontFamily: "var(--ff-body)",
                fontSize: "0.62rem",
                fontWeight: 600,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              + Log Watch
            </Link>
          </div>
        </div>

        {/* Stats strip */}
        <div
          style={{ display: "flex", borderTop: "0.5px solid var(--border)" }}
        >
          {[
            ["0", "Owned"],
            ["0", "Worn"],
            ["0", "Reviews"],
            ["0", "Lists"],
            ["0", "Followers"],
            ["0", "Following"],
          ].map(([n, l]) => (
            <div
              key={l}
              style={{
                flex: 1,
                textAlign: "center",
                padding: "1.25rem 0",
                borderRight: "0.5px solid var(--border2)",
                cursor: "pointer",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(201,168,76,0.03)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <div
                style={{
                  fontFamily: "var(--ff-display)",
                  fontSize: "1.8rem",
                  color: "var(--gold)",
                  lineHeight: 1,
                }}
              >
                {n}
              </div>
              <div
                style={{
                  fontSize: "0.55rem",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                  marginTop: "0.2rem",
                }}
              >
                {l}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Body */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 260px",
          gap: "2rem",
          padding: "2rem 2.5rem",
          alignItems: "start",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              borderBottom: "0.5px solid var(--border)",
              marginBottom: "1.5rem",
            }}
          >
            {tabBtn("collection", "Collection")}
            {tabBtn("activity", "Activity")}
            {tabBtn("reviews", "Reviews")}
            {tabBtn("lists", "Lists")}
          </div>

          {tab === "collection" && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))",
                gap: "1px",
                background: "var(--border2)",
              }}
            >
              {MOCK_COLLECTION.map((w, idx) => (
                <Link
                  key={idx}
                  href="/explore"
                  style={{ textDecoration: "none" }}
                >
                  <div
                    style={{
                      background: "var(--bg)",
                      padding: "1.25rem 1rem",
                      textAlign: "center",
                      cursor: "pointer",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "var(--bg2)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "var(--bg)")
                    }
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        marginBottom: "0.75rem",
                      }}
                    >
                      <WatchFace
                        size={64}
                        hourDeg={HOURS[idx % HOURS.length]}
                        minuteDeg={MINS[idx % MINS.length]}
                        borderColor={COLORS[idx % COLORS.length]}
                      />
                    </div>
                    <div
                      style={{
                        fontSize: "0.52rem",
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        color: "var(--gold)",
                        marginBottom: "0.15rem",
                      }}
                    >
                      {w.brand}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--ff-display)",
                        fontSize: "0.82rem",
                        color: "var(--text)",
                        lineHeight: 1.2,
                      }}
                    >
                      {w.name}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: 1.5,
                        justifyContent: "center",
                        marginTop: "0.35rem",
                      }}
                    >
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          style={{
                            width: 7,
                            height: 7,
                            background:
                              i < w.stars ? "var(--gold)" : "transparent",
                            clipPath:
                              i < w.stars
                                ? "polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)"
                                : "none",
                            border:
                              i < w.stars ? "none" : "0.5px solid var(--gold3)",
                            borderRadius: i < w.stars ? 0 : "50%",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {tab === "activity" && (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {MOCK_ACTIVITY.map((a, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: "1rem",
                    padding: "1rem 0",
                    borderBottom: "0.5px solid var(--border2)",
                  }}
                >
                  <div
                    style={{
                      width: 7,
                      height: 7,
                      background: "var(--gold)",
                      transform: "rotate(45deg)",
                      flexShrink: 0,
                      marginTop: 5,
                    }}
                  />
                  <div>
                    <div
                      style={{
                        fontSize: "0.8rem",
                        color: "var(--muted)",
                        lineHeight: 1.6,
                      }}
                    >
                      {a.text}{" "}
                      <span
                        style={{
                          color: "var(--gold)",
                          fontFamily: "var(--ff-display)",
                          fontStyle: "italic",
                        }}
                      >
                        {a.watch}
                      </span>{" "}
                      {a.suffix}
                    </div>
                    <div
                      style={{
                        fontSize: "0.6rem",
                        color: "var(--muted)",
                        opacity: 0.5,
                        marginTop: "0.2rem",
                      }}
                    >
                      {a.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "reviews" && (
            <p
              style={{
                fontFamily: "var(--ff-display)",
                fontStyle: "italic",
                color: "var(--muted)",
                fontSize: "0.95rem",
                lineHeight: 1.8,
              }}
            >
              No reviews written yet.{" "}
              <Link href="/explore" style={{ color: "var(--gold)" }}>
                Browse watches
              </Link>{" "}
              to start reviewing.
            </p>
          )}

          {tab === "lists" && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))",
                gap: "1px",
                background: "var(--border2)",
              }}
            >
              {[{ name: "My WatchList", count: 0 }].map((l) => (
                <div
                  key={l.name}
                  style={{
                    background: "var(--bg)",
                    padding: "1.25rem",
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--bg2)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "var(--bg)")
                  }
                >
                  <div
                    style={{
                      fontFamily: "var(--ff-display)",
                      fontSize: "0.95rem",
                      color: "var(--text)",
                      marginBottom: "0.3rem",
                    }}
                  >
                    {l.name}
                  </div>
                  <div style={{ fontSize: "0.62rem", color: "var(--muted)" }}>
                    {l.count} watches · Public
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div>
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
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "var(--gold)",
                marginBottom: "0.875rem",
              }}
            >
              Collection Tags
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
              {[
                "Divers",
                "Dress",
                "Chronographs",
                "Grand Seiko",
                "Vintage",
                "Tool Watches",
              ].map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontSize: "0.55rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    border: `0.5px solid ${tags.includes(tag) ? "var(--gold3)" : "var(--border)"}`,
                    padding: "0.2rem 0.5rem",
                    color: tags.includes(tag) ? "var(--gold)" : "var(--muted)",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onClick={() =>
                    setTags((prev) =>
                      prev.includes(tag)
                        ? prev.filter((t) => t !== tag)
                        : [...prev, tag],
                    )
                  }
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

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
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "var(--gold)",
                marginBottom: "0.875rem",
              }}
            >
              Avg. Rating Given
            </div>
            <div
              style={{
                fontFamily: "var(--ff-display)",
                fontSize: "3rem",
                color: "var(--gold)",
                lineHeight: 1,
              }}
            >
              —
            </div>
            <div
              style={{
                fontSize: "0.55rem",
                color: "var(--muted)",
                marginTop: "0.3rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
              }}
            >
              No reviews yet
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
