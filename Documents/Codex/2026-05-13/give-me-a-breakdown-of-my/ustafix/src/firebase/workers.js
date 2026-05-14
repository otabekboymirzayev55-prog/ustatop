import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore'
import { db, isFirebaseReady } from './config'

const requireFirebase = () => {
  if (!isFirebaseReady || !db) {
    throw new Error('Firebase config is missing')
  }
}

export const getWorkers = async () => {
  requireFirebase()

  const workersQuery = query(collection(db, 'workers'), orderBy('rating', 'desc'))
  const snapshot = await getDocs(workersQuery)

  return snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
}

export const addWorker = async (worker) => {
  requireFirebase()

  return addDoc(collection(db, 'workers'), {
    ...worker,
    available: worker.available ?? true,
    rating: worker.rating ?? 5,
    reviews: worker.reviews ?? 0,
    createdAt: serverTimestamp(),
  })
}
