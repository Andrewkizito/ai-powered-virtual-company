import { FileUploader } from "@aws-amplify/ui-react-storage"
import "@aws-amplify/ui-react/styles.css"
import amplify_config from "../../../amplify_outputs.json"

const MediaUploader = () => {
  return (
    <div>
      <FileUploader
        acceptedFileTypes={["image/*"]}
        path="public/"
        maxFileCount={1}
        isResumable
        bucket={amplify_config.storage.bucket_name}
        autoUpload
      />
    </div>
  )
}

export default MediaUploader
