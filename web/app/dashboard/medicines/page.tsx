"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, Clock, CheckCircle2, AlertCircle, Pill, Edit, MoreHorizontal } from "lucide-react"
import { AddMedicationDialog } from "@/components/medicines/add-medication-dialog"
import { EditMedicationDialog } from "@/components/medicines/edit-medication-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

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

export default function MedicinesPage() {
  // Mock data - in real app this would come from API/database
  const [medications, setMedications] = useState<Medication[]>([
    {
      id: "1",
      name: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      timing: "Morning",
      foodTiming: "Before food",
      duration: "30 days",
      startDate: "2024-01-15",
      endDate: "2024-02-14",
      profileId: "1",
      profileName: "John Doe",
      profileAvatar: "/middle-aged-man-contemplative.png",
      status: "active",
      prescriptionId: "1",
      doctorName: "Dr. Sarah Johnson",
      nextDose: "2024-01-20T08:00:00",
      progress: 65,
      totalDoses: 30,
      takenDoses: 19,
    },
    {
      id: "2",
      name: "Metformin",
      dosage: "500mg",
      frequency: "Twice daily",
      timing: "Morning, Evening",
      foodTiming: "After food",
      duration: "90 days",
      startDate: "2024-01-15",
      endDate: "2024-04-15",
      profileId: "1",
      profileName: "John Doe",
      profileAvatar: "/middle-aged-man-contemplative.png",
      status: "active",
      prescriptionId: "1",
      doctorName: "Dr. Sarah Johnson",
      nextDose: "2024-01-20T08:00:00",
      progress: 32,
      totalDoses: 180,
      takenDoses: 58,
    },
    {
      id: "3",
      name: "Amoxicillin",
      dosage: "250mg",
      frequency: "Three times daily",
      timing: "Morning, Afternoon, Evening",
      foodTiming: "After food",
      duration: "7 days",
      startDate: "2024-01-10",
      endDate: "2024-01-17",
      profileId: "3",
      profileName: "Emma Doe",
      profileAvatar: "/teenage-girl.png",
      status: "completed",
      prescriptionId: "2",
      doctorName: "Dr. Michael Chen",
      nextDose: "",
      progress: 100,
      totalDoses: 21,
      takenDoses: 21,
    },
    {
      id: "4",
      name: "Vitamin D3",
      dosage: "1000 IU",
      frequency: "Once daily",
      timing: "Morning",
      foodTiming: "With food",
      duration: "Ongoing",
      startDate: "2024-01-01",
      endDate: "",
      profileId: "2",
      profileName: "Sarah Doe",
      profileAvatar: "/middle-aged-woman.png",
      status: "active",
      nextDose: "2024-01-20T09:00:00",
      progress: 0,
      totalDoses: 0,
      takenDoses: 19,
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProfile, setSelectedProfile] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null)

  // Mock profiles
  const profiles = [
    { id: "1", name: "John Doe", avatar: "/middle-aged-man-contemplative.png" },
    { id: "2", name: "Sarah Doe", avatar: "/middle-aged-woman.png" },
    { id: "3", name: "Emma Doe", avatar: "/teenage-girl.png" },
    { id: "4", name: "Michael Doe", avatar: "/young-boy.png" },
  ]

  // Filter medications
  const filteredMedications = medications.filter((medication) => {
    const matchesSearch =
      medication.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medication.profileName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesProfile = selectedProfile === "all" || medication.profileId === selectedProfile
    const matchesStatus = selectedStatus === "all" || medication.status === selectedStatus
    return matchesSearch && matchesProfile && matchesStatus
  })

  // Group medications by status
  const activeMedications = filteredMedications.filter((med) => med.status === "active")
  const completedMedications = filteredMedications.filter((med) => med.status === "completed")
  const pausedMedications = filteredMedications.filter((med) => med.status === "paused")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "paused":
        return "bg-amber-100 text-amber-800 border-amber-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Clock className="w-3 h-3" />
      case "completed":
        return <CheckCircle2 className="w-3 h-3" />
      case "paused":
        return <AlertCircle className="w-3 h-3" />
      default:
        return <Clock className="w-3 h-3" />
    }
  }

  const formatNextDose = (nextDose: string) => {
    if (!nextDose) return "No upcoming dose"
    const date = new Date(nextDose)
    const now = new Date()
    const diffHours = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60))

    if (diffHours < 0) return "Overdue"
    if (diffHours < 24) return `In ${diffHours} hours`
    return date.toLocaleDateString()
  }

  const handleEditMedication = (medication: Medication) => {
    setSelectedMedication(medication)
    setShowEditDialog(true)
  }

  const handleAddMedication = (newMedication: Omit<Medication, "id">) => {
    const medication: Medication = {
      ...newMedication,
      id: Date.now().toString(),
    }
    setMedications([...medications, medication])
    setShowAddDialog(false)
  }

  const handleUpdateMedication = (updatedMedication: Medication) => {
    setMedications(medications.map((med) => (med.id === updatedMedication.id ? updatedMedication : med)))
    setShowEditDialog(false)
    setSelectedMedication(null)
  }

  const MedicationCard = ({ medication }: { medication: Medication }) => (
    <Card key={medication.id} className="border-border/50 hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Pill className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg font-serif">{medication.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {medication.dosage}
                </Badge>
                <Badge className={`text-xs ${getStatusColor(medication.status)}`}>
                  {getStatusIcon(medication.status)}
                  <span className="ml-1 capitalize">{medication.status}</span>
                </Badge>
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEditMedication(medication)}>
                <Edit className="w-3 h-3 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Mark as Taken</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Pause Medication</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Profile Info */}
        <div className="flex items-center gap-2">
          <Avatar className="w-6 h-6">
            <AvatarImage src={medication.profileAvatar || "/placeholder.svg"} alt={medication.profileName} />
            <AvatarFallback className="text-xs">
              {medication.profileName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">{medication.profileName}</span>
        </div>

        {/* Schedule Info */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Schedule:</span>
            <span className="font-medium">{medication.frequency}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Timing:</span>
            <span>
              {medication.timing} • {medication.foodTiming}
            </span>
          </div>
          {medication.nextDose && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Next dose:</span>
              <span className="font-medium">{formatNextDose(medication.nextDose)}</span>
            </div>
          )}
        </div>

        {/* Progress */}
        {medication.totalDoses > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress:</span>
              <span className="font-medium">
                {medication.takenDoses}/{medication.totalDoses} doses
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary rounded-full h-2 transition-all duration-300"
                style={{ width: `${medication.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Doctor Info */}
        {medication.doctorName && (
          <div className="flex items-center justify-between text-sm pt-2 border-t border-border/50">
            <span className="text-muted-foreground">Prescribed by:</span>
            <span className="font-medium">{medication.doctorName}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Medicines</h1>
          <p className="text-muted-foreground mt-2">View and manage all medications for your family</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Medication
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-border/50">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search medications or family members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={selectedProfile} onValueChange={setSelectedProfile}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Profiles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Profiles</SelectItem>
                  {profiles.map((profile) => (
                    <SelectItem key={profile.id} value={profile.id}>
                      {profile.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Medications Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All ({filteredMedications.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({activeMedications.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedMedications.length})</TabsTrigger>
          <TabsTrigger value="paused">Paused ({pausedMedications.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredMedications.length === 0 ? (
            <Card className="border-dashed border-2 border-border/50">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Pill className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-medium text-foreground mb-2">No medications found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchTerm || selectedProfile !== "all" || selectedStatus !== "all"
                    ? "Try adjusting your filters or search terms"
                    : "Add your first medication to get started with tracking"}
                </p>
                <Button onClick={() => setShowAddDialog(true)}>Add Medication</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredMedications.map((medication) => (
                <MedicationCard key={medication.id} medication={medication} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeMedications.map((medication) => (
              <MedicationCard key={medication.id} medication={medication} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {completedMedications.map((medication) => (
              <MedicationCard key={medication.id} medication={medication} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="paused" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pausedMedications.map((medication) => (
              <MedicationCard key={medication.id} medication={medication} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <AddMedicationDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        profiles={profiles}
        onAddMedication={handleAddMedication}
      />

      <EditMedicationDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        medication={selectedMedication}
        profiles={profiles}
        onUpdateMedication={handleUpdateMedication}
      />
    </div>
  )
}
