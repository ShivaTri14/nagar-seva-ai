
import { Helmet } from "react-helmet";
import Navbar from "@/components/Navbar";
import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import FloatingThemeToggle from "@/components/FloatingThemeToggle";
import AIChatbot from "@/components/AIChatbot";

const About = () => {
  return (
    <>
      <Helmet>
        <title>About Us | Prayagraj Municipal Corporation</title>
        <meta name="description" content="Learn about Prayagraj Municipal Corporation, our mission, responsibilities, and services for citizens." />
      </Helmet>
      
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <Navbar />
        <Breadcrumbs />
        
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-center mb-8">About Prayagraj Municipal Corporation</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Our Mission</CardTitle>
                <CardDescription>Working towards a cleaner, greener, and smarter Prayagraj</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Prayagraj Municipal Corporation is dedicated to providing efficient civic services, 
                  promoting sustainable development, and ensuring a high quality of life for all residents 
                  through transparent and participatory governance.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Our Vision</CardTitle>
                <CardDescription>Building a model city for the future</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  To transform Prayagraj into a modern, inclusive, and sustainable smart city that preserves 
                  its rich cultural heritage while embracing technological innovations for better civic services.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Functions & Responsibilities</CardTitle>
              <CardDescription>Core duties of Prayagraj Municipal Corporation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>
                  The Prayagraj Municipal Corporation is responsible for providing essential civic services and infrastructure 
                  to improve the quality of life for all residents. Our key functions include:
                </p>
                
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <span className="font-medium">Urban Planning & Development:</span> City planning, land use regulation, 
                    and development of public spaces and infrastructure.
                  </li>
                  <li>
                    <span className="font-medium">Water Supply & Sewerage:</span> Providing clean drinking water, maintaining 
                    water supply infrastructure, and sewage treatment and disposal.
                  </li>
                  <li>
                    <span className="font-medium">Solid Waste Management:</span> Collection, transportation, processing, 
                    recycling, and disposal of municipal solid waste.
                  </li>
                  <li>
                    <span className="font-medium">Public Health & Sanitation:</span> Maintaining public hygiene, controlling 
                    epidemics, operating health centers, and conducting vaccination drives.
                  </li>
                  <li>
                    <span className="font-medium">Roads & Transportation:</span> Construction and maintenance of municipal roads, 
                    street lighting, traffic management, and public transportation.
                  </li>
                  <li>
                    <span className="font-medium">Parks & Recreation:</span> Development and maintenance of public parks, 
                    gardens, and recreational facilities.
                  </li>
                  <li>
                    <span className="font-medium">Building Regulations:</span> Enforcing building codes, issuing construction 
                    permits, and ensuring structural safety.
                  </li>
                  <li>
                    <span className="font-medium">Tax Collection:</span> Collection of property tax, water tax, and other 
                    municipal taxes to fund civic services.
                  </li>
                  <li>
                    <span className="font-medium">Welfare Programs:</span> Implementation of social welfare schemes for 
                    underprivileged sections of society.
                  </li>
                </ul>
                
                <p>
                  As we move towards becoming a Smart City, we're integrating technology solutions to improve 
                  service delivery, enhance citizen participation, and make governance more transparent and effective.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Footer />
        <FloatingThemeToggle />
        <AIChatbot />
      </div>
    </>
  );
};

export default About;
