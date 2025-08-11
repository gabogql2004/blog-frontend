import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api';

function EditTask() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/tasks')
      .then(res => {
        const t = res.data.find(x => x._id === id);
        if (t) {
          setTitle(t.title);
          setDescription(t.description || '');
        }
      })
      .catch(err => console.error(err));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    api.put(`/tasks/${id}`, { title, description })
      .then(() => navigate('/'))
      .catch(err => console.error(err));
  };

  return (
    <div className="card shadow-sm p-4">
      <h3 className="mb-3">✏️ Edit Task</h3>
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
        <button type="submit" className="btn btn-success">Update Task</button>
      </form>
    </div>
  );
}
export default EditTask;
