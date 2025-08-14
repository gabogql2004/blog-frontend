import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import Loading from './Loading';
import EmptyState from './EmptyState';
import ConfirmModal from './ConfirmModal';
import ToastMessage from './ToastMessage';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');
  const [showModal, setShowModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });

  // NEW: search & filter
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all'); // all | active | completed

  const fetchTasks = () => {
    setLoading(true);
    setError('');
    api.get('/tasks')
      .then(res => setTasks(res.data))
      .catch(() => setError('Failed to load tasks'))
      .finally(() => setLoading(false));
  };

  useEffect(fetchTasks, []);

  // NEW: toggle completed (optimistic)
  const toggleComplete = (task) => {
    const optimistic = tasks.map(t => t._id === task._id ? { ...t, completed: !t.completed } : t);
    setTasks(optimistic);
    api.put(`/tasks/${task._id}`, { completed: !task.completed })
      .then(() => setToast({ show: true, message: 'Task updated', variant: 'success' }))
      .catch(() => {
        setTasks(tasks); // rollback
        setToast({ show: true, message: 'Update failed', variant: 'danger' });
      });
  };

  // Delete flow (confirm modal + optimistic remove)
  const handleDeleteClick = (task) => {
    setTaskToDelete(task);
    setShowModal(true);
  };

  const confirmDelete = () => {
    if (!taskToDelete) return;
    const prev = tasks;
    setTasks(prev.filter(t => t._id !== taskToDelete._id));
    api.delete(`/tasks/${taskToDelete._id}`)
      .then(() => setToast({ show: true, message: 'Task deleted successfully', variant: 'success' }))
      .catch(() => {
        setTasks(prev); // rollback
        setToast({ show: true, message: 'Failed to delete task', variant: 'danger' });
      })
      .finally(() => {
        setShowModal(false);
        setTaskToDelete(null);
      });
  };

  // NEW: computed list with query + filter
  const filtered = useMemo(() => {
    let list = tasks;
    if (filter === 'active')   list = list.filter(t => !t.completed);
    if (filter === 'completed')list = list.filter(t =>  t.completed);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(t =>
        (t.title || '').toLowerCase().includes(q) ||
        (t.description || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [tasks, filter, query]);

  return (
    <div>
      {/* Top bar: title + search + filter + add */}
      <div className="mb-4">
        <div className="row g-2 align-items-center">
          <div className="col-12 col-md">
            <h2 className="mb-0">📋 Your Tasks</h2>
          </div>
          <div className="col-12 col-sm-6 col-md-4">
            <input
              className="form-control"
              placeholder="Search tasks…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              aria-label="Search tasks"
            />
          </div>
          <div className="col-6 col-sm-3 col-md-2">
            <select
              className="form-select"
              value={filter}
              onChange={e => setFilter(e.target.value)}
              aria-label="Filter tasks"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="col-6 col-sm-3 col-md-auto d-flex justify-content-end">
            <Link className="btn btn-primary w-100 w-md-auto" to="/add">➕ Add Task</Link>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      {loading ? (
        <Loading />
      ) : filtered.length === 0 ? (
        <EmptyState title="No matching tasks" hint="Try clearing the search or filter, or create a new task." />
      ) : (
        <div className="row g-3">
          {filtered.map(task => (
            <div className="col-md-6" key={task._id}>
              <div className="card shadow-sm h-100">
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start">
                    <h5 className="card-title mb-1">
                      {task.title}
                      {task.completed && <span className="badge bg-success ms-2">Completed</span>}
                    </h5>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={!!task.completed}
                        onChange={() => toggleComplete(task)}
                        aria-label="Mark completed"
                      />
                    </div>
                  </div>

                  {task.description && (
                    <p className="card-text text-muted mt-1">{task.description}</p>
                  )}

                  <div className="mt-auto d-flex justify-content-end">
                    <Link to={`/edit/${task._id}`} className="btn btn-sm btn-outline-secondary me-2">✏️ Edit</Link>
                    <button
                      onClick={() => handleDeleteClick(task)}
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

      {/* Confirmation Modal */}
      <ConfirmModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onConfirm={confirmDelete}
        title="Delete Task"
        body={`Are you sure you want to delete "${taskToDelete?.title}"?`}
      />

      {/* Toast Notification */}
      <ToastMessage
        show={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
        message={toast.message}
        variant={toast.variant}
      />
    </div>
  );
}

export default TaskList;
