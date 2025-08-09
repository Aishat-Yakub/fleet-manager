"use client"

import * as React from "react"
import { Toast, ToastProvider, ToastViewport } from "@/components/ui/toast"

export function Toaster() {
  return (
    <ToastProvider>
      <ToastViewport />
    </ToastProvider>
  )
}
