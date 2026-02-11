import { db, pool } from '../src/index';
import * as bcrypt from 'bcrypt';

async function main() {
  const hashedPassword = await bcrypt.hash('root', 10);

  await db.user.upsert({
    where: { email: 'admin@corporate.com' },
    update: {},
    create: {
      email: 'admin@corporate.com',
      name: 'Adminchik',
      password: hashedPassword,
      role: 'ADMIN',
    },
    select: { _count: true },
  });

  const user = await db.user.upsert({
    where: { email: 'user@corporate.com' },
    update: {},
    create: {
      name: 'Userochek',
      email: 'user@corporate.com',
      password: hashedPassword,
      role: 'USER',
    },
    select: { id: true },
  });

  await db.feedback.createMany({
    data: [
      {
        title: 'Организовать время для йоги',
        content:
          'Предлагаю выделить 15-20 минут в середине дня для легкой йоги или растяжки. Это поможет команде размяться и повысить продуктивность.',
        category: 'OFFICE',
        isAnonymous: false,
        isPrivate: false,
        authorId: user.id,
      },
      {
        title: 'Сокращенная пятница',
        content: 'Предлагаю сделать пятницу сокращенным днем!',
        category: 'OTHER',
        isAnonymous: true,
        isPrivate: false,
        authorId: user.id,
      },
      {
        title: 'Доступы',
        content: 'Как получить доступ к корпоративной библиотеке?',
        category: 'PROCESSES',
        isAnonymous: false,
        isPrivate: true,
        authorId: user.id,
      },
    ],
  });

  console.log(
    'packages/db/prisma/seed.ts: Seed completed successfully. Admin, User and 3 Feedbacks created.',
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
    await pool.end();
  });
