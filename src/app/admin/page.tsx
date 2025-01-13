'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { assignQuestsToAllUsers, assignQuestsToUser } from '@/lib/quests/questAssignment'
import { useQuests } from '@/contexts/QuestContext'
import { Input } from '@/components/ui/input'

export default function AdminPage() {
  const [userId, setUserId] = useState('')
  const [loading, setLoading] = useState(false)
  const { refreshQuests } = useQuests()

  const handleAssignToAll = async () => {
    setLoading(true)
    try {
      await assignQuestsToAllUsers()
      alert('Quests assigned to all users successfully!')
    } catch (error) {
      console.error('Error assigning quests to all users:', error)
      alert('Failed to assign quests to all users.')
    } finally {
      setLoading(false)
    }
  }

  const handleAssignToUser = async () => {
    if (!userId) {
      alert('Please enter a user ID.')
      return
    }
    setLoading(true)
    try {
      await assignQuestsToUser(userId)
      alert(`Quests assigned to user ${userId} successfully!`)
      refreshQuests()
    } catch (error) {
      console.error(`Error assigning quests to user ${userId}:`, error)
      alert(`Failed to assign quests to user ${userId}.`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container max-w-md py-4 space-y-6">
      <h1 className="text-2xl font-bold">Admin Panel</h1>
      <div className="space-y-4">
        <Button onClick={handleAssignToAll} disabled={loading}>
          Assign Quests to All Users
        </Button>
        <div className="flex items-center space-x-2">
          <Input 
            placeholder="Enter User ID" 
            value={userId} 
            onChange={(e) => setUserId(e.target.value)} 
          />
          <Button onClick={handleAssignToUser} disabled={loading}>
            Assign to User
          </Button>
        </div>
      </div>
    </div>
  )
} 