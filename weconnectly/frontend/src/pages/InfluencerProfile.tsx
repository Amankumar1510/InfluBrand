import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
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
  Building2,
  Edit3,
  Save,
  X,
  MapPin,
  Globe,
  Camera,
  Plus,
  Trash2
} from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import logo from "@/assets/logo.png";

// Enhanced mock data for detailed influencer profile
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
  website: "www.emmarodriguez.com",
  joinedDate: "March 2022",
  birthDate: "1995-06-15",
  gender: "Female",
  languages: ["English", "Spanish"],
  contentTypes: ["Photos", "Videos", "Stories", "Reels"],
  collaborationTypes: ["Sponsored Posts", "Brand Partnerships", "Product Reviews", "Event Coverage"],
  rates: {
    post: 500,
    story: 200,
    reel: 800,
    video: 1200
  },
  availability: "Available",
  responseTime: "Within 24 hours",
  minCampaignBudget: 1000,
  avatar: "https://images.unsplash.com/photo-1494790108755-2616b2e9b8aa?w=200&h=200&fit=crop&crop=face",
  coverImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop",
  socialPlatforms: [
    { platform: "Instagram", handle: "@fashionista_emma", followers: "125.4K", verified: true },
    { platform: "TikTok", handle: "@emma_fashion", followers: "89.2K", verified: false },
    { platform: "YouTube", handle: "Emma Rodriguez", followers: "45.8K", verified: true }
  ],
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
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(mockInfluencer);

  // Check if this is the user's own profile
  const isOwnProfile = !id || id === 'profile';

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    const fields = [
      profileData.name,
      profileData.bio,
      profileData.email,
      profileData.phone,
      profileData.location,
      profileData.website,
      profileData.category,
      profileData.avatar,
      profileData.coverImage,
      profileData.languages?.length > 0,
      profileData.contentTypes?.length > 0,
      profileData.collaborationTypes?.length > 0,
      profileData.socialPlatforms?.length > 0
    ];

    const completedFields = fields.filter(field => field && field !== '').length;
    return Math.round((completedFields / fields.length) * 100);
  };

  const profileCompletion = calculateProfileCompletion();

  const handleSave = async () => {
    try {
      // Here you would save to backend
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handleCancel = () => {
    setProfileData(mockInfluencer); // Reset to original data
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-card border-b border-border shadow-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
                <ArrowLeft className="w-4 h-4" />
                {isOwnProfile ? 'Back to Discovery' : 'Back'}
              </Button>
              <div className="h-6 w-px bg-border mx-2"></div>
              <img src={logo} alt="Logo" className="w-6 h-6" />
              <h1 className="text-lg font-poppins font-bold text-gradient">CollabHub</h1>
            </div>
            <div className="flex items-center gap-4">
              {isOwnProfile ? (
                isEditing ? (
                  <>
                    <Button variant="outline" size="sm" onClick={handleCancel}>
                      <X className="w-4 h-4 mr-1" />
                      Cancel
                    </Button>
                    <Button variant="hero" size="sm" onClick={handleSave}>
                      <Save className="w-4 h-4 mr-1" />
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <Button variant="hero" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit3 className="w-4 h-4 mr-1" />
                    Edit Profile
                  </Button>
                )
              ) : (
                <>
                  <Button variant="outline" size="sm">Share Profile</Button>
                  <Button variant="hero" size="sm">Contact for Collaboration</Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Completion Progress Bar */}
        {isOwnProfile && (
          <Card className="mb-6 p-4 shadow-card">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-poppins font-semibold">Profile Completion</h3>
              <span className="text-sm font-medium text-primary">{profileCompletion}%</span>
            </div>
            <Progress value={profileCompletion} className="h-2 mb-2" />
            <p className="text-xs text-muted-foreground">
              Complete your profile to attract more collaboration opportunities
            </p>
          </Card>
        )}

        {/* Profile Header */}
        <Card className="mb-8 overflow-hidden shadow-glow border-0">
          {/* Cover Image */}
          <div className="relative h-48 md:h-64">
            <img
              src={profileData.coverImage}
              alt="Cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            {isOwnProfile && isEditing && (
              <div className="absolute top-4 right-4">
                <Button size="sm" variant="secondary">
                  <Camera className="w-4 h-4 mr-1" />
                  Change Cover
                </Button>
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="relative px-6 md:px-8 pb-6">
            <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-16 md:-mt-20">
              <div className="relative mx-auto md:mx-0">
                <img
                  src={profileData.avatar}
                  alt={profileData.name}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-3xl border-4 border-card shadow-glow object-cover"
                />
                {isOwnProfile && isEditing && (
                  <Button size="sm" variant="secondary" className="absolute -bottom-2 -right-2">
                    <Camera className="w-3 h-3" />
                  </Button>
                )}
              </div>

              <div className="flex-1 text-center md:text-left md:mt-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    {isEditing && isOwnProfile ? (
                      <div className="space-y-3 mb-4">
                        <Input
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                          className="text-2xl md:text-3xl font-poppins font-bold bg-transparent border-2"
                          placeholder="Display Name"
                        />
                        <div className="text-primary font-medium text-lg">
                          {profileData.username} {/* Username not editable */}
                        </div>
                        <Select
                          value={profileData.category}
                          onValueChange={(value) => setProfileData({ ...profileData, category: value })}
                        >
                          <SelectTrigger className="w-fit">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Fashion & Beauty">Fashion & Beauty</SelectItem>
                            <SelectItem value="Fitness & Health">Fitness & Health</SelectItem>
                            <SelectItem value="Technology">Technology</SelectItem>
                            <SelectItem value="Travel">Travel</SelectItem>
                            <SelectItem value="Food & Cooking">Food & Cooking</SelectItem>
                            <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    ) : (
                      <>
                        <h1 className="text-3xl md:text-4xl font-poppins font-bold mb-2">
                          {profileData.name}
                        </h1>
                        <p className="text-primary font-medium text-lg mb-2">
                          {profileData.username}
                        </p>
                        <Badge variant="secondary" className="mb-4">
                          {profileData.category}
                        </Badge>
                      </>
                    )}
                  </div>

                  <div className="flex gap-8 justify-center md:justify-end">
                    <div className="text-center">
                      <div className="text-2xl font-poppins font-bold text-gradient">
                        {profileData.followers}
                      </div>
                      <div className="text-sm text-muted-foreground">Followers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-poppins font-bold text-gradient">
                        {profileData.posts}
                      </div>
                      <div className="text-sm text-muted-foreground">Posts</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-poppins font-bold text-gradient">
                        {profileData.engagement}
                      </div>
                      <div className="text-sm text-muted-foreground">Engagement</div>
                    </div>
                  </div>
                </div>

                {isEditing && isOwnProfile ? (
                  <Textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    className="mt-4 max-w-2xl"
                    placeholder="Tell us about yourself..."
                    rows={3}
                  />
                ) : (
                  <p className="text-muted-foreground mt-4 max-w-2xl">
                    {profileData.bio}
                  </p>
                )}

                <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start">
                  {isEditing && isOwnProfile ? (
                    <>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4" />
                        <Input
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          className="w-48"
                          placeholder="Email"
                        />
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4" />
                        <Input
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          className="w-48"
                          placeholder="Phone"
                        />
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4" />
                        <Input
                          value={profileData.location}
                          onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                          className="w-48"
                          placeholder="Location"
                        />
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Globe className="w-4 h-4" />
                        <Input
                          value={profileData.website}
                          onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                          className="w-48"
                          placeholder="Website"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        {profileData.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        {profileData.phone}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {profileData.location}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Globe className="w-4 h-4" />
                        {profileData.website}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        Joined {profileData.joinedDate}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className={`grid w-full ${isOwnProfile ? 'grid-cols-4 lg:grid-cols-4' : 'grid-cols-3 lg:grid-cols-3'} lg:w-fit`}>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            {isOwnProfile && <TabsTrigger value="details">Profile Details</TabsTrigger>}
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
                  {profileData.avgLikes}
                </div>
                <div className="text-sm text-muted-foreground">Avg Likes</div>
              </Card>

              <Card className="profile-card text-center">
                <div className="w-12 h-12 bg-gradient-secondary rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-poppins font-bold text-gradient">
                  {profileData.avgComments}
                </div>
                <div className="text-sm text-muted-foreground">Avg Comments</div>
              </Card>

              <Card className="profile-card text-center">
                <div className="w-12 h-12 bg-gradient-hero rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-poppins font-bold text-gradient">
                  {profileData.avgViews}
                </div>
                <div className="text-sm text-muted-foreground">Avg Views</div>
              </Card>

              <Card className="profile-card text-center">
                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-poppins font-bold text-gradient">
                  {profileData.analytics.monthlyGrowth}
                </div>
                <div className="text-sm text-muted-foreground">Monthly Growth</div>
              </Card>
            </div>

            {/* Social Platforms */}
            <Card className="profile-card">
              <h3 className="font-poppins font-semibold text-lg mb-4">Social Media Platforms</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {profileData.socialPlatforms?.map((platform, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                      <Instagram className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{platform.platform}</span>
                        {platform.verified && <Star className="w-3 h-3 text-yellow-500 fill-current" />}
                      </div>
                      <div className="text-sm text-muted-foreground">{platform.handle}</div>
                      <div className="text-xs text-primary font-medium">{platform.followers} followers</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {isOwnProfile && (
            <TabsContent value="details" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <Card className="profile-card">
                  <h3 className="font-poppins font-semibold text-lg mb-4">Personal Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Birth Date</label>
                      {isEditing ? (
                        <Input
                          type="date"
                          value={profileData.birthDate}
                          onChange={(e) => setProfileData({ ...profileData, birthDate: e.target.value })}
                        />
                      ) : (
                        <div className="text-sm text-muted-foreground">{profileData.birthDate}</div>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Gender</label>
                      {isEditing ? (
                        <Select
                          value={profileData.gender}
                          onValueChange={(value) => setProfileData({ ...profileData, gender: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Non-binary">Non-binary</SelectItem>
                            <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="text-sm text-muted-foreground">{profileData.gender}</div>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Languages</label>
                      <div className="flex flex-wrap gap-2">
                        {profileData.languages?.map((lang, index) => (
                          <Badge key={index} variant="secondary">{lang}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Content & Collaboration */}
                <Card className="profile-card">
                  <h3 className="font-poppins font-semibold text-lg mb-4">Content & Collaboration</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Content Types</label>
                      <div className="flex flex-wrap gap-2">
                        {profileData.contentTypes?.map((type, index) => (
                          <Badge key={index} variant="outline">{type}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Collaboration Types</label>
                      <div className="flex flex-wrap gap-2">
                        {profileData.collaborationTypes?.map((type, index) => (
                          <Badge key={index} variant="outline">{type}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Availability</label>
                      {isEditing ? (
                        <Select
                          value={profileData.availability}
                          onValueChange={(value) => setProfileData({ ...profileData, availability: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Available">Available</SelectItem>
                            <SelectItem value="Busy">Busy</SelectItem>
                            <SelectItem value="Not Available">Not Available</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="text-sm text-muted-foreground">{profileData.availability}</div>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Response Time</label>
                      <div className="text-sm text-muted-foreground">{profileData.responseTime}</div>
                    </div>
                  </div>
                </Card>

                {/* Rates & Pricing */}
                <Card className="profile-card">
                  <h3 className="font-poppins font-semibold text-lg mb-4">Rates & Pricing</h3>
                  <div className="space-y-4">
                    {Object.entries(profileData.rates).map(([type, rate]) => (
                      <div key={type} className="flex justify-between items-center">
                        <span className="text-sm capitalize">{type}</span>
                        {isEditing ? (
                          <Input
                            type="number"
                            value={rate}
                            onChange={(e) => setProfileData({
                              ...profileData,
                              rates: { ...profileData.rates, [type]: parseInt(e.target.value) }
                            })}
                            className="w-24 text-right"
                            prefix="$"
                          />
                        ) : (
                          <span className="font-medium text-primary">${rate}</span>
                        )}
                      </div>
                    ))}
                    <div className="pt-2 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Min Campaign Budget</span>
                        {isEditing ? (
                          <Input
                            type="number"
                            value={profileData.minCampaignBudget}
                            onChange={(e) => setProfileData({
                              ...profileData,
                              minCampaignBudget: parseInt(e.target.value)
                            })}
                            className="w-32 text-right"
                            prefix="$"
                          />
                        ) : (
                          <span className="font-medium text-primary">${profileData.minCampaignBudget}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>
          )}

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="profile-card">
                <h3 className="font-poppins font-semibold text-lg mb-4">Audience Demographics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Primary Audience</span>
                    <span className="font-medium">{profileData.analytics.topDemographics}</span>
                  </div>
                  <div className="space-y-2">
                    <span className="text-sm text-muted-foreground">Top Countries</span>
                    {profileData.analytics.topCountries.map((country, index) => (
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
                    <span className="font-medium text-primary">{profileData.analytics.avgEngagementRate}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Best Performing Content</span>
                    <span className="font-medium">{profileData.analytics.bestPerformingContent}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Monthly Growth</span>
                    <span className="font-medium text-green-600">{profileData.analytics.monthlyGrowth}</span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="collaborations" className="space-y-6">
            <div className="grid gap-6">
              {profileData.collaborations.map((collab) => (
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