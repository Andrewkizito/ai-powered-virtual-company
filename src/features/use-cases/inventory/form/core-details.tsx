import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import MediaUploader from "@/components/ui/media-uploader"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

const CoreDetails = () => {
  const [customDescription, setCustomDescription] = useState(false)

  return (
    <div className="max-w-7xl">
      <FieldSet>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="name">Item Name</FieldLabel>
            <Input id="name" autoComplete="off" placeholder="Evil Rabbit" />
            <FieldDescription>
              This appears on invoices and emails.
            </FieldDescription>
          </Field>
          <Field orientation="horizontal">
            <Switch
              id="newsletter"
              checked={customDescription}
              onCheckedChange={(value) => setCustomDescription(value)}
            />
            <FieldLabel htmlFor="newsletter">Custom Description</FieldLabel>
          </Field>
          <Field>
            <FieldLabel htmlFor="description">Description</FieldLabel>
            <Textarea
              id="description"
              autoComplete="off"
              placeholder="Evil Rabbit"
              disabled={!customDescription}
            />
            <FieldDescription>
              Generated automatically if not provided
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="image">Item Photo</FieldLabel>
            <MediaUploader />
          </Field>
        </FieldGroup>
      </FieldSet>
    </div>
  )
}

export default CoreDetails
