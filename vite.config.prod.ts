import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    // Custom plugin for comprehensive protection
    {
      name: 'comprehensive-protection',
      transform(code: string, id: string) {
        if (process.env.NODE_ENV === 'production') {
          // Remove console.log statements
          code = code.replace(/console\.log\([^)]*\);?/g, '');
          
          // Obfuscate sensitive component names
          code = code.replace(/GafferChat/g, 'ChatComponent');
          code = code.replace(/SquadBuilder/g, 'TeamBuilder');
          code = code.replace(/TopScorers/g, 'ScorersTable');
          code = code.replace(/BeatTheGaffer/g, 'PredictionGame');
          code = code.replace(/CaptainPicks/g, 'SelectionHelper');
          
          // Obfuscate sensitive method names
          code = code.replace(/getGafferReply/g, 'getResponse');
          code = code.replace(/trackUsage/g, 'logActivity');
          code = code.replace(/detectAbuse/g, 'validateInput');
          code = code.replace(/rotateAPI/g, 'selectProvider');
          
          // Obfuscate API endpoints
          code = code.replace(/\/api\/chat/g, '/api/v1/conversation');
          code = code.replace(/\/api\/usage/g, '/api/v1/analytics');
          code = code.replace(/\/api\/gaffer-replies/g, '/api/v1/responses');
          
          // Obfuscate type names
          code = code.replace(/UserTier/g, 'AccessLevel');
          code = code.replace(/ChatMessage/g, 'ConversationItem');
          code = code.replace(/UsageData/g, 'ActivityRecord');
          code = code.replace(/AbuseDetection/g, 'ValidationResult');
          
          // Remove sensitive comments
          code = code.replace(/\/\/.*IP.*|\/\/.*TODO.*|\/\/.*FIXME.*/g, '');
          code = code.replace(/\/\*[\s\S]*?\*\//g, '');
        }
        return code;
      }
    }
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          supabase: ['@supabase/supabase-js'],
          charts: ['html2canvas'],
          api: ['axios', 'node-fetch'],
          protection: ['./src/config/componentProtection', './src/config/apiProtection', './src/config/flowProtection', './src/config/typeProtection']
        }
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        // Additional obfuscation
        sequences: true,
        properties: true,
        dead_code: true,
        conditionals: true,
        comparisons: true,
        evaluate: true,
        booleans: true,
        loops: true,
        unused: true,
        hoist_funs: true,
        if_return: true,
        join_vars: true,
        side_effects: true
      },
      mangle: {
        properties: {
          regex: /^_/,
          reserved: ['ChatComponent', 'TeamBuilder', 'ScorersTable']
        }
      }
    },
    sourcemap: false, // Don't expose source maps in production
    // Additional build protections
    target: 'es2020',
    chunkSizeWarningLimit: 1000
  },
  define: {
    'process.env.NODE_ENV': '"production"',
    // Disable debug mode in production
    __DEV__: JSON.stringify(false),
    // Add protection flags
    __PRODUCTION__: JSON.stringify(true),
    __OBSCURATE__: JSON.stringify(true)
  },
  server: {
    host: true,
    port: 5173,
    strictPort: true
  },
  // Hide build details
  logLevel: 'error'
});
