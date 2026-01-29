import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {
      FIREBASE_API_KEY: 'your_firebase_api_key',
      FIREBASE_AUTH_DOMAIN: 'your_firebase_auth_domain',
      FIREBASE_PROJECT_ID: 'your_firebase_project_id',
      FIREBASE_STORAGE_BUCKET: 'your_firebase_storage_bucket',
      FIREBASE_MESSAGING_SENDER_ID: 'your_firebase_messaging_sender_id',
      FIREBASE_APP_ID: 'your_firebase_app_id',
    },
  },
});