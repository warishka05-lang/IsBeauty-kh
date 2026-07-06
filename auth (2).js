generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String   @id @default(cuid())
  login        String   @unique
  passwordHash String
  role         String   @default("admin")
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model SiteContent {
  id        String   @id @default("main")
  payload   Json
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
