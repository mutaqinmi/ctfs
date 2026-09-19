import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env } from '$env/dynamic/private';
import { error, redirect } from '@sveltejs/kit';
import { eq, and } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { challengeMedia, challenges } from '$lib/server/db/schema';
import { s3 } from '$lib/s3';

export async function GET({ locals, params }) {
	if (!locals.user) {
		throw redirect(302, '/signin');
	}

	const mediaId = Number(params.mediaId);
	if (!Number.isInteger(mediaId)) {
		throw error(400, 'Invalid media id');
	}

	const [media] = await db
		.select({
			fileName: challengeMedia.file_name,
			objectKey: challengeMedia.object_key,
			mimeType: challengeMedia.mime_type
		})
		.from(challengeMedia)
		.innerJoin(challenges, eq(challengeMedia.challenge_id, challenges.challenge_id))
		.where(
			and(eq(challengeMedia.challenge_media_id, mediaId), eq(challenges.challenge_slug, params.slug))
		);

	if (!media) {
		throw error(404, 'Media not found');
	}

	const url = await getSignedUrl(
		s3,
		new GetObjectCommand({
			Bucket: env.R2_BUCKET_NAME,
			Key: media.objectKey,
			ResponseContentDisposition: `attachment; filename="${media.fileName.replace(/[^a-zA-Z0-9._-]/g, '_')}"`,
			ResponseContentType: media.mimeType || undefined
		}),
		{ expiresIn: 300 }
	);

	throw redirect(302, url);
}