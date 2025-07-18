interface Member {
    id: number;
    name: string;
    avatar: string;
    email: string;
    paymentStatus: 'paid' | 'pending' | 'overdue';
    joinDate: string;
    amountDue: number;
  }
interface RoomDetail {
    id: number;
    name: string;
    service: string;
    logoUrl: string;
    owner: {
      id: number;
      name: string;
      avatar: string;
      email: string;
    };
    description: string;
    accountEmail?: string;
    accountPassword?: string;
    monthlyCost: number;
    nextBilling: string;
    createdDate: string;
    maxMembers: number;
    members: Member[];
    isOwner: boolean;
  }
  
  // Sample data for a room detail
  const roomDetail: RoomDetail = {
    id: 1,
    name: "Netflix Family Plan",
    service: "Netflix",
    logoUrl: "/api/placeholder/80/80",
    owner: {
      id: 101,
      name: "John Doe",
      avatar: "/api/placeholder/40/40",
      email: "john.doe@example.com"
    },
    description: "Premium Netflix account with 4K UHD streaming capability. Split cost among friends for all Netflix content.",
    accountEmail: "netflixshared@example.com",
    accountPassword: "************",
    monthlyCost: 19.99,
    nextBilling: "April 15, 2025",
    createdDate: "January 5, 2025",
    maxMembers: 5,
    members: [
      {
        id: 101,
        name: "John Doe",
        avatar: "/api/placeholder/40/40",
        email: "john.doe@example.com",
        paymentStatus: "paid",
        joinDate: "January 5, 2025",
        amountDue: 0
      },
      {
        id: 102,
        name: "Alex Johnson",
        avatar: "/api/placeholder/40/40",
        email: "alex.j@example.com",
        paymentStatus: "paid",
        joinDate: "January 6, 2025",
        amountDue: 0
      },
      {
        id: 103,
        name: "Samantha Lee",
        avatar: "/api/placeholder/40/40",
        email: "sam.lee@example.com",
        paymentStatus: "pending",
        joinDate: "January 10, 2025",
        amountDue: 4.99
      },
      {
        id: 104,
        name: "Michael Smith",
        avatar: "/api/placeholder/40/40",
        email: "mike.smith@example.com",
        paymentStatus: "overdue",
        joinDate: "January 15, 2025",
        amountDue: 9.99
      }
    ],
    isOwner: true
  };
export default roomDetail;