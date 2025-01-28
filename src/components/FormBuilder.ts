// src/components/FormBuilder.ts
import { Form, FormField } from '../types/interfaces';
import { loadForms, saveForm } from '../storage/storage';
import { FormRenderer } from './FormRenderer';
import { Notifications } from './Notifications';

export class FormBuilder {
  private static currentForm: Form = {
    id: '',
    title: 'Untitled Form',
    fields: []
  };

  static initialize(form?: Form): void {
    if (form) this.currentForm = form;
    this.renderFormEditor();
    this.setupEventListeners();
    this.toggleScreens('form-builder');
  }

  private static renderFormEditor(): void {
    const editor = document.getElementById('form-editor')!;
    editor.innerHTML = `
      <div class="form-header">
        <input type="text" id="form-title" value="${this.currentForm.title}" placeholder="Form Title">
      </div>
      <div id="form-fields-container">
        ${this.currentForm.fields.map(this.renderFieldEditor).join('')}
      </div>
    `;

    // Re-bind the title listener after re-render
    document.getElementById('form-title')?.addEventListener('input', (e) => {
      this.currentForm.title = (e.target as HTMLInputElement).value;
    });

    // Add this after rendering fields
    this.currentForm.fields.forEach(field => {
      if (field.type !== 'text') {
        this.setupOptionListeners(field);
      }
    });
  }

  private static renderOptionsEditor(field: FormField): string {
    return `
      <div class="field-options">
        ${field.options?.map((option, index) => `
          <div class="option-row">
            <input type="text" 
                   class="option-input" 
                   value="${option}"
                   placeholder="Option ${index + 1}">
            <button class="delete-option" data-option-index="${index}">×</button>
          </div>
        `).join('')}
        <button class="add-option">+ Add Option</button>
      </div>
    `;
  }

  private static renderFieldEditor(field: FormField): string {
    return `
      <div class="field-editor" data-field-id="${field.id}">
        <input type="text" value="${field.label}" class="field-label">
        ${
          field.type === 'text' 
            ? '' 
            // Explicitly call using the class reference
            : FormBuilder.renderOptionsEditor(field)
        }
        <button class="delete-field">Delete</button>
      </div>
    `;
  }

  static addField(type: 'text' | 'radio' | 'checkbox'): void {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      type,
      label: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      options: type !== 'text' ? ['Option 1'] : undefined
    };

    this.currentForm.fields.push(newField);
    this.renderFormEditor();

    // Scroll to new field
    const lastField = document.querySelector(`[data-field-id="${newField.id}"]`);
    lastField?.scrollIntoView({ behavior: 'smooth' });
  }

  private static setupEventListeners(): void {
    // Field type buttons
    document.getElementById('add-text-field')?.addEventListener('click', () => this.addField('text'));
    document.getElementById('add-radio-field')?.addEventListener('click', () => this.addField('radio'));
    document.getElementById('add-checkbox-field')?.addEventListener('click', () => this.addField('checkbox'));

    // Save form
    document.getElementById('save-form')?.addEventListener('click', () => {
      this.currentForm.title = (document.getElementById('form-title') as HTMLInputElement).value;
      this.currentForm.id = this.currentForm.id || `form-${Date.now()}`;
      saveForm(this.currentForm);
      Notifications.show('Form saved successfully!');
      // Refresh the form list
      const forms = loadForms();
      FormRenderer.renderFormList(forms);
      this.toggleScreens('form-list');
    });

    // Add title change listener
    document.getElementById('form-title')?.addEventListener('input', (e) => {
      this.currentForm.title = (e.target as HTMLInputElement).value;
    });

    // Add back button listener in setupEventListeners
    document.getElementById('back-to-list')?.addEventListener('click', () => {
      this.toggleScreens('form-list');
    });
  }

  static toggleScreens(screenId: string): void {
    const leftPanel = document.querySelector('.left-panel')!;
    const formsList = document.getElementById('form-list')!;
    const formBuilder = document.getElementById('form-builder')!;

    if (screenId === 'form-list') {
      formsList.classList.remove('hidden');
      formBuilder.classList.add('hidden');
    } else {
      formsList.classList.add('hidden');
      formBuilder.classList.remove('hidden');
    }
    
    // Always update preview
    const currentForm = this.currentForm;
    if (currentForm) {
      FormRenderer.renderFormPreview(currentForm);
    }
  }

  private static setupOptionListeners(field: FormField): void {
    // Add option button
    const container = document.querySelector(`[data-field-id="${field.id}"] .field-options`);
    container?.querySelector('.add-option')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.addOptionToField(field);
    });
  
    // Delete option buttons
    container?.querySelectorAll('.delete-option').forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const index = parseInt(button.getAttribute('data-option-index') || '0');
        this.removeOptionFromField(field, index);
      });
    });
  
    // Option input changes
    container?.querySelectorAll('.option-input').forEach((input, index) => {
      input.addEventListener('input', (e) => {
        const value = (e.target as HTMLInputElement).value;
        this.updateOptionValue(field, index, value);
      });
    });
  }

  private static addOptionToField(field: FormField): void {
    if (!field.options) field.options = [];
    field.options.push(`Option ${field.options.length + 1}`);
    this.renderFormEditor();
  }
  
  private static removeOptionFromField(field: FormField, index: number): void {
    if (field.options && field.options.length > index) {
      field.options.splice(index, 1);
      this.renderFormEditor();
    }
  }
  
  private static updateOptionValue(field: FormField, index: number, value: string): void {
    if (field.options && field.options.length > index) {
      field.options[index] = value;
    }
  }
}