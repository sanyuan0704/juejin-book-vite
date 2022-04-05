import { defineConfig } from 'vite-plugin-windicss';

export default defineConfig({
  attributify: true,
  shortcuts: {
    'flex-c': 'flex justify-center items-center',
    'flex-around': 'flex justify-around'
  }
});
