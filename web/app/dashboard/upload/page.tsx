"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, X, Plus, Save, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Medication {
  id: string
  name: string
  dosage: string
  frequency: string
  timing: string
  foodTiming: string
  duration: string
}

interface ExtractedData {
  doctorName: string
  hospitalClinic: string
  profileId: string
  medications: Medication[]
  notes: string
}

export default function UploadPage() {
  const { toast } = useToast()
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Mock profiles - in real app this would come from API
  const profiles = [
    { id: "1", name: "John Doe" },
    { id: "2", name: "Sarah Doe" },
    { id: "3", name: "Emma Doe" },
    { id: "4", name: "Michael Doe" },
  ]

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      // Simulate AI processing
      setIsProcessing(true)
      setTimeout(() => {
        setIsProcessing(false)
        // Mock extracted data
        setExtractedData({
          doctorName: "Dr. Sarah Johnson",
          hospitalClinic: "City General Hospital",
          profileId: "",
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
          ],
          notes: "Follow up in 4 weeks. Monitor blood pressure daily.",
        })
        toast({
          title: "Prescription processed",
          description: "AI has extracted the prescription details. Please review and edit if needed.",
        })
      }, 3000)
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file) {
      setUploadedFile(file)
      // Trigger processing similar to file input
      setIsProcessing(true)
      setTimeout(() => {
        setIsProcessing(false)
        setExtractedData({
          doctorName: "Dr. Sarah Johnson",
          hospitalClinic: "City General Hospital",
          profileId: "",
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
          ],
          notes: "Follow up in 4 weeks. Monitor blood pressure daily.",
        })
        toast({
          title: "Prescription processed",
          description: "AI has extracted the prescription details. Please review and edit if needed.",
        })
      }, 3000)
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const removeFile = () => {
    setUploadedFile(null)
    setExtractedData(null)
  }

  const addMedication = () => {
    if (!extractedData) return
    const newMedication: Medication = {
      id: Date.now().toString(),
      name: "",
      dosage: "",
      frequency: "",
      timing: "",
      foodTiming: "",
      duration: "",
    }
    setExtractedData({
      ...extractedData,
      medications: [...extractedData.medications, newMedication],
    })
  }

  const removeMedication = (id: string) => {
    if (!extractedData) return
    setExtractedData({
      ...extractedData,
      medications: extractedData.medications.filter((med) => med.id !== id),
    })
  }

  const updateMedication = (id: string, field: keyof Medication, value: string) => {
    if (!extractedData) return
    setExtractedData({
      ...extractedData,
      medications: extractedData.medications.map((med) => (med.id === id ? { ...med, [field]: value } : med)),
    })
  }

  const updateExtractedData = (field: keyof ExtractedData, value: string) => {
    if (!extractedData) return
    setExtractedData({
      ...extractedData,
      [field]: value,
    })
  }

  const handleSave = async () => {
    if (!extractedData || !extractedData.profileId) {
      toast({
        title: "Missing information",
        description: "Please select a profile and fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      toast({
        title: "Prescription saved",
        description: "The prescription has been successfully added to the selected profile.",
      })
      // Reset form
      setUploadedFile(null)
      setExtractedData(null)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground">Upload Prescription</h1>
        <p className="text-muted-foreground mt-2">Upload doctor prescriptions and extract medication details</p>
      </div>

      {/* Upload Section */}
      {!uploadedFile && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-serif">Upload Prescription Image or PDF</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-foreground mb-2">Drop your prescription here</h3>
              <p className="text-sm text-muted-foreground mb-4">or click to browse files</p>
              <p className="text-xs text-muted-foreground">Supports PDF, JPG, PNG files up to 10MB</p>
              <input
                id="file-upload"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Processing State */}
      {uploadedFile && isProcessing && (
        <Card className="border-border/50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
            <h3 className="font-medium text-foreground mb-2">Processing prescription...</h3>
            <p className="text-sm text-muted-foreground">AI is extracting medication details from your prescription</p>
          </CardContent>
        </Card>
      )}

      {/* Uploaded File Display */}
      {uploadedFile && !isProcessing && (
        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-serif">Uploaded File</CardTitle>
              <Button variant="outline" size="sm" onClick={removeFile} className="gap-2 bg-transparent">
                <X className="w-3 h-3" />
                Remove
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
              <FileText className="w-8 h-8 text-primary" />
              <div>
                <p className="font-medium">{uploadedFile.name}</p>
                <p className="text-sm text-muted-foreground">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Extracted Data Form */}
      {extractedData && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-serif">Review & Edit Prescription Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="doctor-name">Doctor's Name</Label>
                <Input
                  id="doctor-name"
                  value={extractedData.doctorName}
                  onChange={(e) => updateExtractedData("doctorName", e.target.value)}
                  placeholder="Enter doctor's name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hospital">Hospital/Clinic</Label>
                <Input
                  id="hospital"
                  value={extractedData.hospitalClinic}
                  onChange={(e) => updateExtractedData("hospitalClinic", e.target.value)}
                  placeholder="Enter hospital or clinic name"
                />
              </div>
            </div>

            {/* Profile Selection */}
            <div className="space-y-2">
              <Label htmlFor="profile">Select Profile</Label>
              <Select
                value={extractedData.profileId}
                onValueChange={(value) => updateExtractedData("profileId", value)}
              >
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

            {/* Medications */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base">Medications</Label>
                <Button variant="outline" size="sm" onClick={addMedication} className="gap-2 bg-transparent">
                  <Plus className="w-3 h-3" />
                  Add Medication
                </Button>
              </div>

              <div className="space-y-4">
                {extractedData.medications.map((medication, index) => (
                  <Card key={medication.id} className="border-border/30">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">Medication {index + 1}</Badge>
                        {extractedData.medications.length > 1 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeMedication(medication.id)}
                            className="text-destructive hover:text-destructive bg-transparent"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Medicine Name</Label>
                          <Input
                            value={medication.name}
                            onChange={(e) => updateMedication(medication.id, "name", e.target.value)}
                            placeholder="Enter medicine name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Dosage</Label>
                          <Input
                            value={medication.dosage}
                            onChange={(e) => updateMedication(medication.id, "dosage", e.target.value)}
                            placeholder="e.g., 10mg, 500mg"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Frequency</Label>
                          <Select
                            value={medication.frequency}
                            onValueChange={(value) => updateMedication(medication.id, "frequency", value)}
                          >
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
                          <Select
                            value={medication.timing}
                            onValueChange={(value) => updateMedication(medication.id, "timing", value)}
                          >
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
                        <div className="space-y-2">
                          <Label>Food Timing</Label>
                          <Select
                            value={medication.foodTiming}
                            onValueChange={(value) => updateMedication(medication.id, "foodTiming", value)}
                          >
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
                      </div>

                      <div className="space-y-2">
                        <Label>Duration</Label>
                        <Input
                          value={medication.duration}
                          onChange={(e) => updateMedication(medication.id, "duration", e.target.value)}
                          placeholder="e.g., 7 days, 30 days, 3 months"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Doctor's Notes</Label>
              <Textarea
                id="notes"
                value={extractedData.notes}
                onChange={(e) => updateExtractedData("notes", e.target.value)}
                placeholder="Enter any additional notes from the doctor"
                rows={3}
              />
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button onClick={handleSave} disabled={isSaving} className="gap-2">
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {isSaving ? "Saving..." : "Save Prescription"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
