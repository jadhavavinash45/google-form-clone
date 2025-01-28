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
    
  }

  private static renderOptionsEditor(field: FormField): string {
    return `
      <div class="field-options">
        
      </div>
    `;
  }

  private static renderFieldEditor(field: FormField): string {
    return "";
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
    
  }

  static toggleScreens(screenId: string): void {
    
  }

  private static setupOptionListeners(field: FormField): void {
    
  }
}