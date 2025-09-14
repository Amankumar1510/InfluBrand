import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Users, 
  Heart, 
  MessageCircle, 
  Eye, 
  TrendingUp,
  Instagram,
  Mail,
  Phone,
  Calendar,
  Star,
  Building2
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import logo from "@/assets/logo.png";

// Mock data for detailed influencer profile
const mockInfluencer = {
  id: 1,
  username: "@fashionista_emma",
  name: "Emma Rodriguez",
  bio: "Fashion enthusiast & lifestyle creator sharing daily outfit inspirations and beauty tips. Partnering with sustainable fashion brands to promote conscious living. 💫",
  followers: "125.4K",
  following: "892",
  posts: "1,247",
  engagement: "4.8%",
  avgLikes: "6,234",
  avgComments: "124",
  avgViews: "15.2K",
  category: "Fashion & Beauty",
  location: "Los Angeles, CA",
  email: "emma@example.com",
  phone: "+1 (555) 123-4567",
  joinedDate: "March 2022",
  avatar: "https://images.unsplash.com/photo-1494790108755-2616b2e9b8aa?w=200&h=200&fit=crop&crop=face",
  coverImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop",
  collaborations: [
    {
      id: 1,
      brand: "SustainStyle",
      logo: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=60&h=60&fit=crop",
      campaign: "Sustainable Summer Collection",
      date: "Dec 2024",
      performance: { likes: "8.2K", comments: "156", reach: "24.5K" }
    },
    {
      id: 2,
      brand: "EcoBeauty",
      logo: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=60&h=60&fit=crop",
      campaign: "Natural Skincare Line",
      date: "Nov 2024",
      performance: { likes: "7.8K", comments: "142", reach: "22.1K" }
    },
    {
      id: 3,
      brand: "GreenThreads",
      logo: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=60&h=60&fit=crop",
      campaign: "Conscious Fashion Week",
      date: "Oct 2024",
      performance: { likes: "9.1K", comments: "189", reach: "28.3K" }
    }
  ],
  analytics: {
    monthlyGrowth: "+12.5%",
    avgEngagementRate: "4.8%",
    bestPerformingContent: "Fashion hauls",
    topDemographics: "18-34 Female (78%)",
    topCountries: ["United States (65%)", "Canada (12%)", "UK (8%)"]
  }
};

