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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface Profile {
  id: string
  name: string
  avatar: string
}

interface Medication {
  id: string
  name: string
  dosage: string
  frequency: string
  timing: string
  foodTiming: string
  duration: string
  startDate: string
  endDate: string
  profileId: string
  profileName: string
  profileAvatar: string
  status: "active" | "completed" | "paused"
  prescriptionId?: string
  doctorName?: string
  nextDose?: string
  progress: number
  totalDoses: number
  takenDoses: number
}

interface AddMedicationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  profiles: Profile[]
  onAddMedication: (medication: Omit<Medication, "id">) => void
}

export function AddMedicationDialog({ open, onOpenChange, profiles, onAddMedication }: AddMedicationDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    frequency: "",
    timing: "",
    foodTiming: "",
    duration: "",
    profileId: "",
    notes: "",
  })
  const [startDate, setStartDate] = useState<Date>()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.dosage || !formData.profileId || !startDate) {
      return
    }

    const selectedProfile = profiles.find((p) => p.id === formData.profileId)
    if (!selectedProfile) return

    // Calculate end date based on duration
    let endDate = ""
    if (formData.duration && formData.duration !== "Ongoing") {
      const durationMatch = formData.duration.match(/(\d+)\s*(day|week|month)s?/i)
      if (durationMatch) {
        const [, amount, unit] = durationMatch
        const endDateTime = new Date(startDate)
        switch (unit.toLowerCase()) {
          case "day":
            endDateTime.setDate(endDateTime.getDate() + Number.parseInt(amount))
            break
          case "week":
            endDateTime.setDate(endDateTime.getDate() + Number.parseInt(amount) * 7)
            break
          case "month":
            endDateTime.setMonth(endDateTime.getMonth() + Number.parseInt(amount))
            break
        }
        endDate = endDateTime.toISOString().split("T")[0]
      }
    }

    const newMedication: Omit<Medication, "id"> = {
      name: formData.name,
      dosage: formData.dosage,
      frequency: formData.frequency,
      timing: formData.timing,
      foodTiming: formData.foodTiming,
      duration: formData.duration,
      startDate: startDate.toISOString().split("T")[0],
      endDate,
      profileId: formData.profileId,
      profileName: selectedProfile.name,
      profileAvatar: selectedProfile.avatar,
      status: "active",
      nextDose: "", // Would be calculated based on schedule
      progress: 0,
      totalDoses: 0,
      takenDoses: 0,
    }

    onAddMedication(newMedication)

    // Reset form
    setFormData({
      name: "",
      dosage: "",
      frequency: "",
      timing: "",
      foodTiming: "",
      duration: "",
      profileId: "",
      notes: "",
    })
    setStartDate(undefined)
  }

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif">Add New Medication</DialogTitle>
          <DialogDescription>Add a medication manually to track for a family member</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Medicine Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateFormData("name", e.target.value)}
                placeholder="Enter medicine name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dosage">Dosage *</Label>
              <Input
                id="dosage"
                value={formData.dosage}
                onChange={(e) => updateFormData("dosage", e.target.value)}
                placeholder="e.g., 10mg, 500mg"
                required
              />
            </div>
          </div>

          {/* Profile Selection */}
          <div className="space-y-2">
            <Label>Family Member *</Label>
            <Select value={formData.profileId} onValueChange={(value) => updateFormData("profileId", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select family member" />
              </SelectTrigger>
              <SelectContent>
                {profiles.map((profile) => (
                  <SelectItem key={profile.id} value={profile.id}>
                    {profile.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Schedule */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Frequency</Label>
              <Select value={formData.frequency} onValueChange={(value) => updateFormData("frequency", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Once daily">Once daily</SelectItem>
                  <SelectItem value="Twice daily">Twice daily</SelectItem>
                  <SelectItem value="Three times daily">Three times daily</SelectItem>
                  <SelectItem value="Four times daily">Four times daily</SelectItem>
                  <SelectItem value="As needed">As needed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Timing</Label>
              <Select value={formData.timing} onValueChange={(value) => updateFormData("timing", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timing" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Morning">Morning</SelectItem>
                  <SelectItem value="Afternoon">Afternoon</SelectItem>
                  <SelectItem value="Evening">Evening</SelectItem>
                  <SelectItem value="Morning, Evening">Morning, Evening</SelectItem>
                  <SelectItem value="Morning, Afternoon, Evening">Morning, Afternoon, Evening</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Food Timing</Label>
              <Select value={formData.foodTiming} onValueChange={(value) => updateFormData("foodTiming", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select food timing" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Before food">Before food</SelectItem>
                  <SelectItem value="After food">After food</SelectItem>
                  <SelectItem value="With food">With food</SelectItem>
                  <SelectItem value="Empty stomach">Empty stomach</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Duration</Label>
              <Input
                value={formData.duration}
                onChange={(e) => updateFormData("duration", e.target.value)}
                placeholder="e.g., 7 days, 30 days, Ongoing"
              />
            </div>
          </div>

          {/* Start Date */}
          <div className="space-y-2">
            <Label>Start Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => updateFormData("notes", e.target.value)}
              placeholder="Any additional notes about this medication"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="gap-2">
              <Plus className="w-4 h-4" />
              Add Medication
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
