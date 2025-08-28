import { supabase } from '../lib/supabase'
import type { AirAssignment, AirMateria } from '../lib/supabase'

export interface UserMateriaAssignment {
  materia: AirMateria
  assignment?: AirAssignment
}

type DbMateriaRow = {
  id: number
  slug: string
  nombre: string
  typeform_form_id: string | null
  activo: boolean
}

type DbAssignmentRow = {
  id: number
  user_id: string
  materia_id: number
  status: string
  created_at?: string
  sent_at?: string | null
}

export async function fetchAllMaterias(): Promise<AirMateria[]> {
  const { data, error } = await supabase
    .from('air_materia')
    .select('id, slug, nombre, typeform_form_id, activo')
    .eq('activo', true)
    .order('id', { ascending: true })

  if (error) throw error
  const rows = (data ?? []) as DbMateriaRow[]
  return rows.map((m) => ({
    id: m.id,
    slug: m.slug,
    name: m.nombre,
    position: 0,
    typeform_id: m.typeform_form_id ?? ''
  }))
}

export async function fetchUserAssignments(userId: string): Promise<AirAssignment[]> {
  const { data, error } = await supabase
    .from('air_assignment')
    .select('id, user_id, materia_id, status, sent_at, created_at')
    .eq('user_id', userId)

  if (error) throw error
  const rows = (data ?? []) as DbAssignmentRow[]
  return rows.map((a) => ({
    id: a.id,
    user_id: a.user_id,
    materia_id: a.materia_id,
    lang: 'es',
    status: a.status?.toLowerCase() === 'sent' ? 'sent' : 'pending',
    sent_at: a.sent_at ?? undefined,
  }))
}

export async function fetchMateriasWithUserAssignments(userId: string): Promise<UserMateriaAssignment[]> {
  // Intentar join directo si existe FK air_assignment.materia_id → air_materia.id
  try {
    const { data, error } = await supabase
      .from('air_assignment')
      .select('id, user_id, materia_id, status, sent_at, air_materia(id, slug, nombre, typeform_form_id, activo)')
      .eq('user_id', userId)

    if (error) throw error
    const rows = (data ?? []) as Array<DbAssignmentRow & { air_materia: DbMateriaRow | null }>
    // Mapear solo asignadas (con materia activa y no PSITAC)
    return rows
      .filter((r) => r.air_materia && r.air_materia.activo && r.air_materia.slug !== 'PSITAC')
      .map((r) => ({
        materia: {
          id: r.air_materia!.id,
          slug: r.air_materia!.slug,
          name: r.air_materia!.nombre,
          position: 0,
          typeform_id: r.air_materia!.typeform_form_id ?? ''
        },
        assignment: {
          id: r.id,
          user_id: userId,
          materia_id: r.materia_id,
          lang: 'es',
          status: (r.status?.toLowerCase?.() === 'sent' ? 'sent' : 'pending') as 'pending' | 'sent',
          sent_at: r.sent_at ?? undefined,
        }
      }))
  } catch {
    // Fallback a 2 pasos si el join no está disponible
    const [materias, assignments] = await Promise.all([
      fetchAllMaterias(),
      fetchUserAssignments(userId),
    ])

    const assignmentsByMateriaId = new Map<number, AirAssignment>()
    for (const a of assignments) assignmentsByMateriaId.set(a.materia_id, a)

    return materias
      .filter((m) => m.slug !== 'PSITAC')
      .map((m) => ({
        materia: m,
        assignment: assignmentsByMateriaId.get(m.id),
      }))
      .filter((x) => !!x.assignment)
  }
}

export async function fetchMateriaBySlug(slug: string): Promise<AirMateria | null> {
  const { data, error } = await supabase
    .from('air_materia')
    .select('id, slug, nombre, typeform_form_id, activo')
    .eq('slug', slug)
    .maybeSingle()

  if (error) throw error
  if (!data) return null
  const m = data as DbMateriaRow
  return {
    id: m.id,
    slug: m.slug,
    name: m.nombre,
    position: 0,
    typeform_id: m.typeform_form_id ?? ''
  }
}

export async function fetchAssignmentForUserAndMateria(userId: string, materiaId: number): Promise<AirAssignment | null> {
  const { data, error } = await supabase
    .from('air_assignment')
    .select('id, user_id, materia_id, status, sent_at, created_at')
    .eq('user_id', userId)
    .eq('materia_id', materiaId)
    .maybeSingle()

  if (error) throw error
  if (!data) return null
  const a = data as DbAssignmentRow
  return {
    id: a.id,
    user_id: a.user_id,
    materia_id: a.materia_id,
    lang: 'es',
    status: a.status?.toLowerCase() === 'sent' ? 'sent' : 'pending',
    sent_at: a.sent_at ?? undefined,
  }
}

export async function markAssignmentAsSent(assignmentId: number): Promise<void> {
  const { error } = await supabase
    .from('air_assignment')
    .update({ status: 'sent', sent_at: new Date().toISOString() })
    .eq('id', assignmentId)

  if (error) throw error
}


