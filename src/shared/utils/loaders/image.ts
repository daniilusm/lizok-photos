import { delayPromise } from "@shared/utils/delay";

// Типы колбэков для удобства переиспользования
type ImageLoadedCallback = (image: HTMLImageElement) => void;

type PerItemCallbackOptions = {
  loaded: number;
  length: number;
  texture: HTMLImageElement | null;
  index: number;
};

export const loaderImage = (
  src: string,
  callback: ImageLoadedCallback,
): void => {
  if (!callback || !src) {
    return;
  }

  const image = new Image();
  image.decoding = "async";

  const finish = () => {
    callback(image);
    image.onload = null;
    image.onerror = null;
  };

  image.onload = finish;
  image.onerror = finish;
  image.src = src;
};

export const promiseImageLoader = (
  src: string,
  cb?: ImageLoadedCallback,
): Promise<HTMLImageElement> =>
  new Promise<HTMLImageElement>((resolve) => {
    loaderImage(src, (image) => {
      if (cb) cb(image);
      resolve(image);
    });
  });

export const loaderAllImages = (
  images: string[],
  delay: number = 0,
  callbackFinish: (textures: (HTMLImageElement | null)[]) => void,
  callbackPerItem?: (options: PerItemCallbackOptions) => void,
): Promise<HTMLImageElement[]> => {
  let loaded = 0;

  const allPromise = Promise.all(
    images.map((el, index) =>
      delayPromise(delay * index).then(() =>
        promiseImageLoader(el, (image) => {
          loaded += 1;
          if (callbackPerItem) {
            callbackPerItem({
              loaded,
              length: images.length,
              texture: image,
              index,
            });
          }
        }),
      ),
    ),
  );

  allPromise.then((textures) => {
    callbackFinish(textures);
  });

  return allPromise;
};
