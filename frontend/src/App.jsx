import { useState } from "react";
import axios from "axios";

const App = () => {
  const [jsonInput, setJsonInput] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState("");
  const [filteredData, setFilteredData] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);

  const handleSubmit = async () => {
    try {
      setError("");
      setFilteredData(null);

      const parsedInput = JSON.parse(jsonInput);

      const response = await axios.post(
        "https://bajaj-finserv-assignment-ufb5.onrender.com/api",
        parsedInput
      );
      setResponseData(response.data);
    } catch (err) {
      console.error(err);

      setError("Invalid JSON or API error.");
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setJsonInput(value);

    setResponseData(null);
    setFilteredData(null);
    setSelectedFilters([]);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const handleClear = () => {
    setJsonInput("");
    setResponseData(null);
    setFilteredData(null);
    setSelectedFilters([]);
  };

  const handleFilterChange = (selectedOptions) => {
    const filtered = selectedOptions.reduce((acc, filter) => {
      acc[filter] = responseData[filter];
      return acc;
    }, {});
    setFilteredData(filtered);
    setSelectedFilters(selectedOptions);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">API data</h1>
      <div className="w-full max-w-2xl">
        <textarea
          className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none mb-4"
          rows="5"
          placeholder='Enter JSON here. e.g. -> { "data": ["A", "C", "z"] }. 
NOTE:- Use double inverted ("") commas for accurate results.'
          value={jsonInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
        />
        <div className="flex gap-2">
          <button
            className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all flex-1"
            onClick={handleSubmit}
          >
            Submit
          </button>
          <button
            className="bg-gray-300 text-black font-bold py-2 px-4 rounded-lg hover:bg-gray-400 active:bg-gray-500 transition-all"
            onClick={handleClear}
          >
            Clear
          </button>
        </div>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>

      {responseData && (
        <div className="mt-6 w-full max-w-2xl bg-white p-4 rounded-lg shadow-md sticky top-4 z-10">
          <h2 className="text-xl font-bold mb-4">Filters</h2>
          <div className="flex flex-wrap gap-2">
            {["alphabets", "numbers", "highest_lowercase_alphabet"].map(
              (filter) => (
                <label key={filter} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value={filter}
                    checked={selectedFilters.includes(filter)}
                    onChange={(e) =>
                      handleFilterChange(
                        e.target.checked
                          ? [...selectedFilters, filter]
                          : selectedFilters.filter((f) => f !== filter)
                      )
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                  />
                  {filter[0].toUpperCase() + filter.slice(1)}
                </label>
              )
            )}
          </div>
        </div>
      )}

      {filteredData && (
        <div className="mt-6 w-full max-w-2xl bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Filtered Data</h2>
          <div className="bg-gray-100 p-4 rounded-lg">
            {JSON.stringify(filteredData)}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
