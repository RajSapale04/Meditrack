"use client"

import type React from "react"

import { useState } from "react"
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


interface AddProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddProfile: (profile: {
    name: string
    age: number
  }) => void
}

export function AddProfileDialog({ open, onOpenChange, onAddProfile }: AddProfileDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const handleSubmit =  async(e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.age) return
    setIsLoading(true)
    try {
      await onAddProfile({
        name: formData.name,
        age: Number.parseInt(formData.age),
      })
      setFormData({ name: "", age: ""})
    } catch (error) {
      console.error("Failed to add profile", error)
    } finally {
      setIsLoading(false)
    }

    // Reset form
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-serif">Add New Profile</DialogTitle>
          <DialogDescription>Create a new profile for a family member to track their medications.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
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
              Add Profile
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
