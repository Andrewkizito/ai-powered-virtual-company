import { defineStepper } from "@stepperize/react"
import CoreDetails from "./core-details"
import SpecsForm from "./specs"

const { Stepper } = defineStepper([
  {
    id: "product",
    title: "Product Details",
    description: "Basic product information",
  },
  {
    id: "specifications",
    title: "Specifications",
    description: "Product details and attributes",
  },
  {
    id: "inventory",
    title: "Inventory Rules",
    description: "Stock and pricing settings",
  },
  {
    id: "review",
    title: "Review",
    description: "Confirm before creating",
  },
])

const RADIUS = 20
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

const InventoryStepper = () => {
  return (
    <Stepper.Root
      linear
      className="w-full rounded-xl border bg-background p-6 shadow-sm"
    >
      {({ stepper }) => {
        const progress = (stepper.index + 1) / stepper.count
        const activeStep = stepper.index

        return (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="relative grid size-14 shrink-0 place-items-center">
                <svg viewBox="0 0 48 48" className="size-14 -rotate-90">
                  <circle
                    cx="24"
                    cy="24"
                    r={RADIUS}
                    fill="none"
                    strokeWidth="4"
                    className="stroke-muted"
                  />

                  <circle
                    cx="24"
                    cy="24"
                    r={RADIUS}
                    fill="none"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={CIRCUMFERENCE}
                    strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
                    className="stroke-primary transition-all duration-500"
                  />
                </svg>

                <span className="absolute text-xs font-semibold">
                  {stepper.index + 1}/{stepper.count}
                </span>
              </div>

              <Stepper.Content step={stepper.current.id}>
                <h3 className="text-sm font-semibold">
                  {stepper.current.title}
                </h3>

                <p className="text-sm text-muted-foreground">
                  {stepper.current.description}
                </p>
              </Stepper.Content>
            </div>
            <hr />
            <div>
              {activeStep === 0 && <CoreDetails />}
              {activeStep === 1 && <SpecsForm />}
            </div>
            <Stepper.Actions className="mt-6 flex justify-between">
              <Stepper.Prev className="inline-flex h-10 items-center rounded-lg border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-50">
                Back
              </Stepper.Prev>

              {stepper.isLast ? (
                <Stepper.Next className="inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                  Create Product
                </Stepper.Next>
              ) : (
                <Stepper.Next className="inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                  Continue
                </Stepper.Next>
              )}
            </Stepper.Actions>
          </div>
        )
      }}
    </Stepper.Root>
  )
}

export default InventoryStepper
