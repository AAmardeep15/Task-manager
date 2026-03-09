import { useEffect, useMemo, useState } from "react";
import "./App.css";

function App() {
  const [taskText, setTaskText] = useState("");
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("task-manager.tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  useEffect(() => {
    localStorage.setItem("task-manager.tasks", JSON.stringify(tasks));
  }, [tasks]);

  const pendingTasks = useMemo(
    () => tasks.filter((task) => !task.completed).length,
    [tasks],
  );

  const completedTasks = tasks.length - pendingTasks;

  const handleAddTask = (event) => {
    event.preventDefault();

    const trimmedTask = taskText.trim();
    if (!trimmedTask) {
      return;
    }

    const newTask = {
      id: crypto.randomUUID(),
      text: trimmedTask,
      completed: false,
    };

    setTasks((currentTasks) => [newTask, ...currentTasks]);
    setTaskText("");
  };

  const handleToggleTask = (taskId) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const handleDeleteTask = (taskId) => {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== taskId),
    );
  };

  return (
    <div className="app-shell">
      <div className="background-glow" aria-hidden="true" />
      <main className="task-app" aria-labelledby="app-title">
        <header className="app-header">
          <p className="eyebrow">Daily Focus Board</p>
          <h1 id="app-title">Task Manager</h1>
          <p className="subtitle">Plan it. Finish it. Keep moving.</p>
        </header>

        <form className="task-form" onSubmit={handleAddTask}>
          <label htmlFor="task-input" className="visually-hidden">
            Add a new task
          </label>
          <input
            id="task-input"
            name="task"
            type="text"
            value={taskText}
            onChange={(event) => setTaskText(event.target.value)}
            placeholder="Add a task..."
            autoComplete="off"
          />
          <button type="submit">Add Task</button>
        </form>

        <section className="task-meta" aria-label="Task summary">
          <p>
            <strong>{tasks.length}</strong> total
          </p>
          <p>
            <strong>{pendingTasks}</strong> pending
          </p>
          <p>
            <strong>{completedTasks}</strong> completed
          </p>
        </section>

        <section aria-label="Task list">
          {tasks.length === 0 ? (
            <p className="empty-state">No tasks yet. Add one to get started.</p>
          ) : (
            <ul className="task-list">
              {tasks.map((task) => (
                <li key={task.id} className="task-item">
                  <label className="task-toggle">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggleTask(task.id)}
                    />
                    <span
                      className={
                        task.completed ? "task-text completed" : "task-text"
                      }
                    >
                      {task.text}
                    </span>
                  </label>
                  <button
                    type="button"
                    className="delete-button"
                    onClick={() => handleDeleteTask(task.id)}
                    aria-label={`Delete task: ${task.text}`}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
