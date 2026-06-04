import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBQ05qGCDPadHLVY3Lt1ct-9FywHRYS7vk",
  authDomain: "nelachala-homes.firebaseapp.com",
  projectId: "nelachala-homes",
  storageBucket: "nelachala-homes.firebasestorage.app",
  messagingSenderId: "908993332345",
  appId: "1:908993332345:web:5940d581c84d5dbb9b40a8"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)