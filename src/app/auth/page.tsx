"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import WatchFace from "@/components/WatchFace";

const MINI_WATCHES = [
  { color: "#C9A84C", hourDeg: 120, minuteDeg: 200, label: "Rolex" },
  { color: "#6B9FBD", hourDeg: 60, minuteDeg: 300, label: "Omega" },
  { color: "#4A7C6E", hourDeg: 170, minuteDeg: 40, label: "G. Seiko" },
  { color: "#8B6F47", hourDeg: 320, minuteDeg: 90, label: "Patek" },
  { color: "#9B7DC4", hourDeg: 220, minuteDeg: 140, label: "AP" },
];

export default function AuthPage() {
  const router = useRouter();
  const supabase = createClient();
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pwScore, setPwScore] = useState(0);

  const checkPw = (v: string) => {
    setPassword(v);
    let s = 0;
    if (v.length >= 8) s++;
    if (/[A-Z]/.test(v)) s++;
    if (/[0-9]/.test(v)) s++;
    if (/[^A-Za-z0-9]/.test(v)) s++;
    setPwScore(s);
  };

  const pwBarColor = ["", "#8B2020", "#C8783A", "#C8C040", "#C9A84C"][pwScore];
  const pwBarWidth = [0, 25, 50, 75, 100][pwScore];

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else router.push("/feed");
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: `${firstName} ${lastName}`, username } },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Update profile with username
      if (data.user) {
        await supabase
          .from("profiles")
          .update({ username, full_name: `${firstName} ${lastName}` })
          .eq("id", data.user.id);
      }
      router.push("/feed");
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

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        minHeight: "calc(100vh - 60px)",
      }}
    >
      {/* LEFT */}
      <div
        style={{
          background: "var(--bg2)",
          borderRight: "0.5px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "4rem",
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
        <p
          style={{
            fontFamily: "var(--ff-body)",
            fontSize: "0.55rem",
            fontWeight: 100,
            letterSpacing: "0.45em",
            textTransform: "uppercase",
            color: "var(--gold)",
            marginBottom: "1.25rem",
          }}
        >
          The Collector's Society
        </p>
        <h2
          style={{
            fontFamily: "var(--ff-display)",
            fontSize: "2.8rem",
            fontWeight: 300,
            lineHeight: 1.12,
            color: "var(--text)",
            marginBottom: "1.5rem",
          }}
        >
          Your wrist tells
          <br />a{" "}
          <em style={{ fontStyle: "italic", color: "var(--gold)" }}>story.</em>
          <br />
          Start writing it.
        </h2>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            margin: "1.5rem 0",
          }}
        >
          <div
            style={{
              height: "0.5px",
              background: "linear-gradient(90deg,var(--gold3),transparent)",
              flex: 1,
              maxWidth: 60,
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
              width: 6,
              height: 6,
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
        </div>
        <p
          style={{
            fontFamily: "var(--ff-display)",
            fontStyle: "italic",
            fontSize: "0.95rem",
            color: "var(--muted)",
            lineHeight: 1.8,
            maxWidth: 360,
          }}
        >
          Join thousands of collectors logging, reviewing, and discovering
          watches together. Free forever.
        </p>
        <div style={{ display: "flex", gap: "1.5rem", marginTop: "2.5rem" }}>
          {MINI_WATCHES.map((w) => (
            <div
              key={w.label}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.5rem",
                opacity: 0.6,
                transition: "opacity 0.2s",
                cursor: "default",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.6")}
            >
              <WatchFace
                size={52}
                hourDeg={w.hourDeg}
                minuteDeg={w.minuteDeg}
                borderColor={w.color}
              />
              <span
                style={{
                  fontSize: "0.55rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                }}
              >
                {w.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "4rem",
          maxWidth: 460,
          margin: "0 auto",
          width: "100%",
        }}
      >
        {/* Tabs */}
        <div
          style={{
            display: "flex",
            borderBottom: "0.5px solid var(--border)",
            marginBottom: "2.5rem",
          }}
        >
          {(["signin", "signup"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: "0.75rem 1.5rem",
                fontSize: "0.6rem",
                fontWeight: 400,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                cursor: "pointer",
                borderBottom:
                  tab === t
                    ? "1.5px solid var(--gold)"
                    : "1.5px solid transparent",
                color: tab === t ? "var(--gold)" : "var(--muted)",
                background: "none",
                border: "none",
                borderBottom:
                  tab === t
                    ? "1.5px solid var(--gold)"
                    : "1.5px solid transparent",
                fontFamily: "var(--ff-body)",
                transition: "color 0.2s",
              }}
            >
              {t === "signin" ? "Sign In" : "Create Account"}
            </button>
          ))}
        </div>

        {error && (
          <p
            style={{
              color: "#c0392b",
              fontSize: "0.75rem",
              marginBottom: "1rem",
              letterSpacing: "0.05em",
            }}
          >
            {error}
          </p>
        )}

        {tab === "signin" ? (
          <form onSubmit={handleSignIn}>
            <div style={{ marginBottom: "1.25rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.58rem",
                  fontWeight: 400,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                  marginBottom: "0.5rem",
                }}
              >
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={input}
                onFocus={(e) => (e.target.style.borderColor = "var(--gold)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
            </div>
            <div style={{ marginBottom: "1.25rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.58rem",
                  fontWeight: 400,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                  marginBottom: "0.5rem",
                }}
              >
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={input}
                onFocus={(e) => (e.target.style.borderColor = "var(--gold)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                background: "var(--gold)",
                color: "var(--bg)",
                border: "none",
                padding: "0.875rem",
                fontFamily: "var(--ff-body)",
                fontSize: "0.62rem",
                fontWeight: 600,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                cursor: "pointer",
                marginTop: "1.5rem",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignUp}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
                marginBottom: "1.25rem",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.58rem",
                    fontWeight: 400,
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    color: "var(--muted)",
                    marginBottom: "0.5rem",
                  }}
                >
                  First Name
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="James"
                  style={input}
                  onFocus={(e) => (e.target.style.borderColor = "var(--gold)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.58rem",
                    fontWeight: 400,
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    color: "var(--muted)",
                    marginBottom: "0.5rem",
                  }}
                >
                  Last Name
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Ward"
                  style={input}
                  onFocus={(e) => (e.target.style.borderColor = "var(--gold)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
              </div>
            </div>
            <div style={{ marginBottom: "1.25rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.58rem",
                  fontWeight: 400,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                  marginBottom: "0.5rem",
                }}
              >
                Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="@yourhandle"
                style={input}
                onFocus={(e) => (e.target.style.borderColor = "var(--gold)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
            </div>
            <div style={{ marginBottom: "1.25rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.58rem",
                  fontWeight: 400,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                  marginBottom: "0.5rem",
                }}
              >
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={input}
                onFocus={(e) => (e.target.style.borderColor = "var(--gold)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
            </div>
            <div style={{ marginBottom: "1.25rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.58rem",
                  fontWeight: 400,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                  marginBottom: "0.5rem",
                }}
              >
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => checkPw(e.target.value)}
                placeholder="Min. 8 characters"
                style={input}
                onFocus={(e) => (e.target.style.borderColor = "var(--gold)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
              <div
                style={{
                  height: "1.5px",
                  background: "var(--bg3)",
                  marginTop: "0.4rem",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${pwBarWidth}%`,
                    background: pwBarColor,
                    transition: "width 0.3s, background 0.3s",
                  }}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                background: "var(--gold)",
                color: "var(--bg)",
                border: "none",
                padding: "0.875rem",
                fontFamily: "var(--ff-body)",
                fontSize: "0.62rem",
                fontWeight: 600,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                cursor: "pointer",
                marginTop: "1.5rem",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Joining..." : "Join the WatchList"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
