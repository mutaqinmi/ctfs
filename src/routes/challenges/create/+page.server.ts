import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { challengeSchema } from '$lib/schemas';
import { db } from '$lib/server/db';
import { categories } from '$lib/server/db/schema';
// import { challenges, categories } from '$lib/server/db/schema';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/signin');
	}

	if (event.locals.user.role !== 'admin') {
		return redirect(302, '/challenges');
	}

    const challengeCategories = await db.select().from(categories);

	const defaultValues = {
        category_id: 0,
        author_id: event.locals.user.id,
        challenge_hints: []
	};

	const form = await superValidate(defaultValues, zod4(challengeSchema), { errors: false });
	return { user: event.locals.user, form, challengeCategories };
};

export const actions = {
	default: async ({ request, locals }) => {
        if(locals.user?.role !== 'admin') {
            throw error(403, "Forbidden");
        };
        
		const form = await superValidate(request, zod4(challengeSchema));
        // const slug = form.data.challenge_title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

		try {
			// await db.insert(challenges).values({
            //     challenge_title: form.data.challenge_title,
            //     challenge_description: form.data.challenge_description,
            //     challenge_points: form.data.challenge_points,
            //     author_id: locals.user.id,
            //     challenge_difficulty: form.data.challenge_difficulty,
            //     category_id: form.data.category_id,
            //     challenge_flag: form.data.challenge_flag,
            //     challenge_slug: slug
            // });

            console.log(form.data);
		} catch (error) {
            if(error instanceof Error) {
                setError(form, '', error.message);
            }
		}

        return redirect(302, '/');
	}
};
