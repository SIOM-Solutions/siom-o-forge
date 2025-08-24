import { supabase } from '../lib/supabase'
import type { AirAssignment, AirMateria } from '../lib/supabase'

export interface UserMateriaAssignment {
  materia: AirMateria
  assignment?: AirAssignment
}

export async function fetchAllMaterias(): Promise<AirMateria[]> {
  const { data, error } = await supabase
    .from('air_materias')
    .select('*')
    .order('position', { ascending: true })

  if (error) throw error
  return (data ?? []) as AirMateria[]
}

export async function fetchUserAssignments(userId: string): Promise<AirAssignment[]> {
  const { data, error } = await supabase
    .from('air_assignments')
    .select('*')
    .eq('user_id', userId)

  if (error) throw error
  return (data ?? []) as AirAssignment[]
}

export async function fetchMateriasWithUserAssignments(userId: string): Promise<UserMateriaAssignment[]> {
  const [materias, assignments] = await Promise.all([
    fetchAllMaterias(),
    fetchUserAssignments(userId),
  ])

  const assignmentsByMateriaId = new Map<number, AirAssignment>()
  for (const a of assignments) assignmentsByMateriaId.set(a.materia_id, a)

  return materias.map((m) => ({
    materia: m,
    assignment: assignmentsByMateriaId.get(m.id),
  }))
}

export async function fetchMateriaBySlug(slug: string): Promise<AirMateria | null> {
  const { data, error } = await supabase
    .from('air_materias')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  if (error) throw error
  return (data ?? null) as AirMateria | null
}

export async function fetchAssignmentForUserAndMateria(userId: string, materiaId: number): Promise<AirAssignment | null> {
  const { data, error } = await supabase
    .from('air_assignments')
    .select('*')
    .eq('user_id', userId)
    .eq('materia_id', materiaId)
    .maybeSingle()

  if (error) throw error
  return (data ?? null) as AirAssignment | null
}

export async function markAssignmentAsSent(assignmentId: number): Promise<void> {
  const { error } = await supabase
    .from('air_assignments')
    .update({ status: 'sent', sent_at: new Date().toISOString() })
    .eq('id', assignmentId)

  if (error) throw error
}


