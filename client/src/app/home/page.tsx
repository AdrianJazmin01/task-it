"use client";

import React, { useState, useEffect } from "react";
import {
  Priority,
  Project,
  Task,
  useGetProjectsQuery,
  useGetTasksQuery,
} from "@/state/api";
import { useAppSelector } from "../redux";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Header from "@/components/Header";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { dataGridClassNames, dataGridSxStyles } from "@/lib/utils";

const taskColumns: GridColDef[] = [
  { field: "title", headerName: "Title", width: 200 },
  { field: "status", headerName: "Status", width: 150 },
  { field: "priority", headerName: "Priority", width: 150 },
  { field: "dueDate", headerName: "Due Date", width: 150 },
];



const HomePage = () => {
  // Initialize projectId from localStorage, or default to 1
  const [projectId, setProjectId] = useState(() => {
    const savedProjectId = localStorage.getItem("projectId");
    return savedProjectId ? parseInt(savedProjectId) : 1;
  });

  // Save projectId to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("projectId", projectId.toString());
  }, [projectId]);

  const handleChangeProject = () => {
    const newProjectId = prompt("Enter new project ID:", projectId.toString());
    if (newProjectId) {
      setProjectId(parseInt(newProjectId));
    }
  };

  const {
    data: tasks,
    isLoading: tasksLoading,
    isError: tasksError,
  } = useGetTasksQuery({ projectId });
  
  const { data: projects, isLoading: isProjectsLoading } =
    useGetProjectsQuery();

  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  if (tasksLoading || isProjectsLoading) return <div>Loading..</div>;
  if (tasksError || !tasks || !projects) return <div>Error fetching data</div>;

  // Find the current project based on projectId
  const currentProject = projects.find((project: Project) => project.id === projectId);

  const priorityCount = tasks.reduce(
    (acc: Record<string, number>, task: Task) => {
      const { priority } = task;
      acc[priority as Priority] = (acc[priority as Priority] || 0) + 1;
      return acc;
    },
    {}
  );

  const taskDistribution = Object.keys(priorityCount).map((key) => ({
    name: key,
    count: priorityCount[key],
  }));

  // const statusCount = projects.reduce(
  //   (acc: Record<string, number>, project: Project) => {
  //     const status = project.endDate ? "Completed" : "Active";
  //     acc[status] = (acc[status] || 0) + 1;
  //     return acc;
  //   },
  //   {}
  // );

  // const projectStatus = Object.keys(statusCount).map((key) => ({
  //   name: key,
  //   count: statusCount[key],
  // }));

  const chartColors = isDarkMode
    ? {
        bar: "#8884d8",
        barGrid: "#303030",
        pieFill: "#4A90E2",
        text: "#FFFFFF",
      }
    : {
        bar: "#8884d8",
        barGrid: "#E0E0E0",
        pieFill: "#82ca9d",
        text: "#000000",
      };

  return (
    <div className="container h-full w-[100%] bg-gray-100 bg-transparent p-8">
      <Header name="Project Management Dashboard" />
      <div className="mb-4">
        <button
          className="rounded bg-black px-3 py-2 text-white hover:bg-blue-600"
          onClick={handleChangeProject}
        >
          Change Project ID
        </button>
        <span className="ml-4 bg-black px-3 py-2 text-white">
          Current Project ID: {projectId}
        </span>
        {/* Display the project title */}
        {currentProject && (
          <h2 className="mt-4 text-xl font-bold text-blue-600">
            Project Title: {currentProject.name}
          </h2>
        )}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary">
          <h3 className="mb-4 text-lg font-semibold dark:text-white">
            Task Priority Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={taskDistribution}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={chartColors.barGrid}
              />
              <XAxis dataKey="name" stroke={chartColors.text} />
              <YAxis stroke={chartColors.text} />
              <Tooltip
                contentStyle={{
                  width: "min-content",
                  height: "min-content",
                }}
              />
              <Legend />
              <Bar dataKey="count" fill={chartColors.bar} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary md:col-span-2">
            <div style={{ height: 400, width: "100%" }}>
              <DataGrid
                rows={tasks}
                columns={taskColumns}
                checkboxSelection
                loading={tasksLoading}
                getRowClassName={() => "data-grid-row"}
                getCellClassName={() => "data-grid-cell"}
                className={dataGridClassNames}
                sx={dataGridSxStyles(isDarkMode)}
              />
            </div>
          </div>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HomePage;
// import { count } from "console";
// import { id } from "date-fns/locale";
// import { find, reduce, keys, map, fill } from "lodash";
// import { title } from "process";
// import { text } from "stream/consumers";
// import style from "styled-jsx/style";
// import { isError } from "util";
