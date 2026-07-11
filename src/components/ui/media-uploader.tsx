import { FileUploader } from "@aws-amplify/ui-react-storage"
import "@aws-amplify/ui-react/styles.css"
import { toast } from "sonner"
import { v4 as uuidv4 } from "uuid"

const MediaUploader = () => {
  const processFile = async ({ file }: { file: File }) => {
    const fileExtension = file.name.split(".").pop()

    return {
      file,
      key: `${uuidv4()}.${fileExtension}`,
    }
  }

  return (
    <FileUploader
      acceptedFileTypes={["image/*"]}
      path="public/"
      maxFileCount={1}
      isResumable
      processFile={processFile}
      onUploadError={(err) => toast.error(err)}
    />
  )
}

export default MediaUploader
