interface Room {
    id: number;
    name: string;
    service: string;
    logoUrl: string;
    owner: string;
    ownerAvatar: string;
    nextBilling: string;
    memberCount: number;
    isOwner: boolean;
    monthlyCost: number;
  }
  
  
  // Sample data for streaming rooms
  const roomsData: Room[] = [
    {
      id: 1,
      name: "Netflix Family Plan",
      service: "Netflix",
      logoUrl: "/api/placeholder/60/60",
      owner: "John Doe",
      ownerAvatar: "/api/placeholder/40/40",
      nextBilling: "April 15, 2025",
      memberCount: 4,
      isOwner: true,
      monthlyCost: 19.99
    },
    {
      id: 2,
      name: "Spotify Premium",
      service: "Spotify",
      logoUrl: "/api/placeholder/60/60",
      owner: "Jane Smith",
      ownerAvatar: "/api/placeholder/40/40",
      nextBilling: "April 5, 2025",
      memberCount: 5,
      isOwner: false,
      monthlyCost: 14.99
    },
    {
      id: 3,
      name: "Disney+ Group",
      service: "Disney+",
      logoUrl: "/api/placeholder/60/60",
      owner: "Mark Johnson",
      ownerAvatar: "/api/placeholder/40/40",
      nextBilling: "March 28, 2025",
      memberCount: 3,
      isOwner: false,
      monthlyCost: 9.99
    },
    {
      id: 4,
      name: "HBO Max Friends",
      service: "HBO Max",
      logoUrl: "/api/placeholder/60/60",
      owner: "Sarah Williams",
      ownerAvatar: "/api/placeholder/40/40",
      nextBilling: "April 10, 2025",
      memberCount: 4,
      isOwner: true,
      monthlyCost: 17.99
    },
    {
      id: 5,
      name: "YouTube Premium",
      service: "YouTube",
      logoUrl: "/api/placeholder/60/60",
      owner: "You",
      ownerAvatar: "/api/placeholder/40/40",
      nextBilling: "April 22, 2025",
      memberCount: 6,
      isOwner: true,
      monthlyCost: 11.99
    },
    {
      id: 6,
      name: "Apple TV+",
      service: "Apple TV+",
      logoUrl: "/api/placeholder/60/60",
      owner: "Alex Chen",
      ownerAvatar: "/api/placeholder/40/40",
      nextBilling: "April 3, 2025",
      memberCount: 3,
      isOwner: false,
      monthlyCost: 8.99
    }
  ];
export default roomsData;  