export default function Footer() {
  return (
    <footer style={{
      borderTop: "0.5px solid var(--border-subtle)",
      padding: "1.5rem 2rem",
      textAlign: "center",
      fontSize: 12,
      color: "var(--text-tertiary)",
    }}>
      © {new Date().getFullYear()} Curly Braces AI &nbsp;·&nbsp;
      <a href="https://rosie.curlybraces.ai" style={{ color: "var(--text-tertiary)", margin: "0 0.5rem" }}>rosie.curlybraces.ai</a> &nbsp;·&nbsp;
      <a href="#" style={{ color: "var(--text-tertiary)", margin: "0 0.5rem" }}>HIPAA-compliant</a> &nbsp;·&nbsp;
      <a href="/privacy" style={{ color: "var(--text-tertiary)", margin: "0 0.5rem" }}>Privacy Policy</a> &nbsp;·&nbsp;
      <a href="/terms" style={{ color: "var(--text-tertiary)", margin: "0 0.5rem" }}>Terms of Service</a>
    </footer>
  );
}
