// create-course.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-course',
  templateUrl: './create-course.component.html',
  styleUrls: ['./create-course.component.scss']
})
export class CreateCourseComponent {
  courseForm: FormGroup;
  isSubmitting = false;
  coverImage: File | null = null;
  previewImage: string | ArrayBuffer | null = null;

  videoPlatforms = [
    { value: 'google_meet', label: 'Google Meet' },
    { value: 'zoom', label: 'Zoom' }
  ];

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.courseForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      price: ['', [Validators.required, Validators.min(0)]],
      platform: ['google_meet', Validators.required],
      date: ['', Validators.required],
      startTime: ['09:00', Validators.required],
      endTime: ['10:00', Validators.required]
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (file.size > 2 * 1024 * 1024) { // 2MB max
        alert('La taille maximale de l\'image est de 2MB');
        return;
      }
      
      this.coverImage = file;
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => this.previewImage = reader.result;
      reader.readAsDataURL(this.coverImage);
    }
  }

  removeImage(): void {
    this.coverImage = null;
    this.previewImage = null;
  }

  onSubmit(): void {
    if (this.courseForm.invalid) {
      this.markFormGroupTouched(this.courseForm);
      return;
    }

    this.isSubmitting = true;

    const formData = new FormData();
    formData.append('name', this.courseForm.value.name);
    formData.append('description', this.courseForm.value.description);
    formData.append('price', this.courseForm.value.price);
    formData.append('platform', this.courseForm.value.platform);
    formData.append('date', this.courseForm.value.date);
    formData.append('startTime', this.courseForm.value.startTime);
    formData.append('endTime', this.courseForm.value.endTime);
    
    if (this.coverImage) {
      formData.append('coverImage', this.coverImage);
    }

    // Simulate API call
    setTimeout(() => {
      console.log('Form submitted:', formData);
      this.isSubmitting = false;
      // Reset form after successful submission
      this.courseForm.reset({
        platform: 'google_meet',
        startTime: '09:00',
        endTime: '10:00'
      });
      this.previewImage = null;
      this.router.navigateByUrl('expert-formation');
    }, 1500);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}