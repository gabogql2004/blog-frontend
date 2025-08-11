import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';

function TaskList() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    api.get('/tasks')
      .then(res => setTasks(res.data))
      .catch(err => console.error(err));
  }, []);

  const deleteTask = (id) => {
    api.delete(`/tasks/${id}`)
      .then(() => setTasks(prev => prev.filter(t => t._id !== id)))
      .catch(err => console.error(err));
  };

  return (
    <div>
      <h2 className="mb-4">📋 Your Tasks</h2>
      {tasks.length === 0 ? (
        <p className="text-muted">You have no tasks yet. Click "Add Task" to get started.</p>
      ) : (
        <div className="row g-3">
          {tasks.map(task => (
            <div className="col-md-6" key={task._id}>
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title mb-1">{task.title}</h5>
                  {task.description && <p className="card-text text-muted">{task.description}</p>}
                  <div className="d-flex justify-content-end">
                    <Link to={`/edit/${task._id}`} className="btn btn-sm btn-outline-secondary me-2">✏️ Edit</Link>
                    <button onClick={() => deleteTask(task._id)} className="btn btn-sm btn-outline-danger">🗑 Delete</button>
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
