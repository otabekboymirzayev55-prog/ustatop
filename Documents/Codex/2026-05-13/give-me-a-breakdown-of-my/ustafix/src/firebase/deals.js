import {
  addDoc,
  collection,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore'
import { db, isFirebaseReady } from './config'

const requireFirebase = () => {
  if (!isFirebaseReady || !db) {
    throw new Error('Firebase config is missing')
  }
}

export const createDeal = async (deal) => {
  requireFirebase()

  return addDoc(collection(db, 'deals'), {
    ...deal,
    status: 'pending',
    createdAt: serverTimestamp(),
  })
}

export const getDeals = async () => {
  requireFirebase()

  const snapshot = await getDocs(collection(db, 'deals'))

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}
