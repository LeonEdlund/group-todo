export default function createTask(task) {
  const taskElem = document.createElement("task-container");
  taskElem.setAttribute("id", task.task_id);
  taskElem.setAttribute("title", task.title);
  taskElem.setAttribute("assigned", task.assigned_to);
  taskElem.setAttribute("difficulty", task.difficulty_level);
  taskElem.setAttribute("description", task.description_text);
  taskElem.setAttribute("completed", task.completion_status);

  return taskElem;
}