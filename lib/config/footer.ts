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
    description: "Aviation Weather"
  },
  sections: [
    {
      title: "Weather Briefing",
      links: [
        { href: "/briefing", label: "Weather Briefing" },
        { href: "/map", label: "Weather Map" },
      ]
    }
  ],
  copyright: `© ${new Date().getFullYear()} Aviation Weather. All rights reserved.`
}
