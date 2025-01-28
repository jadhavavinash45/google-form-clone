// src/components/FormRenderer.ts
import { Form, FormField, FormResponse } from '../types/interfaces';
import { FORM_STORAGE_KEY, loadForms, saveResponse } from '../storage/storage';
import { FormBuilder } from './FormBuilder';

export class FormRenderer {
  static renderFormList(forms: Form[]): void {
    const container = document.getElementById('forms-container')!;

    if (forms.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <p>No forms created yet</p>
        </div>
      `;
      return;
    }

    container.innerHTML = forms.map(form => `
      <div class="form-card" data-form-id="${form.id}">
        <h3>${form.title}</h3>
        <div class="form-actions">
          <button class="edit-form">Edit</button>
          <button class="delete-form">Delete</button>
          <button class="preview-form">Preview</button>
        </div>
      </div>
    `).join('');

    this.setupFormListListeners();
  }

  static renderFormPreview(form: Form): void {
    const previewContainer = document.getElementById('preview-container')!;
    previewContainer.innerHTML = `
      <h2>${form.title}</h2>
      <form id="form-preview-container">
        ${form.fields.map(this.renderPreviewField).join('')}
      </form>
    `;

    /**
     * Below lines were causing infinite calls resulting in max callstack
     */
    // this.setupPreviewListeners(form);
    // FormBuilder.toggleScreens('form-preview');
  }

  private static renderPreviewField(field: FormField): string {
    switch (field.type) {
      case 'text':
        return `
          <div class="form-field">
            <label>${field.label}</label>
            <input type="text" name="${field.id}">
          </div>
        `;
        
      case 'radio':
        return `
          <div class="form-field">
            <label>${field.label}</label>
            ${field.options?.map(option => `
              <label>
                <input type="radio" name="${field.id}" value="${option}">
                ${option}
              </label>
            `).join('')}
          </div>
        `;

      case 'checkbox':
        return `
          <div class="form-field">
            <label>${field.label}</label>
            ${field.options?.map(option => `
              <label>
                <input type="checkbox" name="${field.id}" value="${option}">
                ${option}
              </label>
            `).join('')}
          </div>
        `;
    }
  }

  private static setupFormListListeners(): void {
    document.querySelectorAll('.edit-form').forEach(button => {
      button.addEventListener('click', () => {
        const formId = button.closest('.form-card')?.getAttribute('data-form-id');
        const form = loadForms().find(f => f.id === formId);
        if (form) FormBuilder.initialize(form);
      });
    });

    document.querySelectorAll('.preview-form').forEach(button => {
      button.addEventListener('click', () => {
        const formId = button.closest('.form-card')?.getAttribute('data-form-id');
        const form = loadForms().find(f => f.id === formId);
        if (form) this.renderFormPreview(form);
      });
    });

    document.querySelectorAll('.delete-form').forEach(button => {
      button.addEventListener('click', () => {
        const formId = button.closest('.form-card')?.getAttribute('data-form-id');
        const forms = loadForms().filter(f => f.id !== formId);
        localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(forms));
        this.renderFormList(forms); // Refresh list
      });
    });
  }

  // private static setupPreviewListeners(form: Form): void {
  //   document.getElementById('submit-form')?.addEventListener('click', (e) => {
  //     e.preventDefault();
  //     const formData = new FormData(document.getElementById('form-preview-container') as HTMLFormElement);
  //     const responses: FormResponse = {
  //       formId: form.id,
  //       responses: {}
  //     };
  
  //     form.fields.forEach(field => {
  //       if (field.type === 'checkbox') {
  //         // Convert FormDataEntryValue[] to string[]
  //         responses.responses[field.id] = formData.getAll(field.id)
  //           .map(entry => entry.toString()); // Explicit conversion to string
  //       } else {
  //         // Handle single-value fields
  //         const value = formData.get(field.id);
  //         responses.responses[field.id] = value ? value.toString() : '';
  //       }
  //     });
  
  //     saveResponse(responses);
  //     alert('Form submitted successfully!');
  //     FormBuilder.toggleScreens('form-list');
  //   });
  // }
}