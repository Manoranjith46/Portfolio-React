import {
  FieldValue,
  type DocumentData,
  type Query,
  type WhereFilterOp,
  type WriteBatch,
} from 'firebase-admin/firestore'
import { getDb } from '../config/firebase.js'
import type { CollectionName } from '../types/collections.js'

export function docRef(collection: CollectionName, id: string) {
  return getDb().collection(collection).doc(id)
}

export function collectionRef(collection: CollectionName) {
  return getDb().collection(collection)
}

export async function getDocument<T extends DocumentData>(
  collection: CollectionName,
  id: string,
): Promise<(T & { id: string }) | null> {
  const snap = await docRef(collection, id).get()
  if (!snap.exists) return null
  return { id: snap.id, ...(snap.data() as T) }
}

export async function setDocument<T extends DocumentData>(
  collection: CollectionName,
  id: string,
  data: T,
  merge = false,
): Promise<void> {
  await docRef(collection, id).set(
    {
      ...data,
      updatedAt: FieldValue.serverTimestamp(),
      ...(merge ? {} : { createdAt: FieldValue.serverTimestamp() }),
    },
    { merge },
  )
}

export async function updateDocument(
  collection: CollectionName,
  id: string,
  data: Record<string, unknown>,
): Promise<void> {
  await docRef(collection, id).update({
    ...data,
    updatedAt: FieldValue.serverTimestamp(),
  })
}

export async function deleteDocument(collection: CollectionName, id: string): Promise<void> {
  await docRef(collection, id).delete()
}

export interface QueryFilter {
  field: string
  op: WhereFilterOp
  value: unknown
}

export async function queryDocuments<T extends DocumentData>(
  collection: CollectionName,
  filters: QueryFilter[] = [],
  orderByField?: string,
  direction: 'asc' | 'desc' = 'asc',
  limit?: number,
): Promise<(T & { id: string })[]> {
  let query: Query = collectionRef(collection)

  for (const filter of filters) {
    query = query.where(filter.field, filter.op, filter.value)
  }

  if (orderByField) {
    query = query.orderBy(orderByField, direction)
  }

  if (limit !== undefined) {
    query = query.limit(limit)
  }

  const snapshot = await query.get()
  return snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as T) }))
}

export async function getAllDocuments<T extends DocumentData>(
  collection: CollectionName,
  orderByField = 'displayOrder',
): Promise<(T & { id: string })[]> {
  return queryDocuments<T>(collection, [], orderByField, 'asc')
}

export function createBatch(): WriteBatch {
  return getDb().batch()
}

export function batchSet<T extends DocumentData>(
  batch: WriteBatch,
  collection: CollectionName,
  id: string,
  data: T,
): void {
  batch.set(docRef(collection, id), {
    ...data,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  })
}

export async function commitBatch(batch: WriteBatch): Promise<void> {
  await batch.commit()
}

export async function clearCollection(collection: CollectionName): Promise<number> {
  const snapshot = await collectionRef(collection).get()
  if (snapshot.empty) return 0

  const batch = createBatch()
  snapshot.docs.forEach((doc) => batch.delete(doc.ref))
  await commitBatch(batch)
  return snapshot.size
}

export { FieldValue }
