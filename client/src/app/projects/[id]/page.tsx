"use client";

import React, { useState } from "react";
import ProjectHeader from "@/app/projects/ProjectHeader";
import Board from "../BoardView";
import List from "../ListView";
import Timeline from "../TimelineView";
import Table from "../TableView";
import ModalNewTask from "@/components/ModalNewTask";
import { useRouter } from "next/navigation"; // Import useRouter to redirect after deletion

type Props = {
  params: { id: string };
};

const Project = ({ params }: Props) => {
  const { id } = params;
  const [activeTab, setActiveTab] = useState("Board");
  const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);
  const router = useRouter();

  const deleteProject = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this project?");

    if (confirmDelete) {
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/projects/${id}`;
        console.log("Attempting to delete project at:", apiUrl); // Log the URL

        const response = await fetch(apiUrl, {
          method: "DELETE",
        });

        console.log("Response status:", response.status);
        const responseText = await response.text();
        console.log("Response text:", responseText);

        if (!response.ok) {
          throw new Error(`Failed to delete project. Status: ${response.status}`);
        }

        alert("Project deleted successfully.");
        router.push("/projects");
      } catch (error) {
        console.error("Error deleting project:", error);
        alert(`An error occurred: ${"Unable to delete the project."}`);
      }
    }
  };

  return (
    <div>
      <ModalNewTask
        isOpen={isModalNewTaskOpen}
        onClose={() => setIsModalNewTaskOpen(false)}
        id={id}
      />

      <ProjectHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      <button 
        onClick={deleteProject} 
        className="bg-black text-white px-4 py-2 rounded mt-3 ml-4"
      >
        Delete Project
      </button>
      <span className="ml-4 bg-black px-3 py-2 text-white">
          Project ID: {id}
        </span>

      {activeTab === "Board" && (
        <Board id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
      )}

      {activeTab === "List" && (
        <List id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
      )}

      {activeTab === "Timeline" && (
        <Timeline id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
      )}

      {activeTab === "Table" && (
        <Table id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
      )}
    </div>
  );
};

export default Project;
