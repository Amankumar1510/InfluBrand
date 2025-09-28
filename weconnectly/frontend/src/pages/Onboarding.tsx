import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Building2, Upload, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import logo from "@/assets/logo.png";

interface FormData {
  // Common fields
  username: string;
  first_name: string;
  last_name: string;
  phone: string;
  bio: string;
  website: string;
  location: string;

  // Role-specific fields
  role: "influencer" | "brand";

  // Influencer fields
  display_name?: string;
  primary_category?: string;
  content_types?: string[];
  languages?: string[];
  years_experience?: number;
  min_rate?: number;
  max_rate?: number;

  // Brand fields
  company_name?: string;
  brand_name?: string;
  tagline?: string;
  description?: string;
  company_size?: string;
  company_email?: string;
  company_phone?: string;
  headquarters_location?: string;
  monthly_marketing_budget?: number;
}

const Onboarding = () => {
  const navigate = useNavigate();
  const { user, profile, refreshProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    username: "",
    first_name: "",
    last_name: "",
    phone: "",
    bio: "",
    website: "",
    location: "",
    role: "influencer",
    content_types: [],
    languages: ["English"]
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
        first_name: metadata.full_name?.split(' ')[0] || metadata.given_name || "",
        last_name: metadata.full_name?.split(' ').slice(1).join(' ') || metadata.family_name || "",
        username: metadata.preferred_username || metadata.name || "",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please sign in first");
      return;
    }

    setIsLoading(true);

    try {
      // Update user profile (may already exist from trigger)
      const profileData = {
        username: formData.username,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        bio: formData.bio,
        website: formData.website,
        location: formData.location,
        role: formData.role,
        avatar_url: user.user_metadata?.avatar_url || null
      };

      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          ...profileData
        }, {
          onConflict: 'user_id'
        });

      if (profileError) {
        console.error('Profile update error:', profileError);
        throw profileError;
      }

      // Update role-specific profile
      if (formData.role === 'influencer') {
        // Map frontend categories to database enums
        const mapToContentCategory = (category: string) => {
          const categoryMap: Record<string, string> = {
            'Fashion & Beauty': 'fashion_beauty',
            'Technology': 'technology',
            'Fitness & Health': 'fitness_health',
            'Food & Cooking': 'food_cooking',
            'Travel': 'travel',
            'Gaming': 'gaming',
            'Entertainment': 'entertainment',
            'Education': 'education',
            'Lifestyle': 'lifestyle',
            'Parenting': 'parenting',
            'Business': 'business',
            'Art & Design': 'art_design',
            'Music': 'music',
            'Sports': 'sports',
            'Home & Garden': 'home_garden',
            'Automotive': 'automotive',
            'Pets': 'pets'
          };
          return categoryMap[category] || 'other';
        };

        const influencerData = {
          user_id: user.id,
          display_name: formData.display_name || formData.first_name,
          primary_category: mapToContentCategory(formData.primary_category || ''),
          content_types: formData.content_types || [],
          languages: formData.languages || ['en'],
          years_experience: formData.years_experience || null,
          min_rate: formData.min_rate || null,
          max_rate: formData.max_rate || null,
          rate_currency: 'USD'
        };

        const { error: influencerError } = await supabase
          .from('influencers')
          .upsert(influencerData, {
            onConflict: 'user_id'
          });

        if (influencerError) {
          console.error('Influencer profile error:', influencerError);
          throw influencerError;
        }
      } else if (formData.role === 'brand') {
        // Map frontend categories to database enums
        const mapToBrandCategory = (category: string) => {
          const categoryMap: Record<string, string> = {
            'Fashion & Beauty': 'fashion_beauty',
            'Technology': 'technology',
            'Food & Beverage': 'food_beverage',
            'Fitness & Health': 'fitness_health',
            'Travel & Tourism': 'travel_tourism',
            'Gaming': 'gaming',
            'Entertainment': 'entertainment',
            'Education': 'education',
            'Lifestyle': 'lifestyle',
            'Home & Garden': 'home_garden',
            'Automotive': 'automotive',
            'Finance': 'finance',
            'Real Estate': 'real_estate',
            'Healthcare': 'healthcare',
            'B2B Services': 'b2b_services',
            'Retail': 'retail',
            'Sports': 'sports',
            'Pets': 'pets'
          };
          return categoryMap[category] || 'other';
        };

        const brandData = {
          user_id: user.id,
          company_name: formData.company_name || 'Unnamed Company',
          brand_name: formData.brand_name || null,
          tagline: formData.tagline || null,
          description: formData.description || null,
          primary_category: mapToBrandCategory(formData.primary_category || ''),
          company_size: formData.company_size || null,
          company_email: formData.company_email || null,
          company_phone: formData.company_phone || null,
          headquarters_location: formData.headquarters_location || null,
          monthly_marketing_budget: formData.monthly_marketing_budget || null,
          budget_currency: 'USD'
        };

        const { error: brandError } = await supabase
          .from('brands')
          .upsert(brandData, {
            onConflict: 'user_id'
          });

        if (brandError) {
          console.error('Brand profile error:', brandError);
          throw brandError;
        }

        // Ensure brand profile exists
        const { data: brandData_result } = await supabase
          .from('brands')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (brandData_result?.id) {
          const { error: brandProfileError } = await supabase
            .from('brand_profiles')
            .upsert({
              brand_id: brandData_result.id
            }, {
              onConflict: 'brand_id'
            });

          if (brandProfileError) {
            console.error('Brand profile creation error:', brandProfileError);
            // Don't throw here as it's not critical
          }
        }
      }

      // Refresh the profile
      await refreshProfile();

      toast.success("Profile created successfully!");

      // Navigate based on role
      if (formData.role === 'influencer') {
        navigate('/brand-discovery');
      } else {
        navigate('/influencer-discovery');
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
            {formData.role === "influencer" ? (
              <>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      placeholder="@johndoe"
                      value={formData.username}
                      onChange={(e) => handleInputChange("username", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="display_name">Display Name</Label>
                    <Input
                      id="display_name"
                      placeholder="Your display name"
                      value={formData.display_name || ""}
                      onChange={(e) => handleInputChange("display_name", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profilePic">Profile Picture</Label>
                  <div className="flex items-center gap-4">
                    <Button type="button" variant="outline" size="sm">
                      <Upload className="w-4 h-4" />
                      Upload Photo
                    </Button>
                    <span className="text-sm text-muted-foreground">JPG, PNG up to 5MB</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself and your content style..."
                    className="min-h-[100px]"
                    value={formData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="contact">Contact Number</Label>
                    <Input
                      id="contact"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      placeholder="https://yourwebsite.com"
                      value={formData.website}
                      onChange={(e) => handleInputChange("website", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="City, Country"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Content Category</Label>
                    <Select
                      value={formData.primary_category || ""}
                      onValueChange={(value) => handleInputChange("primary_category", value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your niche" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Entertainment">Entertainment</SelectItem>
                        <SelectItem value="Fashion & Beauty">Fashion & Beauty</SelectItem>
                        <SelectItem value="Gaming">Gaming</SelectItem>
                        <SelectItem value="Education">Education</SelectItem>
                        <SelectItem value="Fitness & Health">Fitness & Health</SelectItem>
                        <SelectItem value="Food & Cooking">Food & Cooking</SelectItem>
                        <SelectItem value="Travel">Travel</SelectItem>
                        <SelectItem value="Technology">Technology</SelectItem>
                        <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                        <SelectItem value="Music">Music</SelectItem>
                        <SelectItem value="Sports">Sports</SelectItem>
                        <SelectItem value="Art & Design">Art & Design</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="experience">Years of Experience</Label>
                    <Input
                      id="experience"
                      type="number"
                      placeholder="3"
                      min="0"
                      value={formData.years_experience || ""}
                      onChange={(e) => handleInputChange("years_experience", parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="range">Rate Range ($)</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Min"
                        type="number"
                        min="0"
                        value={formData.min_rate || ""}
                        onChange={(e) => handleInputChange("min_rate", parseInt(e.target.value) || 0)}
                      />
                      <Input
                        placeholder="Max"
                        type="number"
                        min="0"
                        value={formData.max_rate || ""}
                        onChange={(e) => handleInputChange("max_rate", parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>
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