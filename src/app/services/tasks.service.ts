import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  tasks = signal<{ id: number; title: string; completed: boolean }[]>([]);
  itemsLeft = signal<number>(0);

  addTask(title: string) {
    this.tasks.update((prevTasks) => [
      { id: Math.round(Math.random() * 10000), title, completed: false },
      ...prevTasks,
    ]);
    this.itemsLeft.set(this.tasks().filter((task) => !task.completed).length);
  }

  changeCompleted(taskIndex: number) {
    this.tasks.update((prevTasks) => {
      prevTasks[taskIndex].completed = !prevTasks[taskIndex].completed;
      this.itemsLeft.set(prevTasks.filter((task) => !task.completed).length);
      return prevTasks;
    });
  }

  clearCompleted() {
    this.tasks.update((prevTasks) =>
      prevTasks.filter((task) => !task.completed)
    );
  }

  deleteTask(taskIndex: number) {
    this.tasks.update((prevTasks) => {
      prevTasks.splice(taskIndex, 1);
      return prevTasks;
    });
    this.itemsLeft.set(this.tasks().filter((task) => !task.completed).length);
  }
}
