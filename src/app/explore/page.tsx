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
  "#C9A84C",
  "#9B7DC4",
  "#C4A882",
  "#7A9BC4",
  "#B8C4D0",
  "#D4A847",
  "#A89060",
  "#C9A84C",
];
const HOURS = [120, 60, 170, 320, 30, 220, 80, 260, 140, 340, 40, 200];
const MINS = [200, 300, 40, 90, 150, 140, 250, 360, 60, 100, 220, 280];

const BRANDS = [
  "All Brands",
  "Rolex",
  "Omega",
  "Patek Philippe",
  "Audemars Piguet",
  "IWC",
  "Grand Seiko",
  "Tudor",
  "Cartier",
  "Jaeger-LeCoultre",
];
const CATS = [
  "Dress Watch",
  "Diver",
  "Chronograph",
  "Pilot",
  "Field Watch",
  "Vintage",
];
const MOVS = ["Automatic", "Manual Wind", "Quartz", "Spring Drive"];
const SIZES = ["Under 38mm", "38–40mm", "40–42mm", "42mm+"];

export default function ExplorePage() {
  const [watches, setWatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("All Brands");
  const [sortBy, setSortBy] = useState("brand");

  useEffect(() => {
    const supabase = createClient();
    let query = supabase.from("watches").select("*");
    if (brand !== "All Brands") query = query.eq("brand", brand);
    if (search)
      query = query.or(
        `brand.ilike.%${search}%,model.ilike.%${search}%,reference.ilike.%${search}%`,
      );
    query.order(sortBy).then(({ data }) => {
      setWatches(data || []);
      setLoading(false);
    });
  }, [brand, search, sortBy]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e, i) => {
          if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add("visible"), i * 60);
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 },
    );
    document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [watches]);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "220px 1fr",
        minHeight: "calc(100vh - 60px)",
      }}
    >
      {/* SIDEBAR */}
      <aside
        style={{
          borderRight: "0.5px solid var(--border)",
          padding: "2rem 1.5rem",
          position: "sticky",
          top: 60,
          height: "calc(100vh - 60px)",
          overflowY: "auto",
        }}
      >
        {[{ label: "Brand", items: BRANDS, state: brand, set: setBrand }].map(
          ({ label, items, state, set }) => (
            <div key={label} style={{ marginBottom: "2rem" }}>
              <div
                style={{
                  fontSize: "0.52rem",
                  fontWeight: 400,
                  letterSpacing: "0.35em",
                  textTransform: "uppercase",
                  color: "var(--gold)",
                  marginBottom: "0.875rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                {label}
                <div
                  style={{
                    flex: 1,
                    height: "0.5px",
                    background: "var(--border2)",
                  }}
                />
              </div>
              {items.map((item) => (
                <button
                  key={item}
                  onClick={() => set(item)}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    background:
                      state === item ? "rgba(201,168,76,0.05)" : "none",
                    border: "none",
                    color: state === item ? "var(--gold)" : "var(--muted)",
                    fontFamily: "var(--ff-body)",
                    fontSize: "0.75rem",
                    fontWeight: 300,
                    padding: "0.4rem 0.5rem",
                    cursor: "pointer",
                    transition: "color 0.15s",
                    letterSpacing: "0.05em",
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          ),
        )}

        {[
          { label: "Category", items: CATS },
          { label: "Movement", items: MOVS },
          { label: "Case Size", items: SIZES },
        ].map(({ label, items }) => (
          <div key={label} style={{ marginBottom: "2rem" }}>
            <div
              style={{
                fontSize: "0.52rem",
                fontWeight: 400,
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                color: "var(--gold)",
                marginBottom: "0.875rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              {label}
              <div
                style={{
                  flex: 1,
                  height: "0.5px",
                  background: "var(--border2)",
                }}
              />
            </div>
            {items.map((item) => (
              <button
                key={item}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  background: "none",
                  border: "none",
                  color: "var(--muted)",
                  fontFamily: "var(--ff-body)",
                  fontSize: "0.75rem",
                  fontWeight: 300,
                  padding: "0.4rem 0.5rem",
                  cursor: "pointer",
                  letterSpacing: "0.05em",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--text)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--muted)")
                }
              >
                {item}
              </button>
            ))}
          </div>
        ))}

        <div style={{ marginBottom: "2rem" }}>
          <div
            style={{
              fontSize: "0.52rem",
              fontWeight: 400,
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "var(--gold)",
              marginBottom: "0.875rem",
            }}
          >
            Price (£)
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input
              type="number"
              placeholder="Min"
              style={{
                flex: 1,
                background: "var(--bg2)",
                border: "0.5px solid var(--border)",
                color: "var(--text)",
                padding: "0.4rem 0.6rem",
                fontSize: "0.72rem",
                fontFamily: "var(--ff-body)",
                outline: "none",
                width: "100%",
              }}
            />
            <input
              type="number"
              placeholder="Max"
              style={{
                flex: 1,
                background: "var(--bg2)",
                border: "0.5px solid var(--border)",
                color: "var(--text)",
                padding: "0.4rem 0.6rem",
                fontSize: "0.72rem",
                fontFamily: "var(--ff-body)",
                outline: "none",
                width: "100%",
              }}
            />
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ padding: "2rem 2.5rem", paddingBottom: "3rem" }}>
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
            Browse{" "}
            <em style={{ fontStyle: "italic", color: "var(--gold)" }}>
              Watches
            </em>
          </h1>
          <div
            style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}
          >
            <input
              type="text"
              placeholder="Search watches..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                background: "var(--bg2)",
                border: "0.5px solid var(--border)",
                color: "var(--text)",
                padding: "0.45rem 1rem",
                fontFamily: "var(--ff-body)",
                fontSize: "0.78rem",
                outline: "none",
                width: 200,
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--gold)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                background: "var(--bg2)",
                border: "0.5px solid var(--border)",
                color: "var(--muted)",
                padding: "0.4rem 0.75rem",
                fontFamily: "var(--ff-body)",
                fontSize: "0.72rem",
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="brand">Sort: Brand A–Z</option>
              <option value="model">Sort: Model A–Z</option>
              <option value="rrp_gbp">Sort: Price Low–High</option>
            </select>
          </div>
        </div>

        {/* deco rule */}
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

        <p
          style={{
            fontSize: "0.7rem",
            color: "var(--muted)",
            marginBottom: "1.25rem",
            letterSpacing: "0.05em",
          }}
        >
          <strong style={{ color: "var(--text)" }}>{watches.length}</strong>{" "}
          watches found
        </p>

        {loading ? (
          <p
            style={{
              color: "var(--muted)",
              fontFamily: "var(--ff-display)",
              fontStyle: "italic",
            }}
          >
            Loading the archive...
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(175px,1fr))",
              gap: "1px",
              background: "var(--border2)",
            }}
          >
            {watches.map((w, idx) => (
              <Link
                key={w.id}
                href={`/watch/${w.id}`}
                style={{ textDecoration: "none" }}
              >
                <div
                  className="reveal"
                  style={{
                    background: "var(--bg)",
                    padding: "1.5rem 1.25rem",
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
                      marginBottom: "1rem",
                    }}
                  >
                    <WatchFace
                      size={72}
                      hourDeg={HOURS[idx % HOURS.length]}
                      minuteDeg={MINS[idx % MINS.length]}
                      borderColor={COLORS[idx % COLORS.length]}
                    />
                  </div>
                  <div
                    style={{
                      fontSize: "0.55rem",
                      fontWeight: 400,
                      letterSpacing: "0.28em",
                      textTransform: "uppercase",
                      color: "var(--gold)",
                      marginBottom: "0.2rem",
                    }}
                  >
                    {w.brand}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--ff-display)",
                      fontSize: "0.9rem",
                      fontWeight: 400,
                      color: "var(--text)",
                      marginBottom: "0.3rem",
                      lineHeight: 1.2,
                    }}
                  >
                    {w.model}
                  </div>
                  <div
                    style={{
                      fontSize: "0.6rem",
                      color: "var(--muted)",
                      marginBottom: "0.4rem",
                    }}
                  >
                    {w.reference}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 2,
                      justifyContent: "center",
                      marginBottom: "0.4rem",
                    }}
                  >
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="star" />
                    ))}
                  </div>
                  {w.rrp_gbp && (
                    <div
                      style={{
                        fontSize: "0.6rem",
                        color: "var(--muted)",
                        letterSpacing: "0.08em",
                      }}
                    >
                      £{w.rrp_gbp.toLocaleString()}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
