import StepperForm from "../../../use-cases/inventory/form/core"

const AddInventory = () => {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Add Inventory</h1>
        <p className="text-sm font-medium text-muted-foreground">
          Create a new product for your autonomous agents to manage.
        </p>
      </div>

      <StepperForm />
    </div>
  )
}

export default AddInventory
