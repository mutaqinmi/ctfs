import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { asc, eq, sql } from 'drizzle-orm';
import {
	categories,
	challengeHints,
	challengeMedia,
	challenges,
	user
} from '$lib/server/db/schema';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/signin');
	}

	const { slug } = event.params;

	const challenge = await db
		.select({
			challenge_id: challenges.challenge_id,
			challenge_slug: challenges.challenge_slug,
			challenge_title: challenges.challenge_title,
			challenge_author: user.name,
			challenge_difficulty: challenges.challenge_difficulty,
			challenge_description: challenges.challenge_description,
			challenge_category: categories.category_name,
			challenge_points: challenges.challenge_points
		})
		.from(challenges)
		.where(eq(challenges.challenge_slug, slug))
		.leftJoin(user, eq(challenges.author_id, user.id))
		.leftJoin(categories, eq(challenges.category_id, categories.category_id));

	if (!challenge[0]) {
		throw error(404, 'Challenge not found');
	}

	const [hints, media] = await Promise.all([
		db
			.select({
				id: challengeHints.challenge_hint_id,
				hint: challengeHints.hint,
				order: challengeHints.hint_order
			})
			.from(challengeHints)
			.where(eq(challengeHints.challenge_id, challenge[0].challenge_id))
			.orderBy(asc(challengeHints.hint_order)),
		db
			.select({
				id: challengeMedia.challenge_media_id,
				mediaType: challengeMedia.media_type,
				fileName: challengeMedia.file_name,
				mimeType: challengeMedia.mime_type,
				fileSize: challengeMedia.file_size
			})
			.from(challengeMedia)
			.where(eq(challengeMedia.challenge_id, challenge[0].challenge_id))
			.orderBy(asc(challengeMedia.challenge_media_id))
	]);

	return { user: event.locals.user, challenge: challenge[0], hints, media };
};

export const actions = {
	default: async ({ request, locals, params }) => {
		if (!locals.user) {
			throw redirect(302, '/signin');
		}

		const { slug } = params;

		const challenge = await db
			.select({
				challenge_id: challenges.challenge_id,
				challenge_flag: challenges.challenge_flag,
				challenge_points: challenges.challenge_points
			})
			.from(challenges)
			.where(eq(challenges.challenge_slug, slug));

		if (!challenge[0]) {
			throw error(404, 'Challenge not found');
		}

		const formData = await request.formData();
		const submittedFlag = formData.get('flag');

		if (typeof submittedFlag !== 'string' || !submittedFlag.trim()) {
			return { success: false, message: 'Flag tidak boleh kosong' };
		}

		if (submittedFlag.trim() === challenge[0].challenge_flag) {
			await db
				.update(user)
				.set({ points: sql`${user.points} + ${challenge[0].challenge_points}` })
				.where(eq(user.id, locals.user.id));
				
			return { success: true, message: 'Selamat! Flag yang Anda masukkan benar.' };
		} else {
			return { success: false, message: 'Flag yang Anda masukkan salah. Silakan coba lagi.' };
		}
	}
};
