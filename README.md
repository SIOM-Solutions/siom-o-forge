# O-Forge (SIOM) - Frontend

Aplicación SPA en React + TypeScript con autenticación mediante Supabase y ruteo con React Router. Incluye el módulo AIR (Auditoría Inicial de Rendimiento).

## Requisitos
- Node 18+ recomendado
- Variables de entorno en `.env.local`:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

Puedes usar el archivo `.env.example` como referencia.

## Arranque rápido
```bash
npm install
npm run dev
```

App disponible en `http://localhost:5173`.

## Scripts
- `npm run dev`: servidor de desarrollo (Vite)
- `npm run build`: compila TypeScript y genera build de producción
- `npm run preview`: sirve la build en local
- `npm run lint`: lint del proyecto

## Tech stack
- React 19, React Router 7
- Supabase JS
- Tailwind CSS v4 (activado vía `@import "tailwindcss";`)
- Vite 7, TypeScript estricto, ESLint

## Estructura relevante
- `src/main.tsx`: arranque
- `src/App.tsx`: ruteo y protección de rutas
- `src/contexts/AuthContext.tsx`: autenticación y sesión
- `src/components/ProtectedRoute.tsx`: wrapper para rutas protegidas
- `src/pages/**`: páginas de Login, Hub y módulo AIR
- `src/lib/supabase.ts`: cliente y tipos de dominio
- `src/index.css`: estilos globales, importa Tailwind

## Notas
- Asegúrate de configurar correctamente las variables de entorno para que la autenticación funcione.
- El módulo AIR usa datos de ejemplo por ahora; la integración con Supabase se implementará a continuación.

## Licencia
Privado.
