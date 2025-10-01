import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { User, Building2, Upload, Loader2, X, Instagram, Youtube, Twitter, Music } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { profileApi } from "@/services/profileApi";
import { toast } from "sonner";
import logo from "@/assets/logo.png";

interface FormData {
  // Common fields
  username: string;
  role: "influencer" | "brand";

  // Influencer fields
  display_name?: string;
  profile_picture?: string;
  primary_platform?: "instagram" | "youtube" | "tiktok" | "twitter";
  platform_username?: string;
  categories?: string[];
  bio?: string;

  // Brand fields
  brand_name?: string;
  description?: string;
  logo?: string;
  industry_categories?: string[];
  website?: string;
  social_link?: string;
  company_email?: string;
}

const Onboarding = () => {
  const navigate = useNavigate();
  const { user, profile, refreshProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    username: "",
    role: "influencer",
    // Influencer fields
    display_name: "",
    profile_picture: "",
    primary_platform: undefined,
    platform_username: "",
    categories: [],
    bio: "",
    // Brand fields
    brand_name: "",
    description: "",
    logo: "",
    industry_categories: [],
    website: "",
    social_link: "",
    company_email: ""
  });

  useEffect(() => {
    // Redirect if not authenticated
    if (!user) {
      navigate('/signin');
      return;
    }

    // Pre-fill form with user data if available
    if (user.user_metadata) {
      const metadata = user.user_metadata;
      setFormData(prev => ({
        ...prev,
        username: metadata.preferred_username || metadata.name || "",
        display_name: metadata.full_name || metadata.name || "",
        company_email: user.email || "",
      }));
    }

    // If profile already exists and is complete, redirect
    if (profile && profile.role) {
      if (profile.role === 'influencer') {
        navigate('/brand-discovery');
      } else if (profile.role === 'brand') {
        navigate('/influencer-discovery');
      }
    }
  }, [user, profile, navigate]);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Helper functions for tags
  const handleTagAdd = (field: 'categories' | 'industry_categories', tag: string) => {
    if (tag.trim()) {
      const currentTags = formData[field] || [];
      if (!currentTags.includes(tag.trim())) {
        handleInputChange(field, [...currentTags, tag.trim()]);
      }
    }
  };

  const handleTagRemove = (field: 'categories' | 'industry_categories', tagToRemove: string) => {
    const currentTags = formData[field] || [];
    handleInputChange(field, currentTags.filter(tag => tag !== tagToRemove));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, field: 'categories' | 'industry_categories') => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const input = e.currentTarget;
      handleTagAdd(field, input.value);
      input.value = '';
    }
  };

  // File upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'profile_picture' | 'logo') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a JPEG, PNG, or WebP image');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setUploadingImage(true);
    try {
      const imageUrl = await profileApi.uploadImage(file);
      handleInputChange(field, imageUrl);
      toast.success('Image uploaded successfully!');
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please sign in first");
      return;
    }

    setIsLoading(true);

    try {
      // Validation
      if (!formData.username.trim()) {
        toast.error("Username is required");
        return;
      }

      if (formData.role === 'influencer') {
        if (!formData.display_name?.trim()) {
          toast.error("Display name is required");
          return;
        }
        if (!formData.primary_platform) {
          toast.error("Please select a primary platform");
          return;
        }
        if (!formData.platform_username?.trim()) {
          toast.error("Platform username is required");
          return;
        }
        if (!formData.categories?.length) {
          toast.error("Please add at least one category");
          return;
        }
        if (!formData.bio?.trim()) {
          toast.error("Bio is required");
          return;
        }
      } else {
        if (!formData.brand_name?.trim()) {
          toast.error("Brand name is required");
          return;
        }
        if (!formData.description?.trim()) {
          toast.error("Description is required");
          return;
        }
        if (!formData.industry_categories?.length) {
          toast.error("Please add at least one industry category");
          return;
        }
      }

      // Use the profile API to create the profile
      const result = await profileApi.createProfileDirect(formData, user);

      if (result.success) {
        // Refresh the profile
        await refreshProfile();

        toast.success("Profile created successfully!");

        // Navigate based on role
        if (formData.role === 'influencer') {
          navigate('/brand-discovery');
        } else {
          navigate('/influencer-discovery');
        }
      }
    } catch (error) {
      console.error('Profile creation error:', error);
      toast.error(`Failed to create profile: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background p-4">
      <div className="max-w-2xl mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src={logo} alt="CollabHub Logo" className="w-12 h-12" />
          </div>
          <h1 className="text-3xl font-poppins font-bold text-gradient mb-2">
            Complete Your Profile
          </h1>
          <p className="text-muted-foreground">
            Tell us about yourself to get the best collaboration matches
          </p>
        </div>

        {/* User Type Toggle */}
        <Card className="p-6 mb-8 shadow-card">
          <div className="flex bg-muted rounded-2xl p-1 gap-1">
            <button
              type="button"
              onClick={() => handleInputChange("role", "influencer")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-poppins font-medium transition-all duration-300 ${formData.role === "influencer"
                ? "bg-primary text-primary-foreground shadow-soft"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <User className="w-4 h-4" />
              Influencer
            </button>
            <button
              type="button"
              onClick={() => handleInputChange("role", "brand")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-poppins font-medium transition-all duration-300 ${formData.role === "brand"
                ? "bg-primary text-primary-foreground shadow-soft"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <Building2 className="w-4 h-4" />
              Brand
            </button>
          </div>
        </Card>

        {/* Form */}
        <Card className="p-8 shadow-glow border-0 bg-card/80 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Common Username */}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="@yourusername"
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">Unique handle inside the platform</p>
            </div>

            {formData.role === "influencer" ? (
              <>
                {/* Profile Picture - At the top */}
                <div className="space-y-2">
                  <Label>Profile Picture</Label>
                  <div className="flex items-center gap-4">
                    {formData.profile_picture && (
                      <img
                        src={formData.profile_picture}
                        alt="Profile"
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'profile_picture')}
                        className="hidden"
                        id="profile-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('profile-upload')?.click()}
                        disabled={uploadingImage}
                      >
                        {uploadingImage ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                        Upload from Device
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">Upload your profile picture from your device</p>
                </div>

                {/* Display Name */}
                <div className="space-y-2">
                  <Label htmlFor="display_name">Display Name</Label>
                  <Input
                    id="display_name"
                    placeholder="Your display name"
                    value={formData.display_name || ""}
                    onChange={(e) => handleInputChange("display_name", e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">Auto-filled from Google, but editable</p>
                </div>

                {/* Primary Platform */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="primary_platform">Primary Platform</Label>
                    <Select
                      value={formData.primary_platform || ""}
                      onValueChange={(value) => handleInputChange("primary_platform", value as any)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose your main platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="instagram">
                          <div className="flex items-center gap-2">
                            <Instagram className="w-4 h-4" />
                            Instagram
                          </div>
                        </SelectItem>
                        <SelectItem value="youtube">
                          <div className="flex items-center gap-2">
                            <Youtube className="w-4 h-4" />
                            YouTube
                          </div>
                        </SelectItem>
                        <SelectItem value="tiktok">
                          <div className="flex items-center gap-2">
                            <Music className="w-4 h-4" />
                            TikTok
                          </div>
                        </SelectItem>
                        <SelectItem value="twitter">
                          <div className="flex items-center gap-2">
                            <Twitter className="w-4 h-4" />
                            Twitter/X
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="platform_username">Platform Username</Label>
                    <Input
                      id="platform_username"
                      placeholder="@yourhandle"
                      value={formData.platform_username || ""}
                      onChange={(e) => handleInputChange("platform_username", e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Categories */}
                <div className="space-y-2">
                  <Label htmlFor="categories">Category/Niche</Label>
                  <Input
                    id="categories"
                    placeholder="Type a category and press Enter (e.g., Fashion, Tech, Food)"
                    onKeyPress={(e) => handleTagKeyPress(e, 'categories')}
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.categories?.map((category, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {category}
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-destructive"
                          onClick={() => handleTagRemove('categories', category)}
                        />
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">At least one category is required</p>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself..."
                    rows={4}
                    value={formData.bio || ""}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    required
                  />
                </div>
              </>
            ) : (
              <>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      placeholder="Your Company"
                      value={formData.company_name || ""}
                      onChange={(e) => handleInputChange("company_name", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="brandName">Brand Name</Label>
                    <Input
                      id="brandName"
                      placeholder="Your Brand (if different)"
                      value={formData.brand_name || ""}
                      onChange={(e) => handleInputChange("brand_name", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input
                    id="tagline"
                    placeholder="Your brand tagline"
                    value={formData.tagline || ""}
                    onChange={(e) => handleInputChange("tagline", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Company Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Tell us about your company and what you do..."
                    className="min-h-[100px]"
                    value={formData.description || ""}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="brandCategory">Brand Category</Label>
                    <Select
                      value={formData.primary_category || ""}
                      onValueChange={(value) => handleInputChange("primary_category", value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Fashion & Beauty">Fashion & Beauty</SelectItem>
                        <SelectItem value="Technology">Technology</SelectItem>
                        <SelectItem value="Food & Beverage">Food & Beverage</SelectItem>
                        <SelectItem value="Fitness & Health">Fitness & Health</SelectItem>
                        <SelectItem value="Travel & Tourism">Travel & Tourism</SelectItem>
                        <SelectItem value="Gaming">Gaming</SelectItem>
                        <SelectItem value="Entertainment">Entertainment</SelectItem>
                        <SelectItem value="Education">Education</SelectItem>
                        <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                        <SelectItem value="Retail">Retail</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companySize">Company Size</Label>
                    <Select
                      value={formData.company_size || ""}
                      onValueChange={(value) => handleInputChange("company_size", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select company size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="startup">Startup (1-10)</SelectItem>
                        <SelectItem value="small">Small (11-50)</SelectItem>
                        <SelectItem value="medium">Medium (51-200)</SelectItem>
                        <SelectItem value="large">Large (201-1000)</SelectItem>
                        <SelectItem value="enterprise">Enterprise (1000+)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="website">Website URL</Label>
                    <Input
                      id="website"
                      type="url"
                      placeholder="https://yourbrand.com"
                      value={formData.website || ""}
                      onChange={(e) => handleInputChange("website", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyEmail">Company Email</Label>
                    <Input
                      id="companyEmail"
                      type="email"
                      placeholder="hello@yourbrand.com"
                      value={formData.company_email || ""}
                      onChange={(e) => handleInputChange("company_email", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="companyPhone">Company Phone</Label>
                    <Input
                      id="companyPhone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={formData.company_phone || ""}
                      onChange={(e) => handleInputChange("company_phone", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Headquarters Location</Label>
                    <Input
                      id="location"
                      placeholder="City, Country"
                      value={formData.headquarters_location || ""}
                      onChange={(e) => handleInputChange("headquarters_location", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget">Monthly Marketing Budget ($)</Label>
                  <Input
                    id="budget"
                    type="number"
                    placeholder="5000"
                    min="0"
                    value={formData.monthly_marketing_budget || ""}
                    onChange={(e) => handleInputChange("monthly_marketing_budget", parseInt(e.target.value) || 0)}
                  />
                </div>
              </>
            )}

            <Button
              type="submit"
              variant="hero"
              size="xl"
              className="w-full mt-8"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Creating Profile...
                </>
              ) : (
                "Complete Profile & Continue"
              )}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;