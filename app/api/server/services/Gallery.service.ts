import { PrismaClient } from '@prisma/client';

import { MediaService } from '~/api/server/services/Media.service';
import type { GalleryResponse } from '~/api/types/Gallery.type';
import type { LookRequest } from '~/api/types/Look.type';


import { GalleryLookService } from "./GalleryLook.service.js";
import { addWidthQuery } from "../utils/urlUtils.js";

const prisma = new PrismaClient();

/**
 * ギャラリーに関するビジネスロッジクを管理する
 */
export class GalleryService {
  /**
   * ギャラリーを全件取得します。Ï
   * @returns ギャラリー一覧
   */
  static getAll = async () => {
    const galleries = await prisma.galleries.findMany({
      orderBy: { id: 'desc' },
      include: { looks: true },
    });
    if (!galleries.length) return [];

    const medias = await MediaService.getAll();
    return galleries.map((gallery) => makeResponse(gallery, medias));
  };

  /**
   * 指定されたIDを元にギャラリーを取得します。
   * @param id ギャラリーID
   * @returns ギャラリー
   */
  static getById = async (id: number) => {
    const gallery = await prisma.galleries.findUnique(
      {
        where: { id },
        include: { looks: true },
      });
    if (gallery == null) return null;

    const medias = await MediaService.getAll();
    return makeResponse(gallery, medias);
  };

  /**
   * 指定されたIDを元にギャラリーを取得します。Mediaはshopifyから取得しません。
   * そのため、sessionは不要です。
   *
   * NOTICE:
   *  なぜかここでproductの順序を変更しようとすると、Lookの順序も変わってしまうので、
   *  js側でproductの順序を変更する。
   *
   * @param id ギャラリーID
   * @returns ギャラリー
   */
  static getByIdWithoutMedia = async (id: number) => {
    const gallery = await prisma.galleries.findUnique({
      where: { id },
      include: {
        looks: {
          include: {
            products: {
              select: {
                productId: true,
                productHandle: true,
              },
            },
          },
          where: {
            isActive: true,
            OR: [
              {
                publishedAt: null,
                unpublishedAt: null,
              },
              {
                publishedAt: null,
                unpublishedAt: { gt: new Date() },
              },
              {
                publishedAt: { lt: new Date() },
                unpublishedAt: null,
              },
              {
                publishedAt: { lt: new Date() },
                unpublishedAt: { gt: new Date() },
              } ],
          },
        },
      },
    });
    if (gallery == null) return null;

    return makeResponseWithoutMedia(gallery);
  };

  /**
   * ギャラリーを作成します。
   * @param title タイトル
   * @param looks ギャラリーに紐付くルック一覧
   * @returns 作成されたギャラリー
   */
  static create = async (title: string, looks: LookRequest[]) => {
    const now = new Date();
    const createdGallery = await prisma.galleries.create({
      data: {
        title,
        isActive: false,
        registeredAt: now,
        modifiedAt: now,
      },
      include: { looks: true }, // 必要に応じて関連するlooksを含める
    });

    // ギャラリーとルックの中間テーブルも作成
    await GalleryLookService.create(createdGallery.id, looks);
    return { ...createdGallery, looks };
  };

  /**
   * 指定されたIDのギャラリーを更新します。
   * @param id 更新対象のギャラリーID
   * @param title タイトル
   * @param isActive 有効/無効
   * @returns 更新された数
   */
  static update = async (
    id: number,
    title: string,
    isActive: boolean,
  ) => {
    // ギャラリーを更新
    await prisma.galleries.update({
      where: { id },
      data: {
        title,
        isActive,
        modifiedAt: new Date(),
      },
      include: { looks: true },
    });

    // ギャラリーとルックの中間テーブルも更新
    const updateGallery = await prisma.gallery_looks.findUnique({
      where: { id },
      include: { looks: true },
    });

    // 更新後のギャラリーを取得して返す
    return makeResponse(updateGallery, []);
  };

  /**
   * 指定されたIDのギャラリーを削除します。
   * @param id 削除対象のギャラリーID
   * @returns 削除 成功/失敗
   */
  static remove = async (id: number | number[]) => {
    const destroyedCount = await prisma.galleries.deleteMany({
      where: { id: { in: typeof id === 'number' ? [ id ] : id } },
    });

    return destroyedCount.count > 0;
  };
}

/**
 * レスポンスを作成します。
 * @param gallery ギャラリー
 * @param medias メディア一覧
 * @returns レスポンス
 */
const makeResponse = async (gallery: Gallery, medias): Promise<GalleryResponse> => {
  // ギャラリーと画像を紐付けてレスポンスを生成
  const looks =
    gallery?.looks?.map((look) => ({
      ...look,
      isFeatured: look.galleryLook?.isFeatured ?? false,
      mediaUrl: medias.find((media) => look.mediaKey === media.key)?.public_url,
    })) ?? [];
  return { ...gallery, looks };
};

const makeResponseWithoutMedia = (gallery: Gallery): GalleryResponse => {
  const looks =
    gallery?.looks?.map((look) => ({
      ...look,
      isFeatured: look.galleryLook?.isFeatured ?? false,
      mediaUrl: addWidthQuery(look.mediaUrl),
    })) ?? [];
  return { ...gallery, looks };
};
