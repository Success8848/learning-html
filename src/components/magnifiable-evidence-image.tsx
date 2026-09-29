import { useRef, useState, type PointerEvent } from "react";
import { ZoomIn, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

type LensPosition = {
  left: number;
  top: number;
  backgroundPosition: string;
  backgroundSize: string;
};

const lensSize = 208;
const zoomFactor = 3;

export function MagnifiableEvidenceImage({ src, alt }: { src: string; alt: string }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const [mode, setMode] = useState<"none" | "magnify" | "enhance">("none");
  const [lens, setLens] = useState<LensPosition | null>(null);

  function moveLens(event: PointerEvent<HTMLDivElement>) {
    if (mode === "none" || event.pointerType === "touch") return;

    const stage = stageRef.current?.getBoundingClientRect();
    const image = imageRef.current?.getBoundingClientRect();

    if (!stage || !image || image.width === 0 || image.height === 0) return;

    const imageElement = imageRef.current;

    if (!imageElement?.naturalWidth || !imageElement.naturalHeight) return;

    const scale = Math.min(
      image.width / imageElement.naturalWidth,
      image.height / imageElement.naturalHeight,
    );

    const visibleWidth = imageElement.naturalWidth * scale;
    const visibleHeight = imageElement.naturalHeight * scale;

    const visibleLeft = image.left + (image.width - visibleWidth) / 2;
    const visibleTop = image.top + (image.height - visibleHeight) / 2;

    const imageX = event.clientX - visibleLeft;
    const imageY = event.clientY - visibleTop;

    if (
      imageX < 0 ||
      imageY < 0 ||
      imageX > visibleWidth ||
      imageY > visibleHeight
    ) {
      setLens(null);
      return;
    }

    const radius = lensSize / 2;

    if (mode === "magnify") {
      setLens({
        left: event.clientX - stage.left - radius,
        top: event.clientY - stage.top - radius,
        backgroundPosition: `${radius - imageX * zoomFactor}px ${
          radius - imageY * zoomFactor
        }px`,
        backgroundSize: `${visibleWidth * zoomFactor}px ${
          visibleHeight * zoomFactor
        }px`,
      });
    } else {
      // Enhancement mode: same-size image with stronger clarity,
      // contrast and sharpness without zooming.
      setLens({
        left: event.clientX - stage.left - radius,
        top: event.clientY - stage.top - radius,
        backgroundPosition: `${radius - imageX}px ${
          radius - imageY
        }px`,
        backgroundSize: `${visibleWidth}px ${visibleHeight}px`,
      });
    }
  }

  function setMagnifyMode() {
    setMode((current) => (current === "magnify" ? "none" : "magnify"));
    setLens(null);
  }

  function setEnhanceMode() {
    setMode((current) => (current === "enhance" ? "none" : "enhance"));
    setLens(null);
  }

  return (
    <div
      ref={stageRef}
      onPointerMove={moveLens}
      onPointerLeave={() => setLens(null)}
      className={`relative flex h-full w-full items-center justify-center overflow-hidden ${
        mode !== "none" ? "cursor-crosshair" : ""
      }`}
    >
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        className="h-full w-full object-contain"
      />

      {/* Magnify button */}
      <Button
        type="button"
        size="icon"
        variant={mode === "magnify" ? "default" : "secondary"}
        aria-label={
          mode === "magnify"
            ? "Turn off photo magnifier"
            : "Turn on photo magnifier"
        }
        aria-pressed={mode === "magnify"}
        title={
          mode === "magnify"
            ? "Turn off photo magnifier"
            : "Magnify evidence"
        }
        onClick={setMagnifyMode}
        className="absolute right-16 top-4 z-20 shadow-md"
      >
        <ZoomIn />
      </Button>

      {/* Enhancement button */}
      <Button
        type="button"
        size="icon"
        variant={mode === "enhance" ? "default" : "secondary"}
        aria-label={
          mode === "enhance"
            ? "Turn off evidence enhancement"
            : "Enhance evidence"
        }
        aria-pressed={mode === "enhance"}
        title={
          mode === "enhance"
            ? "Turn off enhancement"
            : "Enhance evidence"
        }
        onClick={setEnhanceMode}
        className="absolute right-4 top-4 z-20 shadow-md"
      >
        <Sparkles />
      </Button>

      {/* Magnifying / enhancement lens */}
      {mode !== "none" && lens && (
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute z-10 rounded-full border-2 border-white bg-no-repeat shadow-[0_0_0_1px_rgba(0,0,0,0.7),0_8px_28px_rgba(0,0,0,0.55)] ${
            mode === "enhance" ? "enhancement-lens" : ""
          }`}
          style={{
            left: lens.left,
            top: lens.top,
            width: lensSize,
            height: lensSize,
            backgroundImage: `url("${src}")`,
            backgroundSize: lens.backgroundSize,
            backgroundPosition: lens.backgroundPosition,
            ...(mode === "enhance"
              ? {
                  filter:
                    "contrast(1.45) brightness(1.08) saturate(1.08)",
                }
              : {}),
          }}
        />
      )}
    </div>
  );
}
