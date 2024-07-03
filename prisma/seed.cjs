const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const gallery1 = await prisma.galleries.create({
    data: {
      title: 'Summer Collection',
      is_active: true,
      registered_at: new Date(),
      modified_at: new Date(),
      published_at: new Date(),
      looks: {
        create: [
          {
            mediaKey: 'summer-look-1',
            mediaUrl: 'https://example.com/summer-look-1.jpg',
            title: 'Look 1',
            isActive: true,
            shouldDisplayProduct: true,
            registeredAt: new Date(),
            modifiedAt: new Date(),
            publishedAt: new Date(),
            modelDescription: 'Model wearing summer look 1',
            products: {
              create: [
                {
                  productId: 'prod_1',
                  productHandle: 'summer-product-1',
                  spotX: 100,
                  spotY: 200,
                },
              ],
            },
          },
        ],
      },
    },
  });

  const look1 = await prisma.looks.create({
    data: {
      mediaKey: 'summer-look-2',
      mediaUrl: 'https://example.com/summer-look-2.jpg',
      title: 'Look 2',
      isActive: true,
      shouldDisplayProduct: true,
      registeredAt: new Date(),
      modifiedAt: new Date(),
      publishedAt: new Date(),
      modelDescription: 'Model wearing summer look 2',
      galleries: {
        connect: { id: gallery1.id },
      },
      products: {
        create: [
          {
            productId: 'prod_2',
            productHandle: 'summer-product-2',
            spotX: 150,
            spotY: 250,
          },
        ],
      },
    },
  });

  await prisma.gallery_looks.create({
    data: {
      galleryId: gallery1.id,
      lookId: look1.id,
      isFeatured: true,
    },
  });

  console.log({ gallery1, look1 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
