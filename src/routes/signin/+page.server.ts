import { env } from '$env/dynamic/private';
import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { zod4 } from "sveltekit-superforms/adapters";
import { superValidate, setError } from "sveltekit-superforms";
import { signinSchema } from "$lib/schemas";
import { auth } from '$lib/server/auth';
import { APIError } from 'better-auth';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, "/");
	}

	const form = await superValidate(zod4(signinSchema));
	return { form };
};

export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod4(signinSchema));

		if (!form.valid) {
			return setError(form, "", "Form tidak valid!");
		}

		try {
			await auth.api.signInEmail({
				body: {
					email: form.data.email,
					password: form.data.password,
				},
				headers: request.headers,
			});
		} catch (error) {
			if(error instanceof APIError) {
				if (error.body?.code === "INVALID_EMAIL_OR_PASSWORD") {
					return setError(form, "password", "Email atau password salah!");
				}
				
				return setError(form, "", error.message);
			}

			return setError(form, "", "Terjadi kesalahan!");
		}

		redirect(303, env.ORIGIN || "/");
	}
} satisfies Actions;