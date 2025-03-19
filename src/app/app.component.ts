import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TasksService } from './services/tasks.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { Task } from './interfaces/task.interface';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CdkDropList, CdkDrag],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private destroyRef = inject(DestroyRef);
  private tasksService = inject(TasksService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  taskForm = new FormGroup({
    title: new FormControl('', { validators: [Validators.required] }),
  });
  displayedTasks = computed(() => {
    switch (this.filter()) {
      case 'all':
        return this.tasksService.tasks();
      case 'active':
        return this.tasksService.tasks().filter((task) => !task.completed);
      case 'completed':
        return this.tasksService.tasks().filter((task) => task.completed);
      default:
        return this.tasksService.tasks();
    }
  });
  filter = signal<'all' | 'active' | 'completed'>('all');
  itemsLeft = this.tasksService.itemsLeft;
  filterOptions = [
    ['all', 'All'],
    ['active', 'Active'],
    ['completed', 'Completed'],
  ];

  ngOnInit() {
    const querySubscription = this.activatedRoute.queryParams.subscribe({
      next: (value) => {
        console.log(value['filter']);
        this.filter.set(value['filter']);
        console.log(this.displayedTasks());
      },
    });

    this.destroyRef.onDestroy(() => querySubscription.unsubscribe());
  }

  onAddTask() {
    if (this.taskForm.valid) {
      this.tasksService.addTask(this.taskForm.value.title!);
      this.taskForm.reset();
    }
  }

  onSelectTask(id: number) {
    this.tasksService.changeCompleted(id);
  }

  clearCompleted() {
    // this.router.navigate([''], { queryParams: { filter: 'all' } });
    this.tasksService.clearCompleted();
  }

  onDeleteTask(id: number) {
    this.tasksService.deleteTask(id);
  }

  drop(event: CdkDragDrop<Task[]>) {
    moveItemInArray(
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
  }
}
