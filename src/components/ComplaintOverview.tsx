
import { useState } from "react";
import { CheckCircle, Clock, ArrowUpRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";

const ComplaintOverview = () => {
  const [trackingId, setTrackingId] = useState("");

  const trackComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would redirect to the tracking page with the ID
    window.location.href = `/track?id=${trackingId}`;
  };

  const recentUpdates = [
    {
      id: "GC-2023-4512",
      area: "Civil Lines",
      issue: "Garbage Collection",
      status: "Resolved",
      date: "2023-10-15",
    },
    {
      id: "WS-2023-1827",
      area: "Katra",
      issue: "Water Supply",
      status: "In Progress",
      date: "2023-10-14",
    },
    {
      id: "RM-2023-7235",
      area: "Daraganj",
      issue: "Road Maintenance",
      status: "Assigned",
      date: "2023-10-13",
    },
  ];

  return (
    <section className="py-16 bg-municipal-light/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Complaint Stats */}
          <div>
            <h2 className="section-heading">Civic Issue Resolution</h2>
            <p className="section-subheading">
              We're committed to resolving citizen complaints promptly and efficiently
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                <div className="text-municipal-primary font-bold text-3xl">89%</div>
                <div className="text-sm text-gray-600 mt-1">
                  Resolution Rate
                </div>
                <Progress value={89} className="h-1 mt-2" />
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                <div className="text-municipal-primary font-bold text-3xl">24hrs</div>
                <div className="text-sm text-gray-600 mt-1">
                  Average Response
                </div>
                <Progress value={75} className="h-1 mt-2" />
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                <div className="text-municipal-primary font-bold text-3xl">1.2K+</div>
                <div className="text-sm text-gray-600 mt-1">
                  Monthly Complaints
                </div>
                <Progress value={65} className="h-1 mt-2" />
              </div>
            </div>
            
            {/* Track Status */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="font-bold text-xl text-municipal-dark mb-4">
                Track Your Complaint
              </h3>
              <form onSubmit={trackComplaint} className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Input
                    type="text"
                    placeholder="Enter Tracking ID (e.g., GC-2023-1234)"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    className="border-gray-300"
                  />
                  <Button type="submit" className="bg-municipal-secondary hover:bg-municipal-secondary/90">
                    <Search size={18} className="mr-2" />
                    Track
                  </Button>
                </div>
                <p className="text-sm text-gray-500">
                  Enter the tracking ID received when filing your complaint to check its current status.
                </p>
              </form>
            </div>
          </div>
          
          {/* Recent Updates */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-xl text-municipal-dark">
                Recent Updates
              </h3>
              <Button asChild variant="link" className="text-municipal-primary">
                <Link to="/track">
                  View All <ArrowUpRight size={16} className="ml-1" />
                </Link>
              </Button>
            </div>
            
            <div className="space-y-4">
              {recentUpdates.map((update) => (
                <div key={update.id} className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm flex items-center">
                  <div className="mr-4">
                    {update.status === "Resolved" ? (
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <CheckCircle size={20} />
                      </div>
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                        <Clock size={20} />
                      </div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-municipal-dark">
                        {update.issue}
                      </h4>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        update.status === "Resolved" 
                          ? "bg-green-100 text-green-700" 
                          : "bg-amber-100 text-amber-700"
                      }`}>
                        {update.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Area: {update.area}
                    </p>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-municipal-primary font-medium">
                        ID: {update.id}
                      </span>
                      <span className="text-xs text-gray-500">
                        {update.date}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              
              <Button asChild variant="outline" className="w-full border-municipal-primary text-municipal-primary hover:bg-municipal-primary/10">
                <Link to="/complaints">
                  File a New Complaint
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComplaintOverview;
