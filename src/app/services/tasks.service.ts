import { Injectable, signal } from '@angular/core';
import { Task } from '../interfaces/task.interface';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  tasks = signal<Task[]>([]);
  itemsLeft = signal<number>(0);

  updateItemsAndLocalTasks() {
    this.itemsLeft.set(this.tasks().filter((task) => !task.completed).length);
    window.localStorage.setItem('tasks', JSON.stringify([...this.tasks()]));
  }

  fetchTasks() {
    const savedTasks = JSON.parse(window.localStorage.getItem('tasks')!);
    if (savedTasks) {
      this.tasks.set(savedTasks);
    }
    this.itemsLeft.set(this.tasks().filter((task) => !task.completed).length);
  }

  addTask(title: string) {
    this.tasks.update((prevTasks) => [
      { id: Math.round(Math.random() * 10000), title, completed: false },
      ...prevTasks,
    ]);
    this.updateItemsAndLocalTasks();
  }

  changeCompleted(taskId: number) {
    this.tasks.update((prevTasks) => {
      const found = prevTasks.find((task) => task.id == taskId);
      if (found) {
        found.completed = !found.completed;
      }

      return [...prevTasks];
    });
    this.updateItemsAndLocalTasks();
  }

  clearCompleted() {
    this.tasks.update((prevTasks) =>
      prevTasks.filter((task) => !task.completed)
    );
    window.localStorage.setItem('tasks', JSON.stringify([...this.tasks()]));
  }

  deleteTask(taskId: number) {
    this.tasks.update((prevTasks) => {
      return prevTasks.filter((task) => task.id != taskId);
    });
    this.updateItemsAndLocalTasks();
  }
}
