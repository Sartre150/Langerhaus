# Langerhaus

**Cuaderno de arena y cálculo** — Un roadmap visual e interactivo de matemáticas, desde aritmética hasta cálculo multivariable y álgebra lineal.

> *"Como escribir fórmulas en arena — el viento puede borrarlas, pero la estructura permanece."*

## Qué es

Una plataforma gamificada de aprendizaje matemático con:

- **11 niveles** (60+ temas) desde números naturales hasta ecuaciones diferenciales
- **100+ problemas** con hints, soluciones paso a paso y verificación LaTeX
- **7 visualizadores interactivos** (Canvas 2D): gráficas, fracciones, círculo unitario, derivadas, integrales, vectores, transformaciones matriciales
- **Contenido educativo profundo** — teoría, fórmulas clave, aplicaciones reales (ML, física, finanzas, criptografía), ejemplos resueltos
- **6 temas estéticos**: Cyberpunk, Solarpunk, Neobrutalismo, Bauhaus, Midnight, Retrowave
- **Progreso persistente** en Supabase con autenticación (email + Google OAuth)
- **Árbol de habilidades** con desbloqueo en cascada al dominar temas

## Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** con sistema de temas via CSS custom properties
- **Supabase** — Auth + base de datos (progreso de usuario)
- **react-katex** — renderizado LaTeX
- **framer-motion** — animaciones
- **Canvas 2D** — visualizadores interactivos

## Setup

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.local.example .env.local
# Editar .env.local con tus credenciales de Supabase

# 3. Crear tabla en Supabase
# Ejecutar el contenido de supabase-schema.sql en el SQL Editor de Supabase

# 4. Iniciar
npm run dev
```

## Supabase

### Tabla requerida

Ejecuta `supabase-schema.sql` en **Supabase Dashboard → SQL Editor**. Solo necesitas una tabla: `user_progress`.

### Google OAuth (opcional)

1. Crear credenciales OAuth 2.0 en Google Cloud Console
2. Redirect URI: `https://<tu-proyecto>.supabase.co/auth/v1/callback`
3. Habilitar Google provider en Supabase → Authentication → Providers

## Deploy

```bash
npm run build   # Verificar build
npx vercel      # Deploy a Vercel
```

Variables de entorno en Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Estructura

```
src/
├── app/
│   ├── auth/          # Login + registro + Google OAuth
│   ├── dashboard/     # Árbol de habilidades + stats
│   ├── arena/[id]/    # Resolver problemas
│   └── learn/[id]/    # Teoría + visualización + aplicaciones
├── components/
│   ├── visualizers/   # 7 visualizadores Canvas 2D
│   ├── SkillTree.tsx  # Árbol de niveles
│   ├── ThemePicker.tsx
│   └── ui.tsx         # Sistema de diseño (Button, Card, Modal, Badge)
└── lib/
    ├── seedData.ts        # 60+ temas, 100+ problemas
    ├── explanations.ts    # Contenido educativo profundo
    ├── ProgressContext.tsx # Progreso + sync Supabase
    ├── ThemeContext.tsx    # 6 temas estéticos
    └── AuthContext.tsx     # Supabase auth
```

## Licencia

MIT

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
