import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "WatchList — Are you on the WatchList?",
  description:
    "Log, review and discover watches with the world's finest collectors.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main>{children}</main>
        <footer
          style={{
            background: "var(--bg)",
            borderTop: "0.5px solid var(--border)",
          }}
        >
          <div className="footer-deco" />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "1.5rem 2.5rem",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div
              style={{
                fontFamily: "var(--ff-display)",
                fontSize: "1.2rem",
                fontWeight: 300,
                letterSpacing: "0.15em",
                color: "var(--gold)",
                textTransform: "uppercase",
              }}
            >
              Watch
              <em style={{ fontStyle: "italic", color: "var(--text)" }}>
                List
              </em>
            </div>
            <p
              style={{
                fontSize: "0.62rem",
                color: "var(--muted)",
                letterSpacing: "0.1em",
              }}
            >
              Built for collectors, by collectors · © 2025
            </p>
            <div style={{ display: "flex", gap: "1.5rem" }}>
              {["Privacy", "Terms", "Contact"].map((l) => (
                <a
                  key={l}
                  href="#"
                  style={{
                    fontSize: "0.58rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "var(--muted)",
                    textDecoration: "none",
                  }}
                >
                  {l}
                </a>
              ))}
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
