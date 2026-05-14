import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { auth, isFirebaseReady } from './config'

const requireFirebase = () => {
  if (!isFirebaseReady || !auth) {
    throw new Error('Firebase config is missing')
  }
}

export const register = async (email, password) => {
  requireFirebase()
  return createUserWithEmailAndPassword(auth, email, password)
}

export const login = async (email, password) => {
  requireFirebase()
  return signInWithEmailAndPassword(auth, email, password)
}

export const logout = async () => {
  requireFirebase()
  return signOut(auth)
}

export const updateUserProfile = async (profile) => {
  requireFirebase()
  return updateProfile(auth.currentUser, profile)
}

export const watchAuth = (callback) => {
  requireFirebase()
  return onAuthStateChanged(auth, callback)
}
