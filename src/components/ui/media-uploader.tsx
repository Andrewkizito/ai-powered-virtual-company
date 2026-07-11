import { useState, useRef } from "react"
import { uploadData, getUrl } from "aws-amplify/storage"
import { v4 as uuidv4 } from "uuid"
import { toast } from "sonner"
import { IoClose, IoCloudUpload } from "react-icons/io5"
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "./attachment"
import { Spinner } from "./spinner"

const CustomMediaUploader = () => {
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle")
  const [progress, setProgress] = useState(0)
  const [uploadedKey, setUploadedKey] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected) {
      setFile(selected)
      setStatus("idle")
      setProgress(0)
      setUploadedKey(null)
      setErrorMsg(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    const fileExtension = file.name.split(".").pop()
    const key = `public/${uuidv4()}.${fileExtension}` // 👈 Matches your original path

    setStatus("uploading")
    setProgress(0)

    try {
      // 🧪 THE RAW AMPLIFY STORAGE CALL
      const result = await uploadData({
        path: key,
        data: file,
        options: {
          contentType: file.type,
          // 🔑 UNCOMMENT THIS LINE TO TEST IF 'guest' ACCESS WORKS (if unauthenticated)
          // accessLevel: 'guest',
          // 🔑 OR TRY 'protected' to see if your policy expects that instead
          // accessLevel: 'protected',
          onProgress: ({ transferredBytes, totalBytes }) => {
            if (totalBytes) {
              const pct = Math.round((transferredBytes / totalBytes) * 100)
              setProgress(pct)
            }
          },
        },
      }).result

      console.log("✅ Upload success! Full result:", result)
      setUploadedKey(result.path) // or result.key depending on version
      setStatus("success")
      toast.success(`Uploaded: ${file.name}`)

      // Optional: Verify the file is accessible by fetching its URL
      const urlResult = await getUrl({ path: result.path })
      console.log("🔗 File URL:", urlResult.url)
    } catch (error: any) {
      console.error("❌ RAW UPLOAD FAILED:", error)
      setErrorMsg(error.message || "Unknown error")
      setStatus("error")
      toast.error(`Upload failed: ${error.message || "Check console"}`)
    }
  }

  const handleRemove = () => {
    setFile(null)
    setStatus("idle")
    setProgress(0)
    setUploadedKey(null)
    setErrorMsg(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // --- Render ---
  if (!file) {
    return (
      <div
        className="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-8 text-center transition hover:border-blue-500"
        onClick={() => fileInputRef.current?.click()}
      >
        <IoCloudUpload className="mx-auto text-4xl text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">Click to select an image</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    )
  }

  // --- File Preview / Upload Status ---
  return (
    <div className="space-y-4">
      <Attachment
        state={status === "uploading" ? "uploading" : undefined}
        className="w-full"
      >
        <AttachmentMedia variant="image" className="size-16!">
          {status === "uploading" ? (
            <Spinner />
          ) : (
            <img
              src={URL.createObjectURL(file)}
              className="size-16 object-cover object-center"
              alt="Preview"
            />
          )}
        </AttachmentMedia>

        <AttachmentContent>
          <AttachmentTitle>{file.name}</AttachmentTitle>
          <AttachmentDescription>
            {status === "idle" && `${Math.round(file.size / 1024)} kb · Ready`}
            {status === "uploading" && `Uploading · ${progress}%`}
            {status === "success" && `✅ Uploaded: ${uploadedKey}`}
            {status === "error" && `❌ Error: ${errorMsg}`}
          </AttachmentDescription>
        </AttachmentContent>

        <AttachmentActions>
          {status === "uploading" ? (
            <AttachmentAction
              aria-label="Cancel"
              // In raw uploadData, cancellation is done via the returned object.
              // For simplicity in this test, we'll just reload the page to cancel,
              // but we can implement proper cancel if needed.
              onClick={() => window.location.reload()}
            >
              <IoClose />
            </AttachmentAction>
          ) : (
            <AttachmentAction aria-label="Remove" onClick={handleRemove}>
              <IoClose />
            </AttachmentAction>
          )}
        </AttachmentActions>
      </Attachment>

      {/* Upload Button (only show if idle or error) */}
      {(status === "idle" || status === "error") && (
        <button
          onClick={handleUpload}
          className="w-full rounded-md bg-blue-600 py-2 text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          {status === "error" ? "Retry Upload" : "Start Upload"}
        </button>
      )}

      {status === "success" && (
        <div className="rounded bg-green-50 p-2 text-sm text-green-800">
          Upload successful! Path:{" "}
          <code className="bg-green-100 px-1">{uploadedKey}</code>
        </div>
      )}
    </div>
  )
}

export default CustomMediaUploader
