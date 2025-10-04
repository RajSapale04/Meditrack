"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { set } from "date-fns"

interface Profile {
  id: string
  name: string
  age: number
}

interface EditProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  profile: Profile | null
  onEditProfile: (profile: {
    name: string
    age: number
  }) => void
}

export function EditProfileDialog({ open, onOpenChange, profile, onEditProfile }: EditProfileDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
  })

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name,
        age: profile.age.toString(),
      })
    }
  }, [profile])
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.age) return

    setIsLoading(true)
    try {
      await onEditProfile({
        name: formData.name,
        age: Number.parseInt(formData.age),
      })
      setFormData({ name: "", age: "" })  
    } catch (error) {
      console.error("Failed to edit profile", error)
    } finally {
      setIsLoading(false)
    }
  }



  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-serif">Edit Profile</DialogTitle>
          <DialogDescription>Update the profile information for {profile?.name}.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-age">Age</Label>
              <Input
                id="edit-age"
                type="number"
                placeholder="Enter age"
                value={formData.age}
                onChange={(e) => handleInputChange("age", e.target.value)}
                min="0"
                max="120"
                required
              />
            </div>
            
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
