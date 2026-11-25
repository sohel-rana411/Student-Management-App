import { useEffect, useState } from "react";
import "./App.css";

const EMPTY_FORM = { name: "", email: "", phone: "", department: "" };
const DEPARTMENTS = [
  "Computer Science",
  "Electrical Engineering",
  "Business Administration",
  "Mathematics",
  "English",
];

function loadStudents() {
  try {
    const saved = localStorage.getItem("students");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [students, setStudents] = useState(loadStudents);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [query, setQuery] = useState("");

  // Keep the list after a page refresh
  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(students));
  }, [students]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Enter the student's name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email address.";
    if (!/^[0-9+\-\s()]{7,15}$/.test(form.phone)) next.phone = "Enter a valid phone number.";
    if (!form.department.trim()) next.department = "Choose or enter a department.";
    return next;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validate();
    if (Object.keys(found).length) {
      setErrors(found);
      return;
    }
    const student = { id: Date.now(), ...form, name: form.name.trim() };
    setStudents((prev) => [student, ...prev]);
    setForm(EMPTY_FORM);
  };

  const handleDelete = (id) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  const visible = students.filter((s) =>
    s.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <div className="app">
      <header className="header">
        <h1>Student Register</h1>
        <p>{students.length} {students.length === 1 ? "student" : "students"} enrolled</p>
      </header>

      <main className="layout">
        <section className="panel" aria-labelledby="add-title">
          <h2 id="add-title">Add a student</h2>
          <form onSubmit={handleSubmit} noValidate>
            <Field label="Student name" error={errors.name}>
              <input name="name" value={form.name} onChange={handleChange} placeholder="Ayesha Rahman" />
            </Field>
            <Field label="Email" error={errors.email}>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="ayesha@example.com" />
            </Field>
            <Field label="Phone number" error={errors.phone}>
              <input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="01712 345678" />
            </Field>
            <Field label="Department" error={errors.department}>
              <input name="department" list="departments" value={form.department} onChange={handleChange} placeholder="Choose or type" />
              <datalist id="departments">
                {DEPARTMENTS.map((d) => <option key={d} value={d} />)}
              </datalist>
            </Field>
            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
        </section>

        <section className="panel" aria-labelledby="list-title">
          <div className="list-head">
            <h2 id="list-title">All students</h2>
            <input
              type="search"
              className="search"
              placeholder="Search by name"
              aria-label="Search students by name"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {visible.length === 0 ? (
            <p className="empty">
              {students.length === 0
                ? "No students yet. Fill in the form to add the first one."
                : `No student named "${query}". Check the spelling or clear the search.`}
            </p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Department</th>
                    <th><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((s) => (
                    <tr key={s.id}>
                      <td data-label="Name">{s.name}</td>
                      <td data-label="Email">{s.email}</td>
                      <td data-label="Phone">{s.phone}</td>
                      <td data-label="Department">{s.department}</td>
                      <td className="actions">
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(s.id)}
                          aria-label={`Delete ${s.name}`}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <label className={`field ${error ? "has-error" : ""}`}>
      <span>{label}</span>
      {children}
      {error && <small role="alert">{error}</small>}
    </label>
  );
}