"use client";
import { useState } from "react";
import Tickets from "../tickets/page";
import Documents from "../documents/page";
import Chat from "../chat/page";

// SVG Icons as components
const NotificationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const TicketIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="10" rx="2" ry="2"></rect>
    <path d="M12 7v10"></path>
    <path d="M7 9h.01"></path>
    <path d="M17 9h.01"></path>
  </svg>
);

const DocumentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

const ChatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

// Mock components for demonstration
// const Tickets = () => (
//   <div className="p-4 bg-white rounded-lg shadow-sm">
//     <h2 className="text-xl font-semibold mb-4">Your Tickets</h2>
//     <div className="space-y-3">
//       {[1, 2, 3].map(ticket => (
//         <div key={ticket} className="p-3 border rounded-lg hover:shadow-md transition-all">
//           <div className="flex justify-between">
//             <h3 className="font-medium">Ticket #{ticket}</h3>
//             <span className={`px-2 py-1 rounded-full text-xs ${ticket % 2 === 0 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
//               {ticket % 2 === 0 ? 'Completed' : 'In Progress'}
//             </span>
//           </div>
//           <p className="text-gray-600 text-sm mt-1">Issue description goes here. This is a sample ticket entry.</p>
//         </div>
//       ))}
//     </div>
//   </div>
// );

// const Documents = () => (
//   <div className="p-4 bg-white rounded-lg shadow-sm">
//     <h2 className="text-xl font-semibold mb-4">Your Documents</h2>
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//       {[1, 2, 3, 4].map(doc => (
//         <div key={doc} className="p-3 border rounded-lg flex items-center hover:shadow-md transition-all">
//           <div className="bg-blue-100 p-2 rounded-lg mr-3">
//             <DocumentIcon />
//           </div>
//           <div>
//             <h3 className="font-medium">Document {doc}.pdf</h3>
//             <p className="text-gray-500 text-xs">Updated 2 days ago</p>
//           </div>
//         </div>
//       ))}
//     </div>
//   </div>
// );

// const Chat = () => (
//   <div className="p-4 bg-white rounded-lg shadow-sm">
//     <h2 className="text-xl font-semibold mb-4">Support Chat</h2>
//     <div className="border rounded-lg p-4 h-64 overflow-y-auto bg-gray-50 mb-3">
//       <div className="mb-3">
//         <div className="bg-blue-100 text-blue-800 p-2 rounded-lg inline-block max-w-xs">
//           Hi there! How can I help you today?
//         </div>
//       </div>
//       <div className="flex justify-end mb-3">
//         <div className="bg-gray-200 p-2 rounded-lg inline-block max-w-xs">
//           I'm having issues with my account
//         </div>
//       </div>
//       <div className="mb-3">
//         <div className="bg-blue-100 text-blue-800 p-2 rounded-lg inline-block max-w-xs">
//           I'm sorry to hear that. Could you provide more details about the issue?
//         </div>
//       </div>
//     </div>
//     <div className="flex">
//       <input 
//         type="text" 
//         placeholder="Type your message..." 
//         className="flex-1 border rounded-l-lg p-2 focus:outline-none"
//       />
//       <button className="bg-blue-500 text-white px-4 py-2 rounded-r-lg">
//         Send
//       </button>
//     </div>
//   </div>
// );

