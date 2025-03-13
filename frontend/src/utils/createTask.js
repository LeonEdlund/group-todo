export default function createTask(projectId, task) {
  const taskElem = document.createElement("task-container");
  taskElem.setAttribute("id", task.task_id);
  taskElem.setAttribute("project-id", projectId);
  taskElem.setAttribute("title", task.title);
  taskElem.setAttribute("score", task.score);
  taskElem.setAttribute("description", task.description_text);

  if (task.completed_by) {
    taskElem.setAttribute("completed-by", task.completed_by);
  }

  return taskElem;
}