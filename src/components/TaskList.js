import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import Loading from './Loading';
import EmptyState from './EmptyState';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);      // NEW
  const [error, setError] = useState('');            // optional small touch

  const fetchTasks = () => {
    setLoading(true);
    setError('');
    api.get('/tasks')
      .then(res => setTasks(res.data))
      .catch(() => setError('Failed to load tasks'))
      .finally(() => setLoading(false));
  };

  useEffect(fetchTasks, []);

  const deleteTask = (id) => {
    // optimistic remove
    const prev = tasks;
    setTasks(prev.filter(t => t._id !== id));
    api.delete(`/tasks/${id}`)
      .catch(() => {
        // rollback on error
        setTasks(prev);
        setError('Delete failed. Try again.');
      });
  };

  return (
    <div>
      <div className="d-flex flex-column flex-md-row gap-2 align-items-md-center mb-4">
        <h2 className="mb-0 flex-grow-1">📋 Your Tasks</h2>
        <Link className="btn btn-primary" to="/add">➕ Add Task</Link>
      </div>

      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      {loading ? (
        <Loading />
      ) : tasks.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="row g-3">
          {tasks.map(task => (
            <div className="col-md-6" key={task._id}>
              <div className="card shadow-sm h-100">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title mb-1">{task.title}</h5>
                  {task.description && (
                    <p className="card-text text-muted mt-1">{task.description}</p>
                  )}
                  <div className="mt-auto d-flex justify-content-end">
                    <Link to={`/edit/${task._id}`} className="btn btn-sm btn-outline-secondary me-2">
                      ✏️ Edit
                    </Link>
                    <button
                      onClick={() => deleteTask(task._id)}
                      className="btn btn-sm btn-outline-danger"
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TaskList;
