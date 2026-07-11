import MDEditor from "@uiw/react-md-editor"
import { useState } from "react"

const SpecsForm = () => {
  const [value, setValue] = useState("")

  return (
    <>
      <MDEditor
        value={value}
        onChange={(value) => setValue(value || "")}
        minHeight={600}
      />
    </>
  )
}

export default SpecsForm
