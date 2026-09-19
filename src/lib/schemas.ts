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

export const challengeDifficultyValues = ['easy', 'medium', 'hard'] as const;
export const challengeDifficulties = [
    {
        value: challengeDifficultyValues[0],
        label: "Mudah"
    },
    {
        value: challengeDifficultyValues[1],
        label: "Sedang"
    },
    {
        value: challengeDifficultyValues[2],
        label: "Sulit"
    }
] as const;
export const challengeMediaTypeValues = ['image', 'source', 'docker'] as const;
export const challengeMediaTypes = [
    {
        value: challengeMediaTypeValues[0],
        label: "Gambar"
    },
    {
        value: challengeMediaTypeValues[1],
        label: "Source Code"
    },
    {
        value: challengeMediaTypeValues[2],
        label: "Docker Image"
    }
] as const;
const mediaMetadataSchema = z.preprocess(
    (value) => {
        if (typeof value !== "string") return value;
        try {
            return JSON.parse(value);
        } catch {
            return undefined;
        }
    },
    z.array(z.object({
        objectKey: z.string().min(1, "Object key media tidak boleh kosong"),
        fileName: z.string().min(1, "Nama file media tidak boleh kosong"),
        mimeType: z.string().optional(),
        fileSize: z.number().int().positive()
    })).optional()
);
export const challengeSchema = z.object({
    challenge_title: z.string().min(1, "Nama tantangan tidak boleh kosong"),
    challenge_description: z.string().optional(),
    challenge_points: z.number().min(1, "Poin harus lebih dari 0"),
    author_id: z.string().min(1, "Nama pembuat tidak boleh kosong"),
    challenge_difficulty: z.enum(challengeDifficultyValues, "Tingkat kesulitan tidak valid"),
    category_id: z.number().min(1, "Kategori tidak boleh kosong"),
    challenge_flag: z.string().min(1, "Nilai flag tidak boleh kosong"),
    challenge_media_metadata: mediaMetadataSchema,
    challenge_media_type: z.enum(challengeMediaTypeValues).optional(),
    challenge_hints: z.array(z.string().min(1, "Hint tidak boleh kosong"))
})