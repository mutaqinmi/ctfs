import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { zod4 } from "sveltekit-superforms/adapters";
import { superValidate } from "sveltekit-superforms";
import { signinSchema } from "$lib/schemas";
import { fail } from "@sveltejs/kit";
// import { authClient } from "$lib/auth-client";

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
			return fail(400, { form });
		}

		console.log(form.data);
		try {
			// const { data, error } = await authClient.signIn.email({
			// 	email: form.data.email,
			// 	password: form.data.password
			// })
		} catch (error) {
			return fail(400, { form, message: typeof error === "string" ? error : "An unexpected error occurred" });
		}

		// redirect(303, "/");

		return { form };
	}
} satisfies Actions;