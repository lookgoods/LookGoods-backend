import storage from '@google-cloud/storage'
import DotEnv from 'dotenv'
import sharp from 'sharp'

DotEnv.config()

const gcs = storage({
	projectId: process.env.GCLOUD_PROJECT_ID,
	keyFilename: 'keyfile.json'
})

const bucket = gcs.bucket('lookgoods-storage')

function getPublicUrl (filename) {
	return `https://storage.googleapis.com/${bucket.name}/${filename}`
}

export function sendUploadToGCS (req, res, next) {
	if (!req.file) {
		res.status(400).send('No file uploaded.')
		return
	}

	const originalName = `original/${Date.now()}-${req.file.originalname}`
	const originalFile = bucket.file(originalName)

	var picture = {
		picture_url: null,
		picture_thumbnail_url: null
	}

	const stream = originalFile.createWriteStream({
		metadata: {
			contentType: req.file.mimetype
		}
	})

	stream.on('error', (err) => {
		res.status(400).send(err)
	})

	stream.on('finish', () => {
		originalFile.makePublic().then(() => {
			const cloudStoragePublicUrl = getPublicUrl(originalName)
			picture.picture_url = cloudStoragePublicUrl

			const thumbnailName = `thumbnail/thumbnail-${Date.now()}-${req.file.originalname}`
			const thumbnailFile = bucket.file(thumbnailName)

			sharp(req.file.buffer).resize(360, 360).toBuffer().then((data) => {
				const stream = thumbnailFile.createWriteStream({
					metadata: {
						contentType: req.file.mimetype
					}
				})
				stream.on('error', (err) => {
					res.status(400).send(err)
				})
				stream.on('finish', () => {
					thumbnailFile.makePublic().then(() => {
						const cloudStoragePublicUrl = getPublicUrl(thumbnailName)
						picture.picture_thumbnail_url = cloudStoragePublicUrl

						res.status(200).send(picture)
					})
				})

				stream.end(data)
			})
		})
	})

	stream.end(req.file.buffer)
}
