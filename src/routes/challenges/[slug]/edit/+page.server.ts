import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { challengeSchema } from '$lib/schemas';
import { db } from '$lib/server/db';
import { categories, challengeHints, challengeMedia, challenges } from '$lib/server/db/schema';
import { asc, eq } from 'drizzle-orm';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { env } from '$env/dynamic/private';
import { s3 } from '$lib/s3';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/signin');
	}

	if (event.locals.user.role !== 'admin') {
		return redirect(302, '/challenges');
	}

    const { slug } = event.params;
    const [challenge] = await db
        .select()
        .from(challenges)
        .where(eq(challenges.challenge_slug, slug));

    if (!challenge) {
        throw error(404, 'Challenge not found');
    }

    const [challengeCategories, hints, media] = await Promise.all([
        db.select().from(categories),
        db.select().from(challengeHints).where(eq(challengeHints.challenge_id, challenge.challenge_id)).orderBy(asc(challengeHints.hint_order)),
        db.select().from(challengeMedia).where(eq(challengeMedia.challenge_id, challenge.challenge_id))
    ]);

    const defaultValues = {
        challenge_title: challenge.challenge_title,
        challenge_description: challenge.challenge_description ?? '',
        challenge_points: challenge.challenge_points,
        author_id: challenge.author_id,
        challenge_difficulty: challenge.challenge_difficulty,
        category_id: challenge.category_id,
        challenge_flag: challenge.challenge_flag,
        challenge_media_metadata: media.map((item) => ({
            mediaId: item.challenge_media_id,
            objectKey: item.object_key,
            fileName: item.file_name,
            mimeType: item.mime_type ?? undefined,
            fileSize: item.file_size ?? 1
        })),
        challenge_hints: hints.map((hint) => hint.hint)
    };

	const form = await superValidate(defaultValues, zod4(challengeSchema), { errors: false });
    return { user: event.locals.user, form, challengeCategories, challenge };
};

export const actions = {
    default: async ({ request, locals, params }) => {
        const user = locals.user;
        if (user?.role !== 'admin') {
            throw error(403, "Forbidden");
        };
        
        const form = await superValidate(request, zod4(challengeSchema));
        if (!form.valid) {
            return fail(400, { form });
        }

        const [challenge] = await db.select().from(challenges).where(eq(challenges.challenge_slug, params.slug));
        if (!challenge) throw error(404, 'Challenge not found');

        const existingMedia = await db.select().from(challengeMedia).where(eq(challengeMedia.challenge_id, challenge.challenge_id));
        const existingKeys = new Set(existingMedia.map((item) => item.object_key));
        const mediaMetadata = form.data.challenge_media_metadata ?? [];
        if (mediaMetadata.some(({ objectKey }) => !existingKeys.has(objectKey) && !objectKey.startsWith(`uploads/${user.id}/`))) {
            return fail(400, { form, message: 'Object key media tidak valid' });
        }

        const nextSlug = form.data.challenge_title
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '');

		const retainedMediaIds = new Set(mediaMetadata.flatMap(({ mediaId }) => mediaId ? [mediaId] : []));
		const removedMedia = existingMedia.filter((item) => !retainedMediaIds.has(item.challenge_media_id));

		try {
            await db.transaction(async (tx) => {
                await tx.update(challenges).set({
					challenge_title: form.data.challenge_title,
					challenge_description: form.data.challenge_description,
					challenge_points: form.data.challenge_points,
					challenge_difficulty: form.data.challenge_difficulty,
					category_id: form.data.category_id,
					challenge_flag: form.data.challenge_flag,
					challenge_slug: nextSlug
				}).where(eq(challenges.challenge_id, challenge.challenge_id));

				await tx.delete(challengeHints).where(eq(challengeHints.challenge_id, challenge.challenge_id));
				await tx.delete(challengeMedia).where(eq(challengeMedia.challenge_id, challenge.challenge_id));

                if (mediaMetadata.length > 0) {
                    await tx.insert(challengeMedia).values(
                        mediaMetadata.map(({ objectKey, fileName, mimeType, fileSize }) => ({
                            challenge_id: challenge.challenge_id,
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
                            challenge_id: challenge.challenge_id,
                            hint,
                            hint_order: index
                        }))
                    );
                }
            });
			await Promise.all(removedMedia.map((media) => s3.send(new DeleteObjectCommand({ Bucket: env.R2_BUCKET_NAME, Key: media.object_key }))));
		} catch (error) {
            if(error instanceof Error) {
                setError(form, '', error.message);
            }
            return fail(400, { form });
		}

        return redirect(302, `/challenges/${nextSlug}`);
	}
};
