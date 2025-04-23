import Icons from "@/components/global/icons";
import { SidebarConfig } from "@/components/global/app-sidebar";

const sidebarConfig: SidebarConfig = {
  brand: {
    title: "Aviation Weather",
    icon: Icons.shield,
    href: "/"
  },
  sections: [
    {
      label: "Overview",
      items: [
        {
          title: "Weather Briefing",
          href: "/briefing",
          icon: Icons.home
        },
        {
          title: "Weather Map",
          href: "/map",
          icon: Icons.layoutDashboard
        },
        {
          title: "Flight Plan",
          href: "/plan",
          icon: Icons.activity
        }
      ]
    },
    {
        label: "Weather Briefing",
        items: [
          {
            title: "Weather Briefing",
            href: "/briefing",
            icon: Icons.user
          },
          {
            title: "Weather Map",
            href: "/map",
            icon: Icons.settings
          }
        ]
      }
    
  ]
}

export default sidebarConfig