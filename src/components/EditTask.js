import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function EditTask() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/tasks`)
      .then(res => {
        const task = res.data.find(t => t._id === id);
        if (task) {
          setTitle(task.title);
          setDescription(task.description || '');
        }
      })
      .catch(err => console.error(err));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`/api/tasks/${id}`, { title, description })
      .then(() => navigate('/'))
      .catch(err => console.error(err));
  };

  return (
    <div className="card shadow-sm p-4">
      <h3 className="mb-3">✏️ Edit Task</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title <span className="text-danger">*</span></label>
          <input type="text" className="form-control" required value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea className="form-control" rows="3" value={description} onChange={e => setDescription(e.target.value)}></textarea>
        </div>
        <button type="submit" className="btn btn-success">Update Task</button>
      </form>
    </div>
  );
}

export default EditTask;
