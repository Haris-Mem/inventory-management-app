import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
 apiKey: NEXT_PUBLIC_API_KEY,
 authDomain: NEXT_PUBLIC_AUTH_DOMAIN,
 projectId: NEXT_PUBLIC_PROJECT_ID,
 storageBucket: NEXT_PUBLIC_STORAGE_BUCKET,
 messagingSenderId: NEXT_PUBLIC_MESSAGING_SENDER_ID,
 appId: NEXT_PUBLIC_APP_ID
 };
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export { firestore };