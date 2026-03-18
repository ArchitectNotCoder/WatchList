"use client";
import { useEffect, useState, useCallback } from "react";
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
  "Breitling",
  "Panerai",
  "Hublot",
  "Seiko",
  "Longines",
  "Tissot",
  "TAG Heuer",
  "Hamilton",
  "Nomos",
  "Zenith",
  "Oris",
  "Rado",
  "Citizen",
  "Casio",
  "Titan",
  "HMT",
  "Sonata",
  "Fastrack",
  "Timex",
  "Orient",
  "Fossil",
  "Sinn",
  "Vacheron Constantin",
  "A. Lange & Söhne",
];
const CATS = [
  "All Categories",
  "Dress Watch",
  "Diver",
  "Chronograph",
  "Pilot",
  "Field Watch",
  "Sport",
  "Vintage",
];
const MOVS = [
  "All Movements",
  "Automatic",
  "Manual Wind",
  "Quartz",
  "Spring Drive",
  "Solar",
  "Hybrid Smartwatch",
];
const SIZES = ["All Sizes", "Under 38mm", "38–40mm", "40–42mm", "42mm+"];
const SORTS = ["brand", "model", "rrp_gbp"];
const SORT_LABELS: Record<string, string> = {
  brand: "Sort: Brand A–Z",
  model: "Sort: Model A–Z",
  rrp_gbp: "Sort: Price Low–High",
};

