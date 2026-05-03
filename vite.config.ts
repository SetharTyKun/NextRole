import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  plugins: [
    tailwindcss(),
    viteStaticCopy({
      targets: [
        { src: 'components', dest: '.' },
        { src: 'js', dest: '.' },
        { src: 'asset', dest: '.' },
        { src: 'pages', dest: '.' },
      ]
    })
  ],
  server: {
    allowedHosts: true
  }
})