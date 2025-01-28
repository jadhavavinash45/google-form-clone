import { Form, FormResponse } from "../types/interfaces";

export const FORM_STORAGE_KEY = 'forms';
const RESPONSE_STORAGE_KEY = 'responses';

export const saveForm = (form: Form): void => {
  const existingForms = loadForms();
  const index = existingForms.findIndex(f => f.id === form.id);
  if (index >= 0) existingForms[index] = form;
  else existingForms.push(form);
  localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(existingForms));
};

export const loadForms = (): Form[] => {
  return JSON.parse(localStorage.getItem(FORM_STORAGE_KEY) || '[]');
};

export const saveResponse = (response: FormResponse): void => {
  const existingResponses = JSON.parse(localStorage.getItem(RESPONSE_STORAGE_KEY) || '[]');
  existingResponses.push(response);
  localStorage.setItem(RESPONSE_STORAGE_KEY, JSON.stringify(existingResponses));
};