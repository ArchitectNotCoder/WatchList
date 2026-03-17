"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

const MOCK_MEMBERS = [
  {
    initials: "MK",
    name: "Marcus K.",
    handle: "@marcus_ticks",
    location: "London",
    owned: 34,
    reviews: 18,
    followers: 206,
    tags: ["Divers", "Grand Seiko", "Tool Watches"],
  },
  {
    initials: "AV",
    name: "Arjun V.",
    handle: "@arjun_v",
    location: "Mumbai",
    owned: 312,
    reviews: 89,
    followers: 1204,
    tags: ["Vintage", "Dress", "Chronographs"],
  },
  {
    initials: "SM",
    name: "Sana M.",
    handle: "@sana.m",
    location: "Dubai",
    owned: 41,
    reviews: 22,
    followers: 387,
    tags: ["Dress", "Cartier", "Luxury"],
  },
  {
    initials: "JP",
    name: "James P.",
    handle: "@jakep",
    location: "New York",
    owned: 87,
    reviews: 54,
    followers: 892,
    tags: ["Pilots", "Chronographs", "IWC"],
  },
  {
    initials: "RK",
    name: "Rohan K.",
    handle: "@rohan_k",
    location: "London",
    owned: 12,
    reviews: 8,
    followers: 143,
    tags: ["Divers", "Tudor", "Rolex"],
  },
  {
    initials: "LC",
    name: "Lena C.",
    handle: "@lena_collects",
    location: "Paris",
    owned: 28,
    reviews: 31,
    followers: 567,
    tags: ["Dress", "Vintage", "JLC"],
  },
];

export default function MembersPage() {
  const [search, setSearch] = useState("");
  const [members, setMembers] = useState(MOCK_MEMBERS);
  const [followed, setFollowed] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (search) {
      setMembers(
        MOCK_MEMBERS.filter(
          (m) =>
            m.name.toLowerCase().includes(search.toLowerCase()) ||
            m.handle.toLowerCase().includes(search.toLowerCase()) ||
            m.location.toLowerCase().includes(search.toLowerCase()),
        ),
      );
    } else {
      setMembers(MOCK_MEMBERS);
    }
  }, [search]);

  const toggleFollow = (handle: string) => {
    setFollowed((prev) => {
      const next = new Set(prev);
      next.has(handle) ? next.delete(handle) : next.add(handle);
      return next;
    });
  };

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "3rem 2rem" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <p
          style={{
            fontFamily: "var(--ff-body)",
            fontSize: "0.55rem",
            fontWeight: 100,
            letterSpacing: "0.45em",
            textTransform: "uppercase",
            color: "var(--gold)",
            marginBottom: "0.875rem",
          }}
        >
          The Society
        </p>
        <h1
          style={{
            fontFamily: "var(--ff-display)",
            fontSize: "clamp(2rem,4vw,3rem)",
            fontWeight: 300,
            color: "var(--text)",
          }}
        >
          Meet the{" "}
          <em style={{ fontStyle: "italic", color: "var(--gold)" }}>
            Collectors.
          </em>
        </h1>
        <div
          style={{
            margin: "1.5rem auto",
            maxWidth: 280,
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              flex: 1,
              height: "0.5px",
              background: "rgba(201,168,76,0.35)",
            }}
          />
          <div
            style={{
              width: 4,
              height: 4,
              border: "0.5px solid var(--gold3)",
              transform: "rotate(45deg)",
            }}
          />
          <div
            style={{
              width: 7,
              height: 7,
              background: "var(--gold)",
              transform: "rotate(45deg)",
            }}
          />
          <div
            style={{
              width: 4,
              height: 4,
              border: "0.5px solid var(--gold3)",
              transform: "rotate(45deg)",
            }}
          />
          <div
            style={{
              flex: 1,
              height: "0.5px",
              background: "rgba(201,168,76,0.35)",
            }}
          />
        </div>
        <input
          type="text"
          placeholder="Search members..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            background: "var(--bg2)",
            border: "0.5px solid var(--border)",
            color: "var(--text)",
            padding: "0.75rem 1.5rem",
            fontFamily: "var(--ff-body)",
            fontSize: "0.82rem",
            outline: "none",
            width: "100%",
            maxWidth: 400,
          }}
          onFocus={(e) => (e.target.style.borderColor = "var(--gold)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
        />
      </div>

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
          gap: "1px",
          background: "var(--border2)",
        }}
      >
        {members.map((m) => (
          <div
            key={m.handle}
            style={{
              background: "var(--bg)",
              padding: "1.75rem",
              position: "relative",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "var(--bg2)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "var(--bg)")
            }
          >
            {/* corner deco */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: 12,
                height: 12,
                borderTop: "1px solid transparent",
                borderLeft: "1px solid transparent",
                transition: "border-color 0.3s",
              }}
            />

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "1.25rem",
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  background: "var(--bg3)",
                  border: "1px solid var(--gold3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--ff-display)",
                  fontSize: "1.1rem",
                  color: "var(--gold)",
                  flexShrink: 0,
                }}
              >
                {m.initials}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontFamily: "var(--ff-display)",
                    fontSize: "1.1rem",
                    fontWeight: 300,
                    color: "var(--text)",
                  }}
                >
                  {m.name}
                </div>
                <div
                  style={{
                    fontSize: "0.62rem",
                    color: "var(--muted)",
                    letterSpacing: "0.08em",
                  }}
                >
                  {m.handle}
                </div>
                <div
                  style={{
                    fontSize: "0.58rem",
                    color: "var(--muted)",
                    marginTop: "0.15rem",
                  }}
                >
                  <span
                    style={{ color: "var(--gold3)", marginRight: "0.3rem" }}
                  >
                    ✦
                  </span>
                  {m.location}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div
              style={{
                display: "flex",
                gap: "1.25rem",
                padding: "0.875rem 0",
                borderTop: "0.5px solid var(--border2)",
                borderBottom: "0.5px solid var(--border2)",
                marginBottom: "1rem",
              }}
            >
              {[
                ["Owned", m.owned],
                ["Reviews", m.reviews],
                ["Followers", m.followers],
              ].map(([l, n]) => (
                <div key={l}>
                  <div
                    style={{
                      fontFamily: "var(--ff-display)",
                      fontSize: "1.3rem",
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
                    }}
                  >
                    {l}
                  </div>
                </div>
              ))}
            </div>

            {/* Tags */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.35rem",
                marginBottom: "1.25rem",
              }}
            >
              {m.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontSize: "0.55rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    border: "0.5px solid var(--gold3)",
                    padding: "0.2rem 0.5rem",
                    color: "var(--gold)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                onClick={() => toggleFollow(m.handle)}
                style={{
                  flex: 1,
                  background: followed.has(m.handle)
                    ? "var(--gold4)"
                    : "transparent",
                  border: "0.5px solid var(--gold)",
                  color: "var(--gold)",
                  fontFamily: "var(--ff-body)",
                  fontSize: "0.6rem",
                  fontWeight: 600,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  padding: "0.5rem",
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
              >
                {followed.has(m.handle) ? "Following" : "Follow"}
              </button>
              <Link
                href="/profile"
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "0.5px solid var(--border)",
                  color: "var(--muted)",
                  fontFamily: "var(--ff-body)",
                  fontSize: "0.6rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  padding: "0.5rem",
                  cursor: "pointer",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--gold)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--muted)")
                }
              >
                View Profile
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
