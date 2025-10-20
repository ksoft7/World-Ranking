import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import FilterCheckbox from "./filterCheckbox";

const CountryRanking = ({ onSelectCountry }) => {
  const [allCountries, setAllCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [displayedCountries, setDisplayedCountries] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Population");
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef(null);

  // Fetch countries
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "https://restcountries.com/v3.1/all?fields=name,flags,population,area,region,subregion,cca3"
        );
        const sorted = res.data.sort((a, b) => b.population - a.population);
        setAllCountries(sorted);
        setFilteredCountries(sorted);
        setDisplayedCountries(sorted.slice(0, 10));
      } catch (error) {
        console.error("Error fetching countries:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCountries();
  }, []);

  // Sorting logic
  const sortCountries = (countries, sortBy) => {
    switch (sortBy) {
      case "Population":
        return [...countries].sort((a, b) => b.population - a.population);
      case "A-Z":
        return [...countries].sort((a, b) =>
          a.name.common.localeCompare(b.name.common)
        );
      case "Z-A":
        return [...countries].sort((a, b) =>
          b.name.common.localeCompare(a.name.common)
        );
      case "Area":
        return [...countries].sort((a, b) => (b.area || 0) - (a.area || 0));
      default:
        return countries;
    }
  };

  // Filtering logic
  useEffect(() => {
    let result = allCountries;
    if (selectedRegion !== "All") {
      result = result.filter((c) => c.region === selectedRegion);
    }
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.common.toLowerCase().includes(query) ||
          c.region.toLowerCase().includes(query) ||
          (c.subregion && c.subregion.toLowerCase().includes(query))
      );
    }
    result = sortCountries(result, sortBy);
    setFilteredCountries(result);
    setDisplayedCountries(result.slice(0, 10));
    setVisibleCount(10);
  }, [selectedRegion, searchQuery, sortBy, allCountries]);

  // Infinite scroll
  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting && !loading) {
        setVisibleCount((prev) => prev + 10);
      }
    },
    [loading]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "20px",
      threshold: 0.5,
    });
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [handleObserver]);

  useEffect(() => {
    setDisplayedCountries(filteredCountries.slice(0, visibleCount));
  }, [visibleCount, filteredCountries]);

  const regions = [
    "All",
    "Americas",
    "Antarctic",
    "Africa",
    "Asia",
    "Europe",
    "Oceania",
  ];

  return (
    <section
      className="z-10 flex p-10 flex-col gap-10 relative mt-60 m-auto shadow-lg bg-[#1B1D1F] rounded-xl"
      style={{ width: "95%", border: "1.5px solid #232324FF" }}
    >
      {/* Top bar */}
      <div className="flex justify-between gap-9 max-sm:flex-col text-[#D2D5DA]">
        <p className="font-medium text-xl">
          Found <span>{filteredCountries.length}</span> countries
        </p>

        <span className="flex gap-4 rounded-2xl bg-[#43454a] py-4 pl-4 pr-10">
          <FiSearch color="#d1d2d4" size={15} />
          <input
            className="outline-none flex-1 w-full bg-transparent text-[#D2D5DA]"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Name, Region, or Subregion"
          />
        </span>
      </div>

      <div className="flex max-sm:flex-col gap-10 items-start">
        {/* Sidebar */}
        <div className="flex flex-col gap-8 mt-5 max-sm:w-full">
          <span className="flex flex-col gap-2">
            <h4 className="text-[#D2D5DA] font-medium text-sm">Sort by</h4>
            <span className="p-4 rounded-xl border-2 flex justify-between border-[#6C727F] w-90 max-sm:w-full">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-[#D2D5DA] font-medium flex-1 outline-none bg-transparent"
              >
                <option value="Population">Population</option>
                <option value="A-Z">A–Z</option>
                <option value="Z-A">Z–A</option>
                <option value="Area">Area</option>
              </select>
            </span>
          </span>

          <span className="flex flex-col gap-3">
            <h4 className="text-[#D2D5DA] font-medium text-sm">Region</h4>
            <span className="flex flex-wrap gap-4 w-80 max-sm:w-full tracking-wide">
              {regions.map((region) => (
                <p
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className={`font-medium p-4 text-xl rounded-2xl cursor-pointer transition ${
                    selectedRegion === region
                      ? "bg-[#d2d5da] text-[#1B1D1F]"
                      : "text-[#d2d5da] bg-[#5a5b5c7c] hover:bg-[#777]"
                  }`}
                >
                  {region}
                </p>
              ))}
            </span>
          </span>

          <FilterCheckbox />
        </div>

        {/* Table */}
        <div className="flex-1 w-full overflow-x-auto">
          {loading ? (
            <div className="animate-pulse space-y-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-6 bg-[#2b2d31] rounded-xl p-4"
                >
                  <div className="w-16 h-12 bg-[#3a3c40] rounded-md" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-[#3a3c40] rounded w-1/3" />
                    <div className="h-4 bg-[#3a3c40] rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <table className="w-full table-auto text-sm">
                <thead
                  className="text-left font-medium"
                  style={{ color: "#D2D5DA", fontSize: "1rem" }}
                >
                  <tr style={{ borderBottom: "2px solid #282b30" }}>
                    <th className="py-4 pr-4">Flag</th>
                    <th className="py-4 px-4">Name</th>
                    <th className="py-4 px-4">Population</th>
                    <th className="py-4 px-4">Area (km²)</th>
                    <th className="py-4 px-4">Region</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedCountries.map((country) => (
                    <tr
                      key={country.cca3}
                      onClick={() => onSelectCountry(country.cca3)}
                      className="tracking-wide hover:bg-[#4b4b4b] transition select-none cursor-pointer"
                      style={{ color: "#D2D5DA", fontSize: "1rem" }}
                    >
                      <td className="py-3 pr-4">
                        <img
                          src={country.flags.png}
                          alt={country.name.common}
                          className="w-16 h-12 rounded-sm object-cover"
                        />
                      </td>
                      <td className="py-3 px-4 font-medium">
                        {country.name.common}
                      </td>
                      <td className="py-3 px-4">
                        {country.population.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        {country.area ? country.area.toLocaleString() : "—"}
                      </td>
                      <td className="py-3 px-4">{country.region}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div ref={loaderRef} className="text-center py-6 text-[#999]">
                Scroll to load more
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default CountryRanking;
