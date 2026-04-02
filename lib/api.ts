import axios from "axios"

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10_000,
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ?? error?.message ?? "An unexpected error occurred"
    return Promise.reject(new Error(message))
  }
)

export interface ContactPayload {
  name: string
  email: string
  message: string
}

export async function submitContactForm(payload: ContactPayload): Promise<void> {
  await apiClient.post("/contact", payload)
}
