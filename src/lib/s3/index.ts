import { env } from "$env/dynamic/private";
import { S3Client } from "@aws-sdk/client-s3";

if (
	!env.R2_ACCOUNT_ID ||
	!env.R2_BUCKET_NAME ||
	!env.R2_ACCESS_KEY_ID ||
	!env.R2_SECRET_ACCESS_KEY
) {
	throw new Error(
		'R2_ACCOUNT_ID, R2_BUCKET_NAME, R2_ACCESS_KEY_ID, or R2_SECRET_ACCESS_KEY is not set'
	);
}

export const s3 = new S3Client({
	region: 'auto',
	endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: env.R2_ACCESS_KEY_ID,
		secretAccessKey: env.R2_SECRET_ACCESS_KEY
	}
});
