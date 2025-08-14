import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api';

const TITLE_MIN = 3;
const TITLE_MAX = 80;

function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const titleLen = title.length;
  const isTitleValid = useMemo(() => title.trim().length >= TITLE_MIN, [title]);

  // Fetch tasks list and hydrate current task (since no GET /tasks/:id)
  useEffect(() => {
    api.get('/tasks')
      .then((res) => {
        const task = res.data.find((t) => t._id === id);
        if (task) {
          setTitle(task.title || '');
          setDescription(task.description || '');
        } else {
          alert('Task not found.');
          navigate('/');
        }
      })
      .catch((err) => {
        console.error(err);
        alert('Failed to load task.');
        navigate('/');
      });
  }, [id, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isTitleValid) return;
    api.put(`/tasks/${id}`, { title: title.trim(), description })
      .then(() => navigate('/'))
      .catch((err) => {
        console.error(err);
        alert('Failed to update task. Please try again.');
      });
  };

  return (
    <div className="card shadow-sm p-4">
      <h3 className="mb-3">✏️ Edit Task</h3>
      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-2 d-flex justify-content-between align-items-center">
          <label htmlFor="title" className="form-label mb-0">
            Title <span className="text-danger">*</span>
          </label>
          <small className={`text-${titleLen > TITLE_MAX ? 'danger' : 'muted'}`}>
            {titleLen}/{TITLE_MAX}
          </small>
        </div>

        <input
          id="title"
          className={`form-control ${title && !isTitleValid ? 'is-invalid' : ''}`}
          required
          minLength={TITLE_MIN}
          maxLength={TITLE_MAX}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Update the task title"
          autoFocus
          aria-describedby="titleHelp"
        />
        <div id="titleHelp" className="form-text mb-3">
          At least {TITLE_MIN} characters.
        </div>

        <div className="mb-3">
          <label htmlFor="desc" className="form-label">Description</label>
          <textarea
            id="desc"
            className="form-control"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Update details (optional)…"
          />
        </div>

        <button type="submit" className="btn btn-success" disabled={!isTitleValid}>
          Update Task
        </button>
      </form>
    </div>
  );
}

export default EditTask;
