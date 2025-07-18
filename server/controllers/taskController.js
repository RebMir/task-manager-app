import asyncHandler from "express-async-handler";
import Task from "../models/taskModel.js";

// Create a new task
export const createTask = asyncHandler(async (req, res) => {
  const { title, description, stage } = req.body;

  const task = await Task.create({
    user: req.user.userId,
    title,
    description,
    stage,
  });

  res.status(201).json(task);
});

// Get all tasks for the logged-in user, with optional filters
export const getAllTask = asyncHandler(async (req, res) => {
  const { stage, isTrashed, search } = req.query;
  const query = { user: req.user.userId };

  if (stage) query.stage = stage;
  if (isTrashed !== undefined) query.isTrashed = isTrashed === "true";
  if (search) query.title = { $regex: search, $options: "i" };

  const tasks = await Task.find(query);
  res.status(200).json(tasks);
});

// Get single task by id (owned by user)
export const getSingleTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user.userId });
  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }
  res.json(task);
});

// Update a task by id (owned by user)
export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user.userId },
    req.body,
    { new: true }
  );
  if (!task) {
    res.status(404);
    throw new Error("Task not found or unauthorized");
  }
  res.json(task);
});

// Duplicate a task by id (owned by user)
export const duplicateTask = asyncHandler(async (req, res) => {
  const original = await Task.findOne({ _id: req.params.id, user: req.user.userId });
  if (!original) {
    res.status(404);
    throw new Error("Original task not found");
  }

  const duplicate = await Task.create({
    ...original.toObject(),
    _id: undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  res.status(201).json(duplicate);
});

// Soft delete (trash) a task by id (owned by user)
export const trashTask = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user.userId },
    { isTrashed: true },
    { new: true }
  );
  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }
  res.json(task);
});

// Permanently delete or restore a task by id (owned by user)
export const deleteRestoreTask = asyncHandler(async (req, res) => {
  const { actionType } = req.query;

  if (actionType === "restore") {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { isTrashed: false },
      { new: true }
    );
    return res.json(task);
  } else if (actionType === "delete") {
    await Task.deleteOne({ _id: req.params.id, user: req.user.userId });
    return res.json({ message: "Task permanently deleted" });
  } else {
    res.status(400);
    throw new Error("Invalid actionType");
  }
});

// Add an activity entry to a task
export const postTaskActivity = asyncHandler(async (req, res) => {
  const { content } = req.body;

  const task = await Task.findOne({ _id: req.params.id, user: req.user.userId });
  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  task.activities.push({ content });
  await task.save();
  res.json(task);
});

// Create a subtask inside a task
export const createSubTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user.userId });
  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  task.subTasks.push(req.body);
  await task.save();
  res.json(task);
});

// Change stage of a task
export const changeTaskStage = asyncHandler(async (req, res) => {
  const { stage } = req.body;

  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user.userId },
    { stage },
    { new: true }
  );

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  res.json(task);
});

// Change status of a subtask
export const changeSubTaskStatus = asyncHandler(async (req, res) => {
  const { id, subId } = req.params;
  const { status } = req.body;

  const task = await Task.findOne({ _id: id, user: req.user.userId });
  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  const subTask = task.subTasks.id(subId);
  if (!subTask) {
    res.status(404);
    throw new Error("Subtask not found");
  }

  subTask.status = status;
  await task.save();
  res.json(task);
});

// Get dashboard statistics
export const dashboardStatistics = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      console.error("No userId found in request");
      return res.status(401).json({ error: "Unauthorized" });
    }

    console.log("Dashboard stats for user:", userId);

    const totalTasks = await Task.countDocuments({ user: userId });
    const completed = await Task.countDocuments({ user: userId, stage: "completed" });
    const inProgress = await Task.countDocuments({ user: userId, stage: "in progress" });
    const todo = await Task.countDocuments({ user: userId, stage: "todo" });

    res.status(200).json({totalTasks, completed, inProgress, todo});
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};
