import axios, { CanceledError } from "axios";
import { useEffect, useState } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
}

const App = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err instanceof cancelIdleCallback) return;
        setError(err.message);
        setLoading(false);
      });
    // .finally(() => {
    //   setLoading(false);
    // });
    return () => controller.abort();
  }, []);

  const deleteUser = (user: User) => {
    const originalUsers = [...users];
    setUsers(users.filter((u) => u.id !== user.id));
    axios
      .delete("https://jsonplaceholder.typicode.com/users/" + user.id)
      .catch((error) => {
        if (error instanceof CanceledError) return;
        setError(error.message);
        setUsers(originalUsers);
      });
  };

  return (
    <>
      <form className="container">
        <div className="my-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input id="name" type="text" className="form-control" />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input id="email" type="email" className="form-control" />
        </div>
        <div className="mb-3">
          <label htmlFor="number" className="form-label">
            Phone
          </label>
          <input id="phone" type="phone" className="form-control" />
        </div>
        <button className="btn btn-outline-primary mb-5 px-5" type="submit">
          Add
        </button>
      </form>

      <div className="container mb-3">
        <input type="text" className="form-control" placeholder="Search name" />
      </div>
      {error && <p className="text-danger">{error}</p>}
      {isLoading && <div className="spinner-border"></div>}
      <ul className="container list-group">
        {users.map((user) => (
          <li
            className="list-group-item d-flex justify-content-between"
            key={user.id}
          >
            {user.name} <br />
            {user.email} <br />
            {user.phone} <br />
            <button
              className="btn btn-outline-danger m-2"
              onClick={() => deleteUser(user)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default App;
