
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { getTasksByUserId } from '@/data/mockData';
import { Task } from '@/types/models';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';

interface TaskListProps {
  userId: string;
}

const TaskList = ({ userId }: TaskListProps) => {
  const tasks = getTasksByUserId(userId);

  const formatDate = (date: Date) => {
    return format(date, "EEEE d. MMMM 'kl.' HH:mm", { locale: nb });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Dine oppgaver</CardTitle>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <p className="text-muted-foreground">Ingen oppgaver tildelt.</p>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const TaskItem = ({ task }: { task: Task }) => {
  const isOverdue = new Date() > task.dueDate && !task.completed;
  const isPending = new Date() < task.dueDate && !task.completed;
  
  return (
    <div className={`p-4 rounded-lg border ${
      task.completed 
        ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800/30' 
        : isOverdue 
          ? 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800/30' 
          : 'bg-card border-card'
    }`}>
      <div className="flex items-start gap-3">
        <Checkbox 
          checked={task.completed} 
          id={`task-${task.id}`} 
          className="mt-1"
        />
        <div className="flex-1">
          <label 
            htmlFor={`task-${task.id}`} 
            className={`font-medium ${
              task.completed ? 'line-through text-muted-foreground' : ''
            }`}
          >
            {task.title}
          </label>
          <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
          <p className={`text-xs mt-2 ${
            isOverdue ? 'text-red-600 dark:text-red-400' : 
            isPending ? 'text-amber-600 dark:text-amber-400' : 
            'text-muted-foreground'
          }`}>
            {isOverdue 
              ? 'Forfalt: ' 
              : isPending 
                ? 'Forfaller: ' 
                : 'Fullført: '}
            {format(task.dueDate, "d. MMM 'kl.' HH:mm", { locale: nb })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TaskList;
