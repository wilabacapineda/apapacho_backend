import admin from "firebase-admin"
import fs from 'fs'

const serviceAccount = JSON.parse(fs.readFileSync('./nopublic/firebaseServiceAccountKey.json','utf8'))

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://apapacho-53525.firebaseio.com'
});

console.log('Base Firebase conectada')