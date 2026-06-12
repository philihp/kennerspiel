import next from 'eslint-config-next/core-web-vitals'

export default [
  { ignores: ['.next/**', 'node_modules/**', 'src/supabase.types.ts'] },
  ...next,
]