export default function ExplorePage() {
  const [watches, setWatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  // Filters
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("All Brands");
  const [category, setCategory] = useState("All Categories");
  const [movement, setMovement] = useState("All Movements");
  const [caseSize, setCaseSize] = useState("All Sizes");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("brand");
  const [page, setPage] = useState(0);
  const PER_PAGE = 24;

  const fetchWatches = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    let query = supabase.from("watches").select("*", { count: "exact" });

    if (brand !== "All Brands") query = query.eq("brand", brand);
    if (category !== "All Categories") query = query.eq("category", category);
    if (movement !== "All Movements")
      query = query.ilike("movement", `%${movement}%`);

    // Case size filter
    if (caseSize === "Under 38mm") query = query.lt("case_size", "38");
    else if (caseSize === "38–40mm")
      query = query.gte("case_size", "38").lte("case_size", "40");
    else if (caseSize === "40–42mm")
      query = query.gte("case_size", "40").lte("case_size", "42");
    else if (caseSize === "42mm+") query = query.gt("case_size", "42");

    // Price filter
    if (minPrice) query = query.gte("rrp_gbp", parseFloat(minPrice));
    if (maxPrice) query = query.lte("rrp_gbp", parseFloat(maxPrice));

    // Search
    if (search)
      query = query.or(
        `brand.ilike.%${search}%,model.ilike.%${search}%,reference.ilike.%${search}%`,
      );

    query = query
      .order(sortBy, { nullsFirst: false })
      .range(page * PER_PAGE, (page + 1) * PER_PAGE - 1);

    const { data, count } = await query;
    setWatches(data || []);
    setTotal(count || 0);
    setLoading(false);
  }, [
    brand,
    category,
    movement,
    caseSize,
    minPrice,
    maxPrice,
    search,
    sortBy,
    page,
  ]);

  useEffect(() => {
    fetchWatches();
  }, [fetchWatches]);

  // Reset page when filters change
  useEffect(() => {
    setPage(0);
  }, [brand, category, movement, caseSize, minPrice, maxPrice, search, sortBy]);

  // Scroll reveal
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e, i) => {
          if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add("visible"), i * 40);
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.05 },
    );
    document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [watches]);

  const totalPages = Math.ceil(total / PER_PAGE);

  const sideLabel = (text: string) => (
    <div
      style={{
        fontSize: "0.52rem",
        fontWeight: 400,
        letterSpacing: "0.35em",
        textTransform: "uppercase" as const,
        color: "var(--gold)",
        marginBottom: "0.875rem",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
      }}
    >
      {text}
      <div style={{ flex: 1, height: "0.5px", background: "var(--border2)" }} />
    </div>
  );

  const filterBtn = (label: string, active: boolean, onClick: () => void) => (
    <button
      key={label}
      onClick={onClick}
      style={{
        display: "block",
        width: "100%",
        textAlign: "left",
        background: active ? "rgba(201,168,76,0.06)" : "none",
        border: "none",
        color: active ? "var(--gold)" : "var(--muted)",
        fontFamily: "var(--ff-body)",
        fontSize: "0.75rem",
        fontWeight: 300,
        padding: "0.4rem 0.5rem",
        cursor: "pointer",
        transition: "color 0.15s",
        letterSpacing: "0.05em",
        borderLeft: active ? "2px solid var(--gold)" : "2px solid transparent",
      }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.color = "var(--text)";
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.color = "var(--muted)";
      }}
    >
      {label}
    </button>
  );

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "240px 1fr",
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
        <div style={{ marginBottom: "2rem" }}>
          {sideLabel("Brand")}
          {BRANDS.map((b) => filterBtn(b, brand === b, () => setBrand(b)))}
        </div>

        <div style={{ marginBottom: "2rem" }}>
          {sideLabel("Category")}
          {CATS.map((c) => filterBtn(c, category === c, () => setCategory(c)))}
        </div>

        <div style={{ marginBottom: "2rem" }}>
          {sideLabel("Movement")}
          {MOVS.map((m) => filterBtn(m, movement === m, () => setMovement(m)))}
        </div>

        <div style={{ marginBottom: "2rem" }}>
          {sideLabel("Case Size")}
          {SIZES.map((s) => filterBtn(s, caseSize === s, () => setCaseSize(s)))}
        </div>

        <div style={{ marginBottom: "2rem" }}>
          {sideLabel("Price (£)")}
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
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
              onFocus={(e) => (e.target.style.borderColor = "var(--gold)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
            />
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
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
              onFocus={(e) => (e.target.style.borderColor = "var(--gold)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
            />
          </div>
        </div>

        {/* Reset button */}
        <button
          onClick={() => {
            setBrand("All Brands");
            setCategory("All Categories");
            setMovement("All Movements");
            setCaseSize("All Sizes");
            setMinPrice("");
            setMaxPrice("");
            setSearch("");
            setSortBy("brand");
          }}
          style={{
            width: "100%",
            background: "transparent",
            border: "0.5px solid var(--border)",
            color: "var(--muted)",
            padding: "0.5rem",
            fontFamily: "var(--ff-body)",
            fontSize: "0.6rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--gold)";
            e.currentTarget.style.color = "var(--gold)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.color = "var(--muted)";
          }}
        >
          ✕ Reset Filters
        </button>
      </aside>

      {/* MAIN */}
      <main style={{ padding: "2rem 2.5rem", paddingBottom: "3rem" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            marginBottom: "0.5rem",
            flexWrap: "wrap",
            gap: "0.75rem",
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
            style={{
              display: "flex",
              gap: "0.75rem",
              alignItems: "center",
              flexWrap: "wrap",
            }}
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
                width: 220,
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
              {SORTS.map((s) => (
                <option key={s} value={s}>
                  {SORT_LABELS[s]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Deco */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "1rem",
          }}
        >
          <div
            style={{ height: "0.5px", background: "var(--border2)", width: 24 }}
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
            style={{ height: "0.5px", background: "var(--border2)", flex: 1 }}
          />
        </div>

        {/* Active filters */}
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            flexWrap: "wrap",
            marginBottom: "1rem",
          }}
        >
          {[
            brand !== "All Brands" && brand,
            category !== "All Categories" && category,
            movement !== "All Movements" && movement,
            caseSize !== "All Sizes" && caseSize,
            (minPrice || maxPrice) &&
              `£${minPrice || "0"} – £${maxPrice || "∞"}`,
          ]
            .filter(Boolean)
            .map((tag: any) => (
              <div
                key={tag}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  background: "rgba(201,168,76,0.06)",
                  border: "0.5px solid var(--border)",
                  color: "var(--gold)",
                  padding: "0.25rem 0.625rem",
                  fontSize: "0.6rem",
                  letterSpacing: "0.1em",
                }}
              >
                {tag}
                <span
                  style={{
                    cursor: "pointer",
                    opacity: 0.7,
                    fontSize: "0.65rem",
                  }}
                  onClick={() => {
                    if (tag === brand) setBrand("All Brands");
                    else if (tag === category) setCategory("All Categories");
                    else if (tag === movement) setMovement("All Movements");
                    else if (tag === caseSize) setCaseSize("All Sizes");
                    else {
                      setMinPrice("");
                      setMaxPrice("");
                    }
                  }}
                >
                  ✕
                </span>
              </div>
            ))}
        </div>

        {/* Count */}
        <p
          style={{
            fontSize: "0.7rem",
            color: "var(--muted)",
            marginBottom: "1.25rem",
            letterSpacing: "0.05em",
          }}
        >
          <strong style={{ color: "var(--text)" }}>
            {total.toLocaleString()}
          </strong>{" "}
          watches found
          {totalPages > 1 && (
            <span>
              {" "}
              · Page {page + 1} of {totalPages}
            </span>
          )}
        </p>

        {/* Grid */}
        {loading ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 300,
            }}
          >
            <p
              style={{
                fontFamily: "var(--ff-display)",
                fontStyle: "italic",
                color: "var(--muted)",
                fontSize: "1.1rem",
              }}
            >
              Loading the archive...
            </p>
          </div>
        ) : watches.length === 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 300,
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
              No watches found.
            </p>
            <button
              onClick={() => {
                setBrand("All Brands");
                setCategory("All Categories");
                setMovement("All Movements");
                setCaseSize("All Sizes");
                setMinPrice("");
                setMaxPrice("");
                setSearch("");
              }}
              style={{
                background: "transparent",
                border: "0.5px solid var(--gold)",
                color: "var(--gold)",
                padding: "0.5rem 1.25rem",
                fontFamily: "var(--ff-body)",
                fontSize: "0.62rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              Reset Filters
            </button>
          </div>
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
                    position: "relative",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--bg2)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "var(--bg)")
                  }
                >
                  {/* Category badge */}
                  {w.category && (
                    <div
                      style={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        fontSize: "0.48rem",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        border: "0.5px solid var(--border2)",
                        padding: "0.1rem 0.35rem",
                        color: "var(--muted)",
                      }}
                    >
                      {w.category}
                    </div>
                  )}

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
                      fontSize: "0.58rem",
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
                      marginBottom: "0.35rem",
                    }}
                  >
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="star" />
                    ))}
                  </div>
                  {w.rrp_gbp && (
                    <div
                      style={{
                        fontSize: "0.58rem",
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.4rem",
              marginTop: "2.5rem",
            }}
          >
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              style={{
                background: "none",
                border: "0.5px solid var(--border)",
                color: page === 0 ? "var(--muted)" : "var(--text)",
                width: 32,
                height: 32,
                cursor: page === 0 ? "not-allowed" : "pointer",
                fontFamily: "var(--ff-body)",
                fontSize: "0.82rem",
                opacity: page === 0 ? 0.4 : 1,
              }}
            >
              ‹
            </button>
            {[...Array(Math.min(totalPages, 7))].map((_, i) => {
              const pageNum =
                totalPages <= 7
                  ? i
                  : i === 0
                    ? 0
                    : i === 6
                      ? totalPages - 1
                      : page - 2 + i;
              if (pageNum < 0 || pageNum >= totalPages) return null;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  style={{
                    background: "none",
                    border: `0.5px solid ${page === pageNum ? "var(--gold)" : "var(--border)"}`,
                    color: page === pageNum ? "var(--gold)" : "var(--muted)",
                    width: 32,
                    height: 32,
                    cursor: "pointer",
                    fontFamily: "var(--ff-body)",
                    fontSize: "0.75rem",
                  }}
                >
                  {pageNum + 1}
                </button>
              );
            })}
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              style={{
                background: "none",
                border: "0.5px solid var(--border)",
                color: page === totalPages - 1 ? "var(--muted)" : "var(--text)",
                width: 32,
                height: 32,
                cursor: page === totalPages - 1 ? "not-allowed" : "pointer",
                fontFamily: "var(--ff-body)",
                fontSize: "0.82rem",
                opacity: page === totalPages - 1 ? 0.4 : 1,
              }}
            >
              ›
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
