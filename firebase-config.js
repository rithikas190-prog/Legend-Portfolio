// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyA3Qps_VjW1uCaPbpGskhWLMnzBIAXCtr0",
  authDomain: "my-portfolio-cms-108fd.firebaseapp.com",
  projectId: "my-portfolio-cms-108fd",
  storageBucket: "my-portfolio-cms-108fd.firebasestorage.app",
  messagingSenderId: "724936714403",
  appId: "1:724936714403:web:46bf4b6fffbc10e20cb716",
  measurementId: "G-CXTSVXZYD9"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = firebase.firestore();

// Initialize Firebase Authentication and get a reference to the service
const auth = firebase.auth();

// Owner Configuration
// TODO: Replace with the exact email address you register in Firebase Authentication for the owner
const OWNER_EMAIL = "owner@example.com";
