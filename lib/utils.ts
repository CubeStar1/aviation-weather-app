import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import Icons from "@/components/global/icons";
import { 
  Home,
  Wrench,
  ShowerHead,
  UtensilsCrossed,
  Calendar,
  Wallet
} from "lucide-react"


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const features = [
  {
    icon: Home,
    title: "Room Management",
    info: "Smart room allocation system with automated roommate matching and room swapping requests.",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: Wrench,
    title: "Maintenance & Cleaning",
    info: "Streamlined complaint submission and tracking system with scheduled cleaning management.",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: ShowerHead,
    title: "Laundry & Utilities",
    info: "Integrated laundry booking system with vendor management and utility tracking features.",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    icon: UtensilsCrossed,
    title: "Mess Management",
    info: "Daily food ratings, hygiene feedback system, and weekly menu planning interface.",
    gradient: "from-orange-500 to-yellow-500"
  },
  {
    icon: Calendar,
    title: "Events & Community",
    info: "Comprehensive event management with announcements and RSVP system for hostel activities.",
    gradient: "from-red-500 to-rose-500"
  },
  {
    icon: Wallet,
    title: "Billing & Payments",
    info: "Automated monthly invoicing with integrated payment gateway for hassle-free fee collection.",
    gradient: "from-indigo-500 to-violet-500"
  }
];
