import admin from 'firebase-admin'
import env from './env.js'

console.log('credential:', admin.credential)

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: env.get('FIREBASE_PROJECT_ID'),
    clientEmail: env.get('FIREBASE_CLIENT_EMAIL'),
    privateKey: env.get('FIREBASE_PRIVATE_KEY')?.replace(/\\n/g, '\n'),
  }),
  storageBucket: env.get('FIREBASE_STORAGE_BUCKET'),
})

const bucket = admin.storage().bucket()
export default bucket
