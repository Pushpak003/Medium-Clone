import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

let firebaseApp = null;

// Server start hote waqt ek baar call hota hai (server.js se)
// Agar env vars set nahi hain to Google sign-in disabled rahega — baaki poora app normally chalega
export const initializeFirebaseAdmin = () => {
  const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env;

  if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
    console.warn(
      "⚠️  Firebase Admin env vars missing — /auth/google route 503 dega jab tak FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY set na karo."
    );
    return;
  }

  if (!getApps().length) {
    firebaseApp = initializeApp({
      credential: cert({
        projectId: FIREBASE_PROJECT_ID,
        clientEmail: FIREBASE_CLIENT_EMAIL,
      
        privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }),
    });
  }

  console.log("✅ Firebase Admin Connected");
};

export const isFirebaseAdminReady = () => Boolean(firebaseApp);
export const verifyGoogleIdToken = (idToken) => getAuth(firebaseApp).verifyIdToken(idToken);