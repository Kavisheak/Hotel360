"use client";

import React from 'react';

interface Task {
  id: number;
  title: string;
  subtext: string;
  color: string;
  completed: boolean;
}

interface PendingTasksProps {
  tasks: Task[];
  onToggleTask: (id: number) => void;
}

export default function PendingTasks({ tasks, onToggleTask }: PendingTasksProps) {
  return (
    <div className="bg-white border border-[#D4C9A8] p-6 shadow-sm rounded-sm">
      <div className="flex justify-between items-baseline mb-4">
        <h3 className="text-lg font-serif text-gray-900">Pending Preparation Tasks</h3>
        <span className="text-[9px] uppercase tracking-widest font-bold text-gray-400">
          {tasks.filter(t => !t.completed).length} Remaining
        </span>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <div 
            key={task.id}
            onClick={() => onToggleTask(task.id)}
            className={`flex items-center gap-3 p-3 border hover:border-[#C9A84C]/30 hover:bg-[#F0E6D0]/40 rounded-sm transition-all duration-200 cursor-pointer ${task.completed ? 'border-emerald-100 bg-emerald-50/50' : 'border-gray-100'}`}
          >
            <input 
              type="checkbox" 
              className="accent-[#C9A84C] cursor-pointer" 
              checked={task.completed} 
              onChange={() => onToggleTask(task.id)}
            />
            <div className={`flex-1 transition-all ${task.completed ? 'opacity-50 line-through' : ''}`}>
              <span className="text-xs font-semibold text-gray-900">{task.title}</span>
              <span className={`block text-[9px] uppercase font-bold tracking-wider mt-0.5 ${task.color}`}>
                {task.subtext}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
