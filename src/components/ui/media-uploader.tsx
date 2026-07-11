import { FileUploader, StorageImage } from "@aws-amplify/ui-react-storage"
import "@aws-amplify/ui-react/styles.css"
import { IoClose } from "react-icons/io5"
import { toast } from "sonner"
import { v4 as uuidv4 } from "uuid"
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
      autoUpload={false}
      components={{
        FileList: ({ files }) =>
          files.map((item, index) => {
            const { file } = item

            if (!file) return null

            console.log(item)

            if (item.status === "uploading")
              return (
                <Attachment state="uploading" className="w-full" key={index}>
                  <AttachmentMedia className="size-16!">
                    <Spinner />
                  </AttachmentMedia>
                  <AttachmentContent>
                    <AttachmentTitle>
                      {item.file?.name || item.id}
                    </AttachmentTitle>
                    <AttachmentDescription>
                      Uploading (
                      {`${Math.round((item.file?.size || 0) / 1024)} kb`}) ·{" "}
                      {item.progress}%
                    </AttachmentDescription>
                  </AttachmentContent>
                  <AttachmentActions>
                    <AttachmentAction
                      aria-label="Cancel upload"
                      onClick={() => item.uploadTask?.cancel()}
                    >
                      <IoClose />
                    </AttachmentAction>
                  </AttachmentActions>
                </Attachment>
              )

            return (
              <Attachment key={index} className="w-full">
                <AttachmentMedia variant="image" className="size-16!">
                  {item.progress === -1 ? (
                    <img
                      src={URL.createObjectURL(file)}
                      className="size-16 object-cover object-center"
                    />
                  ) : (
                    <StorageImage alt="" path={item.key} />
                  )}
                </AttachmentMedia>
                <AttachmentContent>
                  <AttachmentTitle>{file.name}</AttachmentTitle>
                  <AttachmentDescription>{file.type}</AttachmentDescription>
                </AttachmentContent>
                <AttachmentActions>
                  <AttachmentAction
                    aria-label={`Remove ${file.name}`}
                    onClick={() => item.uploadTask?.cancel()}
                  >
                    <IoClose />
                  </AttachmentAction>
                </AttachmentActions>
              </Attachment>
            )
          }),
      }}
    />
  )
}

export default MediaUploader
