import credits from "@/data/credits.json";

export default function CreditsPage() {
  return (
    <main style={styles.container}>
      <h1 style={styles.title}>{credits.title}</h1>

      <div>
        {credits.people.map((person, index) => (
          <div key={index} style={styles.item}>
            <p style={styles.name}>{person.name}</p>
            <p style={styles.role}>{person.role}</p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "2rem" }}>
        <h2>Special Thanks</h2>
        {credits.specialThanks.map((name, i) => (
          <p key={i}>{name}</p>
        ))}
      </div>

      <p style={styles.footer}>{credits.footer}</p>
    </main>
  );
}

const styles = {
  container: {
    height: "100vh",
    backgroundColor: "black",
    color: "white",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "sans-serif",
  },
  title: { fontSize: "3rem", marginBottom: "2rem" },
  item: { marginBottom: "1rem", textAlign: "center" as const },
  name: { fontSize: "1.4rem", fontWeight: "bold" },
  role: { opacity: 0.7 },
  footer: { marginTop: "2rem", opacity: 0.6 },
};
