// records.service.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../api/api';

const getRecordsKey = async () => {
  const userId = await AsyncStorage.getItem('userId');
  return `quizRecords_${userId || 'guest'}`;
};

// --- YAHAN CLAUDE KA NAYA PATCH AAYEGA ---
export const saveQuizRecord = async (record) => {
  try {
    const response = await api.post('/records', record);
    return response.data;
  } catch (err) {
    console.log('Backend save failed, saving locally:', err.message);
    return await saveRecordLocally(record); 
  }
};

// export const fetchQuizRecords = async () => {
//   try {
//     const response = await api.get('/records');
//     return response.data;
//   } catch (err) {
//     console.log('Backend fetch failed, using local cache:', err.message);
//     return await fetchRecordsLocally(); 
//   }
// };


// For Fetch Data from locally and Server both
export const fetchQuizRecords = async () => {
  try {
    // 1. Server se data laao
    const response = await api.get('/records');
    const serverRecords = response.data;

    // 2. Local storage se offline wala data laao
    const localRecords = await fetchRecordsLocally();

    // 3. Dono data ko aapas mein merge (mix) kar do
    return [...serverRecords, ...localRecords];

  } catch (err) {
    console.log('Backend fetch failed, using local cache:', err.message);
    return await fetchRecordsLocally(); 
  }
};










// -----------------------------------------

// --- TUMHARA PURANA CODE YAHAN RENAME HO KAR PRIVATE BAN GAYA ---
const saveRecordLocally = async (record) => {
  try {
    const key = await getRecordsKey();
    const existingRaw = await AsyncStorage.getItem(key);
    const existing = existingRaw ? JSON.parse(existingRaw) : [];
    const newRecord = {
      id: `rec_${Date.now()}`,
      ...record,
      date: new Date().toISOString(),
    };
    const updated = [newRecord, ...existing];
    await AsyncStorage.setItem(key, JSON.stringify(updated));
    return newRecord;
  } catch (e) {
    console.log('Failed to save quiz record:', e.message);
    return null;
  }
};

const fetchRecordsLocally = async () => {
  try {
    const key = await getRecordsKey();
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const clearQuizRecords = async () => {
  const key = await getRecordsKey();
  await AsyncStorage.removeItem(key);
};