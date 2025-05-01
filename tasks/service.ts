import { readTasks, writeTasks } from "../data.ts";
import { Task } from "./Task.ts";

export async function addNewTask(
  taskName: string,
  columnName: string = "To Do",
) {
  const newTask = { id: crypto.randomUUID(), name: taskName, columnName };

  const tasks = await readTasks();

  tasks.push(newTask);

  await writeTasks(tasks);

  return newTask;
}

export async function findTaskById(id: string) {
  const tasks = await readTasks();
  const task = tasks.find((task: Task) => task.id === id);
  return task;
}

export async function updateTask(updatedTask: Task) {
  const tasks = await readTasks();

  const currentTaskIndex = tasks.findIndex((t: Task) =>
    t.id === updatedTask.id
  );

  tasks[currentTaskIndex] = updatedTask;

  await writeTasks(tasks);
}

export async function removeTask(id: string) {
  const tasks = await readTasks();

  const updatedTasks = tasks.filter((t: Task) => t.id != id);

  await writeTasks(updatedTasks);
}
