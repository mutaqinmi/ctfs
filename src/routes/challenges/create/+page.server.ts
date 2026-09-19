import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { challengeSchema } from '$lib/schemas';
import { db } from '$lib/server/db';
import { categories, challengeHints, challengeMedia, challenges } from '$lib/server/db/schema';

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
        challenge_media_metadata: [],
        challenge_hints: []
	};

	const form = await superValidate(defaultValues, zod4(challengeSchema), { errors: false });
	return { user: event.locals.user, form, challengeCategories };
};

export const actions = {
	default: async ({ request, locals }) => {
        const user = locals.user;
        if (user?.role !== 'admin') {
            throw error(403, "Forbidden");
        };
        
        const form = await superValidate(request, zod4(challengeSchema));
        if (!form.valid) {
            return fail(400, { form });
        }

        const mediaMetadata = form.data.challenge_media_metadata ?? [];
        if (mediaMetadata.some(({ objectKey }) => !objectKey.startsWith(`uploads/${user.id}/`))) {
            return fail(400, { form, message: 'Object key media tidak valid' });
        }
        if (mediaMetadata.length > 0 && !form.data.challenge_media_type) {
            return fail(400, { form, message: 'Jenis media wajib dipilih' });
        }

        const slug = form.data.challenge_title
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '');

		try {
            await db.transaction(async (tx) => {
                const [challenge] = await tx
                    .insert(challenges)
                    .values({
                        challenge_title: form.data.challenge_title,
                        challenge_description: form.data.challenge_description,
                        challenge_points: form.data.challenge_points,
                        author_id: user.id,
                        challenge_difficulty: form.data.challenge_difficulty,
                        category_id: form.data.category_id,
                        challenge_flag: form.data.challenge_flag,
                        challenge_slug: slug
                    })
                    .returning({ id: challenges.challenge_id });

                if (mediaMetadata.length > 0 && form.data.challenge_media_type) {
                    await tx.insert(challengeMedia).values(
                        mediaMetadata.map(({ objectKey, fileName, mimeType, fileSize }) => ({
                            challenge_id: challenge.id,
                            media_type: form.data.challenge_media_type!,
                            file_name: fileName,
                            object_key: objectKey,
                            mime_type: mimeType || null,
                            file_size: fileSize
                        }))
                    );
                }

                if (form.data.challenge_hints.length > 0) {
                    await tx.insert(challengeHints).values(
                        form.data.challenge_hints.map((hint, index) => ({
                            challenge_id: challenge.id,
                            hint,
                            hint_order: index
                        }))
                    );
                }
            });
		} catch (error) {
            if(error instanceof Error) {
                setError(form, '', error.message);
            }
            return fail(400, { form });
		}

        return redirect(302, '/');
	}
};
