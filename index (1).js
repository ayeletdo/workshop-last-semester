// 1. Import Firebase tools
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// 2. Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA8e7VWbr97C9JIwawEPIm9UsSJseAFnVc",
  authDomain: "parkingapp-4d329.firebaseapp.com",
  projectId: "parkingapp-4d329",
  storageBucket: "parkingapp-4d329.firebasestorage.app",
  messagingSenderId: "203233748891",
  appId: "1:203233748891:web:d246df2a9831bb4d29e33e",
  measurementId: "G-XG3J0ZNFWY"
};

// 3. Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 4. Test function to add a parking spot with location and timestamp
async function testAddParking() {
  try {
    const docRef = await addDoc(collection(db, "parking_spots"), {
      address: "Rothschild Blvd 22, Tel Aviv", // כתובת לדוגמה
      location: { latitude: 32.0626, longitude: 34.7713 }, // הוספנו מיקום!
      status: "available",
      reportedAt: new Date(), // הוספנו זמן דיווח מדויק!
      reportedBy: "team_member_test"
    });
    console.log("Success! Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

// Run the test
testAddParking();