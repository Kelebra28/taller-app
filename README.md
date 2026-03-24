# Taller App (Next.js 15 + React 19 + Prisma 6 + MySQL)

## Setup
1) Crea `.env`:
```bash
DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/DB_NAME"
AUTH_SECRET="pon_una_cadena_larga_random_larga"
AUTH_COOKIE_NAME="taller_session"
AUTH_COOKIE_SECURE="false"
```

2) Instala y sincroniza DB:
```bash
npm install
npm run db:push
```

3) Crea admin inicial:
```bash
ADMIN_EMAIL="admin@taller.com" ADMIN_PASSWORD="Admin123!" npm run seed:admin
```

4) Corre:
```bash
npm run dev
```

- Operación: /empleados
- Admin: /admin/login

## Vercel
En Vercel pon `AUTH_COOKIE_SECURE=true` y `DATABASE_URL`.
