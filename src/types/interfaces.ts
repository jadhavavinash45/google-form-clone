export interface FormField {
    id: string;
    type: 'text' | 'radio' | 'checkbox';
    label: string;
    options?: string[]; // For radio/checkbox
}
  
export interface Form {
    id: string;
    title: string;
    fields: FormField[];
}

export interface FormResponse {
    formId: string;
    responses: Record<string, string | string[]>; // Field ID -> Value
}