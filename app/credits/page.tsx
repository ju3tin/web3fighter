import credits from "@/data/credits.json";

export default function CreditsPage() {
  return (
    <main style={styles.container}>
      <h1 style={styles.title}>{credits.title}</h1>

      <div style={styles.grid}>
        {credits.people.map((person, index) => (
          <div key={index} style={styles.card}>
            {/* Avatar (optional) */}
            {person.avatar && (
              <img
                src={person.avatar}
                alt={person.name}
                style={styles.avatar}
              />
            )}

            <h2 style={styles.name}>{person.name}</h2>
            <p style={styles.role}>{person.role}</p>
          </div>
        ))}
      </div>

      <p style={styles.footer}>{credits.footer}</p>
    </main>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#0a0a0a",
    color: "white",
    padding: "3rem 1rem",
    fontFamily: "sans-serif",
    textAlign: "center" as const,
  },
  title: {
    fontSize: "3rem",
    marginBottom: "2rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "1.5rem",
    maxWidth: "800px",
    margin: "0 auto",
  },
  card: {
    background: "#111",
    padding: "1.5rem",
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
    transition: "transform 0.2s ease",
  },
  avatar: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    objectFit: "cover" as const,
    marginBottom: "1rem",
  },
  name: {
    fontSize: "1.3rem",
    marginBottom: "0.3rem",
  },
  role: {
    opacity: 0.7,
    fontSize: "0.95rem",
  },
  footer: {
    marginTop: "3rem",
    opacity: 0.6,
  },
};
