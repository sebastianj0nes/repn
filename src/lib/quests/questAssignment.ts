import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/lib/database.types'

const supabase = createClientComponentClient<Database>()

export async function assignQuestsToUser(userId: string) {
  // First, get all active quests
  const { data: quests, error: questError } = await supabase
    .from('quests')
    .select('id')
    .eq('active', true)

  if (questError) {
    console.error('Error fetching quests:', questError)
    return
  }

  // Prepare the user_quests entries
  const userQuestEntries = quests.map(quest => ({
    user_id: userId,
    quest_id: quest.id,
    progress: 0,
    completed: false,
    reward_claimed: false
  }))

  // Insert the user_quests entries
  const { error: insertError } = await supabase
    .from('user_quests')
    .upsert(userQuestEntries, {
      onConflict: 'user_id,quest_id'
    })

  if (insertError) {
    console.error('Error assigning quests:', insertError)
    return
  }

  return true
}

export async function assignQuestsToAllUsers() {
  // Get all users
  const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers()
  
  if (usersError) {
    console.error('Error fetching users:', usersError)
    return
  }

  // Get all active quests
  const { data: quests, error: questError } = await supabase
    .from('quests')
    .select('id')
    .eq('active', true)

  if (questError) {
    console.error('Error fetching quests:', questError)
    return
  }

  // Create entries for all users and quests
  const userQuestEntries = users.flatMap(user =>
    quests.map(quest => ({
      user_id: user.id,
      quest_id: quest.id,
      progress: 0,
      completed: false,
      reward_claimed: false
    }))
  )

  // Insert in batches to avoid hitting limits
  const batchSize = 1000
  for (let i = 0; i < userQuestEntries.length; i += batchSize) {
    const batch = userQuestEntries.slice(i, i + batchSize)
    const { error: insertError } = await supabase
      .from('user_quests')
      .upsert(batch, {
        onConflict: 'user_id,quest_id'
      })

    if (insertError) {
      console.error(`Error assigning quests batch ${i}:`, insertError)
    }
  }

  return true
} 