import { useEffect, useState } from "react";
import { getEmployees, createEmployee } from "../api";

export default function Employees() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      setLoading(true);
      const data = await getEmployees();
      setRows(Array.isArray(data) ? data : data.employees || []);
    } catch (e) {
      alert("Failed to load employees: " + e.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, []);

  async function handleCreate(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    if (payload.salary) payload.salary = Number(payload.salary);
    try {
      await createEmployee(payload);
      e.currentTarget.reset();
      await load();
    } catch (e) {
      alert("Create failed: " + e.message);
    }
  }

  return (
    <>
      <section className="card">
        <div className="card-header"><div className="card-title">Add Employee</div></div>
        <div className="card-body">
          <form onSubmit={handleCreate}>
            <div className="row">
              <div>
                <label className="label">Name</label>
                <input className="input" name="name" placeholder="SpongeBob SquarePants" required />
              </div>
              <div>
                <label className="label">Position</label>
                <input className="input" name="position" placeholder="Cook" required />
              </div>
            </div>
            <div className="row mt-16">
              <div>
                <label className="label">Salary</label>
                <input className="input" name="salary" type="number" step="0.01" placeholder="120" />
              </div>
              <div>
                <label className="label">Employee ID</label>
                <input className="input" name="employeeId" placeholder="EMP-001" />
              </div>
            </div>
            <div className="flex space-between mt-24">
              <button className="btn btn-ghost" type="reset">Reset</button>
              <button className="btn btn-primary">Create</button>
            </div>
          </form>
        </div>
      </section>

      <section className="card mt-24">
        <div className="card-header"><div className="card-title">Employees</div></div>
        <div className="card-body">
          {loading ? <div className="p">Loading…</div> : (
            <table className="table">
              <thead><tr><th>Name</th><th>Position</th><th>Salary</th></tr></thead>
              <tbody>
                {rows.map((e) => (
                  <tr key={e._id || e.employeeId || e.name}>
                    <td>{e.name}</td>
                    <td>{e.position}</td>
                    <td>{e.salary ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </>
  );
}
