"use client";
import { useState, useEffect, useRef } from "react";
import { Bell, Paperclip, Send, Filter, Search, ChevronLeft, X, Clock, UserCircle, Download, Share2, Trash2, Menu, MoreVertical } from "lucide-react";

export default function TicketSystem() {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  

  const [documents, setDocuments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  

  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatError, setChatError] = useState("");
  const [isSending, setIsSending] = useState(false);
  
 
  const [mobileView, setMobileView] = useState("tickets"); 
  
  const chatContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  const [showCreateTicket, setShowCreateTicket] = useState(false);

 
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

 
  useEffect(() => {
    setTickets([
      { 
        id: 1, 
        title: "Website Redesign Project", 
        description: "Redesign company homepage and product pages with new brand guidelines", 
        status: "Open", 
        priority: "High",
        createdAt: "2025-05-01",
        assignee: "Rafi Ahmed", 
        assigneeAvatar: "/user.jpg"
      },
      { 
        id: 2, 
        title: "Login System Bug Fix", 
        description: "Users reporting inability to login after password reset. Need to fix authentication flow.", 
        status: "In Progress", 
        priority: "Critical",
        createdAt: "2025-05-03",
        assignee: "Laila Akter", 
        assigneeAvatar: "user1.jpg"
      },
      { 
        id: 3, 
        title: "Mobile App Performance", 
        description: "Optimize load times and reduce battery consumption in latest release", 
        status: "Open", 
        priority: "Medium",
        createdAt: "2025-05-07",
        assignee: "Karim Hassan", 
        assigneeAvatar: "user2.jpg"
      },
      { 
        id: 4, 
        title: "Payment Gateway Integration", 
        description: "Integrate new payment processor for international transactions", 
        status: "Pending", 
        priority: "High",
        createdAt: "2025-05-09",
        assignee: "Sadia Khan", 
        assigneeAvatar: "/user3.jpg"
      },
    ]);
    
    setDocuments([
      { id: 1, name: "design-mockup.pdf", size: "2.4 MB", uploadedAt: "2025-05-01", ticketId: 1 },
      { id: 2, name: "brand-guidelines.pdf", size: "1.8 MB", uploadedAt: "2025-05-02", ticketId: 1 },
      { id: 3, name: "error-log.txt", size: "340 KB", uploadedAt: "2025-05-03", ticketId: 2 },
      { id: 4, name: "auth-flow-diagram.png", size: "1.2 MB", uploadedAt: "2025-05-04", ticketId: 2 },
      { id: 5, name: "performance-report.pdf", size: "3.1 MB", uploadedAt: "2025-05-07", ticketId: 3 },
    ]);
    
    setMessages([
      {
        id: 1,
        user: "Rafi Ahmed",
        avatar: "/user.jpg",
        message: "I've uploaded the design mockups and brand guidelines. Please review when you get a chance.",
        timestamp: "2025-05-01 10:35 AM",
        ticketId: 1
      },
      {
        id: 2,
        user: "Johan Doe",
        avatar: "/user1.jpg",
        message: "Thanks for the mockups. The hero section looks great but we need to adjust the color scheme to match our new branding.",
        timestamp: "2025-05-01 11:20 AM",
        ticketId: 1
      },
      {
        id: 3,
        user: "Rafi Ahmed",
        avatar: "/user.jpg",
        message: "I'll update the color scheme and send a new version by end of day.",
        timestamp: "2025-05-01 12:05 PM",
        ticketId: 1
      },
      {
        id: 4,
        user: "Laila Akter",
        avatar: "/user2.jpg",
        message: "I've identified the issue with the login system. It's related to the token expiration not being properly handled after the password reset.",
        timestamp: "2025-05-03 09:15 AM",
        ticketId: 2
      },
      {
        id: 5,
        user: "Support Team",
        avatar: "/user3.jpg",
        message: "Great find! How soon can we get a fix deployed? We're getting multiple user complaints.",
        timestamp: "2025-05-03 09:30 AM",
        ticketId: 2
      },
      {
        id: 6,
        user: "Laila Akter",
        avatar: "/user7.jpg",
        message: "I've pushed a fix to the development branch. We should be able to deploy after QA approval, hopefully by end of day.",
        timestamp: "2025-05-03 10:45 AM",
        ticketId: 2
      },
    ]);
  }, []);


  useEffect(() => {
    if (selectedTicket) {
      // Set mobile view to details when ticket is selected
      if (isMobile) {
        setMobileView("details");
      }
      
      // In real app, fetch ticket-specific data from API
      /*
      fetch(`/api/documents?ticketId=${selectedTicket.id}`)
        .then(res => res.json())
        .then(data => setDocuments(data));
      
      fetch(`/api/chat?ticketId=${selectedTicket.id}`)
        .then(res => res.json())
        .then(data => setMessages(data));
      */
    }
  }, [selectedTicket, isMobile]);

  // Auto-scroll chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);


  const handleFileUpload = async () => {
    if (!file || !selectedTicket) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
   
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      // In real app, replace with actual file upload API
      /*
      const formData = new FormData();
      formData.append('file', file);
      formData.append('ticketId', selectedTicket.id);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });
      
      const uploadedFile = await response.json();
      */

      // Simulate API response
      await new Promise(resolve => setTimeout(resolve, 2000));
      clearInterval(interval);
      setUploadProgress(100);

      const newDocument = {
        id: documents.length + 1,
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadedAt: new Date().toISOString().split('T')[0],
        ticketId: selectedTicket.id
      };

      setDocuments([...documents, newDocument]);
      setFile(null);
      fileInputRef.current.value = "";

   
      await new Promise(resolve => setTimeout(resolve, 2000));
      setUploadProgress(0);
    } catch (err) {
      console.error("Upload failed:", err);
      setError("File upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };


  const handleSelectTicket = (ticket) => {
    setSelectedTicket(ticket);
  };


  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedTicket) return;

    setIsSending(true);
    setChatError("");

    try {
      // In real app, replace with actual API call
      /*
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: newMessage,
          ticketId: selectedTicket.id
        }),
      });
      
      const newMsg = await response.json();
      */

      // Mock response
      const newMsg = {
        id: messages.length + 1,
        user: "You",
        avatar: "/user7.jpg",
        message: newMessage,
        timestamp: new Date().toLocaleString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }),
        ticketId: selectedTicket.id
      };

      setMessages([...messages, newMsg]);
      setNewMessage("");
    } catch (err) {
      setChatError("Failed to send message. Please try again.");
      console.error("Message sending error:", err);
    } finally {
      setIsSending(false);
    }
  };


  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);
    setError("");

    try {
      // In real app, replace with actual API call
      /*
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description
        }),
      });
      
      const newTicket = await response.json();
      */

      // Mock response
      const newTicket = {
        id: tickets.length + 1,
        title: title,
        description: description,
        status: "Open",
        priority: "Medium",
        createdAt: new Date().toISOString().split('T')[0],
        assignee: "Unassigned",
        assigneeAvatar: "/avatars/default.jpg"
      };

      setTickets([...tickets, newTicket]);
      setTitle("");
      setDescription("");
      setShowCreateTicket(false);
    } catch (err) {
      setError("Failed to create ticket. Please try again.");
      console.error("Ticket creation error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

 
  const filteredTickets = tickets.filter(ticket => {
    const matchesStatus = filterStatus === "all" || ticket.status === filterStatus;
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });


  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-blue-100 text-blue-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };


  const getStatusColor = (status) => {
    switch(status) {
      case 'Open': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Pending': return 'bg-purple-100 text-purple-800';
      case 'Closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Mobile navigation component
  const MobileNav = () => (
    <div className="lg:hidden flex justify-between items-center bg-white border-b border-gray-200 p-4">
      {mobileView !== "tickets" && (
        <button 
          onClick={() => setMobileView("tickets")}
          className="flex items-center text-gray-600"
        >
          <ChevronLeft size={18} className="mr-1" />
          Back
        </button>
      )}
      
      <h1 className="text-lg font-semibold text-center flex-1">
        {mobileView === "tickets" && "Ticket System"}
        {mobileView === "details" && selectedTicket?.title}
        {mobileView === "chat" && "Chat"}
      </h1>
      
      {mobileView === "details" && selectedTicket && (
        <button 
          onClick={() => setMobileView("chat")}
          className="text-blue-600"
        >
          Chat
        </button>
      )}
      
      {mobileView === "chat" && (
        <button 
          onClick={() => setMobileView("details")}
          className="text-blue-600"
        >
          Details
        </button>
      )}
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Menu className="h-6 w-6 mr-2 text-gray-500 lg:hidden" />
                <span className="font-bold text-xl text-blue-600">Support Desk</span>
              </div>
            </div>
            <div className="flex items-center">
              <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100">
                <Bell size={20} />
              </button>
              <div className="ml-3 relative">
                <div className="flex items-center">
                  <img
                    className="h-8 w-8 rounded-full object-cover"
                    src="/user7.jpg"
                    alt="Your profile"
                  />
                  <span className="ml-2 text-sm text-gray-700 hidden md:block">John Smith</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

     
      <MobileNav />

      {showCreateTicket && (
        <div className="fixed inset-0 z-10 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Create New Ticket</h2>
              <button 
                onClick={() => setShowCreateTicket(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmitTicket}>
              {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter ticket title"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe your issue in detail"
                  required
                />
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowCreateTicket(false)}
                  className="mr-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
                  disabled={isSubmitting || !title.trim() || !description.trim()}
                >
                  {isSubmitting ? "Creating..." : "Create Ticket"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6">
 
          {(!isMobile || mobileView === "tickets") && (
            <div className="w-full lg:w-1/4 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h1 className="text-lg font-semibold text-gray-800">Tickets</h1>
                  <button 
                    onClick={() => setShowCreateTicket(true)}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    New Ticket
                  </button>
                </div>
                
           
                <div className="mb-4">
                  <div className="relative mb-2">
                    <input
                      type="text"
                      placeholder="Search tickets..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Filter size={16} className="text-gray-500" />
                    <button
                      onClick={() => setFilterStatus("all")}
                      className={`text-xs px-2 py-1 rounded-md ${filterStatus === "all" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setFilterStatus("Open")}
                      className={`text-xs px-2 py-1 rounded-md ${filterStatus === "Open" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                    >
                      Open
                    </button>
                    <button
                      onClick={() => setFilterStatus("In Progress")}
                      className={`text-xs px-2 py-1 rounded-md ${filterStatus === "In Progress" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"}`}
                    >
                      In Progress
                    </button>
                  </div>
                </div>
              </div>
              
              
              <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 250px)" }}>
                {filteredTickets.length > 0 ? (
                  filteredTickets.map(ticket => (
                    <div 
                      key={ticket.id}
                      onClick={() => handleSelectTicket(ticket)}
                      className={`p-4 border-b border-gray-200 cursor-pointer ${selectedTicket?.id === ticket.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'hover:bg-gray-50'}`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-medium text-gray-900">{ticket.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{ticket.description}</p>
                      <div className="flex justify-between items-center">
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(ticket.status)}`}>
                          {ticket.status}
                        </span>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock size={14} className="mr-1" />
                          {ticket.createdAt}
                        </div>
                      </div>
                      <div className="flex items-center mt-2 text-xs text-gray-600">
                        <div className="flex items-center">
                          <img 
                            src={ticket.assigneeAvatar} 
                            alt={ticket.assignee}
                            className="w-5 h-5 rounded-full mr-1 object-cover" 
                          />
                          {ticket.assignee}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    No tickets match your criteria
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedTicket && (!isMobile || mobileView === "details") && (
            <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-xl font-semibold text-gray-800 mb-1">{selectedTicket.title}</h1>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(selectedTicket.status)}`}>
                        {selectedTicket.status}
                      </span>
                      <span className="flex items-center">
                        <Clock size={14} className="mr-1" />
                        Created: {selectedTicket.createdAt}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500" title="Share ticket">
                      <Share2 size={18} />
                    </button>
                    <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500" title="More options">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="text-gray-700">{selectedTicket.description}</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center">
                    <img 
                      src={selectedTicket.assigneeAvatar} 
                      alt={selectedTicket.assignee}
                      className="w-8 h-8 rounded-full mr-2 object-cover" 
                    />
                    <div>
                      <div className="text-sm font-medium">{selectedTicket.assignee}</div>
                      <div className="text-xs text-gray-500">Assignee</div>
                    </div>
                  </div>
                  
                  <div className="ml-auto flex items-center">
                    <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(selectedTicket.priority)}`}>
                      {selectedTicket.priority} Priority
                    </span>
                  </div>
                </div>
              </div>
              

              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Documents</h2>
                
                <div className="mb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex-1 relative">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={(e) => setFile(e.target.files[0])}
                        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isUploading}
                      />
                      <Paperclip size={18} className="absolute right-3 top-3 text-gray-400" />
                    </div>
                    <button
                      onClick={handleFileUpload}
                      disabled={!file || isUploading}
                      className="px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 flex items-center justify-center"
                    >
                      {isUploading ? "Uploading..." : "Upload File"}
                    </button>
                  </div>
                </div>
                
                {uploadProgress > 0 && (
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-in-out" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                )}
                
                {documents.filter(doc => doc.ticketId === selectedTicket.id).length > 0 ? (
                  <div className="space-y-2 bg-gray-50 rounded-lg p-1">
                    {documents
                      .filter(doc => doc.ticketId === selectedTicket.id)
                      .map(doc => (
                        <div key={doc.id} className="flex items-center justify-between p-3 hover:bg-gray-100 rounded-md">
                          <div className="flex items-center">
                            <div className="bg-blue-100 p-2 rounded-lg mr-3">
                              <Paperclip size={16} className="text-blue-600" />
                            </div>
                            <div>
                              <span className="text-blue-600 hover:underline cursor-pointer block">{doc.name}</span>
                              <span className="text-xs text-gray-500">{doc.size} • {doc.uploadedAt}</span>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <button className="p-2 rounded-full hover:bg-gray-200 text-gray-600" title="Download">
                              <Download size={16} />
                            </button>
                            <button className="p-2 rounded-full hover:bg-gray-200 text-gray-600" title="Delete">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center p-6 bg-gray-50 rounded-lg">
                    <Paperclip size={28} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-500">No documents uploaded for this ticket</p>
                    <p className="text-sm text-gray-400">Upload files to share with the team</p>
                  </div>
                )}
              </div>
              
              {isMobile && (
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                  <button
                    onClick={() => setMobileView("chat")}
                    className="w-full py-2 bg-blue-600 text-white rounded-lg flex items-center justify-center"
                  >
                    <Send size={16} className="mr-2" /> Open Chat
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Right Column - Chat */}
          {selectedTicket && (!isMobile || mobileView === "chat") && (
            <div className="w-full lg:w-1/3 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col" style={{ height: isMobile ? "calc(100vh - 140px)" : "" }}>
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center">
                  <h2 className="text-lg font-semibold text-gray-800">Conversation</h2>
                  <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                    {messages.filter(msg => msg.ticketId === selectedTicket.id).length}
                  </span>
                </div>
                {isMobile && (
                  <button
                    onClick={() => setMobileView("details")}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <ChevronLeft size={20} />
                  </button>
                )}
              </div>
              
              <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4"
                style={{ minHeight: "300px", maxHeight: "calc(100vh - 300px)" }}
              >
                {messages.filter(msg => msg.ticketId === selectedTicket.id).length > 0 ? (
                  messages
                    .filter(msg => msg.ticketId === selectedTicket.id)
                    .map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.user === "You" ? "justify-end" : "justify-start"}`}
                      >
                        <div className={`flex items-start max-w-xs sm:max-w-md ${msg.user === "You" ? "flex-row-reverse" : "flex-row"}`}>
                          <img
                            src={msg.avatar}
                            alt={msg.user}
                            className={`w-8 h-8 rounded-full object-cover flex-shrink-0 ${msg.user === "You" ? "ml-2" : "mr-2"}`}
                          />
                          <div
                            className={`rounded-lg p-3 ${
                              msg.user === "You"
                                ? "bg-blue-500 text-white"
                                : "bg-white border border-gray-200 text-gray-800"
                            }`}
                          >
                            <div className="flex justify-between items-center mb-1">
                              <h3 className={`text-sm font-medium ${msg.user === "You" ? "text-blue-100" : "text-gray-700"}`}>
                                {msg.user}
                              </h3>
                              <span className={`text-xs ${msg.user === "You" ? "text-blue-200" : "text-gray-400"}`}>
                                {msg.timestamp.split(' ')[1]} {msg.timestamp.includes('AM') ? 'AM' : 'PM'}
                              </span>
                            </div>
                            <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                          </div>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center p-6">
                      <Send size={28} className="mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-500">No messages yet</p>
                      <p className="text-sm text-gray-400">Start the conversation</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-4 border-t border-gray-200">
                {chatError && <p className="text-red-500 text-sm mb-2">{chatError}</p>}
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="w-full pr-10 py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isSending}
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                      title="Attach file"
                    >
                      <Paperclip size={18} />
                    </button>
                  </div>
                  <button
                    type="submit"
                    className="p-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300"
                    disabled={isSending || !newMessage.trim()}
                  >
                    <Send size={20} />
                  </button>
                </form>
              </div>
            </div>
          )}
          
        
          {!selectedTicket && (!isMobile || mobileView !== "tickets") && (
            <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 flex items-center justify-center">
              <div className="text-center p-12">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserCircle size={32} className="text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">No Ticket Selected</h2>
                <p className="text-gray-500 mb-6 max-w-md">Select a ticket from the list to view details and participate in the conversation.</p>
                <button
                  onClick={() => setShowCreateTicket(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create New Ticket
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )}