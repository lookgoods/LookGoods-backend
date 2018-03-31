import storage from '@google-cloud/storage'
import DotEnv from 'dotenv'

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
	console.log(req.file, 'file')
	if (!req.file) {
		res.status(400).send('No file uploaded.')
		return
	}

	const gcsname = Date.now() + req.file.originalname
	const file = bucket.file(gcsname)

	const stream = file.createWriteStream({
		metadata: {
			contentType: req.file.mimetype
		}
	})

	stream.on('error', (err) => {
		req.file.cloudStorageError = err
		res.status(400).send(err)
	})

	stream.on('finish', () => {
		req.file.cloudStorageObject = gcsname
		file.makePublic().then(() => {
			req.file.cloudStoragePublicUrl = getPublicUrl(gcsname)
			res.status(200).send(req.file.cloudStoragePublicUrl)
		})
	})

	stream.end(req.file.buffer)
}
