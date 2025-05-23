import { revalidatePath } from 'next/cache';

export type ToastMessage = {
  message: string;
  type: 'success' | 'error' | 'info';
  id: string;
};

// Create a simple in-memory store for toast messages
// In a production environment, you might want to use Redis or another solution
let toastMessages: ToastMessage[] = [];

export async function addToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
  const toast: ToastMessage = {
    message,
    type,
    id: Math.random().toString(36).substring(7),
  };
  
  toastMessages = [...toastMessages, toast];
  revalidatePath('/');
  return toast;
}

export async function getToasts() {
  const messages = [...toastMessages];
  toastMessages = [];
  return messages;
}

export async function clearToast(id: string) {
  toastMessages = toastMessages.filter((toast) => toast.id !== id);
  revalidatePath('/');
} 