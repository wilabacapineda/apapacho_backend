import { initializeApp, credential as _credential } from "firebase-admin";

import serviceAccount from "./../private/apapacho-53525-firebase-adminsdk-kj7c2-bf3e4faa4f.json";

initializeApp({
  credential: _credential.cert(serviceAccount)
});