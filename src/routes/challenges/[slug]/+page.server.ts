import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { categories, challenges, user } from '$lib/server/db/schema';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/signin');
	}

	const { slug } = event.params;

	const challenge = await db
		.select({
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

	return { user: event.locals.user, challenge: challenge[0] };
};
