import { Injectable, signal } from '@angular/core';
import { Task } from '../interfaces/task.interface';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  tasks = signal<Task[]>([]);
  itemsLeft = signal<number>(0);

  addTask(title: string) {
    this.tasks.update((prevTasks) => [
      { id: Math.round(Math.random() * 10000), title, completed: false },
      ...prevTasks,
    ]);
    this.itemsLeft.set(this.tasks().filter((task) => !task.completed).length);
  }

  changeCompleted(taskId: number) {
    this.tasks.update((prevTasks) => {
      const found = prevTasks.find((task) => task.id == taskId);
      if (found) {
        found.completed = !found.completed;
      }
      this.itemsLeft.set(prevTasks.filter((task) => !task.completed).length);
      return [...prevTasks];
    });
  }

  clearCompleted() {
    this.tasks.update((prevTasks) =>
      prevTasks.filter((task) => !task.completed)
    );
  }

  deleteTask(taskId: number) {
    this.tasks.update((prevTasks) => {
      return prevTasks.filter((task) => task.id != taskId);
    });
    this.itemsLeft.set(this.tasks().filter((task) => !task.completed).length);
  }
}
