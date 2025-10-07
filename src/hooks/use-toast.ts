import { toast as sonnerToast } from "sonner"

type ToastProps = {
  title?: string
  description?: string
  variant?: "success" | "error"
}

function toast({ title, description, variant = "success" }: ToastProps) {
  if (variant === "error") {
    return sonnerToast.error(title, {
      description,
    })
  }

  return sonnerToast.success(title, {
    description,
  })
}

function useToast() {
  return {
    toast,
  }
}

export { useToast, toast }
