import { create } from "zustand"
import { devtools } from "zustand/middleware"
import { submitContactForm, type ContactPayload } from "@/lib/api"

interface ContactFormData {
  name: string
  email: string
  message: string
}

type SubmitStatus = "idle" | "loading" | "success" | "error"

interface ContactState {
  formData: ContactFormData
  status: SubmitStatus
  errorMessage: string | null

  setField: (field: keyof ContactFormData, value: string) => void
  resetForm: () => void
  submit: () => Promise<void>
}

const initialFormData: ContactFormData = {
  name: "",
  email: "",
  message: "",
}

export const useContactStore = create<ContactState>()(
  devtools(
    (set, get) => ({
      formData: { ...initialFormData },
      status: "idle",
      errorMessage: null,

      setField: (field, value) =>
        set(
          (state) => ({ formData: { ...state.formData, [field]: value } }),
          false,
          "contact/setField"
        ),

      resetForm: () =>
        set(
          { formData: { ...initialFormData }, status: "idle", errorMessage: null },
          false,
          "contact/resetForm"
        ),

      submit: async () => {
        const { formData } = get()
        set({ status: "loading", errorMessage: null }, false, "contact/submit/start")

        try {
          const payload: ContactPayload = {
            name: formData.name.trim(),
            email: formData.email.trim(),
            message: formData.message.trim(),
          }
          await submitContactForm(payload)
          set(
            { status: "success", formData: { ...initialFormData } },
            false,
            "contact/submit/success"
          )
        } catch (err) {
          const message = err instanceof Error ? err.message : "Something went wrong"
          set({ status: "error", errorMessage: message }, false, "contact/submit/error")
        }
      },
    }),
    { name: "ContactStore" }
  )
)
