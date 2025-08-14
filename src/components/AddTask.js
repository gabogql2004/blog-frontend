import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

const TITLE_MIN = 3;
const TITLE_MAX = 80;

function AddTask() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const titleLen = title.length;
  const isTitleValid = useMemo(() => title.trim().length >= TITLE_MIN, [title]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isTitleValid) return;
    api.post('/tasks', { title: title.trim(), description })
      .then(() => navigate('/'))
      .catch((err) => {
        console.error(err);
        alert('Failed to create task. Please try again.');
      });
  };

  return (
    <div className="card shadow-sm p-4">
      <h3 className="mb-3">➕ Add New Task</h3>
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
          placeholder="e.g., Finish portfolio case study"
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
            placeholder="Optional details to remember…"
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={!isTitleValid}>
          Save Task
        </button>
      </form>
    </div>
  );
}

export default AddTask; 
