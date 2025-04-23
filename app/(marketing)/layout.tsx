import { Footer, Header } from "@/components/index";
import React from 'react'
import { headerConfig, HeaderConfig } from "@/lib/config/header";
import { footerConfig, FooterConfig } from "@/lib/config/footer";
interface Props {
    children: React.ReactNode;
}

const MarketingLayout = ({ children }: Props) => {
    return (
        <div className="relative flex min-h-screen flex-col">
            <Header config={headerConfig} />
            <div className="flex-1">
                {children}
            </div>
            <Footer className="z-50" config={footerConfig} />
        </div>
    )
};

export default MarketingLayout