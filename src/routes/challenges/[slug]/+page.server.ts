import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { env } from '$env/dynamic/private';
import { s3 } from '$lib/s3';
import { and, asc, eq, sql } from 'drizzle-orm';
import {
	categories,
	challengeHints,
	challengeMedia,
	challengeSolves,
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
			challenge_points: challenges.challenge_points,
			challenge_solved: sql<boolean>`case when ${challengeSolves.challenge_solve_id} is null then false else true end`
		})
		.from(challenges)
		.where(eq(challenges.challenge_slug, slug))
		.leftJoin(user, eq(challenges.author_id, user.id))
		.leftJoin(categories, eq(challenges.category_id, categories.category_id))
		.leftJoin(
			challengeSolves,
			and(
				eq(challengeSolves.challenge_id, challenges.challenge_id),
				eq(challengeSolves.user_id, event.locals.user.id)
			)
		);

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
	submit: async ({ request, locals, params }) => {
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
			const userId = locals.user.id;
			const existingSolve = await db
				.select({ challenge_solve_id: challengeSolves.challenge_solve_id })
				.from(challengeSolves)
				.where(
					and(
						eq(challengeSolves.challenge_id, challenge[0].challenge_id),
						eq(challengeSolves.user_id, userId)
					)
				);

			if (existingSolve.length > 0) {
				return { success: true, message: 'Anda sudah menyelesaikan tantangan ini.' };
			}

			await db.transaction(async (tx) => {
				await tx.insert(challengeSolves).values({
					challenge_id: challenge[0].challenge_id,
					user_id: userId
				});
				await tx
					.update(user)
					.set({ points: sql`${user.points} + ${challenge[0].challenge_points}` })
					.where(eq(user.id, userId));
			});

			return { success: true, message: 'Selamat! Flag yang Anda masukkan benar.' };
		} else {
			return { success: false, message: 'Flag yang Anda masukkan salah. Silakan coba lagi.' };
		}
	},
	delete: async ({ locals, params }) => {
		if (!locals.user) {
			throw redirect(302, '/signin');
		}

		if (!locals.user.role || locals.user.role !== 'admin') {
			throw error(403, 'Anda tidak memiliki izin untuk menghapus tantangan ini.');
		}

		const { slug } = params;

		const challenge = await db
			.select({ challenge_id: challenges.challenge_id })
			.from(challenges)
			.where(eq(challenges.challenge_slug, slug));

		if (!challenge[0]) {
			throw error(404, 'Challenge not found');
		}

		const media = await db
			.select({ objectKey: challengeMedia.object_key })
			.from(challengeMedia)
			.where(eq(challengeMedia.challenge_id, challenge[0].challenge_id));

		await db.transaction(async (tx) => {
			await tx.delete(challengeSolves).where(eq(challengeSolves.challenge_id, challenge[0].challenge_id));
			await tx.delete(challengeHints).where(eq(challengeHints.challenge_id, challenge[0].challenge_id));
			await tx.delete(challengeMedia).where(eq(challengeMedia.challenge_id, challenge[0].challenge_id));
			await tx.delete(challenges).where(eq(challenges.challenge_id, challenge[0].challenge_id));
		});

		await Promise.all(
			media.map(({ objectKey }) =>
				s3.send(
					new DeleteObjectCommand({
						Bucket: env.R2_BUCKET_NAME,
						Key: objectKey
					})
				)
			)
		);

		throw redirect(303, '/challenges');
	}
};
