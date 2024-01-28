import { zodResolver } from "@hookform/resolvers/zod";
import axios, { CanceledError } from "axios";
import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";

// interface User {
//   id: number;
//   name: string;
//   email: string;
//   phone: string;
// }

const schema = z.object({
  id: z.number().default(-1),
  name: z
    .string()
    .min(1, { message: "Name must be atleast 1 character long." }),
  email: z.string().email({ message: "Must be a valid email address." }),
  phone: z.number({ invalid_type_error: "Phone field is required." }),
  // .min(10, { message: "Must be a valid 10 digit number." }),
});

type FormData = z.infer<typeof schema>;

const App = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  // const onSubmit = (data: FieldValues) => {
  //   reset();
  //   console.log(data);
  // };
  const onSubmit = (data: FormData) => {
    addUser(data);
    reset();
    console.log(data);
  };

  const [users, setUsers] = useState<FormData[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);

  // Temp
  let localId = users.length;

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

  const addUser = (new_user: FormData) => {
    // new_user.id = users.length + 1;
    new_user.id = ++localId;
    const originalUsers = [...users];
    setUsers([new_user, ...users]);
    axios
      .post("https://jsonplaceholder.typicode.com/users", new_user)
      .then(({ data: savedUser }) => setUsers([savedUser, ...users]))
      .catch((err) => {
        setError(err.message);
        setUsers(originalUsers);
      });
  };

  const deleteUser = (user: FormData) => {
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
      <form className="container" onSubmit={handleSubmit(onSubmit)}>
        <div className="my-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            id="name"
            type="text"
            className="form-control"
            {...register("name")}
          />
          {errors.name && <p className="text-danger">{errors.name.message}</p>}
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="form-control"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-danger">{errors.email.message}</p>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="phone" className="form-label">
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            className="form-control"
            {...register("phone", { valueAsNumber: true })}
          />
          {errors.phone && (
            <p className="text-danger">{errors.phone.message}</p>
          )}
        </div>
        <button className="btn btn-outline-primary mb-5 px-5" type="submit">
          Add
        </button>
        {/* </form> */}

        <div className="container mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search name"
          />
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
      </form>
    </>
  );
};

export default App;
