import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const passwordHash = await bcrypt.hash('password123', 12);

  const alice = await prisma.user.upsert({
    where: { email: 'alice@forge.dev' },
    update: {},
    create: {
      email: 'alice@forge.dev',
      name: 'Alice Chen',
      passwordHash,
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: 'bob@forge.dev' },
    update: {},
    create: {
      email: 'bob@forge.dev',
      name: 'Bob Martinez',
      passwordHash,
    },
  });

  const workspace = await prisma.workspace.upsert({
    where: { slug: 'acme' },
    update: {},
    create: {
      name: 'Acme Corp',
      slug: 'acme',
      description: 'Demo workspace for Forge',
      ownerId: alice.id,
      members: {
        create: [
          { userId: alice.id, role: 'OWNER' },
          { userId: bob.id, role: 'MEMBER' },
        ],
      },
    },
  });

  await prisma.workspaceMember.upsert({
    where: {
      workspaceId_userId: { workspaceId: workspace.id, userId: bob.id },
    },
    update: {},
    create: { workspaceId: workspace.id, userId: bob.id, role: 'MEMBER' },
  });

  const project = await prisma.project.upsert({
    where: {
      workspaceId_key: { workspaceId: workspace.id, key: 'FORGE' },
    },
    update: {},
    create: {
      name: 'Forge Platform',
      key: 'FORGE',
      description: 'Build the enterprise project management platform',
      status: 'IN_PROGRESS',
      workspaceId: workspace.id,
      creatorId: alice.id,
      leadId: alice.id,
    },
  });

  const existingIssues = await prisma.issue.count({
    where: { projectId: project.id },
  });

  if (existingIssues === 0) {
    await prisma.issue.createMany({
      data: [
        {
          number: 1,
          title: 'Set up monorepo scaffold',
          description: 'npm workspaces, Vite, Express, Prisma',
          status: 'DONE',
          priority: 'HIGH',
          order: 1,
          projectId: project.id,
          reporterId: alice.id,
          assigneeId: alice.id,
        },
        {
          number: 2,
          title: 'Define core data model',
          description: 'User, Workspace, Project, Issue',
          status: 'DONE',
          priority: 'HIGH',
          order: 2,
          projectId: project.id,
          reporterId: alice.id,
          assigneeId: alice.id,
        },
        {
          number: 3,
          title: 'Implement auth and REST API',
          description: 'JWT auth + CRUD for workspaces, projects, issues',
          status: 'IN_PROGRESS',
          priority: 'URGENT',
          order: 1,
          projectId: project.id,
          reporterId: alice.id,
          assigneeId: bob.id,
        },
        {
          number: 4,
          title: 'Build issue board UI',
          description: 'Kanban board with drag-and-drop',
          status: 'TODO',
          priority: 'HIGH',
          order: 1,
          projectId: project.id,
          reporterId: alice.id,
          assigneeId: null,
        },
        {
          number: 5,
          title: 'Add real-time updates',
          description: 'WebSocket or polling for live board',
          status: 'BACKLOG',
          priority: 'MEDIUM',
          order: 1,
          projectId: project.id,
          reporterId: bob.id,
          assigneeId: null,
        },
      ],
    });
  }

  console.log('✅ Seed complete');
  console.log('   alice@forge.dev / password123  (owner)');
  console.log('   bob@forge.dev   / password123  (member)');
  console.log(`   Workspace: ${workspace.slug} (${workspace.id})`);
  console.log(`   Project:   ${project.key} (${project.id})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
