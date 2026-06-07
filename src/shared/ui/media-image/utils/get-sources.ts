import type {
  BreakpointKeys,
  ImageProxySourceItem,
  MediaBreakpointKeys,
  RebuiltImage,
} from "@shared/types";
import { BREAKPOINTS, IMAGE_BREAKPOINTS } from "@/shared/config/breakpoints";

type SourceKeys = MediaBreakpointKeys;

type SourceObject = {
  srcSet: string;
  src: string;
  media: string;
  type: string;
  breakpointSize: number;
  sizes: string;
  altText: string | null;
};

/**
 * Создает строку srcSet для изображения с указанными размерами
 */
const createSrcSet = (url: string, sizes: number[]): string => {
  return sizes.map((size) => `${url} ${size}w`).join(", ");
};

const createSrcSetFromArray = (urls: ImageProxySourceItem[]) => {
  return urls.map((item) => `${item.url} ${item.size}w`).join(", ");
};

/**
 * Получает все доступные размеры изображений из конфигурации
 */
export const getImageSizes = (): number[] => {
  const sizes: number[] = [];
  for (const size of Object.values(IMAGE_BREAKPOINTS)) {
    if (size !== null) {
      sizes.push(size);
    }
  }
  return sizes;
};

/**
 * Получает размер breakpoint для ключа
 */
const getBreakpointSize = (key: SourceKeys): number | undefined => {
  return key === "default" ? undefined : BREAKPOINTS[key as BreakpointKeys];
};

/**
 * Создает media query для breakpoint
 */
const createMediaQuery = (key: SourceKeys, breakpointSize?: number): string => {
  if (key === "default") {
    return "(min-width: 0px)";
  }
  return `(max-width: ${breakpointSize}px)`;
};

/**
 * Создает srcSet строку из источника изображения
 * Использует массив source если доступен, иначе генерирует из URL и размеров
 */
const createSrcSetFromImage = (
  image: RebuiltImage,
  fallbackSizes: number[],
): string => {
  return image.source && image.source.length > 0
    ? createSrcSetFromArray(image.source)
    : createSrcSet(image.url, fallbackSizes);
};

/**
 * Создает объект source для picture элемента
 */
const createSourceObject = (
  key: SourceKeys,
  image: RebuiltImage,
  sizes: string,
): SourceObject => {
  const breakpointSize = getBreakpointSize(key);
  const imageSizes = getImageSizes();
  const allSizes = [...imageSizes, image.width || 0];

  const srcSet = createSrcSetFromImage(image, allSizes);
  const defaultSrc = createSrcSet(image.url, [IMAGE_BREAKPOINTS.xs]).split(
    " ",
  )[0];

  return {
    srcSet,
    src: defaultSrc,
    media: createMediaQuery(key, breakpointSize),
    type: image.mime || "image/webp",
    breakpointSize: key === "default" ? 0 : breakpointSize || 0,
    sizes,
    altText: image.alt || null,
  };
};

/**
 * Фильтрует валидные записи источника (исключает id и null значения)
 */
const isValidSourceEntry = (
  entry: [string, RebuiltImage | undefined],
): entry is [string, RebuiltImage] => {
  const [key, value] = entry;
  return key !== "id" && value !== undefined && value !== null;
};

/**
 * Преобразует объект с breakpoint ключами в массив source объектов для picture элемента
 */
export const getSources = (
  source: Partial<Record<SourceKeys, RebuiltImage>>,
  sizes: string,
): SourceObject[] => {
  const sourcesObjects = Object.entries(source)
    .filter(isValidSourceEntry)
    .map(([key, value]) => createSourceObject(key as SourceKeys, value, sizes))
    .sort((a, b) => a.breakpointSize - b.breakpointSize);

  // Перемещаем default в конец (он должен быть последним в picture)
  const defaultIndex = sourcesObjects.findIndex((s) => s.breakpointSize === 0);
  if (defaultIndex === -1) {
    return sourcesObjects;
  }

  const [defaultSource] = sourcesObjects.splice(defaultIndex, 1);
  return [...sourcesObjects, defaultSource];
};
