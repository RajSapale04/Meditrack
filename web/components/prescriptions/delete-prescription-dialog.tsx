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

interface Medication {
  id: string
  name: string
  dosage: string
  frequency: string
  timing: string
  foodTiming: string
  duration: string
}

interface Prescription {
  id: string
  doctorName: string
  hospitalClinic: string
  profileId: string
  profileName: string
  date: string
  medications: Medication[]
  notes?: string
  imageUrl?: string
}

interface DeletePrescriptionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  prescription: Prescription | null
  onDeletePrescription: () => void
}

export function DeletePrescriptionDialog({
  open,
  onOpenChange,
  prescription,
  onDeletePrescription,
}: DeletePrescriptionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <DialogTitle className="font-serif">Delete Prescription</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this prescription from {prescription?.doctorName}?
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="py-4">
          <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
            <p className="text-sm text-foreground">This action cannot be undone. This will permanently delete:</p>
            <ul className="text-sm text-muted-foreground mt-2 space-y-1">
              <li>• Prescription from {prescription?.doctorName}</li>
              <li>• {prescription?.medications.length || 0} medication records</li>
              <li>• All medication schedules and reminders</li>
              <li>• Doctor's notes and prescription image</li>
            </ul>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={onDeletePrescription}>
            Delete Prescription
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
