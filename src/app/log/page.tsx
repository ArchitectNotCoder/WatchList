"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import WatchFace from "@/components/WatchFace";

export default function LogPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [watches, setWatches] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [status, setStatus] = useState("owned");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");
  const [condition, setCondition] = useState("excellent");
  const [visibility, setVisibility] = useState("public");
  const [tags, setTags] = useState<string[]>(["Diver", "Daily Wearer"]);
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  useEffect(() => {
    if (search.length < 2) {
      setWatches([]);
      setShowResults(false);
      return;
    }
    const supabase = createClient();
    supabase
      .from("watches")
      .select("*")
      .or(
        `brand.ilike.%${search}%,model.ilike.%${search}%,reference.ilike.%${search}%`,
      )
      .limit(6)
      .then(({ data }) => {
        setWatches(data || []);
        setShowResults(true);
      });
  }, [search]);

  const selectWatch = (w: any) => {
    setSelected(w);
    setSearch(`${w.brand} ${w.model}`);
    setShowResults(false);
  };

  const handleSubmit = async () => {
    if (!user || !selected) return;
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.from("collection").upsert({
      user_id: user.id,
      watch_id: selected.id,
      status,
      rating,
      review: review || null,
      condition,
      visibility,
    });
    setLoading(false);
    if (!error) {
      setSuccess(true);
      setTimeout(() => router.push("/profile"), 1500);
    }
  };

  const addTag = (e: React.KeyboardEvent) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      setTags((prev) => [...prev, tagInput.trim()]);
      setTagInput("");
    }
  };

  const input = {
    width: "100%",
    background: "var(--bg2)",
    border: "0.5px solid var(--border)",
    color: "var(--text)",
    fontFamily: "var(--ff-body)",
    fontSize: "0.875rem",
    fontWeight: 300,
    padding: "0.75rem 1rem",
    outline: "none",
  };

  const secLabel = (text: string) => (
    <div
      style={{
        fontSize: "0.55rem",
        fontWeight: 400,
        letterSpacing: "0.35em",
        textTransform: "uppercase",
        color: "var(--gold)",
        marginBottom: "1rem",
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
      }}
    >
      {text}
      <div style={{ flex: 1, height: "0.5px", background: "var(--border2)" }} />
    </div>
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
          You need to be signed in to log a watch.
        </p>
        <Link href="/auth" className="btn-primary">
          Enter the List
        </Link>
      </div>
    );

  if (success)
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
        <div
          style={{
            fontFamily: "var(--ff-display)",
            fontSize: "3rem",
            color: "var(--gold)",
          }}
        >
          ✦
        </div>
        <p
          style={{
            fontFamily: "var(--ff-display)",
            fontStyle: "italic",
            fontSize: "1.4rem",
            color: "var(--text)",
          }}
        >
          Added to your WatchList.
        </p>
        <p style={{ color: "var(--muted)", fontSize: "0.8rem" }}>
          Redirecting to your profile...
        </p>
      </div>
    );

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "3rem 2rem 5rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "3rem" }}>
        <p
          style={{
            fontFamily: "var(--ff-body)",
            fontSize: "0.55rem",
            fontWeight: 100,
            letterSpacing: "0.45em",
            textTransform: "uppercase",
            color: "var(--gold)",
            marginBottom: "0.75rem",
          }}
        >
          The Archive
        </p>
        <h1
          style={{
            fontFamily: "var(--ff-display)",
            fontSize: "2.8rem",
            fontWeight: 300,
          }}
        >
          Log a{" "}
          <em style={{ fontStyle: "italic", color: "var(--gold)" }}>Watch</em>
        </h1>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginTop: "1rem",
          }}
        >
          <div
            style={{
              height: "0.5px",
              background: "var(--border)",
              flex: 1,
              maxWidth: 36,
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
              background: "var(--border)",
              flex: 1,
              maxWidth: 36,
            }}
          />
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "2.5rem",
          alignItems: "start",
        }}
      >
        <div>
          {/* Search */}
          <div style={{ marginBottom: "2rem" }}>
            {secLabel("Find the Watch")}
            <div style={{ marginBottom: "1.25rem", position: "relative" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.58rem",
                  fontWeight: 300,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                  marginBottom: "0.5rem",
                }}
              >
                Search by Brand, Model, or Reference
              </label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="e.g. Rolex Submariner, 126610LN..."
                style={input}
                onFocus={(e) => (e.target.style.borderColor = "var(--gold)")}
                onBlur={(e) => {
                  setTimeout(() => setShowResults(false), 200);
                  e.target.style.borderColor = "var(--border)";
                }}
              />
              {showResults && watches.length > 0 && (
                <div
                  style={{
                    background: "var(--bg3)",
                    border: "0.5px solid var(--gold3)",
                    borderTop: "none",
                    position: "absolute",
                    width: "100%",
                    zIndex: 10,
                  }}
                >
                  {watches.map((w) => (
                    <div
                      key={w.id}
                      onClick={() => selectWatch(w)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        padding: "0.75rem 1rem",
                        cursor: "pointer",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "var(--bg2)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <WatchFace
                        size={28}
                        hourDeg={120}
                        minuteDeg={200}
                        borderColor="var(--gold3)"
                      />
                      <div>
                        <div
                          style={{
                            fontSize: "0.6rem",
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            color: "var(--gold)",
                          }}
                        >
                          {w.brand}
                        </div>
                        <div
                          style={{
                            fontFamily: "var(--ff-display)",
                            fontSize: "0.85rem",
                            color: "var(--text)",
                          }}
                        >
                          {w.model} — {w.reference}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Status */}
          <div style={{ marginBottom: "2rem" }}>
            {secLabel("Status")}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: "0.5rem",
              }}
            >
              {[
                ["owned", "◎ Own It"],
                ["worn", "◈ Worn It"],
                ["wanted", "◐ Want It"],
              ].map(([v, l]) => (
                <button
                  key={v}
                  onClick={() => setStatus(v)}
                  style={{
                    border: `0.5px solid ${status === v ? "var(--gold)" : "var(--border)"}`,
                    background:
                      status === v ? "rgba(201,168,76,0.08)" : "transparent",
                    color: status === v ? "var(--gold)" : "var(--muted)",
                    padding: "0.75rem",
                    textAlign: "center",
                    cursor: "pointer",
                    fontSize: "0.62rem",
                    fontWeight: 300,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    fontFamily: "var(--ff-body)",
                    transition: "all 0.2s",
                  }}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div style={{ marginBottom: "2rem" }}>
            {secLabel("Your Rating")}
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => setRating(n)}
                  onMouseEnter={() => setHoverRating(n)}
                  onMouseLeave={() => setHoverRating(0)}
                  style={{
                    width: 30,
                    height: 30,
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    transition: "transform 0.15s",
                    transform: hoverRating >= n ? "scale(1.2)" : "scale(1)",
                  }}
                >
                  <svg viewBox="0 0 24 24" width="22" height="22">
                    <polygon
                      points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
                      fill={
                        (hoverRating || rating) >= n
                          ? "var(--gold)"
                          : "transparent"
                      }
                      stroke={
                        (hoverRating || rating) >= n ? "none" : "var(--gold3)"
                      }
                      strokeWidth="1.5"
                    />
                  </svg>
                </button>
              ))}
              <span
                style={{
                  fontFamily: "var(--ff-display)",
                  fontStyle: "italic",
                  fontSize: "1rem",
                  color: "var(--gold)",
                  marginLeft: "0.5rem",
                }}
              >
                {
                  ["", "Poor", "Below Average", "Average", "Good", "Excellent"][
                    rating
                  ]
                }
              </span>
            </div>
          </div>

          {/* Review */}
          <div style={{ marginBottom: "2rem" }}>
            {secLabel("Review")}
            <div style={{ marginBottom: "1.25rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.58rem",
                  fontWeight: 300,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                  marginBottom: "0.5rem",
                }}
              >
                Write your thoughts (optional)
              </label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="How does it wear? What do you love or dislike?"
                style={{
                  ...input,
                  minHeight: 110,
                  resize: "vertical",
                  lineHeight: 1.7,
                  fontFamily: "var(--ff-display)",
                  fontStyle: "italic",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--gold)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
            </div>
          </div>

          {/* Details */}
          <div style={{ marginBottom: "2rem" }}>
            {secLabel("Details")}
            <div style={{ marginBottom: "1.25rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.58rem",
                  fontWeight: 300,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                  marginBottom: "0.5rem",
                }}
              >
                Condition
              </label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(5,1fr)",
                  gap: "0.35rem",
                }}
              >
                {["mint", "excellent", "good", "fair", "poor"].map((c) => (
                  <button
                    key={c}
                    onClick={() => setCondition(c)}
                    style={{
                      border: `0.5px solid ${condition === c ? "var(--gold)" : "var(--border)"}`,
                      background:
                        condition === c ? "rgba(201,168,76,0.08)" : "none",
                      color: condition === c ? "var(--gold)" : "var(--muted)",
                      padding: "0.45rem 0",
                      fontFamily: "var(--ff-body)",
                      fontSize: "0.58rem",
                      letterSpacing: "0.08em",
                      textTransform: "capitalize",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      textAlign: "center",
                    }}
                  >
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: "1.25rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.58rem",
                  fontWeight: 300,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                  marginBottom: "0.5rem",
                }}
              >
                Tags
              </label>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.35rem",
                  background: "var(--bg2)",
                  border: "0.5px solid var(--border)",
                  padding: "0.5rem",
                  minHeight: 42,
                  cursor: "text",
                }}
                onClick={() => document.getElementById("tag-input")?.focus()}
              >
                {tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      background: "rgba(201,168,76,0.08)",
                      border: "0.5px solid var(--gold3)",
                      color: "var(--gold)",
                      fontSize: "0.6rem",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      padding: "0.18rem 0.45rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                    }}
                  >
                    {tag}
                    <span
                      style={{ cursor: "pointer", opacity: 0.7 }}
                      onClick={() =>
                        setTags((prev) => prev.filter((t) => t !== tag))
                      }
                    >
                      ✕
                    </span>
                  </span>
                ))}
                <input
                  id="tag-input"
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={addTag}
                  placeholder="Add tag..."
                  style={{
                    background: "none",
                    border: "none",
                    outline: "none",
                    color: "var(--text)",
                    fontFamily: "var(--ff-body)",
                    fontSize: "0.78rem",
                    minWidth: 70,
                    flex: 1,
                  }}
                />
              </div>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.58rem",
                  fontWeight: 300,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                  marginBottom: "0.5rem",
                }}
              >
                Visibility
              </label>
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
                style={
                  {
                    ...input,
                    cursor: "pointer",
                    WebkitAppearance: "none",
                  } as any
                }
                onFocus={(e) => (e.target.style.borderColor = "var(--gold)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              >
                <option value="public">Public — visible to all members</option>
                <option value="followers">Followers only</option>
                <option value="private">Private — only you</option>
              </select>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div>
          <div
            style={{
              background: "var(--bg2)",
              border: "0.5px solid var(--border)",
              padding: "1.75rem",
              position: "sticky",
              top: 80,
              position: "relative" as any,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -1,
                left: -1,
                width: 14,
                height: 14,
                borderTop: "1px solid var(--gold)",
                borderLeft: "1px solid var(--gold)",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: -1,
                right: -1,
                width: 14,
                height: 14,
                borderBottom: "1px solid var(--gold)",
                borderRight: "1px solid var(--gold)",
              }}
            />

            <div
              style={{
                fontSize: "0.55rem",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "var(--gold)",
                marginBottom: "1.5rem",
              }}
            >
              Entry Preview
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "1.5rem",
              }}
            >
              <WatchFace
                size={100}
                hourDeg={120}
                minuteDeg={200}
                borderColor={selected ? "var(--gold)" : "var(--gold3)"}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              {[
                ["Watch", selected ? selected.model : "Not selected"],
                ["Brand", selected ? selected.brand : "—"],
                ["Reference", selected ? selected.reference : "—"],
                [
                  "Status",
                  status === "owned"
                    ? "Own It"
                    : status === "worn"
                      ? "Worn It"
                      : "Want It",
                ],
                ["Rating", "★".repeat(rating) + " " + rating],
                [
                  "Condition",
                  condition.charAt(0).toUpperCase() + condition.slice(1),
                ],
              ].map(([k, v]) => (
                <div
                  key={k}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    padding: "0.5rem 0",
                    borderBottom: "0.5px solid var(--border2)",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.58rem",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: "var(--muted)",
                    }}
                  >
                    {k}
                  </span>
                  <span
                    style={{
                      fontSize: "0.8rem",
                      color:
                        k === "Status" || k === "Rating"
                          ? "var(--gold)"
                          : "var(--text)",
                      fontFamily:
                        k === "Rating" ? "var(--ff-display)" : "var(--ff-body)",
                    }}
                  >
                    {v}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || !selected}
              style={{
                width: "100%",
                background: selected ? "var(--gold)" : "var(--bg3)",
                color: selected ? "var(--bg)" : "var(--muted)",
                border: "none",
                padding: "0.875rem",
                fontFamily: "var(--ff-body)",
                fontSize: "0.62rem",
                fontWeight: 600,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                cursor: selected ? "pointer" : "not-allowed",
                marginTop: "1.5rem",
                opacity: loading ? 0.7 : 1,
                position: "relative",
              }}
            >
              {loading ? "Saving..." : "Add to WatchList"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
