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

export const createRequest = async (request) => {
  requireFirebase()

  return addDoc(collection(db, 'requests'), {
    ...request,
    status: 'open',
    dealsCount: 0,
    likesCount: 0,
    createdAt: serverTimestamp(),
  })
}

export const getRequests = async () => {
  requireFirebase()

  const requestsQuery = query(
    collection(db, 'requests'),
    orderBy('createdAt', 'desc'),
  )
  const snapshot = await getDocs(requestsQuery)

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}
