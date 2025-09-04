import { supabase } from './supabase'

export type LpItemAsset = { position: number; type: string; title: string; url: string }
export type LpItemKpi = { id: number; position: number; text: string; required: boolean }
export type LpItemContent = { lp_item_id: number; assets: LpItemAsset[]; kpis: LpItemKpi[] }

export async function getSessionContent(sessionSlug: string): Promise<LpItemContent> {
  const { data, error } = await (supabase as any)
    .rpc('get_lp_item_content', { p_session_slug: sessionSlug })
  if (error) throw error
  if ((data as any)?.error) throw new Error(String((data as any).error))
  return data as LpItemContent
}


