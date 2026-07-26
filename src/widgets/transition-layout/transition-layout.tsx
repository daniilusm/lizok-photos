import { memo, type ReactNode, useCallback, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { gsap } from "gsap";
import type { NextRouter } from "next/router";

import { DelayDelete, SwitchElement } from "@shared/ui/animate-presence";

import { TRANSITION_DURATION } from "./constants";
import { TransitionLayoutContext } from "./context/transition-layout-context";
import { EVENTS_TRANSITION_LAYOUT, transitionLayoutEmitter } from "./emmiter";

import s from "./transition-layout.module.scss";

export type TransitionLayoutProps = {
  children: ReactNode;
  router: NextRouter;
};

const setTransitionOrigin = (
  node: HTMLDivElement | null,
  origin: "left center" | "right center",
) => {
  if (!node) return;
  // Не через gsap transformOrigin — иначе GSAP перезапишет CSS transform
  node.style.setProperty("--transition-origin", origin);
};

export const TransitionLayout = memo(
  ({ router, children }: TransitionLayoutProps) => {
    const [_, setTransitionStarted] = useState(false);

    const $block = useRef<HTMLDivElement>(null);
    const activeTweensRef = useRef<Set<{ kill: () => void }>>(new Set());

    const key = `${router.route}-${router.locale}-${router.query?.slug}`;
    const transitionStartedRef = useRef(false);
    const prevKeyRef = useRef(key);

    if (prevKeyRef.current !== key) {
      transitionStartedRef.current = true;
      prevKeyRef.current = key;
    }

    const onEnter = useCallback((_node: HTMLElement | null) => {
      transitionLayoutEmitter.send(EVENTS_TRANSITION_LAYOUT.pageInStart);
      transitionLayoutEmitter.send(
        EVENTS_TRANSITION_LAYOUT.pageInCompleteStart,
      );

      setTransitionOrigin($block.current, "right center");

      const tween = gsap.to($block.current, {
        "--transition-progress": 0,
        pointerEvents: "none",
        duration: TRANSITION_DURATION,
        ease: "power4.inOut",
        onComplete: () => {
          activeTweensRef.current.delete(tween);
          transitionLayoutEmitter.send(EVENTS_TRANSITION_LAYOUT.pageInComplete);
        },
      });
      activeTweensRef.current.add(tween);
    }, []);

    const onLeave = useCallback((_node: HTMLElement | null) => {
      transitionLayoutEmitter.send(EVENTS_TRANSITION_LAYOUT.pageOutStart);
      setTransitionStarted(true);

      setTransitionOrigin($block.current, "left center");

      const tween = gsap.to($block.current, {
        "--transition-progress": 1,
        pointerEvents: "auto",
        duration: TRANSITION_DURATION,
        ease: "power4.inOut",
        onComplete: () => {
          activeTweensRef.current.delete(tween);
          transitionLayoutEmitter.send(
            EVENTS_TRANSITION_LAYOUT.pageOutComplete,
          );
        },
      });
      activeTweensRef.current.add(tween);
    }, []);

    const onLeaveComplete = useCallback(() => {
      flushSync(() => {
        setTransitionStarted(false);
        transitionStartedRef.current = false;
      });
      transitionLayoutEmitter.send(EVENTS_TRANSITION_LAYOUT.resetScroll);
      transitionLayoutEmitter.send(EVENTS_TRANSITION_LAYOUT.pageOutUnmount);
    }, []);

    return (
      <>
        <div ref={$block} className={s.block} />
        <SwitchElement
          mode="wait"
          transitionKey={key}
          onLeaveComplete={onLeaveComplete}
          onEnter={onEnter}
          onLeave={onLeave}
        >
          <DelayDelete timeout={TRANSITION_DURATION}>
            {({ ref, isVisible }) => (
              <main ref={ref}>
                <TransitionLayoutContext.Provider
                  value={{
                    isVisible: isVisible && !transitionStartedRef.current,
                    transitionStarted: transitionStartedRef.current,
                  }}
                >
                  {children}
                </TransitionLayoutContext.Provider>
              </main>
            )}
          </DelayDelete>
        </SwitchElement>
      </>
    );
  },
);

TransitionLayout.displayName = "TransitionLayout";
