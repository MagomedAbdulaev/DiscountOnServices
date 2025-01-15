import React from 'react';
import Banner from "../ui/Banner.jsx";
import InviteFriend from "../ui/InviteFriend.jsx";
import Services from "../ui/Services.jsx";
import HowItWorks from "../ui/HowItWorks.jsx";
import AboutUs from "../ui/AboutUs.jsx";
import Faq from "../ui/Faq.jsx";


function Home(props) {
    return (
        <>
            <Banner/>
            <Services/>
            <HowItWorks/>
            <InviteFriend/>
            <AboutUs/>
            <Faq/>
        </>
    );
}

export default Home;