import { Logger } from '@nestjs/common';
import { Prisma, PrismaClient, Role, RoleName, User, UserCredentialProvider } from '@prisma/client';

const prisma = new PrismaClient();

const roleCreationData: Prisma.RoleCreateInput[] = [
  {
    name: RoleName.ADMIN,
  },
  {
    name: RoleName.USER,
  },
];

const userCreationData: Prisma.UserCreateInput[] = [
  {
    userThirdPartyCredential: {
      create: {
        sub: '1',
        provider: UserCredentialProvider.GOOGLE,
      },
    },
    userContactDetail: {
      create: {
        email: '1@example.com',
      },
    },
    userProfile: {
      create: {
        name: 'test-user-1',
      },
    },
    userRoles: {
      create: {
        role: {
          connect: {
            id: 1,
          },
        },
      },
    },
  },
  {
    userThirdPartyCredential: {
      create: {
        sub: '2',
        provider: UserCredentialProvider.GOOGLE,
      },
    },
    userContactDetail: {
      create: {
        email: '2@example.com',
      },
    },
    userProfile: {
      create: {
        name: 'test-user-2',
      },
    },
    userRoles: {
      create: {
        role: {
          connect: {
            id: 2,
          },
        },
      },
    },
  },
];

const doSeedRoles = async (createInputs: Prisma.RoleCreateInput[]) => {
  const roles: Prisma.Prisma__RoleClient<Role>[] = [];
  for (const input of createInputs) {
    const createRole = prisma.role.create({
      data: input,
    });
    roles.push(createRole);
  }
  return await prisma.$transaction(roles);
};

const doSeedUsers = async (createInputs: Prisma.UserCreateInput[]) => {
  const users: Prisma.Prisma__UserClient<User>[] = [];
  for (const input of createInputs) {
    const createUser = prisma.user.create({
      data: input,
    });
    users.push(createUser);
  }
  return await prisma.$transaction(users);
};

const main = async () => {
  Logger.log(`Start seeding ...`);

  await doSeedRoles(roleCreationData);
  await doSeedUsers(userCreationData);

  Logger.log(`Seeding finished.`);
};

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
