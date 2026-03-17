"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

export default function Nav() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_e, session) => {
        setUser(session?.user ?? null);
      },
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const links = [
    { href: "/explore", label: "Explore" },
    { href: "/feed", label: "Feed" },
    { href: "/members", label: "Members" },
  ];

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(8,7,6,0.94)",
        backdropFilter: "blur(16px)",
        borderBottom: "0.5px solid var(--border)",
      }}
    >
      <div className="nav-deco" />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1rem 2.5rem",
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: "var(--ff-display)",
            fontSize: "1.5rem",
            fontWeight: 300,
            letterSpacing: "0.12em",
            color: "var(--gold)",
            textDecoration: "none",
            textTransform: "uppercase",
          }}
        >
          Watch
          <em style={{ fontStyle: "italic", color: "var(--text)" }}>List</em>
        </Link>

        <ul
          style={{
            display: "flex",
            gap: "2rem",
            listStyle: "none",
            alignItems: "center",
          }}
        >
          {links.map((link, i) => (
            <React.Fragment key={link.href}>
              <li>
                <Link
                  href={link.href}
                  style={{
                    color:
                      pathname === link.href ? "var(--gold)" : "var(--muted)",
                    textDecoration: "none",
                    fontSize: "0.6rem",
                    fontWeight: 400,
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    transition: "color 0.2s",
                  }}
                >
                  {link.label}
                </Link>
              </li>
              {i < links.length - 1 && (
                <li style={{ color: "var(--gold3)", fontSize: "0.45rem" }}>
                  ✦
                </li>
              )}
            </React.Fragment>
          ))}
        </ul>

        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          {user ? (
            <>
              <Link
                href="/log"
                style={{
                  background: "var(--gold)",
                  color: "var(--bg)",
                  padding: "0.45rem 1.25rem",
                  fontFamily: "var(--ff-body)",
                  fontSize: "0.58rem",
                  fontWeight: 600,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                }}
              >
                + Log Watch
              </Link>
              <Link
                href="/profile"
                style={{
                  color:
                    pathname === "/profile" ? "var(--gold)" : "var(--muted)",
                  fontSize: "0.6rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                }}
              >
                Profile
              </Link>
              <button
                onClick={handleSignOut}
                style={{
                  background: "transparent",
                  border: "0.5px solid var(--border)",
                  color: "var(--muted)",
                  padding: "0.45rem 1rem",
                  fontFamily: "var(--ff-body)",
                  fontSize: "0.58rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              href="/auth"
              style={{
                background: "transparent",
                border: "0.5px solid var(--gold)",
                color: "var(--gold)",
                padding: "0.45rem 1.25rem",
                fontFamily: "var(--ff-body)",
                fontSize: "0.58rem",
                fontWeight: 600,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                textDecoration: "none",
              }}
            >
              Enter the List
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
