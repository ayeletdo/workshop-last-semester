npm install @react-native-firebase/app
npm install @react-native-firebase/firestore
npm install @react-native-firebase/auth
npm install @react-native-firebase/messaging
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",          // מגיע מ-Firebase Console
  authDomain: "freespot.firebaseapp.com",
  projectId: "freespot",
  storageBucket: "freespot.appspot.com",
  messagingSenderId: "123456789",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// --- יצירת משתמש חדש ---
async function createUser(userId, fullName, phone) {
  await setDoc(doc(db, "users", userId), {
    fullName,
    phone,
    joinDate: serverTimestamp(),
    rank: "U1",          // ארעי — מטבלת הקודים שלך
    points: 0
  });
}

// --- דיווח חניה חדשה ---
async function reportParking(userId, lat, lng, type) {
  const docRef = await addDoc(collection(db, "parkingSpots"), {
    userId,
    latitude: lat,
    longitude: lng,
    type,                // R1, R2 וכו' מהמסמך שלך
    status: "S1",        // S1 = פנויה
    reportedAt: serverTimestamp(),
    validity: true
  });
  
  // נתן נקודות למדווח
  await addPoints(userId, 10, "P1");
  
  return docRef.id;
}

// --- הוספת נקודות ---
async function addPoints(userId, amount, reason) {
  await addDoc(collection(db, "rewards"), {
    userId,
    pointsAmount: amount,
    rewardReason: reason,   // P1, P2 וכו'
    date: serverTimestamp()
  });
  
  // עדכון הסכום בפרופיל
  await updateDoc(doc(db, "users", userId), {
    points: increment(amount)
  });
}

// --- יצירת קבוצה ---
async function createGroup(name, createdBy, groupType) {
  await addDoc(collection(db, "groups"), {
    groupName: name,
    createdBy,
    createdAt: serverTimestamp(),
    groupType,           // שכונה / עבודה / לימודים
    members: [createdBy]
  });
}
import { collection, query, where, onSnapshot } from 'firebase/firestore';

function listenToParkingSpots(onUpdate) {
  const q = query(
    collection(db, "parkingSpots"),
    where("status", "==", "S1"),      // רק פנויות
    where("validity", "==", true)
  );

  // onSnapshot = מתעדכן אוטומטית כל פעם שמשהו משתנה
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const spots = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    onUpdate(spots);   // מעדכן את המפה
  });

  return unsubscribe;  // לביטול ההאזנה כשיוצאים מהמסך
}
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // משתמש רואה רק את הפרופיל שלו
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }

    // חניות — כל משתמש מחובר יכול לקרוא ולדווח
    match /parkingSpots/{spotId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.userId;
    }

    // קבוצות — רק חברים רואים
    match /groups/{groupId} {
      allow read: if request.auth.uid in resource.data.members;
      allow create: if request.auth != null;
    }
  }
}
