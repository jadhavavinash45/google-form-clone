import { Form, FormField } from '../types/interfaces';

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
    
  }

  private static renderPreviewField(field: FormField): string {
    return "";
  }

  private static setupFormListListeners(): void {
    
  }

  private static setupPreviewListeners(form: Form): void {
    
  }
}