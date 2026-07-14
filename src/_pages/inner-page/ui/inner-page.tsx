import {
  type ComponentProps,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import clsx from "clsx";
import { useRouter } from "next/router";

import { projects } from "@/shared/stub/projects";
import { ParallaxScrollContainer } from "@/shared/ui/parallax-scroll-container";

import { getCloudinaryPreviewUrl } from "../lib/get-cloudinary-image-url";
import { InnerPageGridItem } from "./inner-page-grid-item";
import { InnerPagePreview } from "./inner-page-preview";

import s from "./inner-page.module.scss";

export type InnerPageProps = ComponentProps<"div"> & {
  className?: string;
};

export const InnerPage = (props: InnerPageProps) => {
  const { className } = props;

  const { query } = useRouter();

  const currentProject = useMemo(() => {
    return projects.find((item) => item.slug === query.slug);
  }, [query.slug]);

  const [currentIndexHover, setCurrentIndexHover] = useState(0);

  const handleSelect = useCallback((index: number) => {
    setCurrentIndexHover(index);
  }, []);

  const images = currentProject?.images ?? [];

  useEffect(() => {
    setCurrentIndexHover(0);
  }, [query.slug]);

  useEffect(() => {
    if (!images.length) return;

    for (const index of [currentIndexHover - 1, currentIndexHover + 1]) {
      const image = images[index];

      if (!image) continue;

      const preloader = new window.Image();
      preloader.decoding = "async";
      preloader.src = getCloudinaryPreviewUrl(image.url);
    }
  }, [currentIndexHover, images]);

  if (!currentProject) {
    return null;
  }

  return (
    <ParallaxScrollContainer className={clsx(s.root, className)}>
      <div className={s.list}>
        {images.map((item, index) => (
          <InnerPageGridItem
            key={item.url}
            url={item.url}
            index={index}
            isActive={currentIndexHover === index}
            onSelect={handleSelect}
          />
        ))}
      </div>

      <InnerPagePreview
        images={images}
        activeIndex={currentIndexHover}
        slug={query.slug}
      />
    </ParallaxScrollContainer>
  );
};

InnerPage.displayName = "InnerPage";
