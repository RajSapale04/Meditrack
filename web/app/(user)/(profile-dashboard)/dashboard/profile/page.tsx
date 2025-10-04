"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Edit,
  Pill,
  Stethoscope,
  FileText,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  Heart,
  Activity,
} from "lucide-react"
import { EditProfileDialog } from "@/components/profiles/edit-profile-dialog"
import { useProfile } from "@/context/ProfileContext"
import axios from "axios"
import { extractLastTwoDigits } from "@/utils/utils"

interface Profile {
  id: string
  name: string
  age: number
}

interface TimelineEvent {
  id: string
  type: "prescription" | "appointment" | "medication" | "note"
  date: string
  title: string
  description: string
  doctorName?: string
  hospitalClinic?: string
  medications?: string[]
  status?: string
}

interface Medication {
  id: string
  name: string
  dosage: string
  frequency: string
  status: "active" | "completed" | "paused"
  startDate: string
  endDate?: string
  doctorName?: string
}

export default function ProfileDetailPage() {
  const router = useRouter()
  const {selectedProfile} = useProfile();

  const handleEditProfile = async(updatedProfile: Omit<Profile, "id" >) => {
    if (!selectedProfile) return
    try {
      const res = await axios.put(`http://localhost:5000/profiles/${selectedProfile.id}`, updatedProfile, { withCredentials: true });
      setProfile(res.data);
      console.log("Profile updated:", res.data);
    } catch (err) {
      console.error("Failed to edit profile", err);
    } finally { 
    setShowEditDialog(false)
    }
  }
  // Mock data - in real app this would come from API/database
  const [profile,setProfile] = useState<Profile|null>(selectedProfile)

  const [showEditDialog, setShowEditDialog] = useState(false)

  // Mock timeline data
  const [timelineEvents] = useState<TimelineEvent[]>([
    {
      id: "1",
      type: "prescription",
      date: "2024-01-15",
      title: "New Prescription from Dr. Sarah Johnson",
      description: "Prescribed Lisinopril and Metformin for blood pressure and diabetes management",
      doctorName: "Dr. Sarah Johnson",
      hospitalClinic: "City General Hospital",
      medications: ["Lisinopril 10mg", "Metformin 500mg"],
      status: "active",
    },
    {
      id: "2",
      type: "appointment",
      date: "2024-01-10",
      title: "Routine Checkup",
      description: "Annual physical examination and blood work",
      doctorName: "Dr. Sarah Johnson",
      hospitalClinic: "City General Hospital",
    },
    {
      id: "3",
      type: "medication",
      date: "2024-01-05",
      title: "Started Vitamin D3 Supplement",
      description: "Added daily vitamin D3 supplement to routine",
      status: "active",
    },
    {
      id: "4",
      type: "note",
      date: "2024-01-01",
      title: "Blood Pressure Monitoring",
      description: "Started daily blood pressure monitoring at home. Target: <130/80 mmHg",
    },
  ])

  // Mock current medications
  const [currentMedications] = useState<Medication[]>([
    {
      id: "1",
      name: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      status: "active",
      startDate: "2024-01-15",
      doctorName: "Dr. Sarah Johnson",
    },
    {
      id: "2",
      name: "Metformin",
      dosage: "500mg",
      frequency: "Twice daily",
      status: "active",
      startDate: "2024-01-15",
      doctorName: "Dr. Sarah Johnson",
    },
    {
      id: "3",
      name: "Vitamin D3",
      dosage: "1000 IU",
      frequency: "Once daily",
      status: "active",
      startDate: "2024-01-05",
    },
  ])

  const getEventIcon = (type: string) => {
    switch (type) {
      case "prescription":
        return <FileText className="w-4 h-4" />
      case "appointment":
        return <Stethoscope className="w-4 h-4" />
      case "medication":
        return <Pill className="w-4 h-4" />
      case "note":
        return <Edit className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getEventColor = (type: string) => {
    switch (type) {
      case "prescription":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "appointment":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      case "medication":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "note":
        return "bg-amber-100 text-amber-800 border-amber-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getMedicationStatusColor = (status: string) => {
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
  if(!profile) {
    return <div>Loading...</div>
  }
  console.log((extractLastTwoDigits(profile.id)%8).toString() + ".jpg")
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={(extractLastTwoDigits(profile.id)%8).toString() + ".jpg"} alt={profile.name} />
              <AvatarFallback className="text-lg">
                {profile.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-serif font-bold text-foreground">{profile.name}</h1>
              <div className="flex items-center gap-4 text-muted-foreground mt-1">
                <span>{profile.age} years old</span>
              </div>
            </div>
          </div>
        </div>
        <Button onClick={() => setShowEditDialog(true)} className="gap-2">
          <Edit className="w-4 h-4" />
          Edit Profile
        </Button>
      </div>

      {/* Profile Information */}
      {/* <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-serif flex items-center gap-2">
              <User className="w-5 h-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile.email && (
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{profile.email}</span>
              </div>
            )}
            {profile.phone && (
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{profile.phone}</span>
              </div>
            )}
            {profile.bloodType && (
              <div className="flex items-center gap-3">
                <Heart className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Blood Type: {profile.bloodType}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-serif flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Health Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile.allergies && profile.allergies.length > 0 && (
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Allergies:</p>
                <div className="flex flex-wrap gap-1">
                  {profile.allergies.map((allergy, index) => (
                    <Badge key={index} variant="destructive" className="text-xs">
                      {allergy}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-foreground mb-1">Active Medications:</p>
              <p className="text-2xl font-bold text-primary">{currentMedications.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-serif">Emergency Contact</CardTitle>
          </CardHeader>
          <CardContent>
            {profile.emergencyContact ? (
              <p className="text-sm">{profile.emergencyContact}</p>
            ) : (
              <p className="text-sm text-muted-foreground">No emergency contact set</p>
            )}
          </CardContent>
        </Card>
      </div> */}

      {/* Notes */}
      {/* {profile.notes && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-serif">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{profile.notes}</p>
          </CardContent>
        </Card>
      )} */}

      {/* Tabs for detailed information */}
      <Tabs defaultValue="timeline" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="medications">Current Medications</TabsTrigger>
          <TabsTrigger value="doctors">Doctors & Visits</TabsTrigger>
        </TabsList>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="space-y-4">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg font-serif">Health Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {timelineEvents.map((event, index) => (
                  <div key={event.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${getEventColor(event.type)}`}
                      >
                        {getEventIcon(event.type)}
                      </div>
                      {index < timelineEvents.length - 1 && <div className="w-px h-12 bg-border mt-2" />}
                    </div>
                    <div className="flex-1 pb-6">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-foreground">{event.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {new Date(event.date).toLocaleDateString()}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                      {event.doctorName && (
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Stethoscope className="w-3 h-3" />
                            {event.doctorName}
                          </div>
                          {event.hospitalClinic && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {event.hospitalClinic}
                            </div>
                          )}
                        </div>
                      )}
                      {event.medications && event.medications.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {event.medications.map((medication, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {medication}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Current Medications Tab */}
        <TabsContent value="medications" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {currentMedications.map((medication) => (
              <Card key={medication.id} className="border-border/50">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg font-serif">{medication.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {medication.dosage}
                        </Badge>
                        <Badge className={`text-xs ${getMedicationStatusColor(medication.status)}`}>
                          {medication.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Frequency:</span>
                    <span className="font-medium">{medication.frequency}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Started:</span>
                    <span>{new Date(medication.startDate).toLocaleDateString()}</span>
                  </div>
                  {medication.doctorName && (
                    <div className="flex items-center justify-between text-sm pt-2 border-t border-border/50">
                      <span className="text-muted-foreground">Prescribed by:</span>
                      <span className="font-medium">{medication.doctorName}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Doctors & Visits Tab */}
        <TabsContent value="doctors" className="space-y-4">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg font-serif">Healthcare Providers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src="/doctor-avatar.png" alt="Dr. Sarah Johnson" />
                    <AvatarFallback>SJ</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">Dr. Sarah Johnson</h4>
                    <p className="text-sm text-muted-foreground">Primary Care Physician</p>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">City General Hospital</span>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <Badge variant="outline" className="text-xs">
                        Last visit: Jan 10, 2024
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        2 active prescriptions
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Profile Dialog */}
      <EditProfileDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        profile={profile}
        onEditProfile={handleEditProfile}
      />
    </div>
  )
}
