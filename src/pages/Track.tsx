
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Search, CheckCircle, Clock, Truck, AlertTriangle, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIChatbot from "@/components/AIChatbot";

type Status = "Submitted" | "Under Review" | "Assigned" | "In Progress" | "Completed";

interface ComplaintDetails {
  id: string;
  status: Status;
  type: string;
  description: string;
  location: string;
  dateSubmitted: string;
  lastUpdated: string;
  estimatedCompletion: string;
  progress: number;
  updates: {
    date: string;
    status: string;
    description: string;
  }[];
  assignedTo?: string;
}

// Demo data for complaint tracking
const demoComplaints: Record<string, ComplaintDetails> = {
  "GC-2023-4512": {
    id: "GC-2023-4512",
    status: "Completed",
    type: "Garbage Collection",
    description: "Overflowing garbage bin at street corner causing foul smell",
    location: "Civil Lines, Near Hanuman Mandir",
    dateSubmitted: "2023-10-15",
    lastUpdated: "2023-10-17",
    estimatedCompletion: "2023-10-17",
    progress: 100,
    updates: [
      {
        date: "2023-10-15 09:30",
        status: "Submitted",
        description: "Complaint received and registered"
      },
      {
        date: "2023-10-15 11:45",
        status: "Under Review",
        description: "Complaint verified and prioritized"
      },
      {
        date: "2023-10-16 08:15",
        status: "Assigned",
        description: "Assigned to Sanitation Team A"
      },
      {
        date: "2023-10-16 14:20",
        status: "In Progress",
        description: "Team dispatched to location"
      },
      {
        date: "2023-10-17 10:05",
        status: "Completed",
        description: "Garbage collected and area cleaned"
      }
    ],
    assignedTo: "Sanitation Department"
  },
  "WS-2023-1827": {
    id: "WS-2023-1827",
    status: "In Progress",
    type: "Water Supply",
    description: "No water supply for the past 2 days",
    location: "Katra, Shivkuti Colony",
    dateSubmitted: "2023-10-14",
    lastUpdated: "2023-10-16",
    estimatedCompletion: "2023-10-18",
    progress: 60,
    updates: [
      {
        date: "2023-10-14 14:22",
        status: "Submitted",
        description: "Complaint received and registered"
      },
      {
        date: "2023-10-15 09:10",
        status: "Under Review",
        description: "Issue identified as main pipeline blockage"
      },
      {
        date: "2023-10-15 16:30",
        status: "Assigned",
        description: "Assigned to Water Works Team B"
      },
      {
        date: "2023-10-16 11:15",
        status: "In Progress",
        description: "Repair work started on main pipeline"
      }
    ],
    assignedTo: "Water Department"
  },
  "RM-2023-7235": {
    id: "RM-2023-7235",
    status: "Assigned",
    type: "Road Maintenance",
    description: "Large pothole causing traffic issues and risk to vehicles",
    location: "Daraganj, Near Sangam",
    dateSubmitted: "2023-10-13",
    lastUpdated: "2023-10-15",
    estimatedCompletion: "2023-10-20",
    progress: 30,
    updates: [
      {
        date: "2023-10-13 16:45",
        status: "Submitted",
        description: "Complaint received and registered"
      },
      {
        date: "2023-10-14 11:30",
        status: "Under Review",
        description: "Site inspection scheduled"
      },
      {
        date: "2023-10-15 14:20",
        status: "Assigned",
        description: "Assigned to Road Maintenance Team C"
      }
    ],
    assignedTo: "Public Works Department"
  }
};

