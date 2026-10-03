import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { categories, challengeSolves, challenges, user } from '$lib/server/db/schema';
import { and, asc, eq, sql } from 'drizzle-orm';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/signin');
	}

	const allChallenges = await db
		.select({
            challenge_id: challenges.challenge_id,
            challenge_title: challenges.challenge_title,
            challenge_author: user.name,
            challenge_difficulty: challenges.challenge_difficulty,
            challenge_slug: challenges.challenge_slug,
            challenge_category: categories.category_name,
            challenge_points: challenges.challenge_points,
            challenge_solved: sql<boolean>`case when ${challengeSolves.challenge_solve_id} is null then false else true end`
        })
		.from(challenges)
        .leftJoin(user, eq(challenges.author_id, user.id))
        .leftJoin(categories, eq(challenges.category_id, categories.category_id))
        .leftJoin(
            challengeSolves,
            and(
                eq(challengeSolves.challenge_id, challenges.challenge_id),
                eq(challengeSolves.user_id, event.locals.user.id)
            )
        )
        .orderBy(asc(sql`case when ${challengeSolves.challenge_solve_id} is null then 0 else 1 end`));

	return { user: event.locals.user, allChallenges };
};
