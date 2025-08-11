import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

function AddTask() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    api.post('/tasks', { title, description })
      .then(() => navigate('/'))
      .catch(err => console.error(err));
  };

  return (
    <div className="card shadow-sm p-4">
      <h3 className="mb-3">➕ Add New Task</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title <span className="text-danger">*</span></label>
          <input
            className="form-control"
            required
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            rows="3"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">Save Task</button>
      </form>
    </div>
  );
}
export default AddTask;