const Track = () => {
  const [trackingId, setTrackingId] = useState("");
  const [complaint, setComplaint] = useState<ComplaintDetails | null>(null);
  const [notFound, setNotFound] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check if tracking ID is in URL
    const params = new URLSearchParams(location.search);
    const id = params.get("id");
    
    if (id) {
      setTrackingId(id);
      handleSearch(id);
    }
  }, [location]);

  const handleSearch = (id: string = trackingId) => {
    // Reset states
    setNotFound(false);
    
    // Simulate API call with timeout
    setTimeout(() => {
      const foundComplaint = demoComplaints[id];
      if (foundComplaint) {
        setComplaint(foundComplaint);
      } else {
        setComplaint(null);
        setNotFound(true);
      }
    }, 500);
  };

  const getStatusColor = (status: Status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";
      case "In Progress":
        return "bg-blue-100 text-blue-700";
      case "Assigned":
        return "bg-amber-100 text-amber-700";
      case "Under Review":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: Status) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="mr-2" size={16} />;
      case "In Progress":
        return <Truck className="mr-2" size={16} />;
      case "Assigned":
        return <Clock className="mr-2" size={16} />;
      case "Under Review":
        return <AlertTriangle className="mr-2" size={16} />;
      default:
        return <Clock className="mr-2" size={16} />;
    }
  };

  return (
    <>
      <Helmet>
        <title>Track Complaint Status | Prayagraj Municipal Corporation</title>
        <meta name="description" content="Track the current status of your municipal complaint using your tracking ID." />
      </Helmet>
      
      <Navbar />
      
      <div className="bg-municipal-light/30 py-10 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-municipal-dark mb-3">
              Track Your Complaint
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Enter your complaint tracking ID to check its current status and updates
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8 max-w-3xl mx-auto">
            <div className="flex items-center space-x-2 mb-8">
              <Input
                type="text"
                placeholder="Enter Tracking ID (e.g., GC-2023-4512)"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                className="border-gray-300"
              />
              <Button 
                onClick={() => handleSearch()}
                className="bg-municipal-primary hover:bg-municipal-primary/90"
              >
                <Search size={18} className="mr-2" />
                Track
              </Button>
            </div>
            
            {notFound && (
              <div className="text-center p-8 border border-gray-200 rounded-lg bg-gray-50">
                <AlertTriangle className="mx-auto text-amber-500 mb-3" size={48} />
                <h3 className="text-xl font-bold text-municipal-dark mb-2">Complaint Not Found</h3>
                <p className="text-gray-600 mb-4">
                  We couldn't find any complaint with the tracking ID: <strong>{trackingId}</strong>
                </p>
                <p className="text-sm text-gray-500">
                  Please check the ID and try again, or contact our support for assistance.
                </p>
              </div>
            )}
            
            {complaint && (
              <div className="animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-municipal-dark">
                      Complaint #{complaint.id}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {complaint.type} - {complaint.location}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full flex items-center ${getStatusColor(complaint.status)}`}>
                    {getStatusIcon(complaint.status)}
                    <span className="font-medium">{complaint.status}</span>
                  </div>
                </div>
                
                <div className="border-t border-b py-4 my-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Date Submitted</p>
                      <p className="font-medium text-municipal-dark">{complaint.dateSubmitted}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Last Updated</p>
                      <p className="font-medium text-municipal-dark">{complaint.lastUpdated}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Assigned To</p>
                      <p className="font-medium text-municipal-dark">{complaint.assignedTo || "Not assigned yet"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Estimated Completion</p>
                      <p className="font-medium text-municipal-dark">{complaint.estimatedCompletion}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span className="font-medium">{complaint.progress}%</span>
                  </div>
                  <Progress value={complaint.progress} className="h-2" />
                </div>
                
                <div className="mb-6">
                  <h3 className="font-medium text-municipal-dark mb-3">Description</h3>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded-md">
                    {complaint.description}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-municipal-dark mb-3">Status Updates</h3>
                  <div className="space-y-3">
                    {complaint.updates.map((update, index) => (
                      <div key={index} className="relative">
                        <div className="ml-6 pb-3">
                          <div className="flex justify-between items-baseline">
                            <p className="font-medium text-municipal-dark">{update.status}</p>
                            <p className="text-xs text-gray-500">{update.date}</p>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{update.description}</p>
                        </div>
                        
                        {/* Timeline dot */}
                        <div className="absolute left-0 top-0">
                          <div className="h-4 w-4 rounded-full bg-municipal-primary"></div>
                          {index !== complaint.updates.length - 1 && (
                            <div className="h-full w-0.5 bg-gray-200 absolute top-4 left-2 -translate-x-1/2"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  className="mt-6 text-municipal-primary border-municipal-primary"
                  onClick={() => window.history.back()}
                >
                  <ArrowLeft size={16} className="mr-2" />
                  Back
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
      <AIChatbot />
    </>
  );
};

export default Track;
