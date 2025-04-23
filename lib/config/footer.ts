export interface FooterLink {
  href: string
  label: string
}

export interface FooterSection {
  title: string
  links: FooterLink[]
}

export interface FooterConfig {
  brand: {
    title: string
    description: string
  }
  sections: FooterSection[]
  copyright: string
}

export const footerConfig: FooterConfig = {
  brand: {
    title: "Aviation Weather",
    description: "Comprehensive weather briefing for pilots"
  },
  sections: [
    {
      title: "Flight Planning",
      links: [
        { href: "/plan", label: "Create Flight Plan" },
        { href: "/map", label: "Weather Map" },
        { href: "/briefing", label: "Weather Briefing" },
      ]
    },
    {
      title: "Weather Reports",
      links: [
        { href: "/briefing", label: "Weather Briefing" },
        { href: "/map", label: "Weather Map" },
        { href: "/plan", label: "Flight Plan" },
      ]
    },
    {
      title: "About",
      links: [
        { href: "/about", label: "About Us" },
        { href: "/contact", label: "Contact Us" },
      ]
    },
    {
      title: "Legal",
      links: [
        { href: "/terms", label: "Terms of Service" },
        { href: "/privacy", label: "Privacy Policy" },
      ]
    }
  ],
  copyright: `© ${new Date().getFullYear()} Aviation Weather. All rights reserved.`
}
