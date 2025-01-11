import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast"
import { Link } from 'lucide-react'

interface ToastWithLinkProps {
  title: string
  description: string
  linkText: string
  linkHref: string
}

export function ToastWithLink({ title, description, linkText, linkHref }: ToastWithLinkProps) {
  return (
    <Toast>
      <div className="grid gap-1">
        <ToastTitle>{title}</ToastTitle>
        <ToastDescription>
          {description}{" "}
          <a
            href={linkHref}
            className="inline-flex items-center text-blue-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {linkText}
            <Link className="ml-1 h-4 w-4" />
          </a>
        </ToastDescription>
      </div>
      <ToastClose />
    </Toast>
  )
}

export function Toaster() {
  return (
    <ToastProvider>
      <ToastViewport />
    </ToastProvider>
  )
}

