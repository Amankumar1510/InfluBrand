import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Users, Heart, MessageCircle, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

// Mock data for influencers
const mockInfluencers = [
  {
    id: 1,
    username: "@fashionista_emma",
    name: "Emma Rodriguez",
    followers: "125K",
    engagement: "4.8%",
    category: "Fashion & Beauty",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b2e9b8aa?w=100&h=100&fit=crop&crop=face",
    avgLikes: "6.2K",
    avgComments: "124"
  },
  {
    id: 2,
    username: "@tech_alex",
    name: "Alex Chen",
    followers: "89K",
    engagement: "6.2%",
    category: "Technology",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    avgLikes: "5.5K",
    avgComments: "89"
  },
  {
    id: 3,
    username: "@fitness_maya",
    name: "Maya Johnson",
    followers: "156K",
    engagement: "5.1%",
    category: "Fitness & Health",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    avgLikes: "8.1K",
    avgComments: "156"
  },
  {
    id: 4,
    username: "@foodie_carlos",
    name: "Carlos Martinez",
    followers: "73K",
    engagement: "7.3%",
    category: "Food & Cooking",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    avgLikes: "5.3K",
    avgComments: "98"
  },
  {
    id: 5,
    username: "@travel_sophia",
    name: "Sophia Kim",
    followers: "198K",
    engagement: "4.6%",
    category: "Travel",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
    avgLikes: "9.1K",
    avgComments: "203"
  },
  {
    id: 6,
    username: "@gamer_jake",
    name: "Jake Wilson",
    followers: "342K",
    engagement: "8.9%",
    category: "Gaming",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face",
    avgLikes: "30.4K",
    avgComments: "567"
  }
];

const InfluencerDiscovery = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [followersRange, setFollowersRange] = useState("");

  const filteredInfluencers = mockInfluencers.filter(influencer => {
    const matchesSearch = influencer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         influencer.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all-categories" || !selectedCategory || influencer.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-card border-b border-border shadow-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Logo" className="w-8 h-8" />
              <h1 className="text-xl font-poppins font-bold text-gradient">CollabHub</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Welcome back, TechBrand Inc.</span>
              <Button variant="ghost" size="sm">Profile</Button>
              <Button variant="outline" size="sm">Logout</Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-poppins font-bold mb-2">
            Discover <span className="text-gradient">Influencers</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Find the perfect creators to collaborate with for your brand campaigns
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="p-6 mb-8 shadow-card">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search influencers by name or username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full lg:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-categories">All Categories</SelectItem>
                <SelectItem value="Fashion & Beauty">Fashion & Beauty</SelectItem>
                <SelectItem value="Technology">Technology</SelectItem>
                <SelectItem value="Fitness & Health">Fitness & Health</SelectItem>
                <SelectItem value="Food & Cooking">Food & Cooking</SelectItem>
                <SelectItem value="Travel">Travel</SelectItem>
                <SelectItem value="Gaming">Gaming</SelectItem>
              </SelectContent>
            </Select>

            <Select value={followersRange} onValueChange={setFollowersRange}>
              <SelectTrigger className="w-full lg:w-48">
                <Users className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Followers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-ranges">All Ranges</SelectItem>
                <SelectItem value="micro">1K - 10K</SelectItem>
                <SelectItem value="mid">10K - 100K</SelectItem>
                <SelectItem value="macro">100K - 1M</SelectItem>
                <SelectItem value="mega">1M+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Results Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInfluencers.map((influencer) => (
            <Link key={influencer.id} to={`/influencer/${influencer.id}`}>
              <Card className="profile-card cursor-pointer">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={influencer.avatar}
                    alt={influencer.name}
                    className="w-16 h-16 rounded-full object-cover ring-2 ring-primary/20"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-poppins font-semibold text-lg truncate">
                      {influencer.name}
                    </h3>
                    <p className="text-sm text-primary truncate">
                      {influencer.username}
                    </p>
                    <span className="inline-block bg-secondary/20 text-secondary-foreground text-xs px-2 py-1 rounded-full mt-1">
                      {influencer.category}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span className="font-medium text-foreground">{influencer.followers}</span>
                      <span>followers</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium text-primary">{influencer.engagement}</span>
                      <span className="text-muted-foreground"> engagement</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-muted/50 rounded-lg p-2">
                      <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                        <Heart className="w-3 h-3" />
                        <span>Avg Likes</span>
                      </div>
                      <div className="text-sm font-medium">{influencer.avgLikes}</div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-2">
                      <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                        <MessageCircle className="w-3 h-3" />
                        <span>Comments</span>
                      </div>
                      <div className="text-sm font-medium">{influencer.avgComments}</div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-2">
                      <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                        <Eye className="w-3 h-3" />
                        <span>Stories</span>
                      </div>
                      <div className="text-sm font-medium">12K</div>
                    </div>
                  </div>

                  <Button variant="hero" size="sm" className="w-full">
                    View Profile
                  </Button>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {filteredInfluencers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-poppins font-medium mb-2">No influencers found</h3>
              <p>Try adjusting your search criteria or filters</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfluencerDiscovery;