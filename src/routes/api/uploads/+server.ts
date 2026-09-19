import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env } from '$env/dynamic/private';
import { error, json } from '@sveltejs/kit';
import { s3 } from '$lib/s3';

const maxFileSize = 50 * 1024 * 1024;

function requireAdmin(locals: App.Locals) {
	if (locals.user?.role !== 'admin') {
		throw error(403, 'Forbidden');
	}

	return locals.user;
}

function getObjectKey(value: unknown) {
	if (typeof value !== 'string' || !value.startsWith('uploads/')) {
		throw error(400, 'Invalid object key');
	}

	return value;
}

export async function POST({ request, locals }) {
	const user = requireAdmin(locals);
	const body = await request.json().catch(() => null);

	if (
		!body ||
		typeof body.filename !== 'string' ||
		typeof body.contentType !== 'string' ||
		typeof body.size !== 'number' ||
		body.size <= 0 ||
		body.size > maxFileSize
	) {
		throw error(400, 'Invalid file metadata');
	}

	const filename = body.filename.replace(/[^a-zA-Z0-9._-]/g, '_');
	const objectKey = `uploads/${user.id}/${crypto.randomUUID()}-${filename}`;
	const command = new PutObjectCommand({
		Bucket: env.R2_BUCKET_NAME,
		Key: objectKey,
		ContentType: body.contentType
	});
	const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 600 });

	return json({ objectKey, uploadUrl });
}

export async function DELETE({ request, locals }) {
	const user = requireAdmin(locals);
	const body = await request.json().catch(() => null);
	const objectKey = getObjectKey(body?.objectKey);

	if (!objectKey.startsWith(`uploads/${user.id}/`)) {
		throw error(403, 'Forbidden');
	}

	await s3.send(
		new DeleteObjectCommand({
			Bucket: env.R2_BUCKET_NAME,
			Key: objectKey
		})
	);

	return new Response(null, { status: 204 });
}