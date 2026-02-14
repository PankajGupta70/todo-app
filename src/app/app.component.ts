import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TodoItem } from './todo-item.model';

const STORAGE_KEY = 'doto-items';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  newTodoTitle = '';
  todos: TodoItem[] = this.loadTodos();

  addTodo(): void {
    const title = this.newTodoTitle.trim();
    if (!title) {
      return;
    }

    this.todos = [
      ...this.todos,
      {
        id: Date.now(),
        title,
        completed: false
      }
    ];

    this.newTodoTitle = '';
    this.persistTodos();
  }

  toggleTodo(todoId: number): void {
    this.todos = this.todos.map((todo) =>
      todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
    );
    this.persistTodos();
  }

  removeTodo(todoId: number): void {
    this.todos = this.todos.filter((todo) => todo.id !== todoId);
    this.persistTodos();
  }

  clearCompleted(): void {
    this.todos = this.todos.filter((todo) => !todo.completed);
    this.persistTodos();
  }

  private loadTodos(): TodoItem[] {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }

    try {
      const parsed = JSON.parse(stored) as TodoItem[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private persistTodos(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.todos));
  }

  checkToDos(): boolean {
    return this.todos.some((todo) => todo.completed);
  }
}
