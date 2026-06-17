import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-task',
  imports: [CommonModule, FormsModule],
  templateUrl: './create-task.html',
  styleUrl: './create-task.css',
})
export class CreateTask {

  taskForm = {
    title: '',
    description: '',
    dueDate: ''
  };

  onSubmit() {
    if (!this.taskForm.title || !this.taskForm.description || !this.taskForm.dueDate) {
      alert('Please fill in all required fields.');
      return;
    }

    console.log('Task Created:', this.taskForm);
    alert('Task created successfully! You can now assign it to an intern.');
    
    this.taskForm = {
      title: '',
      description: '',
      dueDate: ''
    };
    
  }
}