const InfluencerProfile = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-card border-b border-border shadow-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Link to="/influencer-discovery">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Discovery
                </Button>
              </Link>
              <div className="h-6 w-px bg-border mx-2"></div>
              <img src={logo} alt="Logo" className="w-6 h-6" />
              <h1 className="text-lg font-poppins font-bold text-gradient">CollabHub</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">Share Profile</Button>
              <Button variant="hero" size="sm">Contact for Collaboration</Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <Card className="mb-8 overflow-hidden shadow-glow border-0">
          {/* Cover Image */}
          <div className="relative h-48 md:h-64">
            <img 
              src={mockInfluencer.coverImage} 
              alt="Cover" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </div>
          
          {/* Profile Info */}
          <div className="relative px-6 md:px-8 pb-6">
            <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-16 md:-mt-20">
              <img
                src={mockInfluencer.avatar}
                alt={mockInfluencer.name}
                className="w-24 h-24 md:w-32 md:h-32 rounded-3xl border-4 border-card shadow-glow object-cover mx-auto md:mx-0"
              />
              
              <div className="flex-1 text-center md:text-left md:mt-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-poppins font-bold mb-2">
                      {mockInfluencer.name}
                    </h1>
                    <p className="text-primary font-medium text-lg mb-2">
                      {mockInfluencer.username}
                    </p>
                    <Badge variant="secondary" className="mb-4">
                      {mockInfluencer.category}
                    </Badge>
                  </div>
                  
                  <div className="flex gap-8 justify-center md:justify-end">
                    <div className="text-center">
                      <div className="text-2xl font-poppins font-bold text-gradient">
                        {mockInfluencer.followers}
                      </div>
                      <div className="text-sm text-muted-foreground">Followers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-poppins font-bold text-gradient">
                        {mockInfluencer.posts}
                      </div>
                      <div className="text-sm text-muted-foreground">Posts</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-poppins font-bold text-gradient">
                        {mockInfluencer.engagement}
                      </div>
                      <div className="text-sm text-muted-foreground">Engagement</div>
                    </div>
                  </div>
                </div>
                
                <p className="text-muted-foreground mt-4 max-w-2xl">
                  {mockInfluencer.bio}
                </p>
                
                <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    {mockInfluencer.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    {mockInfluencer.phone}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    Joined {mockInfluencer.joinedDate}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-fit lg:grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="collaborations">Past Collaborations</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="profile-card text-center">
                <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-poppins font-bold text-gradient">
                  {mockInfluencer.avgLikes}
                </div>
                <div className="text-sm text-muted-foreground">Avg Likes</div>
              </Card>
              
              <Card className="profile-card text-center">
                <div className="w-12 h-12 bg-gradient-secondary rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-poppins font-bold text-gradient">
                  {mockInfluencer.avgComments}
                </div>
                <div className="text-sm text-muted-foreground">Avg Comments</div>
              </Card>
              
              <Card className="profile-card text-center">
                <div className="w-12 h-12 bg-gradient-hero rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-poppins font-bold text-gradient">
                  {mockInfluencer.avgViews}
                </div>
                <div className="text-sm text-muted-foreground">Avg Views</div>
              </Card>
              
              <Card className="profile-card text-center">
                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-poppins font-bold text-gradient">
                  {mockInfluencer.analytics.monthlyGrowth}
                </div>
                <div className="text-sm text-muted-foreground">Monthly Growth</div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="profile-card">
                <h3 className="font-poppins font-semibold text-lg mb-4">Audience Demographics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Primary Audience</span>
                    <span className="font-medium">{mockInfluencer.analytics.topDemographics}</span>
                  </div>
                  <div className="space-y-2">
                    <span className="text-sm text-muted-foreground">Top Countries</span>
                    {mockInfluencer.analytics.topCountries.map((country, index) => (
                      <div key={index} className="text-sm">{country}</div>
                    ))}
                  </div>
                </div>
              </Card>
              
              <Card className="profile-card">
                <h3 className="font-poppins font-semibold text-lg mb-4">Content Performance</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Avg Engagement Rate</span>
                    <span className="font-medium text-primary">{mockInfluencer.analytics.avgEngagementRate}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Best Performing Content</span>
                    <span className="font-medium">{mockInfluencer.analytics.bestPerformingContent}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Monthly Growth</span>
                    <span className="font-medium text-green-600">{mockInfluencer.analytics.monthlyGrowth}</span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="collaborations" className="space-y-6">
            <div className="grid gap-6">
              {mockInfluencer.collaborations.map((collab) => (
                <Card key={collab.id} className="profile-card">
                  <div className="flex items-start gap-4">
                    <img
                      src={collab.logo}
                      alt={collab.brand}
                      className="w-16 h-16 rounded-2xl object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-poppins font-semibold text-lg">{collab.brand}</h3>
                          <p className="text-muted-foreground">{collab.campaign}</p>
                          <p className="text-sm text-muted-foreground">{collab.date}</p>
                        </div>
                        <Badge variant="outline">
                          <Building2 className="w-3 h-3 mr-1" />
                          Brand Partnership
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        <div className="text-center bg-muted/30 rounded-lg p-3">
                          <div className="font-medium text-primary">{collab.performance.likes}</div>
                          <div className="text-xs text-muted-foreground">Likes</div>
                        </div>
                        <div className="text-center bg-muted/30 rounded-lg p-3">
                          <div className="font-medium text-primary">{collab.performance.comments}</div>
                          <div className="text-xs text-muted-foreground">Comments</div>
                        </div>
                        <div className="text-center bg-muted/30 rounded-lg p-3">
                          <div className="font-medium text-primary">{collab.performance.reach}</div>
                          <div className="text-xs text-muted-foreground">Reach</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default InfluencerProfile;