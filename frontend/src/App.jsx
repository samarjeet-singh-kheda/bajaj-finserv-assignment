import { useState } from "react";
import axios from "axios";

const App = () => {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [filteredResponse, setFilteredResponse] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");
      setFilteredResponse(null);

      const parsedInput = JSON.parse(input);

      const response = await axios.post(
        "https://bajaj-finserv-assignment-ufb5.onrender.com/bfhl",
        parsedInput
      );
      setResponse(response.data);
    } catch (err) {
      console.error(err);

      setError("Invalid JSON or API error.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);

    setResponse(null);
    setFilteredResponse(null);
    setSelectedFilters([]);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const handleClear = () => {
    setInput("");
    setResponse(null);
    setFilteredResponse(null);
    setSelectedFilters([]);

    setLoading(false);
  };

  const handleFilterChange = (selectedOptions) => {
    const filtered = selectedOptions.reduce((acc, filter) => {
      acc[filter] = response[filter];
      return acc;
    }, {});

    setFilteredResponse(filtered);
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
NOTE:- Use double inverted (" ") commas for accurate results.'
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
        />

        <div className="flex gap-2">
          <button
            className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 active:bg-blue-800 flex-1"
            onClick={handleSubmit}
          >
            Submit
          </button>

          <button
            className="bg-gray-300 text-black font-bold py-2 px-4 rounded-lg hover:bg-gray-400 active:bg-gray-500"
            onClick={handleClear}
          >
            Clear
          </button>
        </div>

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>

      {loading && (
        <div className="text-center mt-8">
          <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        </div>
      )}

      {response && !loading && (
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

      {filteredResponse && (
        <div className="mt-6 w-full max-w-2xl bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Filtered Data</h2>
          <div className="bg-gray-100 p-4 rounded-lg">
            {JSON.stringify(filteredResponse)}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
