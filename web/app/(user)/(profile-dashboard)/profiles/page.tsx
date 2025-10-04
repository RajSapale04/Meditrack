"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Eye } from "lucide-react"
import { AddProfileDialog } from "@/components/profiles/add-profile-dialog"
import { EditProfileDialog } from "@/components/profiles/edit-profile-dialog"
import { DeleteProfileDialog } from "@/components/profiles/delete-profile-dialog"
import axios from "axios"
import { useProfile } from "@/context/ProfileContext"
import { useRouter } from "next/navigation"

interface Profile {
  id: string
  name: string
  age: number
}

export default function ProfilesPage() {
  // Mock data - in real app this would come from API/database
  const [profiles, setProfiles] = useState<Profile[]>([])

  const [chosenProfile, setChosenProfile] = useState<Profile | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const {setSelectedProfile} = useProfile();
  const router = useRouter();


  const fetchProfiles = async () => {
    setIsLoading(true)
    try {
      const res= await axios.get("http://localhost:5000/profiles", { withCredentials: true });
      console.log("Profiles fetched:", res.data);
      setProfiles(res.data);
    }catch (err) {
      console.error("Failed to fetch profiles", err);
    }finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchProfiles()
    // Fetch profiles from API or database
    // For now, using static mock data
    
  }, [])
  const selectProfile = (profile: Profile) => {
    setSelectedProfile(profile);
    router.push("/dashboard"); // redirect after choosing
  };

  const handleAddProfile = async(newProfile: Omit<Profile, "id" >) => {
    try {
      const res = await axios.post("http://localhost:5000/profiles", newProfile, { withCredentials: true });
      setProfiles([...profiles, res.data]);
      console.log("Profile added:", res.data);
    } catch (err) {
      console.error("Failed to add profile", err);
    } finally {
      setShowAddDialog(false)
    }
  }

  const handleEditProfile = async(updatedProfile: Omit<Profile, "id" >) => {
    if (!chosenProfile) return
    try {
      const res = await axios.put(`http://localhost:5000/profiles/${chosenProfile.id}`, updatedProfile, { withCredentials: true });
      setProfiles(profiles.map((profile) => profile.id === chosenProfile.id ? res.data : profile));
      console.log("Profile updated:", res.data);
    } catch (err) {
      console.error("Failed to edit profile", err);
    } finally { 
    setShowEditDialog(false)
    setChosenProfile(null)
    }
  }

  const handleDeleteProfile = async() => {
    if (!chosenProfile) return
    try {
      await axios.delete(`http://localhost:5000/profiles/${chosenProfile.id}`, { withCredentials: true });
      setProfiles(profiles.filter((profile) => profile.id !== chosenProfile.id))
      console.log("Profile deleted:", chosenProfile.id);
    } catch (err) {
      console.error("Failed to delete profile", err);
    } finally {
      setShowDeleteDialog(false)
      setChosenProfile(null)
    }
  }

  const openEditDialog = (profile: Profile) => {
    setChosenProfile(profile)
    setShowEditDialog(true)
  }

  const openDeleteDialog = (profile: Profile) => {
    setChosenProfile(profile)
    setShowDeleteDialog(true)
  }
  if (isLoading) return <p>Loading...</p>;
  return (
    <div className="p-16 space-y-6">
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
                  <AvatarImage src={ "/placeholder.svg"} alt={profile.name} />
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

              </div>
            </CardHeader>
            <CardContent className="space-y-4">


              {/* Action Buttons */}
              <div className="space-y-2">
                <Button  className="w-full gap-2" onClick={() => selectProfile(profile)}>
                    <Eye className="w-3 h-3" />
                    Select Profile
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
        profile={chosenProfile}
        onEditProfile={handleEditProfile}
      />

      <DeleteProfileDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        profile={chosenProfile}
        onDeleteProfile={handleDeleteProfile}
      />
    </div>
  )
}
