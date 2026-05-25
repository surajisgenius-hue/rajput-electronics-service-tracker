import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where
} from 'firebase/firestore';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '../firebase.js';

const LOCAL_RECORDS_KEY = 'rajput-electronics-service-records';
const LOCAL_RECORDS_EVENT = 'rajput-electronics-records-updated';
const COMPLETED_STATUSES = ['Completed', 'Delivered'];
const COMPLETED_RECORD_TTL_MS = 7 * 24 * 60 * 60 * 1000;
export const MAX_RECORD_IMAGE_BYTES = 5 * 1024 * 1024;

function isCompletedStatus(status) {
  return COMPLETED_STATUSES.includes(status);
}

function toMillis(value) {
  if (!value) return null;
  if (typeof value.toMillis === 'function') return value.toMillis();
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? null : parsed;
  }
  if (typeof value.seconds === 'number') return value.seconds * 1000;
  return null;
}

function completedAtMillis(record) {
  return toMillis(record.completedAt) || toMillis(record.completedAtLocal);
}

function stripRecordFormData(data) {
  const { imageFile, imagePreviewUrl, removeImage, ...recordData } = data;
  return recordData;
}

function imageExtension(file) {
  const fromName = file.name?.split('.').pop()?.toLowerCase();
  if (fromName && /^[a-z0-9]+$/.test(fromName)) return fromName;
  return file.type?.split('/').pop() || 'jpg';
}

async function uploadRecordImage(file, trackingId) {
  if (!file) return null;
  if (!storage) {
    throw new Error('Firebase Storage is not configured. Enable Storage and try again.');
  }
  if (!file.type?.startsWith('image/')) {
    throw new Error('Please upload an image file.');
  }
  if (file.size > MAX_RECORD_IMAGE_BYTES) {
    throw new Error('Image size should be 5 MB or less.');
  }

  const safeTrackingId = trackingId.toLowerCase().replace(/[^a-z0-9-]/g, '-');
  const imagePath = `service-record-images/${safeTrackingId}/${Date.now()}.${imageExtension(file)}`;
  const imageRef = ref(storage, imagePath);
  await uploadBytes(imageRef, file, {
    contentType: file.type,
    customMetadata: { trackingId }
  });
  const imageUrl = await getDownloadURL(imageRef);
  return { imageName: file.name || 'Service image', imagePath, imageUrl };
}

async function deleteRecordImage(imagePath) {
  if (!imagePath || !storage) return;
  try {
    await deleteObject(ref(storage, imagePath));
  } catch (error) {
    console.warn(`Unable to delete image ${imagePath}:`, error.message);
  }
}

function getLocalRecords() {
  try {
    return JSON.parse(window.localStorage.getItem(LOCAL_RECORDS_KEY) || '[]');
  } catch {
    return [];
  }
}

function setLocalRecords(records) {
  window.localStorage.setItem(LOCAL_RECORDS_KEY, JSON.stringify(records));
  window.dispatchEvent(new Event(LOCAL_RECORDS_EVENT));
}

function localSnapshot(records) {
  return {
    docs: records.map((record) => ({
      id: record.id,
      data: () => record
    }))
  };
}

function upsertLocalRecord(record) {
  const records = getLocalRecords();
  const index = records.findIndex((item) => item.id === record.id || item.trackingId === record.trackingId);
  const completedAtLocal = isCompletedStatus(record.status)
    ? records[index]?.completedAtLocal || record.completedAtLocal || new Date().toISOString()
    : undefined;
  const nextRecord = {
    ...records[index],
    ...record,
    trackingIdLower: record.trackingId.toLowerCase(),
    completedAtLocal,
    updatedAtLocal: new Date().toISOString()
  };

  if (!isCompletedStatus(nextRecord.status)) {
    delete nextRecord.completedAtLocal;
    delete nextRecord.completedAt;
  }

  if (index >= 0) {
    records[index] = nextRecord;
  } else {
    records.unshift(nextRecord);
  }

  setLocalRecords(records);
  return nextRecord;
}

function ensureDb() {
  if (!db) {
    throw new Error('Firebase is not configured. Add your Firebase values to .env and restart the dev server.');
  }
  return db;
}

function recordsRef() {
  return collection(ensureDb(), 'serviceRecords');
}

function publicRecordsRef() {
  return collection(ensureDb(), 'publicServiceRecords');
}

function publicRecordPayload(data) {
  return {
    trackingId: data.trackingId,
    trackingIdLower: data.trackingId.toLowerCase(),
    customerName: data.customerName || '',
    productName: data.productName || '',
    brand: data.brand || '',
    serviceType: data.serviceType || '',
    status: data.status || 'Request Received',
    technicianName: data.technicianName || '',
    expectedDate: data.expectedDate || '',
    updatedAt: serverTimestamp()
  };
}

export function generateTrackingId() {
  const date = new Date();
  const stamp = date
    .toISOString()
    .slice(2, 10)
    .replaceAll('-', '');
  const random = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `RE-${stamp}-${random}`;
}

export function subscribeToServiceRecords(callback, onError) {
  const emitLocal = () => callback(localSnapshot(getLocalRecords()));

  if (!db) {
    emitLocal();
    window.addEventListener(LOCAL_RECORDS_EVENT, emitLocal);
    return () => window.removeEventListener(LOCAL_RECORDS_EVENT, emitLocal);
  }

  let unsubscribeFirestore = () => {};
  try {
    const q = query(recordsRef(), orderBy('createdAt', 'desc'));
    unsubscribeFirestore = onSnapshot(
      q,
      (snapshot) => {
        callback(snapshot);
        const records = snapshot.docs.map((record) => ({ id: record.id, ...record.data() }));
        if (records.length) {
          setLocalRecords(records);
        }
      },
      (error) => {
        emitLocal();
        onError?.(error);
      }
    );
  } catch (error) {
    emitLocal();
    onError?.(error);
  }

  window.addEventListener(LOCAL_RECORDS_EVENT, emitLocal);
  return () => {
    unsubscribeFirestore();
    window.removeEventListener(LOCAL_RECORDS_EVENT, emitLocal);
  };
}

