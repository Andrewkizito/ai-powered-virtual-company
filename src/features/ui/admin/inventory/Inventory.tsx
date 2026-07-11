import { Link } from "react-router"
import { Button } from "@/components/ui/button"

const Inventory = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Inventory</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your product inventory, stock levels, and pricing rules.
          </p>
        </div>

        <Link to="/inventory/add">
          <Button>Add Inventory</Button>
        </Link>
      </div>
    </div>
  )
}

export default Inventory
