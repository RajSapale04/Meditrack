"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, FileText, Calendar, MapPin, Edit, Trash2 } from "lucide-react"
import { DeletePrescriptionDialog } from "@/components/prescriptions/delete-prescription-dialog"

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

export default function DoctorsPage() {
  // Mock data - in real app this would come from API/database
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([
    {
      id: "1",
      doctorName: "Dr. Sarah Johnson",
      hospitalClinic: "City General Hospital",
      profileId: "1",
      profileName: "John Doe",
      date: "2024-01-15",
      medications: [
        {
          id: "1",
          name: "Lisinopril",
          dosage: "10mg",
          frequency: "Once daily",
          timing: "Morning",
          foodTiming: "Before food",
          duration: "30 days",
        },
        {
          id: "2",
          name: "Metformin",
          dosage: "500mg",
          frequency: "Twice daily",
          timing: "Morning, Evening",
          foodTiming: "After food",
          duration: "90 days",
        },
      ],
      notes: "Follow up in 4 weeks. Monitor blood pressure daily.",
      imageUrl: "/prescription-sample.png",
    },
    {
      id: "2",
      doctorName: "Dr. Michael Chen",
      hospitalClinic: "Pediatric Care Center",
      profileId: "3",
      profileName: "Emma Doe",
      date: "2024-01-10",
      medications: [
        {
          id: "3",
          name: "Amoxicillin",
          dosage: "250mg",
          frequency: "Three times daily",
          timing: "Morning, Afternoon, Evening",
          foodTiming: "After food",
          duration: "7 days",
        },
      ],
      notes: "Complete the full course even if symptoms improve.",
      imageUrl: "/prescription-sample-2.png",
    },
  ])

  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDeletePrescription = () => {
    if (!selectedPrescription) return
    setPrescriptions(prescriptions.filter((prescription) => prescription.id !== selectedPrescription.id))
    setShowDeleteDialog(false)
    setSelectedPrescription(null)
  }

  const openDeleteDialog = (prescription: Prescription) => {
    setSelectedPrescription(prescription)
    setShowDeleteDialog(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Doctors & Prescriptions</h1>
          <p className="text-muted-foreground mt-2">Upload and manage prescriptions from healthcare providers</p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/dashboard/upload">
            <Plus className="w-4 h-4" />
            Upload Prescription
          </Link>
        </Button>
      </div>

      {/* Prescriptions List */}
      <div className="space-y-4">
        {prescriptions.length === 0 ? (
          <Card className="border-dashed border-2 border-border/50">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-foreground mb-2">No prescriptions yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Upload your first prescription to get started with medication tracking
              </p>
              <Button asChild>
                <Link href="/dashboard/upload">Upload Prescription</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          prescriptions.map((prescription) => (
            <Card key={prescription.id} className="border-border/50 hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src="/doctor-avatar.png" alt={prescription.doctorName} />
                      <AvatarFallback>
                        {prescription.doctorName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-xl font-serif">{prescription.doctorName}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {prescription.hospitalClinic}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(prescription.date).toLocaleDateString()}
                        </div>
                      </div>
                      <Badge variant="outline" className="mt-2">
                        {prescription.profileName}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                      <Edit className="w-3 h-3" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive bg-transparent"
                      onClick={() => openDeleteDialog(prescription)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Medications */}
                  <div>
                    <h4 className="font-medium text-foreground mb-3">Prescribed Medications</h4>
                    <div className="grid gap-3">
                      {prescription.medications.map((medication) => (
                        <div
                          key={medication.id}
                          className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{medication.name}</span>
                              <Badge variant="secondary" className="text-xs">
                                {medication.dosage}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {medication.frequency} • {medication.timing} • {medication.foodTiming} •{" "}
                              {medication.duration}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  {prescription.notes && (
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Doctor's Notes</h4>
                      <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">{prescription.notes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Delete Dialog */}
      <DeletePrescriptionDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        prescription={selectedPrescription}
        onDeletePrescription={handleDeletePrescription}
      />
    </div>
  )
}
