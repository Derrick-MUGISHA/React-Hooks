import { useEffect, useState } from "react"; // these is important to useEffect hook

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        // Simulate an API call
        const res = await fetch(`${VITE_API_BASE_URL}/users`, {
          signal: controller.signal,
        });
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await res.json();
        if (!controller.signal.aborted) setUsers(data);
      } catch (error) {
        // Handle error
        if (!controller.signal.aborted) setError(error.message);
      } finally {
        // Cleanup
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    load(); // function call or function invocation/execution
    return () => controller.abort();
  }, []);

  // conditional rendering

  if (loading) {
    return <p>Loading users.....</p>;
  }

  if (error) {
    return <p>We could not load users: {error}</p>;
  }

  if (users.length === 0) {
    return <p>No users found</p>;
  }

  return (
    <>
      <ul className="grid">
        {users.map((u) => (
          <li key={u.id} className="card">
            <h3>{u.name}</h3>
            <p>
              {u.email} . {u.address.city}
            </p>
          </li>
        ))}
      </ul>
 

    </>
  );
}
