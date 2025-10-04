"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Eye } from "lucide-react"
import { AddProfileDialog } from "@/components/profiles/add-profile-dialog"
import { EditProfileDialog } from "@/components/profiles/edit-profile-dialog"
import { DeleteProfileDialog } from "@/components/profiles/delete-profile-dialog"

interface Profile {
  id: string
  name: string
  age: number
  relationship: string
  avatar?: string
  medicationCount: number
  lastMedication?: string
}

export default function ProfilesPage() {
  // Mock data - in real app this would come from API/database
  const [profiles, setProfiles] = useState<Profile[]>([
    {
      id: "1",
      name: "John Doe",
      age: 45,
      relationship: "Self",
      avatar: "/middle-aged-man-contemplative.png",
      medicationCount: 3,
      lastMedication: "Lisinopril - 2 hours ago",
    },
    {
      id: "2",
      name: "Sarah Doe",
      age: 42,
      relationship: "Spouse",
      avatar: "/middle-aged-woman.png",
      medicationCount: 2,
      lastMedication: "Amoxicillin - 4 hours ago",
    },
    {
      id: "3",
      name: "Emma Doe",
      age: 16,
      relationship: "Daughter",
      avatar: "/teenage-girl.png",
      medicationCount: 1,
      lastMedication: "Vitamin D3 - Yesterday",
    },
    {
      id: "4",
      name: "Michael Doe",
      age: 12,
      relationship: "Son",
      avatar: "/young-boy.png",
      medicationCount: 0,
      lastMedication: undefined,
    },
  ])

  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleAddProfile = (newProfile: Omit<Profile, "id" | "medicationCount" | "lastMedication">) => {
    const profile: Profile = {
      ...newProfile,
      id: Date.now().toString(),
      medicationCount: 0,
      lastMedication: undefined,
    }
    setProfiles([...profiles, profile])
    setShowAddDialog(false)
  }

  const handleEditProfile = (updatedProfile: Omit<Profile, "id" | "medicationCount" | "lastMedication">) => {
    if (!selectedProfile) return
    setProfiles(
      profiles.map((profile) => (profile.id === selectedProfile.id ? { ...profile, ...updatedProfile } : profile)),
    )
    setShowEditDialog(false)
    setSelectedProfile(null)
  }

  const handleDeleteProfile = () => {
    if (!selectedProfile) return
    setProfiles(profiles.filter((profile) => profile.id !== selectedProfile.id))
    setShowDeleteDialog(false)
    setSelectedProfile(null)
  }

  const openEditDialog = (profile: Profile) => {
    setSelectedProfile(profile)
    setShowEditDialog(true)
  }

  const openDeleteDialog = (profile: Profile) => {
    setSelectedProfile(profile)
    setShowDeleteDialog(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Family Profiles</h1>
          <p className="text-muted-foreground mt-2">Manage medication profiles for your family members</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Profile
        </Button>
      </div>

      {/* Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {profiles.map((profile) => (
          <Card key={profile.id} className="border-border/50 hover:shadow-lg transition-shadow">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.name} />
                  <AvatarFallback className="text-lg">
                    {profile.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-xl font-serif">{profile.name}</CardTitle>
              <div className="flex items-center justify-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {profile.age} years old
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {profile.relationship}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Medication Info */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-primary">{profile.medicationCount}</span> active medications
                </p>
                {profile.lastMedication && (
                  <p className="text-xs text-muted-foreground mt-1">Last: {profile.lastMedication}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button asChild className="w-full gap-2">
                  <Link href={`/dashboard/profiles/${profile.id}`}>
                    <Eye className="w-3 h-3" />
                    View Profile
                  </Link>
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-2 bg-transparent"
                    onClick={() => openEditDialog(profile)}
                  >
                    <Edit className="w-3 h-3" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive bg-transparent"
                    onClick={() => openDeleteDialog(profile)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add Profile Card */}
        <Card
          className="border-dashed border-2 border-border/50 hover:border-primary/50 transition-colors cursor-pointer"
          onClick={() => setShowAddDialog(true)}
        >
          <CardContent className="flex flex-col items-center justify-center h-full min-h-[300px] text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Plus className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-foreground mb-2">Add New Profile</h3>
            <p className="text-sm text-muted-foreground">Create a profile for a family member</p>
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      <AddProfileDialog open={showAddDialog} onOpenChange={setShowAddDialog} onAddProfile={handleAddProfile} />

      <EditProfileDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        profile={selectedProfile}
        onEditProfile={handleEditProfile}
      />

      <DeleteProfileDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        profile={selectedProfile}
        onDeleteProfile={handleDeleteProfile}
      />
    </div>
  )
}
