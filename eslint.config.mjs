import nextVitals from 'eslint-config-next/core-web-vitals';

// Next 16 does not run ESLint from next build. Keep lint a separate CI gate.
// The existing application has several intentionally asynchronous hydration
// effects. Surface React Compiler-style issues as actionable warnings while
// retaining strict Hooks ordering, security rules, and syntax errors as failures.
const eslintConfig=[
  ...nextVitals,
  {
    files:['**/*.{ts,tsx,js,mjs}'],
    rules:{
      'react-hooks/set-state-in-effect':'warn',
      'react-hooks/refs':'warn',
    },
  },
  {
    // Node-based QA scripts intentionally use the CommonJS `module` variable;
    // the Next.js restriction is only relevant to app route/bundler source.
    files:['scripts/**/*.{ts,js,mjs}'],
    rules:{'@next/next/no-assign-module-variable':'off'},
  },
];
export default eslintConfig;
