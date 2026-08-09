"use client";
import uploadToCloudinary from "@/app/utils/uploadToCloudinaryStaff";
import React, { useEffect, useState } from "react";
import { Plus, Calendar, Paperclip, X, Edit2 } from "lucide-react"; 

const API = process.env.NEXT_PUBLIC_API_URL;

const TaskBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null); // For View/Edit Modal
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
    priority: "medium",
    dueDate: "",
    attachments: [],
    status: "todo"
  });

  // ================= API CALLS =================
  const fetchTasks = async () => {
    const res = await fetch(`${API}/tasks`);
    const json = await res.json();
    setTasks(json.tasks || []);
  };

  const fetchStaff = async () => {
    const res = await fetch(`${API}/staff`);
    const json = await res.json();
    setStaffList(json.staff || []);
  };

  useEffect(() => {
    fetchTasks();
    fetchStaff();
  }, []);

  const handleSaveTask = async () => {
    const url = isEditing ? `${API}/tasks/${selectedTask._id}` : `${API}/tasks`;
    const method = isEditing ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    closeModals();
    fetchTasks();
  };

  // ================= HELPERS =================
  const closeModals = () => {
    setShowCreateModal(false);
    setSelectedTask(null);
    setIsEditing(false);
    setForm({ title: "", description: "", assignedTo: "", priority: "medium", dueDate: "", attachments: [], status: "todo" });
  };

  const openViewModal = (task) => {
    setSelectedTask(task);
    setForm({ ...task, assignedTo: task.assignedTo?._id || "" }); // Prep form for potential editing
    setIsEditing(false);
  };

  const handleFileUpload = async (file) => {
    try {
      setUploading(true);
      const uploaded = await uploadToCloudinary(file);
      setForm((prev) => ({ ...prev, attachments: [...prev.attachments, uploaded.url] }));
    } catch (err) {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // ================= UI COMPONENTS =================
  const TaskCard = ({ task }) => (
    <div 
      onClick={() => openViewModal(task)}
      className="group bg-white border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer mb-4"
    >
      <div className="flex justify-between items-start mb-2">
        <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${
          task.priority === 'high' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
        }`}>
          {task.priority}
        </span>
      </div>
      <h3 className="font-bold text-gray-800 text-sm mb-1">{task.title}</h3>
      <p className="text-gray-500 text-xs line-clamp-1 mb-3">{task.description}</p>
      
      <div className="flex items-center justify-between pt-3 border-t border-gray-50">
        <div className="flex items-center text-gray-400 text-[10px]">
          <Calendar className="w-3 h-3 mr-1" />
          {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
        </div>
        <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] text-white font-bold">
          {task.assignedTo?.name?.charAt(0) || '?'}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen font-sans">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Task Management</h1>
          <p className="text-gray-500 text-sm">Click any task to view full details or edit.</p>
        </div>
        <button
          onClick={() => { setIsEditing(false); setShowCreateModal(true); }}
          className="bg-black text-white px-5 py-2.5 rounded-xl flex items-center font-semibold text-sm shadow-lg hover:bg-gray-800"
        >
          <Plus className="w-4 h-4 mr-2" /> New Task
        </button>
      </div>

      {/* KANBAN BOARD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { id: "todo", label: "To Do", icon: "📝" },
          { id: "inprogress", label: "In Progress", icon: "⚡" },
          { id: "done", label: "Completed", icon: "✅" }
        ].map(col => (
          <div key={col.id} className="flex flex-col">
            <h2 className="text-gray-700 font-bold text-sm mb-4 flex items-center uppercase tracking-widest px-2">
              <span className="mr-2">{col.icon}</span> {col.label}
              <span className="ml-auto bg-gray-200 text-gray-600 text-[10px] px-2 py-0.5 rounded-full">
                {tasks.filter(t => t.status === col.id).length}
              </span>
            </h2>
            <div className="bg-gray-100/50 p-2 rounded-2xl min-h-[500px] border border-dashed border-gray-200">
              {tasks.filter(t => t.status === col.id).map(task => (
                <TaskCard key={task._id} task={task} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* VIEW / EDIT MODAL */}
      {(showCreateModal || selectedTask) && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h2 className="font-bold text-xl text-gray-800">
                {isEditing ? "Edit Task" : showCreateModal ? "Create Task" : "Task Details"}
              </h2>
              <div className="flex items-center gap-3">
                {!showCreateModal && !isEditing && (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="flex items-center text-sm text-indigo-600 font-bold hover:bg-indigo-50 px-3 py-1 rounded-lg"
                  >
                    <Edit2 className="w-4 h-4 mr-1" /> Edit
                  </button>
                )}
                <button onClick={closeModals} className="text-gray-400 hover:text-gray-600"><X /></button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-8 overflow-y-auto space-y-6">
              {/* Title & Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Task Title</label>
                  {isEditing || showCreateModal ? (
                    <input 
                      className="w-full border-b-2 border-gray-100 py-2 font-bold text-lg focus:border-indigo-500 outline-none transition-all"
                      value={form.title}
                      onChange={(e) => setForm({...form, title: e.target.value})}
                      placeholder="Enter task name..."
                    />
                  ) : (
                    <h3 className="text-2xl font-bold text-gray-800">{selectedTask.title}</h3>
                  )}
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</label>
                  {(isEditing || showCreateModal) ? (
                    <select 
                      className="w-full mt-1 p-2 bg-gray-50 border rounded-lg text-sm font-bold"
                      value={form.status}
                      onChange={(e) => setForm({...form, status: e.target.value})}
                    >
                      <option value="todo">To Do</option>
                      <option value="inprogress">In Progress</option>
                      <option value="done">Completed</option>
                    </select>
                  ) : (
                    <div className="mt-1 inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-black uppercase">
                      {selectedTask.status}
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</label>
                {isEditing || showCreateModal ? (
                  <textarea 
                    rows={4}
                    className="w-full mt-2 p-4 bg-gray-50 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    value={form.description}
                    onChange={(e) => setForm({...form, description: e.target.value})}
                    placeholder="Describe the task goals..."
                  />
                ) : (
                  <p className="mt-2 text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100 whitespace-pre-wrap">
                    {selectedTask.description || "No description provided."}
                  </p>
                )}
              </div>

              {/* Assignee & Date */}
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Assignee</label>
                  {isEditing || showCreateModal ? (
                    <select 
                      className="w-full mt-2 p-3 bg-gray-50 border rounded-xl text-sm font-medium"
                      value={form.assignedTo}
                      onChange={(e) => setForm({...form, assignedTo: e.target.value})}
                    >
                      <option value="">Unassigned</option>
                      {staffList.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                    </select>
                  ) : (
                    <div className="flex items-center mt-2 gap-3 p-2 bg-white border rounded-xl shadow-sm">
                      <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                        {selectedTask.assignedTo?.name?.charAt(0) || '?'}
                      </div>
                      <span className="text-sm font-bold text-gray-700">{selectedTask.assignedTo?.name || "Unassigned"}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Due Date</label>
                  {isEditing || showCreateModal ? (
                    <input 
                      type="date"
                      className="w-full mt-2 p-3 bg-gray-50 border rounded-xl text-sm"
                      value={form.dueDate ? form.dueDate.split('T')[0] : ""}
                      onChange={(e) => setForm({...form, dueDate: e.target.value})}
                    />
                  ) : (
                    <p className="mt-3 text-sm font-bold text-gray-700 flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-indigo-500" />
                      {selectedTask.dueDate ? new Date(selectedTask.dueDate).toDateString() : "Flexible Date"}
                    </p>
                  )}
                </div>
              </div>

              {/* Attachments */}
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3">Files & Attachments</label>
                {(isEditing || showCreateModal) && (
                  <div className="mb-4 border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-indigo-400 transition-colors">
                    <input 
                      type="file" multiple className="hidden" id="file-upload"
                      onChange={(e) => Array.from(e.target.files).forEach(handleFileUpload)} 
                    />
                    <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                      <Paperclip className="text-gray-400 mb-2" />
                      <span className="text-xs text-indigo-600 font-bold">Click to upload images</span>
                    </label>
                  </div>
                )}
                
                <div className="grid grid-cols-4 gap-4">
                  {(isEditing || showCreateModal ? form.attachments : selectedTask.attachments)?.map((img, i) => (
                    <div key={i} className="relative group rounded-xl overflow-hidden shadow-sm border h-24">
                      <img src={img} className="w-full h-full object-cover" />
                      {!isEditing && !showCreateModal && (
                        <a href={img} target="_blank" className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold transition-opacity">View Large</a>
                      )}
                    </div>
                  ))}
                  {uploading && <div className="h-24 bg-gray-100 rounded-xl animate-pulse flex items-center justify-center text-xs">...</div>}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            {(isEditing || showCreateModal) && (
              <div className="p-6 bg-gray-50 border-t flex justify-end gap-3">
                <button onClick={closeModals} className="px-6 py-2 text-sm font-bold text-gray-500">Cancel</button>
                <button 
                  onClick={handleSaveTask}
                  className="bg-indigo-600 text-white px-8 py-2 rounded-xl text-sm font-bold shadow-lg hover:bg-indigo-700 active:scale-95 transition-all"
                >
                  {isEditing ? "Update Changes" : "Create Task"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskBoard;