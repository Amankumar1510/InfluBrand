import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Building2, Globe, Star } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import logo from "@/assets/logo.png";

// Mock data for brands
const mockBrands = [
  {
    id: 1,
    name: "TechNova",
    tagline: "Innovation for the Future",
    category: "Technology",
    targetAudience: "Tech Enthusiasts",
    logo: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop",
    website: "technova.com",
    rating: 4.9,
    activeCampaigns: 12
  },
  {
    id: 2,
    name: "GlamStyle",
    tagline: "Beauty Redefined",
    category: "Fashion & Beauty",
    targetAudience: "Fashion-Forward Women",
    logo: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100&h=100&fit=crop",
    website: "glamstyle.com",
    rating: 4.8,
    activeCampaigns: 8
  },
  {
    id: 3,
    name: "FitLife Pro",
    tagline: "Your Fitness Journey Starts Here",
    category: "Fitness & Health",
    targetAudience: "Fitness Enthusiasts",
    logo: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop",
    website: "fitlifepro.com",
    rating: 4.7,
    activeCampaigns: 15
  },
  {
    id: 4,
    name: "Wanderlust Travel",
    tagline: "Explore the World",
    category: "Travel",
    targetAudience: "Travel Lovers",
    logo: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=100&h=100&fit=crop",
    website: "wanderlusttravel.com",
    rating: 4.9,
    activeCampaigns: 6
  },
  {
    id: 5,
    name: "GameHub",
    tagline: "Level Up Your Gaming",
    category: "Gaming",
    targetAudience: "Gamers",
    logo: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=100&h=100&fit=crop",
    website: "gamehub.com",
    rating: 4.8,
    activeCampaigns: 20
  },
  {
    id: 6,
    name: "EcoLife",
    tagline: "Sustainable Living Made Easy",
    category: "Lifestyle",
    targetAudience: "Eco-Conscious Consumers",
    logo: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=100&h=100&fit=crop",
    website: "ecolife.com",
    rating: 4.6,
    activeCampaigns: 9
  }
];

const BrandDiscovery = () => {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedAudience, setSelectedAudience] = useState("");

  const handleProfileClick = () => {
    navigate('/influencer/profile');
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Successfully logged out");
      navigate('/');
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  const filteredBrands = mockBrands.filter(brand => {
    const matchesSearch = brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      brand.tagline.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all-categories" || !selectedCategory || brand.category === selectedCategory;
    const matchesAudience = selectedAudience === "all-audiences" || !selectedAudience || brand.targetAudience.toLowerCase().includes(selectedAudience.toLowerCase());
    return matchesSearch && matchesCategory && matchesAudience;
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
              <span className="text-sm text-muted-foreground">
                Welcome back, {profile?.first_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'}
              </span>
              <Button variant="ghost" size="sm" onClick={handleProfileClick}>Profile</Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>Logout</Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-poppins font-bold mb-2">
            Discover <span className="text-gradient">Brands</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Find exciting collaboration opportunities with top brands in your niche
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="p-6 mb-8 shadow-card">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search brands by name or tagline..."
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
                <SelectItem value="Technology">Technology</SelectItem>
                <SelectItem value="Fashion & Beauty">Fashion & Beauty</SelectItem>
                <SelectItem value="Fitness & Health">Fitness & Health</SelectItem>
                <SelectItem value="Travel">Travel</SelectItem>
                <SelectItem value="Gaming">Gaming</SelectItem>
                <SelectItem value="Lifestyle">Lifestyle</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedAudience} onValueChange={setSelectedAudience}>
              <SelectTrigger className="w-full lg:w-48">
                <Building2 className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Target Audience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-audiences">All Audiences</SelectItem>
                <SelectItem value="tech">Tech Enthusiasts</SelectItem>
                <SelectItem value="fashion">Fashion-Forward</SelectItem>
                <SelectItem value="fitness">Fitness Enthusiasts</SelectItem>
                <SelectItem value="travel">Travel Lovers</SelectItem>
                <SelectItem value="gaming">Gamers</SelectItem>
                <SelectItem value="eco">Eco-Conscious</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Results Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBrands.map((brand) => (
            <Link key={brand.id} to={`/brand/${brand.id}`}>
              <Card className="profile-card cursor-pointer h-full">
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-primary/20"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-poppins font-semibold text-lg truncate mb-1">
                      {brand.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {brand.tagline}
                    </p>
                    <span className="inline-block bg-secondary/20 text-secondary-foreground text-xs px-2 py-1 rounded-full">
                      {brand.category}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-muted/30 rounded-lg p-3">
                    <div className="text-xs text-muted-foreground mb-1">Target Audience</div>
                    <div className="text-sm font-medium">{brand.targetAudience}</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{brand.rating}</span>
                      <span className="text-xs text-muted-foreground">rating</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <span className="font-medium text-primary">{brand.activeCampaigns}</span>
                      <span className="text-muted-foreground">campaigns</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Globe className="w-3 h-3" />
                    <span className="truncate">{brand.website}</span>
                  </div>

                  <Button variant="hero" size="sm" className="w-full">
                    View Opportunities
                  </Button>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {filteredBrands.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <Building2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-poppins font-medium mb-2">No brands found</h3>
              <p>Try adjusting your search criteria or filters</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandDiscovery;