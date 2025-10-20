import React, { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "./Spinner";

const CountryDetail = ({ countryCode, onBack }) => {
  const [country, setCountry] = useState(null);
  const [neighbors, setNeighbors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `https://restcountries.com/v3.1/alpha/${countryCode}`
        );
        const data = res.data[0];
        setCountry(data);

        // Fetch neighboring countries
        if (data.borders?.length) {
          const borderRes = await axios.get(
            `https://restcountries.com/v3.1/alpha?codes=${data.borders.join(
              ","
            )}`
          );
          setNeighbors(borderRes.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (countryCode) fetchCountry();
  }, [countryCode]);

  if (loading)
    return (
      <div className="text-center mt-30 mb-30 text-[#D2D5DA] text-xl">
        <Spinner />
      </div>
    );

  if (!country) return null;

  const name = country.name?.common || "";
  const official = country.name?.official || "";
  const population = country.population?.toLocaleString() || "—";
  const area = country.area?.toLocaleString() || "—";
  const capital = country.capital?.[0] || "—";
  const subregion = country.subregion || "—";
  const languages = country.languages
    ? Object.values(country.languages).join(", ")
    : "—";
  const currencies = country.currencies
    ? Object.values(country.currencies)
        .map((c) => c.name)
        .join(", ")
    : "—";
  const continent = country.continents?.[0] || "—";

  return (
    <div>
      {/* Back button */}
      <button
        onClick={onBack}
        className="absolute left-8 top-6 bg-[#282b30] hover:bg-[#3a3d42] text-[#d2d5da] px-6 py-2 rounded-lg font-medium transition"
      >
        ← Back
      </button>

      {/* Flag */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2">
        <img
          src={country.flags?.png}
          alt={`${name} Flag`}
          className="w-60 h-40 object-cover rounded-lg shadow-lg border border-[#222]"
        />
      </div>

      {/* Country Name */}
      <h1 className="text-3xl font-semibold mt-18" style={{ color: "#D2D5DA" }}>
        {name}
      </h1>
      <p className="mb-6 font-medium text-sm" style={{ color: "#D2D5DA" }}>
        {official}
      </p>

      {/* Stats Section */}
      <div
        className="flex justify-center max-sm:flex-wrap gap-4 mb-8 font-medium tracking-wide"
        style={{ color: "#d2d5da", fontSize: "1.1rem" }}
      >
        <div className="bg-[#282b30] px-6 py-3 rounded-lg flex items-center gap-3.5">
          <p className="font-medium">Population</p>
          <div
            style={{
              height: "2.3rem",
              width: "0.1px",
              background: "#1d1f22",
              borderRadius: "1rem",
            }}
          ></div>
          <p className="font-medium">{population}</p>
        </div>
        <div className="bg-[#282b30] px-6 py-3 rounded-lg flex items-center gap-3.5">
          <p className="font-medium">Area (km²)</p>
          <div
            style={{
              height: "2.3rem",
              width: "0.1px",
              background: "#1d1f22",
              borderRadius: "1rem",
            }}
          ></div>
          <p className="font-medium">{area}</p>
        </div>
      </div>

      {/* Info List */}
      <div
        className="text-left font-medium"
        style={{
          fontSize: "1rem",
          color: "#c9ccd0",
        }}
      >
        <div
          className="flex justify-between p-4 py-4"
          style={{
            borderTop: "1.5px solid #26282c",
            borderBottom: "1.5px solid #26282c",
          }}
        >
          <p>Capital</p>
          <p>{capital}</p>
        </div>
        <div
          className="flex justify-between p-4 py-4"
          style={{
            borderBottom: "1.5px solid #26282c",
          }}
        >
          <p>Subregion</p>
          <p>{subregion}</p>
        </div>
        <div
          className="flex justify-between p-4 py-4"
          style={{
            borderBottom: "1.5px solid #26282c",
          }}
        >
          <p>Languages</p>
          <p>{languages}</p>
        </div>
        <div
          className="flex justify-between p-4 py-4"
          style={{
            borderBottom: "1.5px solid #26282c",
          }}
        >
          <p>Currencies</p>
          <p>{currencies}</p>
        </div>
        <div
          className="flex justify-between p-4 py-4"
          style={{
            borderBottom: "1.5px solid #26282c",
          }}
        >
          <p>Continents</p>
          <p>{continent}</p>
        </div>
      </div>

      {/* Neighboring Countries */}
      <div
        className="text-left p-4 py-8 font-medium mb-10"
        style={{
          fontSize: "1rem",
          color: "#c9ccd0",
        }}
      >
        <p className="mb-4.5">Neighbouring Countries</p>
        <div className="flex gap-3 flex-wrap">
          {neighbors.length > 0 ? (
            neighbors.map((n) => (
              <span
                key={n.cca3}
                className="flex flex-col gap-3 items-center cursor-pointer"
              >
                <img
                  src={n.flags?.png}
                  alt={n.name.common}
                  className="w-22 h-16 rounded-md object-cover border border-[#2a2a2a]"
                />
                <p className="text-sm">{n.name.common}</p>
              </span>
            ))
          ) : (
            <p className="text-sm text-[#888]">No neighbouring countries</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CountryDetail;
