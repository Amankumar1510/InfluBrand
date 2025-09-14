import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Building2, Upload } from "lucide-react";
import logo from "@/assets/logo.png";

const Onboarding = () => {
  const [userType, setUserType] = useState<"influencer" | "brand">("influencer");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to appropriate dashboard based on user type
    window.location.href = userType === "influencer" ? "/brand-discovery" : "/influencer-discovery";
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
              onClick={() => setUserType("influencer")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-poppins font-medium transition-all duration-300 ${
                userType === "influencer"
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <User className="w-4 h-4" />
              Influencer
            </button>
            <button
              type="button"
              onClick={() => setUserType("brand")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-poppins font-medium transition-all duration-300 ${
                userType === "brand"
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
            {userType === "influencer" ? (
              <>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" placeholder="@johndoe" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram ID</Label>
                    <Input id="instagram" placeholder="@johndoe" required />
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
                    required 
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="contact">Contact Number</Label>
                    <Input id="contact" type="tel" placeholder="+1 (555) 123-4567" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="john@example.com" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Content Category</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your niche" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entertainment">Entertainment</SelectItem>
                      <SelectItem value="fashion">Fashion & Beauty</SelectItem>
                      <SelectItem value="gaming">Gaming</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="fitness">Fitness & Health</SelectItem>
                      <SelectItem value="food">Food & Cooking</SelectItem>
                      <SelectItem value="travel">Travel</SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="collabs">Total Brand Collaborations</Label>
                    <Input id="collabs" type="number" placeholder="5" min="0" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="range">Rate Range ($)</Label>
                    <div className="flex gap-2">
                      <Input placeholder="Min" type="number" min="0" />
                      <Input placeholder="Max" type="number" min="0" />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="brandName">Brand Name</Label>
                    <Input id="brandName" placeholder="Your Brand" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tagline">Tagline</Label>
                    <Input id="tagline" placeholder="Your brand tagline" required />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="instagramHandle">Instagram Handle</Label>
                    <Input id="instagramHandle" placeholder="@yourbrand" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="youtube">YouTube Channel</Label>
                    <Input id="youtube" placeholder="Your Channel Name" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brandCategory">Brand Category</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fashion">Fashion & Beauty</SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="food">Food & Beverage</SelectItem>
                      <SelectItem value="fitness">Fitness & Health</SelectItem>
                      <SelectItem value="travel">Travel & Tourism</SelectItem>
                      <SelectItem value="gaming">Gaming</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="lifestyle">Lifestyle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="website">Website URL</Label>
                    <Input id="website" type="url" placeholder="https://yourbrand.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyEmail">Company Email</Label>
                    <Input id="companyEmail" type="email" placeholder="hello@yourbrand.com" required />
                  </div>
                </div>
              </>
            )}

            <Button type="submit" variant="hero" size="xl" className="w-full mt-8">
              Complete Profile & Continue
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;