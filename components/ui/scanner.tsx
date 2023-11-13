import QrScanner from "qr-scanner";
import { useEffect, useRef } from "react";

export default function Scanner({
  scanning,
  onResult,
  onError,
}: {
  scanning: boolean;
  onResult: (result: string) => void;
  onError: (error: string) => void;
}) {
  const res = useRef<string | null>(null);
  const err = useRef<string | null>(null);
  const ref = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);

  useEffect(() => {
    (async () => {
      if (!ref.current) return;

      if (scanning) {
        scannerRef.current = new QrScanner(
          ref.current,
          (result) => {
            if (result && res.current !== result.data) {
              res.current = result.data;
              onResult(result.data);
              if (scannerRef.current) {
                scannerRef.current.stop();
                scannerRef.current.$overlay?.remove();
              }
            }
          },
          {
            onDecodeError: (error) => {
              if (typeof error === "string" && err.current !== error) {
                err.current = error;
                onError(error);
              } else if (
                typeof error !== "string" &&
                err.current !== error.message
              ) {
                err.current = error.message;
                onError(error.message);
              }
            },
            highlightScanRegion: true,
            highlightCodeOutline: true,
            preferredCamera: "environment",
          },
        );
        scannerRef.current.setInversionMode("both");
        await scannerRef.current.start();
      } else if (scannerRef.current) {
        scannerRef.current.destroy();
        res.current = null;
        err.current = null;
        scannerRef.current = null;
      }
    })();
  }, [scanning, ref]);

  return (
    <video
      ref={ref}
      className={`rounded-xl overflow-hidden aspect-square grow w-full max-w-[480px] ${
        scanning ? "block" : "hidden"
      } object-cover`}
    />
  );
}
