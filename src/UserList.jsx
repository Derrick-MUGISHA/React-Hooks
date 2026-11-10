import { useEffect, useState } from "react"; // these is important to useEffect hook
import Pagination from "./Pagination";
import ApiDetails from "./ApiDetails";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const pageSize = 6;

  const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://jsonplaceholder.typicode.com";

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
  }, [VITE_API_BASE_URL]);

  // conditional rendering

  if (loading) {
    return <p className="feedback" role="status">Getting to know the community…</p>;
  }

  if (error) {
    return <p className="feedback error" role="alert">We could not load users: {error}</p>;
  }

  if (users.length === 0) {
    return <p className="feedback">No users found</p>;
  }

  return (
    <>
      <ul className="user-grid" aria-label="Community members">
        {users.slice(page * pageSize, (page + 1) * pageSize).map((u) => (
          <li key={u.id} className="user-card">
            <div className="user-summary">
            <span className="avatar" aria-hidden="true">{u.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span>
            <div className="user-details">
            <h3>{u.name}</h3>
            <p className="user-email"><a href={`mailto:${u.email}`}>{u.email}</a></p>
            <p>{u.address?.city || "Location not listed"}</p>
            </div>
            </div>
            <ApiDetails data={u} label={`View ${u.name.split(" ")[0]}’s profile`} />
          </li>
        ))}
      </ul>
      <Pagination page={page} pageSize={pageSize} total={users.length} count={users.slice(page * pageSize, (page + 1) * pageSize).length} hasMore={(page + 1) * pageSize < users.length} onPageChange={setPage} label="Community pages" />
 

    </>
  );
}
