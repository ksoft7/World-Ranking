import { useState } from "react";
import CountryRanking from "../components/countryRanking";
import CountryDetail from "../components/countryDetail";
import HeroImage from "../assets/hero-image.jpg";
import Logo from "../assets/Logo.svg";

function Home() {
  const [selectedCountry, setSelectedCountry] = useState(null);

  return (
    <section className="relative">
      <header className="flex justify-center items-center">
        <img
          className="fixed top-0 left-1/2 -translate-x-1/2"
          src={Logo}
          alt="Logo"
          style={{ zIndex: "1", marginTop: "5.9rem" }}
        />
        <img
          className="left-0 fixed top-0"
          style={{
            width: "100%",
            height: "35%",
          }}
          src={HeroImage}
          alt="HeroImage"
        />
      </header>

      <div className="w-full flex justify-center">
        {!selectedCountry ? (
          <CountryRanking
            onSelectCountry={(code) => setSelectedCountry(code)}
          />
        ) : (
          <div
            className="relative z-10 mt-60 bg-[#1c1d1f] max-sm:rounded-none rounded-2xl shadow-slate-300 w-4xl max-sm:w-full pt-16 text-center"
            style={{ border: "1.5px solid #26282c" }}
          >
            <CountryDetail
              countryCode={selectedCountry}
              onBack={() => setSelectedCountry(null)}
            />
          </div>
        )}
        {/* <CountryDetail /> */}
      </div>
    </section>
  );
}

export default Home;
