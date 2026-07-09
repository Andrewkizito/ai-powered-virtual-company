const Sidebar = () => {
  return (
    <div className="fixed top-0 left-0 flex h-full w-72 flex-col border-r bg-background">
      <div className="flex h-16 items-center justify-center gap-3 border-b">
        <img src="/logo.svg" alt="Logo" className="size-8" />
        <span className="text-sm font-semibold">Virtual Company</span>
      </div>
    </div>
  )
}

export default Sidebar
