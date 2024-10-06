import Modal from "@/components/Modal";
import { Task, Priority, Status, useDeleteTaskMutation } from "@/state/api";
import React, { useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null;
};

const ModalTaskDetails = ({ isOpen, onClose, task }: Props) => {
  const [deleteTask] = useDeleteTaskMutation();
  const [isDeleting, setIsDeleting] = useState(false);

  if (!task) return null;

  const handleDelete = async () => {
    if (task && window.confirm('Are you sure you want to delete this task?')) {
      setIsDeleting(true);
      try {
        await deleteTask(task.id.toString());
        onClose();
      } catch (error) {
        console.error("Failed to delete task:", error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Task Details">
      <div className="mt-4 space-y-6">
        <h2 className="text-lg font-bold">{task.title}</h2>
        <p className="text-gray-700">{task.description}</p>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <div><strong>Status:</strong> {task.status || Status.ToDo}</div>
          <div><strong>Priority:</strong> {task.priority || Priority.Backlog}</div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <div><strong>Tags:</strong> {task.tags || "N/A"}</div>
          <div><strong>Start Date:</strong> {task.startDate ? new Date(task.startDate).toLocaleDateString() : "N/A"}</div>
          <div><strong>Due Date:</strong> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "N/A"}</div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <div><strong>Author User ID:</strong> {task.authorUserId || "N/A"}</div>
          <div><strong>Assigned User ID:</strong> {task.assignedUserId || "N/A"}</div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleDelete}
            className={`px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Task'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalTaskDetails;
