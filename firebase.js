// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getPerformance } from "firebase/performance";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

const firebaseConfig = {
  apiKey: "AIzaSyCbG6XBWRIo9FCf0fjMojToY-yFtlegJZs",
  authDomain: "anweshan-cybrix.firebaseapp.com",
  projectId: "anweshan-cybrix",
  storageBucket: "anweshan-cybrix.appspot.com",
  messagingSenderId: "828339826823",
  appId: "1:828339826823:web:bd3f01dee7b6e902240822",
  measurementId: "G-7FB134NP61"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const performance = getPerformance(app)
const appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(import.meta.env['PUBLIC_APPCHECK_KEY']),
    isTokenAutoRefreshEnabled: true
});
