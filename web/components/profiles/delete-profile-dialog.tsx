"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertTriangle } from "lucide-react"

interface Profile {
  id: string
  name: string
  age: number
  relationship: string
  avatar?: string
  medicationCount: number
  lastMedication?: string
}

interface DeleteProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  profile: Profile | null
  onDeleteProfile: () => void
}

export function DeleteProfileDialog({ open, onOpenChange, profile, onDeleteProfile }: DeleteProfileDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <DialogTitle className="font-serif">Delete Profile</DialogTitle>
              <DialogDescription>Are you sure you want to delete {profile?.name}'s profile?</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="py-4">
          <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
            <p className="text-sm text-foreground">This action cannot be undone. This will permanently delete:</p>
            <ul className="text-sm text-muted-foreground mt-2 space-y-1">
              <li>• Profile information</li>
              <li>• {profile?.medicationCount || 0} medication records</li>
              <li>• All prescription history</li>
              <li>• Medication reminders and schedules</li>
            </ul>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={onDeleteProfile}>
            Delete Profile
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
