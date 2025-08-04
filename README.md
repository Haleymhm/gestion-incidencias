# Sistema de Gestión de Incidencias MX

Un sistema moderno para la gestión d## 📁 Estructura del Proyecto

```bash
src/
├── app/                   # Directorio principal de la aplicación
│   ├── (auth)/           # Rutas de autenticación
│   │   ├── login/        # Página de inicio de sesión
│   │   └── logout/       # Manejo de cierre de sesión
│   ├── (dashboard)/      # Panel de control protegido
│   │   ├── incidencias/  # Gestión de incidencias
│   │   ├── empleados/    # Gestión de empleados
│   │   └── reportes/     # Reportes y estadísticas
│   ├── api/              # API Routes de Next.js
│   │   ├── auth/        # Endpoints de autenticación
│   │   └── v1/          # API versión 1
│   └── layout.tsx       # Layout principal
├── components/          # Componentes reutilizables
│   ├── ui/             # Componentes de UI (shadcn)
│   └── forms/          # Componentes de formularios
├── lib/                # Utilidades y configuraciones
├── prisma/             # Esquema y migraciones DB
└── registry/           # Registro de componentes shadcnmpresariales desarrollado con Next.js 15, Prisma ORM, y shadcn/ui. Diseñado para manejar eficientemente el registro y seguimiento de incidencias laborales en múltiples empresas y oficinas.

## 🚀 Características principales

- **Autenticación segura** con JWT y cookies httpOnly
- **Manejo de sesiones** propio (no NextAuth)
- **Interfaz moderna** con shadcn/ui, Tailwind CSS y Lucide React para íconos
- **Base de datos** MySQL con Prisma ORM
- **Gestión de incidencias** y movimientos
- **Panel de control** responsive
- **Tema oscuro/claro** integrado
- **Preparado para Docker**

## 📋 Prerrequisitos

- Node.js 18+ o Bun 1.0+
- MySQL 8.0+
- npm, yarn, o bun
- Git
- (Opcional) Docker y Docker Compose
- (Opcional) VS Code con las extensiones recomendadas

## 🛠️ Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <tu-repositorio>
   cd incidencias_mx
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   
   Crea un archivo `.env.local` en la raíz del proyecto y agrega:
   ```env
   DATABASE_URL="mysql://usuario:contraseña@localhost:3306/database"
   JWT_SECRET=tu_valor_secreto_unico_y_largo
   ```
   > Puedes generar un valor seguro para JWT_SECRET con: `openssl rand -hex 64`

4. **Configurar la base de datos**
   ```bash
   # Generar y ejecutar migraciones
   npx prisma migrate dev
   
   # Generar cliente de Prisma
   npx prisma generate
   
   # Insertar datos de prueba
   npm run seed
   ```

5. **Ejecutar el servidor de desarrollo**
   ```bash
   npm run dev
   ```

6. **(Opcional) Usar Docker**
   ```bash
   docker build -t incidencias-mx .
   docker run -p 3000:3000 --env-file .env.local incidencias-mx
   ```

## 🔐 Credenciales de Prueba

Después de ejecutar el `seed`, puedes usar estas credenciales:

- **Email:** `superadmin@localhost.dev`
- **Contraseña:** 123456

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── api/auth/login/     # Endpoint de login (POST)
│   ├── api/auth/logout/    # Endpoint de logout (POST)
│   ├── api/auth/me/        # Endpoint para obtener usuario autenticado (GET)
│   ├── (dashboard)/        # Panel de control (con navegación)
│   ├── login/              # Página de login (sin navegación)
│   └── layout.tsx          # Layout principal
├── components/             # Componentes reutilizables y de UI
├── prisma/                 # Esquema y migraciones de base de datos
├── public/                 # Recursos estáticos
└── registry/               # Componentes de shadcn/ui
```

## 🗄️ Esquema de Base de Datos

- **companies:** Empresas
- **offices:** Oficinas
- **users:** Usuarios del sistema (con roles y autenticación)
- **user_offices:** Tabla intermedia para la relación N:N entre usuarios y oficinas.
- **employees:** Empleados de la compañía.
- **incidents:** Tipos de incidencias (faltas, descansos, etc.).
- **movements:** Registro de movimientos/incidencias por empleado.
- **periods:** Periodos de tiempo para agrupar incidencias.

## 🎨 Stack Tecnológico

### Frontend
- **Framework:** Next.js 15 con App Router
- **Lenguaje:** TypeScript 5.2+
- **UI Components:** shadcn/ui + Radix UI
- **Estilos:** Tailwind CSS v3
- **Iconos:** Lucide React
- **Estado:** React Server Components + Server Actions
- **Formularios:** React Hook Form + Zod

### Backend
- **Runtime:** Node.js 18+ / Bun 1.0+
- **API:** Next.js Route Handlers
- **Base de datos:** MySQL 8
- **ORM:** Prisma
- **Autenticación:** JWT + httpOnly cookies
- **Seguridad:** bcrypt, CORS, rate limiting

### DevOps
- **CI/CD:** GitHub Actions
- **Containerización:** Docker + Docker Compose
- **Deployment:** Vercel / Self-hosted
- **Monitoreo:** Sentry
- **Análisis:** Vercel Analytics

## 🔐 Autenticación y Manejo de Sesión

- El login se realiza vía `/api/auth/login` (POST), que valida credenciales y genera un JWT guardado en una cookie httpOnly.
- El usuario autenticado se obtiene consultando `/api/auth/me` (GET), que lee y valida el JWT.
- El logout se realiza vía `/api/auth/logout` (POST), que elimina la cookie de sesión.
- El dashboard y la barra de navegación muestran el usuario activo y permiten cerrar sesión.
- Las rutas protegidas verifican la sesión y redirigen a `/login` si no hay usuario autenticado.

## 🚀 Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Construir para producción
- `npm run start` - Servidor de producción
- `npm run seed` - Insertar datos de prueba
- `npm run lint` - Verificar código
- `npm run format` - Formatear código

## 🔧 Desarrollo y Mantenimiento

### Configuración del Entorno de Desarrollo

1. Instalar extensiones recomendadas de VS Code:
   - Prisma VS Code Extension
   - ESLint
   - Prettier
   - Tailwind CSS IntelliSense

2. Configurar husky para pre-commits:
   ```bash
   npm run prepare
   ```

### Comandos de Desarrollo Frecuentes

#### Componentes UI
```bash
# Agregar nuevo componente de shadcn/ui
npx shadcn@latest add [component-name]

# Actualizar componentes existentes
npx shadcn@latest upgrade
```

#### Base de Datos
```bash
# Crear nueva migración
npx prisma migrate dev --name [nombre-migracion]

# Aplicar migraciones pendientes
npx prisma migrate deploy

# Actualizar cliente de Prisma
npx prisma generate

# Visualizar base de datos
npx prisma studio
```

#### Testing
```bash
# Ejecutar tests unitarios
npm run test

# Ejecutar tests e2e
npm run test:e2e
```

## 📝 Notas

- El sistema está configurado para usar MySQL como base de datos
- Las contraseñas se hashean con bcrypt antes de almacenarse
- La autenticación se realiza usando JWT y cookies httpOnly
- La interfaz es completamente responsive y soporta tema oscuro
- Todos los formularios incluyen validación con Zod
- El proyecto está preparado para ejecutarse en Docker

## 🤝 Como Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

---

![Logo del Proyecto](assets/logo-soaint-azul.png)
