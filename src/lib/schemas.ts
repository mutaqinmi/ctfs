import z from "zod";

export const signinSchema = z.object({
    email: z.email("Email tidak valid"),
    password: z.string().min(6, "Password minimal 6 karakter"),
})

export const signupSchema = z.object({
    name: z.string().min(1, "Nama tidak boleh kosong"),
    email: z.email("Email tidak valid"),
    password: z.string().min(6, "Password minimal 6 karakter"),
    confirmPassword: z.string().min(6, "Konfirmasi password minimal 6 karakter"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Password dan konfirmasi password tidak sama",
})