import { generateBoard } from "./service.ts";
import { addNewTask, findTaskById, removeTask } from "../tasks/service.ts";
import { Board } from "./Board.ts";
import { assertArrayIncludes } from "@std/assert/array-includes";
import { spy } from "@std/testing/mock";
import { TaskRepo } from "../data.ts";
import { Task } from "../tasks/Task.ts";
import { assertEquals } from "@std/assert/equals";

Deno.test("generate a Board", async () => {
  const fakeTask: Task = {
    id: "some-id",
    name: "Some Name",
    column: "To Do",
  };

  const fakeTasks: Task[] = [fakeTask];

  const readTasksSpy = spy(() => fakeTasks);

  const taskRepo = {
    readTasks: readTasksSpy,
  } as unknown as TaskRepo;

  const board = await generateBoard(taskRepo);

  const todoColumn = {
    name: "To Do",
    tasks: [
      fakeTask,
    ],
  };
  const doingColumn = {
    name: "Doing",
    tasks: [],
  };
  const doneColumn = {
    name: "Done",
    tasks: [],
  };
  const expectedBoard: Board = [todoColumn, doingColumn, doneColumn];

  assertArrayIncludes(board, expectedBoard);
});

Deno.test("generate a Board with no tasks", async () => {
  const fakeTasks: Task[] = [];

  const readTasksSpy = spy(() => fakeTasks);

  const taskRepo = {
    readTasks: readTasksSpy,
  } as unknown as TaskRepo;

  const board = await generateBoard(taskRepo);

  const todoColumn = {
    name: "To Do",
    tasks: [],
  };
  const doingColumn = {
    name: "Doing",
    tasks: [],
  };
  const doneColumn = {
    name: "Done",
    tasks: [],
  };
  const expectedBoard: Board = [todoColumn, doingColumn, doneColumn];

  assertArrayIncludes(board, expectedBoard);
});

Deno.test("move task to other column", async () => {
  const fakeTask: Task = {
    id: "some-id",
    name: "Some Name",
    column: "To Do",
  };

  const fakeTasks: Task[] = [fakeTask];

  const readTasksSpy = spy(() => fakeTasks);

  const taskRepo = {
    readTasks: readTasksSpy,
  } as unknown as TaskRepo;

  // Move task to Doing column
  fakeTask.column = "Doing";

  const updatedBoard = await generateBoard(taskRepo);

  const todoColumn = {
    name: "To Do",
    tasks: [],
  };
  const doingColumn = {
    name: "Doing",
    tasks: [
      fakeTask,
    ],
  };
  const doneColumn = {
    name: "Done",
    tasks: [],
  };
  const expectedBoard: Board = [todoColumn, doingColumn, doneColumn];

  assertArrayIncludes(updatedBoard, expectedBoard);
});

// find by id
Deno.test("find task by id", async () => {
  const fakeTask: Task = {
    id: "some-id",
    name: "Some Name",
    column: "To Do",
  };

  const resultTask = await addNewTask(fakeTask.name);

  const expectedTask = await findTaskById(resultTask.id);

  assertEquals(expectedTask.id, resultTask.id);
});

Deno.test("Delete Task", async () => {
  const TaskToDelete: Task = {
    id: "some-id",
    name: "Some Name",
    column: "To Do",
  };

  const resultTaskToDelete = await addNewTask(TaskToDelete.name);

  await removeTask(resultTaskToDelete.id);

  const expectedTaskToBeDeleted = await findTaskById(resultTaskToDelete.id);

  assertEquals(expectedTaskToBeDeleted, undefined);
});
