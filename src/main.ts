// Initialize core components
import { FormBuilder } from './components/FormBuilder';
import { FormRenderer } from './components/FormRenderer';
import { loadForms } from './storage/storage';

// App State
let currentFormId: string | null = null;

// Initialize UI
document.getElementById('create-new-form')?.addEventListener('click', () => {
  currentFormId = null;
  FormBuilder.initialize();
});

// Load existing forms on startup
window.addEventListener('load', () => {
  const forms = loadForms();
  FormRenderer.renderFormList(forms);

  // Always show the form list on load
  document.getElementById('form-list')?.classList.remove('hidden');
  document.getElementById('form-builder')?.classList.add('hidden');
});