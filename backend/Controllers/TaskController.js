import Task from "../Models/Task.js";
import Staff from "../Models/Staff.js";
import { sendEmail } from "../utils/sendEmail.js";

// ================= CREATE TASK =================
export const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      assignedTo,
      priority,
      dueDate,
      attachments,
    } = req.body;

    const task = await Task.create({
      title,
      description,
      assignedTo,
      priority,
      dueDate,
      attachments,
    });

    // 📧 Notify assigned staff
    if (assignedTo) {
      const staff = await Staff.findById(assignedTo);

      if (staff?.email) {
        await sendEmail(
          staff.email,
          "📌 New Task Assigned",
          `
          <h3>New Task Assigned</h3>
          <p><b>Title:</b> ${title}</p>
          <p><b>Description:</b> ${description}</p>
          <p><b>Priority:</b> ${priority}</p>
          <p><b>Due Date:</b> ${dueDate || "N/A"}</p>
          `
        );
      }
    }

    res.status(201).json({ success: true, task });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= GET ALL TASKS =================
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("assignedTo", "name email role")
      .sort({ status: 1, order: 1 });

    res.json({ success: true, tasks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= GET TASKS BY STAFF =================
export const getTasksByStaff = async (req, res) => {
  try {
    const { staffId } = req.params;

    const tasks = await Task.find({ assignedTo: staffId })
      .populate("assignedTo", "name email")
      .sort({ status: 1, order: 1 });

    res.json({ success: true, tasks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= GET SINGLE TASK =================
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate(
      "assignedTo",
      "name email"
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ success: true, task });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= UPDATE TASK (ADMIN FULL EDIT) =================
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    const existingTask = await Task.findById(id);
    if (!existingTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    const oldAssigned = existingTask.assignedTo?.toString();

    Object.assign(existingTask, req.body);

    await existingTask.save();

    // 📧 If reassigned → notify new staff
    if (
      req.body.assignedTo &&
      req.body.assignedTo !== oldAssigned
    ) {
      const staff = await Staff.findById(req.body.assignedTo);

      if (staff?.email) {
        await sendEmail(
          staff.email,
          "🔄 Task Assigned to You",
          `
          <h3>You have been assigned a task</h3>
          <p><b>Title:</b> ${existingTask.title}</p>
          <p><b>Description:</b> ${existingTask.description}</p>
          `
        );
      }
    }

    res.json({ success: true, task: existingTask });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= UPDATE STATUS (DRAG & DROP) =================
export const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, order } = req.body;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (status) task.status = status;
    if (order !== undefined) task.order = order;

    await task.save();

    res.json({ success: true, task });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= DELETE TASK =================
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ success: true, message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= BULK UPDATE ORDER (IMPORTANT FOR DRAG UI) =================
export const reorderTasks = async (req, res) => {
  try {
    const { tasks } = req.body;
    // tasks = [{id, order, status}]

    const bulkOps = tasks.map((t) => ({
      updateOne: {
        filter: { _id: t.id },
        update: {
          order: t.order,
          status: t.status,
        },
      },
    }));

    await Task.bulkWrite(bulkOps);

    res.json({ success: true, message: "Tasks reordered" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};