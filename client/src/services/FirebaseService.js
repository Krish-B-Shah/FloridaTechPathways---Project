import { db } from '../firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where,
  orderBy,
  serverTimestamp,
  getDoc
} from 'firebase/firestore';

export const FirebaseService = {
  async getUserInternships(userId) {
    try {
      const internshipsCollection = collection(db, 'internships');
      const q = query(
        internshipsCollection, 
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const internships = querySnapshot.docs.map(doc => {
        const data = {
          id: doc.id,
          ...doc.data(),
        };
        console.log('Loaded internship with ID:', doc.id);
        return data;
      });
      
      console.log('All loaded internships:', internships);
      return internships;
    } catch (error) {
      console.error('Error getting internships:', error);
      throw error;
    }
  },

  async addInternship(userId, internshipData) {
    try {
      const { id, ...dataWithoutId } = internshipData;
      
      const internshipsCollection = collection(db, 'internships');
      const docRef = await addDoc(internshipsCollection, {
        ...dataWithoutId,
        userId,
        createdAt: serverTimestamp(),
      });
      
      const newInternship = {
        ...dataWithoutId,
        id: docRef.id, 
        userId
      };
      
      console.log('Added internship with ID:', docRef.id);
      return newInternship;
    } catch (error) {
      console.error('Error adding internship:', error);
      throw error;
    }
  },

  async updateInternship(internshipId, internshipData) {
    try {
      if (!internshipId) {
        console.error('Invalid internship ID for update:', internshipId);
        throw new Error('Invalid internship ID');
      }
      
      const internshipRef = doc(db, 'internships', internshipId);
      
      const internshipDoc = await getDoc(internshipRef);
      if (!internshipDoc.exists()) {
        throw new Error('Internship not found');
      }
      
      await updateDoc(internshipRef, {
        ...internshipData,
        updatedAt: serverTimestamp(),
      });
      
      console.log('Updated internship with ID:', internshipId);
      
      return {
        id: internshipId,
        ...internshipData,
      };
    } catch (error) {
      console.error('Error updating internship:', error);
      throw error;
    }
  },

  async deleteInternship(internshipId) {
    try {
      if (!internshipId) {
        console.error('Invalid internship ID for deletion:', internshipId);
        throw new Error('Invalid internship ID');
      }
      
      const internshipRef = doc(db, 'internships', internshipId);
      
      await deleteDoc(internshipRef);
      console.log('Internship successfully deleted:', internshipId);
      return true;
    } catch (error) {
      console.error('Error deleting internship:', error);
      throw error;
    }
  },

  async updateInternshipProgress(internshipId, progress) {
    try {
      if (!internshipId) {
        console.error('Invalid internship ID for progress update:', internshipId);
        throw new Error('Invalid internship ID');
      }
      
      const internshipRef = doc(db, 'internships', internshipId);
      await updateDoc(internshipRef, {
        progress,
        updatedAt: serverTimestamp(),
      });
      
      console.log('Updated progress for internship ID:', internshipId);
      return true;
    } catch (error) {
      console.error('Error updating internship progress:', error);
      throw error;
    }
  },

  async getUserProfile(userId) {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        return userDoc.data();
      }
      
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  },

  async updateUserProfile(userId, profileData) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        ...profileData,
        updatedAt: serverTimestamp(),
      });
      return true;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },
};

export default FirebaseService;