import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();
async function main() {
  const superAdminRole = await prisma.roles.createMany({
    data: [
      { id: 1, role: 'SUPER_ADMIN', context: 'MT' },
      { id: 2, role: 'ADMIN', context: 'MT' },
      { id: 3, role: 'MANAGER', context: 'MT' },
      { id: 4, role: 'DEVELOPER', context: 'MT' },
      { id: 5, role: 'ADMIN', context: 'CLIENT' },
      { id: 6, role: 'USER', context: 'CLIENT' },
    ],
  });

  const passwordHashed = await argon2.hash('123456');

  const addUsers = await prisma.users.createMany({
    data: [
      {
        uid: 'MANUSH-123987',
        email: 'admin@test.test',
        phone: '01711355057',
        name: 'Abir Rahman',
        password: passwordHashed,
        userWeight: 10,
        roleId: 1,
        isMfaEnabled: false,
        isPasswordValid: true,
        isPasswordResetRequired: false,
        lastPasswordResetDate: new Date(),
      },
      {
        uid: 'MANUSH-123988',
        email: 'admin2@test.test',
        phone: '01711355058',
        name: 'John Doe',
        password: passwordHashed,
        userWeight: 8,
        roleId: 2,
        isMfaEnabled: false,
        isPasswordValid: true,
        isPasswordResetRequired: false,
        lastPasswordResetDate: new Date(),
      },
      {
        uid: 'MANUSH-123989',
        email: 'manager@test.test',
        phone: '01711355059',
        name: 'Jane Smith',
        password: passwordHashed,
        userWeight: 7,
        roleId: 3,
        isMfaEnabled: true,
        isPasswordValid: true,
        isPasswordResetRequired: false,
        lastPasswordResetDate: new Date(),
      },
      {
        uid: 'MANUSH-123990',
        email: 'user@test.test',
        phone: '01711355060',
        name: 'Alice Johnson',
        password: passwordHashed,
        userWeight: 6,
        roleId: 6,
        isMfaEnabled: false,
        isPasswordValid: true,
        isPasswordResetRequired: false,
        lastPasswordResetDate: new Date(),
      },
      {
        uid: 'MANUSH-123991',
        email: 'user2@test.test',
        phone: '01711355061',
        name: 'Bob Williams',
        password: passwordHashed,
        userWeight: 5,
        roleId: 6,
        isMfaEnabled: false,
        isPasswordValid: true,
        isPasswordResetRequired: false,
        lastPasswordResetDate: new Date(),
      },
      {
        uid: 'MANUSH-123992',
        email: 'user3@test.test',
        phone: '01711355062',
        name: 'Charlie Brown',
        password: passwordHashed,
        userWeight: 4,
        roleId: 6,
        isMfaEnabled: false,
        isPasswordValid: true,
        isPasswordResetRequired: false,
        lastPasswordResetDate: new Date(),
      },
    ],
  });

  const addProducts = await prisma.products.createMany({
    data: [
      {
        name: 'Product 1',
        description: 'Description 1',
        currentPrice: 100,
        perUnit: 10,
        availableQuantity: 5000,
        unit: 'GRAM',
        createdBy: 1,
      },
      {
        name: 'Product 2',
        description: 'Description 2',
        currentPrice: 200,
        perUnit: 5,
        availableQuantity: 3000,
        unit: 'GRAM',
        createdBy: 2,
      },
      {
        name: 'Product 3',
        description: 'Description 3',
        currentPrice: 500,
        perUnit: 40,
        availableQuantity: 2000,
        unit: 'GRAM',
        createdBy: 1,
      },
      {
        name: 'Product 4',
        description: 'Description 4',
        currentPrice: 900,
        perUnit: 500,
        availableQuantity: 10000,
        unit: 'GRAM',
        createdBy: 2,
      },
      {
        name: 'Product 5',
        description: 'Description 5',
        currentPrice: 40,
        perUnit: 5,
        availableQuantity: 10500,
        unit: 'GRAM',
        createdBy: 1,
      },
    ],
  });

  const addPromotions = await prisma.promotions.createMany({
    data: [
      {
        title: 'Promo 1',
        secondTitle: 'Discount 1',
        minimumRange: 300,
        maximumRange: 500,
        discountAmount: 2,
        perQuantity: 500,
        description: 'Discount! Discount!',
        startDate: new Date().toISOString(),
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
        createdBy: 1,
        type: "WEIGHTED",
        unit: "GRAM"

      },
      {
        title: 'Promo 2',
        secondTitle: 'Discount 2',
        minimumRange: 501,
        maximumRange: 950,
        discountAmount: 4,
        perQuantity: 500,
        description: 'Discount 4 tk per 500 gram!',
        startDate: new Date().toISOString(),
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
        createdBy: 1,
        type: "WEIGHTED",
        unit: "GRAM"
      }, {
        title: 'Fixed 1',
        secondTitle: 'Fixed Discount',
        discountAmount: 5,
        description: 'Discount 5 tk',
        startDate: new Date().toISOString(),
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
        type: "FIXED",
        createdBy: 2,
      },
      {
        title: 'Percentage 1',
        secondTitle: '3% Discount ',
        discountAmount: 3,
        description: 'Discount upto 5%',
        startDate: new Date().toISOString(),
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
        type: "PERCENTAGE",
        createdBy: 2,
      },
    ],
  });

  console.log({ addUsers, superAdminRole, addProducts, addPromotions });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
