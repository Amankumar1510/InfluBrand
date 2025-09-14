import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Users, TrendingUp, Zap, Star } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";
import logo from "@/assets/logo.png";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Logo" className="w-8 h-8" />
              <h1 className="text-xl font-poppins font-bold text-gradient">CollabHub</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/signin">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link to="/signin">
                <Button variant="hero" size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-poppins font-bold leading-tight">
                  Connect. 
                  <span className="text-gradient"> Collaborate. </span>
                  Create.
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  The ultimate platform where influencers meet brands for authentic collaborations. 
                  Build your network, grow your influence, and create amazing content together.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signin">
                  <Button variant="hero" size="xl" className="w-full sm:w-auto">
                    Start Collaborating
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Button variant="outline" size="xl" className="w-full sm:w-auto">
                  Watch Demo
                </Button>
              </div>

              {/* Stats */}
              <div className="flex gap-8 pt-4">
                <div>
                  <div className="text-2xl font-poppins font-bold text-gradient">10K+</div>
                  <div className="text-sm text-muted-foreground">Active Creators</div>
                </div>
                <div>
                  <div className="text-2xl font-poppins font-bold text-gradient">500+</div>
                  <div className="text-sm text-muted-foreground">Partner Brands</div>
                </div>
                <div>
                  <div className="text-2xl font-poppins font-bold text-gradient">50M+</div>
                  <div className="text-sm text-muted-foreground">Total Reach</div>
                </div>
              </div>
            </div>

            <div className="relative animate-float">
              <div className="relative rounded-3xl overflow-hidden shadow-glow">
                <img 
                  src={heroImage} 
                  alt="Influencers and brands collaboration" 
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              
              {/* Floating Cards */}
              <Card className="absolute -top-4 -left-4 p-4 bg-card/90 backdrop-blur-sm animate-scale-in">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <span className="font-medium">98% Match Rate</span>
                </div>
              </Card>
              
              <Card className="absolute -bottom-4 -right-4 p-4 bg-card/90 backdrop-blur-sm animate-scale-in">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-secondary" />
                  <span className="font-medium">5.0 Average Rating</span>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-poppins font-bold mb-4">
              Why Choose <span className="text-gradient">CollabHub</span>?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We make collaboration seamless with cutting-edge matching algorithms and powerful analytics.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="profile-card text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-poppins font-semibold mb-2">Smart Matching</h3>
              <p className="text-muted-foreground">
                Our AI-powered algorithm connects you with the perfect collaboration partners based on your niche, audience, and goals.
              </p>
            </Card>

            <Card className="profile-card text-center">
              <div className="w-16 h-16 bg-gradient-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-poppins font-semibold mb-2">Analytics Dashboard</h3>
              <p className="text-muted-foreground">
                Track your collaboration performance with detailed analytics, engagement metrics, and growth insights.
              </p>
            </Card>

            <Card className="profile-card text-center">
              <div className="w-16 h-16 bg-gradient-hero rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-poppins font-semibold mb-2">Instant Connect</h3>
              <p className="text-muted-foreground">
                Skip the lengthy negotiations. Connect instantly with brands and creators ready to collaborate.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="profile-card bg-gradient-hero text-white p-12">
            <h2 className="text-4xl font-poppins font-bold mb-4">
              Ready to Start Your Next Collaboration?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of creators and brands already growing together on CollabHub.
            </p>
            <Link to="/signin">
              <Button variant="secondary" size="xl" className="text-primary">
                Get Started Now
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-7xl mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 CollabHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;