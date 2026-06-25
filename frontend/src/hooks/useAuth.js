import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import api from "../lib/api"

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const { data } = await api.get("/auth/me")
      return data
    },
    enabled: !!localStorage.getItem("token"),
    retry: false,
  })
}

export function useLogin() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async ({ email, password }) => {
      const form = new URLSearchParams()
      form.append("username", email)
      form.append("password", password)
      const { data } = await api.post("/auth/login", form)
      return data
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.access_token)
      queryClient.invalidateQueries({ queryKey: ["me"] })
      navigate("/bookings")
    },
  })
}

export function useRegister() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post("/auth/register", payload)
      return data
    },
    onSuccess: () => {
      navigate("/login")
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return () => {
    localStorage.removeItem("token")
    queryClient.clear()
    navigate("/login")
  }
}