export default function Dashboard() {
  const [view, setView] = useState('tickets');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  // Toggle sidebar for mobile only
  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  const navItems = [
    { id: 'tickets', label: 'Tickets', icon: <TicketIcon /> },
    { id: 'documents', label: 'Documents', icon: <DocumentIcon /> },
    { id: 'chat', label: 'Chat', icon: <ChatIcon /> }
  ];

  // Function to handle navigation item clicks
  const handleNavClick = (navId) => {
    setView(navId);
    // On mobile, close the sidebar after clicking a nav item
    if (window.innerWidth < 768) {
      setMobileSidebarOpen(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="flex flex-col md:flex-row relative">
        {/* Sidebar - visible on desktop, hidden on mobile by default */}
        <div className={`
          md:block md:w-64 bg-white shadow-lg z-30
          fixed md:static top-0 left-0 h-full
          transition-all duration-300
          ${mobileSidebarOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full md:translate-x-0'}
        `}>
          {/* Sidebar header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3">
              <img src="/dash.png" alt="Dashboard" className="w-8 h-6" />
              <h3 className="text-lg font-medium">Dashboard</h3>
            </div>
            <button onClick={toggleMobileSidebar} className="md:hidden p-1">
              <CloseIcon />
            </button>
          </div>
          
          {/* Sidebar content */}
          <div className="p-4">
            {/* Retainer plan card */}
            <div className="border border-gray-300 p-4 rounded-lg mb-6 bg-white">
              <p className="font-medium">Retainer Plan</p>
              <p className="text-sm text-gray-600 mb-2">30 tickets left</p>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{width: '30%'}}></div>
              </div>
              <button className="mt-3 px-3 py-1.5 w-full bg-blue-500 hover:bg-blue-600 text-white rounded text-sm transition-colors">
                Upgrade Plan
              </button>
            </div>
            
            {/* Navigation */}
            <nav className="space-y-1">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                    view === item.id 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
        
        {/* Backdrop for mobile when sidebar is open */}
        {mobileSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden" 
            onClick={toggleMobileSidebar}
          ></div>
        )}
        
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="bg-white p-4 sticky top-0 shadow-sm z-10">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <button 
                  onClick={toggleMobileSidebar} 
                  className="p-2 mr-2 rounded-lg hover:bg-gray-100 md:hidden"
                  aria-label="Toggle sidebar"
                >
                  <MenuIcon />
                </button>
                <h2 className="text-xl font-medium">Client Dashboard</h2>
              </div>
              <div className="flex items-center gap-4">
                <button className="relative p-2 rounded-full hover:bg-gray-100">
                  <NotificationIcon />
                  <span className="absolute top-0 right-0.5 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <img  src="/user7.jpg" alt="user" 
                  className="w-8 rounded-full"
                  />
                </button>
              </div>
            </div>
          </div>
          
          {/* Dynamic content based on selected view */}
          <div className="p-4">
            {view === 'tickets' && <Tickets />}
            {view === 'documents' && <Documents />}
            {view === 'chat' && <Chat />}
          </div>
        </div>
      </div>
    </div>
  );
}















// "use client";
// import { useState } from "react";
// import Tickets from "../tickets/page";
// import Documents from "../documents/page";
// import Chat from "../chat/page";
// import { IoIosNotifications } from "react-icons/io";
// import { FaUserAlt } from "react-icons/fa";

// export default function dashboard() {
//     const [view, setView] = useState('tickets');
//     return (
//         <div className="bg-[#F1F3F5] p-4">
//             <div className=" flex bg-white min-h-screen shadow-lg">
//                 <div className="flex-1 bg-[#FAFBFE] p-3 ">
//                     <div className="flex items-center gap-4" >
//                         <img src="/dash.png" alt="icon" className="w-10 h-8" />
//                         <h3 className="text-2xl font-lg">Dashboard</h3>
//                     </div>

//                     <div className="h-0.5 w-full bg-gray-300 my-4"></div>


//                     <div className="border p-3 border-gray-400 rounded-lg">
//                         <p>Retainer Plan</p>
//                         <p>30 tickets left</p>
                        
//                         <div className="w-full bg-[#FDFFF4] rounded-full h-2.5 dark:bg-gray-700">
//                               <div className="bg-[#DDDFE5] h-2.5 rounded-full" style={{width: '30%'}}></div>
//                         </div>

//                         <div className="px-2 py-1 w-1/2 mt-3 bg-[#DDDFE5] rounded-sm cursor-pointer">Upgrate</div>

//                     </div>

//                     <div className="flex flex-col gap-3 text-start">
//                         <button onClick={() => setView('tickets')}>
//                             Tickets
//                         </button>
//                         <button onClick={() => setView('documents')}>
//                             Documents
//                         </button>
//                         <button onClick={() => setView('chat')}>
//                             Chat
//                         </button>
//                     </div>
//                 </div>
//                 <div className="flex-3 p-4">
//                     <div className="flex justify-between">
//                         <p>Client Deshboard</p>
//                         <div className="flex gap-4">
//                             <IoIosNotifications className="text-3xl border rounded-full" />
//                             <FaUserAlt  className="text-2xl border rounded-full"/>
//                         </div>
//                     </div>
//                     <div className="h-0.5 w-full bg-gray-300 mt-3"></div>
//                     {view === 'tickets' && <Tickets />}
//                     {view === 'documents' && <Documents />}
//                     {view === 'chat' && <Chat />}
//                 </div>
//             </div>
//         </div>
//     )
// }