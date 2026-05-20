import { useRef, useState } from "react";
import { Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ADMIN_UPLOAD_MAX_MB, adminUploadImage } from "@/api/admin-api";
import { cn } from "@/utils/cn";

interface AdminImageUploadFieldProps {
  /** Current image URL (controlled). */
  value: string;
  onUrlChange: (url: string) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Upload JPEG/PNG to Cloudinary via the admin API, or paste a URL.
 * Max size matches backend `UPLOAD_MAX_IMAGE_MB` default (see {@link ADMIN_UPLOAD_MAX_MB}).
 */
export function AdminImageUploadField({ value, onUrlChange, disabled, className }: AdminImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const pickFile = () => {
    setLocalError(null);
    inputRef.current?.click();
  };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    setLocalError(null);
    try {
      const { url } = await adminUploadImage(file);
      onUrlChange(url);
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,.jpg,.jpeg,.png"
        className="hidden"
        onChange={onFile}
        aria-hidden
      />
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled || busy}
          onClick={pickFile}
          className="border-[rgba(145,158,171,0.32)]"
        >
          {busy ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
              Uploading…
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" aria-hidden />
              Upload image
            </>
          )}
        </Button>
        <span className="text-xs text-[#919eab]">
          JPG or PNG · max {ADMIN_UPLOAD_MAX_MB} MB · URL is saved to the database
        </span>
      </div>
      {localError && (
        <p className="text-xs font-medium text-[#ff5630]" role="alert">
          {localError}
        </p>
      )}
      {value.trim() ? (
        <p className="truncate text-xs text-[#637381]" title={value.trim()}>
          Current: {value.trim()}
        </p>
      ) : null}
    </div>
  );
}
