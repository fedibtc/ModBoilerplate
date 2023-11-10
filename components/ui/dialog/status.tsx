import Icon, { IconKey } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { styled } from "@/components/ui/utils/styled";
import { cva } from "class-variance-authority";
import { useEffect, useRef, useState } from "react";

export interface DialogStatusProps {
  status: "success" | "error" | "loading";
  title?: React.ReactNode;
  description?: React.ReactNode;
}

/**
 * Shows either a success or error confirmation, after the dialog status has finished loading.
 */
export const DialogStatus: React.FC<DialogStatusProps> = ({
  status,
  title,
  description,
}) => {
  const [backgroundRotation, setBackgroundRotation] = useState(0);
  const [expandedScale, setExpandedScale] = useState(3);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const icon: IconKey | undefined =
    status === "success"
      ? "IconCheck"
      : status === "error"
      ? "IconAlertCircleFilled"
      : undefined;

  // Rotate while in loading status
  useEffect(() => {
    if (status !== "loading") return;
    let isRotating = true;
    let prevTime = 0;
    const rotate = (time: number) => {
      if (!isRotating) return;
      if (!prevTime) prevTime = time;
      setBackgroundRotation((deg) => deg + (time - prevTime) * 0.1);
      requestAnimationFrame(rotate);
      prevTime = time;
    };
    requestAnimationFrame(rotate);
    return () => {
      isRotating = false;
    };
  }, [status]);

  // Measure the necessary scale based on parent size. Re-run on status
  // change so we have up-to-date sizing on status change.
  useEffect(() => {
    const containerEl = containerRef.current;
    const contentEl = contentRef.current;
    if (!containerEl || !contentEl) return;
    const parentEl = containerEl.offsetParent;
    if (!parentEl) return;
    // Calculate necessary scale using larger of width or height
    const contentRect = contentEl.getBoundingClientRect();
    const parentRect = parentEl.getBoundingClientRect();
    const scaleDelta = Math.max(
      parentRect.width / contentRect.width,
      parentRect.height / contentRect.height,
    );
    // Expand further than delta due to circle having cut off corners
    setExpandedScale(scaleDelta * 1.333);
  }, [status]);

  return (
    <Container ref={containerRef}>
      <StatusBackground
        status={status}
        style={
          {
            "--rotation": `${backgroundRotation}deg`,
            "--scale": status === "loading" ? 1.04 : expandedScale,
          } as React.CSSProperties
        }
      />
      <Content ref={contentRef}>
        {icon && <Icon size="md" icon={icon} />}
        {title && (
          <Text variant="h2" weight="medium">
            {title}
          </Text>
        )}
        {description && <Text variant="caption">{description}</Text>}
      </Content>
    </Container>
  );
};

const Container = styled(
  "div",
  cva("absolute inset-0 bg-white animate-fadeIn"),
)(({ props: { className, ...props }, cn }) => (
  <div {...props} className={cn({ className })} />
));

const Content = styled(
  "div",
  cva(
    "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80%] max-w-[280px] aspect-square rounded-full z-[2] flex flex-col justify-center items-center text-center gap-[8px] bg-white",
  ),
)(({ props: { className, ...props }, cn }) => (
  <div {...props} className={cn({ className })} />
));

const StatusBackground = styled(
  "div",
  cva(
    "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80%] max-w-[280px] aspect-square rounded-full z-[1] rotate-[var(--rotation)] scale-[var(--scale)] transition-all duration-500",
    {
      variants: {
        status: {
          success: "bg-holo-600",
          error: "bg-extraLightGrey",
          loading: "bg-holo-600 transition-none",
        },
      },
    },
  ),
)(({ props: { status, className, ...props }, cn }) => (
  <div {...props} className={cn({ status, className })} />
));
