import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import { PrismaClient } from '@prisma/client';
import { projectRoutes } from './src/routes/projects.js';
import { jobRoutes } from './src/routes/jobs.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// DB 마이그레이션 (스키마 → SQLite 자동 동기화)
execFileSync('npx', ['prisma', 'db', 'push', '--skip-generate'], {
  cwd: __dirname,
  stdio: 'inherit',
});

const prisma = new PrismaClient();

const app = Fastify({ logger: true });

app.decorate('prisma', prisma);

app.register(projectRoutes);
app.register(jobRoutes);

// SPA 정적 파일 서빙 (빌드된 dist 디렉토리)
const distDir = join(__dirname, 'dist');
if (existsSync(distDir)) {
  app.register(fastifyStatic, {
    root: distDir,
    prefix: '/',
    wildcard: false,
  });

  // SPA fallback — /api 외 모든 GET을 index.html로
  app.setNotFoundHandler((req, reply) => {
    if (req.method === 'GET' && !req.url.startsWith('/api/')) {
      return reply.sendFile('index.html');
    }
    reply.code(404).send({ error: 'Not found' });
  });
}

const PORT = Number(process.env.PORT) || 3333;

app.listen({ port: PORT }, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  console.log(`\n  Claude Worker UI: http://localhost:${PORT}\n`);
});