export async function cleanupExpiredCompletedRecords(records) {
  const now = Date.now();
  const expiredRecords = records.filter((record) => {
    if (!isCompletedStatus(record.status)) return false;
    const completedAt = completedAtMillis(record);
    return completedAt && now - completedAt >= COMPLETED_RECORD_TTL_MS;
  });

  if (!expiredRecords.length) return 0;

  setLocalRecords(
    getLocalRecords().filter((record) => !expiredRecords.some((expired) => (
      expired.id === record.id || expired.trackingId === record.trackingId
    )))
  );

  if (db) {
    await Promise.all(
      expiredRecords.map(async (record) => {
        try {
          await deleteServiceRecord(record.id, record.trackingId, record.imagePath);
        } catch (error) {
          console.warn(`Unable to auto-delete completed record ${record.trackingId}:`, error.message);
        }
      })
    );
  }

  return expiredRecords.length;
}

export async function addServiceRecord(data) {
  const trackingId = data.trackingId || generateTrackingId();
  const imageData = await uploadRecordImage(data.imageFile, trackingId);
  const recordData = {
    ...stripRecordFormData(data),
    ...imageData
  };
  const localId = crypto.randomUUID?.() || `local-${Date.now()}`;
  const payload = {
    ...recordData,
    id: localId,
    trackingId,
    trackingIdLower: trackingId.toLowerCase(),
    createdAtLocal: new Date().toISOString(),
    completedAtLocal: isCompletedStatus(recordData.status) ? new Date().toISOString() : undefined,
    updatedAtLocal: new Date().toISOString()
  };

  upsertLocalRecord(payload);

  try {
    const cloudPayload = {
      ...recordData,
      trackingId,
      trackingIdLower: trackingId.toLowerCase(),
      completedAt: isCompletedStatus(recordData.status) ? serverTimestamp() : null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    const added = await addDoc(recordsRef(), cloudPayload);
    await setDoc(doc(ensureDb(), 'publicServiceRecords', trackingId.toLowerCase()), publicRecordPayload(cloudPayload));
    upsertLocalRecord({ ...payload, id: added.id });
  } catch (error) {
    console.warn('Saved locally because Firestore is unavailable:', error.message);
  }

  return trackingId;
}

export async function updateServiceRecord(id, data, previousTrackingId, previousImagePath) {
  const imageData = await uploadRecordImage(data.imageFile, data.trackingId);
  const recordData = {
    ...stripRecordFormData(data),
    ...(imageData || {})
  };

  if (data.removeImage && !imageData) {
    recordData.imageName = '';
    recordData.imagePath = '';
    recordData.imageUrl = '';
  }

  const payload = {
    ...recordData,
    trackingIdLower: recordData.trackingId?.toLowerCase(),
    completedAt: isCompletedStatus(recordData.status) ? serverTimestamp() : null,
    updatedAt: serverTimestamp()
  };

  upsertLocalRecord({ id, ...recordData });

  try {
    await updateDoc(doc(ensureDb(), 'serviceRecords', id), payload);

    if (previousTrackingId && previousTrackingId.toLowerCase() !== recordData.trackingId.toLowerCase()) {
      await deleteDoc(doc(ensureDb(), 'publicServiceRecords', previousTrackingId.toLowerCase()));
    }

    await setDoc(doc(ensureDb(), 'publicServiceRecords', recordData.trackingId.toLowerCase()), publicRecordPayload(recordData));
    if ((imageData || data.removeImage) && previousImagePath) {
      await deleteRecordImage(previousImagePath);
    }
  } catch (error) {
    console.warn('Updated locally because Firestore is unavailable:', error.message);
  }
}

export async function deleteServiceRecord(id, trackingId, imagePath) {
  setLocalRecords(getLocalRecords().filter((record) => record.id !== id && record.trackingId !== trackingId));

  try {
    await deleteDoc(doc(ensureDb(), 'serviceRecords', id));
    if (trackingId) {
      await deleteDoc(doc(ensureDb(), 'publicServiceRecords', trackingId.toLowerCase()));
    }
    await deleteRecordImage(imagePath);
  } catch (error) {
    console.warn('Deleted locally because Firestore is unavailable:', error.message);
  }
}

export async function syncPublicServiceRecord(record) {
  if (!record?.trackingId) return;
  upsertLocalRecord(record);
  try {
    await setDoc(
      doc(ensureDb(), 'publicServiceRecords', record.trackingId.toLowerCase()),
      publicRecordPayload(record)
    );
  } catch (error) {
    console.warn('Synced locally because Firestore is unavailable:', error.message);
  }
}

export async function syncPublicServiceRecords(records) {
  await Promise.all(records.map((record) => syncPublicServiceRecord(record)));
}

export async function findRecordByTrackingId(trackingId) {
  const normalized = trackingId.trim().toLowerCase();
  const localRecord = getLocalRecords().find(
    (record) => record.trackingId?.toLowerCase() === normalized || record.trackingIdLower === normalized
  );

  if (localRecord) {
    return localRecord;
  }

  const q = query(publicRecordsRef(), where('trackingIdLower', '==', normalized), limit(1));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return null;
  }

  const record = snapshot.docs[0];
  return { id: record.id, ...record.data() };
}
