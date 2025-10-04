import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, Pill, Calendar } from "lucide-react"

export default function DashboardPage() {
  // Mock data - in real app this would come from API/database
  const userData = {
    name: "John Doe",
    profilesCount: 4,
    activePrescriptions: 12,
    upcomingMedications: 3,
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground">Welcome back, {userData.name}</h1>
        <p className="text-muted-foreground mt-2">Here's an overview of your family's medication management</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-border/50 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Family Profiles</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{userData.profilesCount}</div>
            <p className="text-xs text-muted-foreground">Active family members</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Prescriptions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{userData.activePrescriptions}</div>
            <p className="text-xs text-muted-foreground">Current prescriptions</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medications Today</CardTitle>
            <Pill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{userData.upcomingMedications}</div>
            <p className="text-xs text-muted-foreground">Due today</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Appointment</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">2</div>
            <p className="text-xs text-muted-foreground">Days away</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-serif">Recent Medications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium">Amoxicillin 500mg</p>
                  <p className="text-sm text-muted-foreground">Sarah - Taken 2 hours ago</p>
                </div>
                <div className="w-2 h-2 bg-primary rounded-full"></div>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium">Lisinopril 10mg</p>
                  <p className="text-sm text-muted-foreground">John - Taken 4 hours ago</p>
                </div>
                <div className="w-2 h-2 bg-primary rounded-full"></div>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium">Vitamin D3</p>
                  <p className="text-sm text-muted-foreground">Emma - Taken yesterday</p>
                </div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-serif">Upcoming Reminders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-accent/10 rounded-lg border border-accent/20">
                <div>
                  <p className="font-medium">Metformin 500mg</p>
                  <p className="text-sm text-muted-foreground">John - Due in 30 minutes</p>
                </div>
                <div className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded">Soon</div>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium">Ibuprofen 200mg</p>
                  <p className="text-sm text-muted-foreground">Sarah - Due in 2 hours</p>
                </div>
                <div className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">Later</div>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium">Calcium supplement</p>
                  <p className="text-sm text-muted-foreground">Emma - Due tomorrow</p>
                </div>
                <div className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">Tomorrow</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
