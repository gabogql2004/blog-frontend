export default function EmptyState({
    title = "No tasks yet",
    hint = "Click “Add Task” to create your first one."
  }) {
    return (
      <div className="text-center text-muted py-5">
        <h5 className="mb-2">{title}</h5>
        <p className="mb-0">{hint}</p>
      </div>
    );
  }
    