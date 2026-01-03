// pages/user.js
export async function getServerSideProps() {
  const res = await fetch('https://api.example.com/user');
  const data = await res.json();

  return {
    props: {
      data,
    },
  };
}

export default function User({ data }) {
  return (
    <div>
      <h1>User Data</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
