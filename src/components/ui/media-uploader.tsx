import { useRef } from "react"
import { uploadData } from "aws-amplify/storage"
import { v4 as uuidv4 } from "uuid"
import { toast } from "sonner"

const MediaUploader = () => {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    const extension = file.name.split(".").pop()
    const filename = `${uuidv4()}.${extension}`
    const path = `public/${filename}`

    try {
      await uploadData({ path, data: file, options: {} })
      toast.success("File uploaded")
    } catch (error) {
      toast.error("Upload failed")
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
        }}
      />
      <button onClick={() => inputRef.current?.click()}>Upload Image</button>
    </div>
  )
}

export default MediaUploader
