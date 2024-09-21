import React, { useState } from "react";
import axios from "axios";
import "./App.css"; // Import for styling

function App() {
  const [inputData, setInputData] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false); // For controlling filter visibility
  const [availableFilters, setAvailableFilters] = useState(["alphabets", "numbers", "highest_alphabet"]); // Available filters
  const [selectedFilters, setSelectedFilters] = useState([]); // Selected filters

  // Handle Input Change
  const handleInputChange = (e) => {
    setInputData(e.target.value);
  };

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const jsonData = JSON.parse(inputData); // Validate JSON
      const response = await axios.post("https://bfhl-backend-rouge.vercel.app/bfhl", { data: jsonData.data });
      setResponseData(response.data);
      setError(null);
      setShowFilters(true); // Show filters after successful submission
    } catch (err) {
      setError("Invalid JSON or Server Error");
      setResponseData(null);
      setShowFilters(false); // Hide filters on error
    }
  };

  // Handle filter selection (move from available to selected)
  const selectFilter = (filter) => {
    setAvailableFilters(availableFilters.filter((item) => item !== filter));
    setSelectedFilters([...selectedFilters, filter]);
  };

  // Handle removing a filter from selected filters
  const removeFilter = (filter) => {
    setSelectedFilters(selectedFilters.filter((item) => item !== filter));
    setAvailableFilters([...availableFilters, filter]);
  };

  // Render Response based on Selected Filters
  const renderResponse = () => {
    if (!responseData) return null;

    const result = {};
    if (selectedFilters.includes("alphabets")) result["Alphabets"] = responseData.alphabets;
    if (selectedFilters.includes("numbers")) result["Numbers"] = responseData.numbers;
    if (selectedFilters.includes("highest_alphabet")) result["Highest Alphabet"] = responseData.highest_alphabet;

    return (
      <div className="response-block">
        <h3>Response:</h3>
        {Object.keys(result).length > 0 ? (
          Object.keys(result).map((key) => (
            <div key={key}>
              <strong>{key}:</strong> {result[key].join(", ")}
            </div>
          ))
        ) : (
          <p>No filters selected.</p>
        )}
      </div>
    );
  };

  return (
    <div className="App">
      <div className="container">
        <h1>BFHL Challenge</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-section">
            <label>Enter JSON:</label>
            <textarea
              rows="4"
              value={inputData}
              onChange={handleInputChange}
              placeholder='{"data": ["A", "B", "1", "2"]}'
            />
          </div>
          <button type="submit" className="submit-btn">Submit</button>
        </form>

        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* Filters visible only after valid JSON submission */}
        {showFilters && (
          <>
            <div className="filters-section">
              <div className="available-filters">
                <h3>Available Filters:</h3>
                {availableFilters.map((filter) => (
                  <div key={filter} className="filter-block" onClick={() => selectFilter(filter)}>
                    {filter.replace('_', ' ')}
                  </div>
                ))}
              </div>

              <div className="selected-filters">
                <h3>Selected Filters:</h3>
                {selectedFilters.length > 0 ? (
                  selectedFilters.map((filter) => (
                    <div key={filter} className="filter-block selected">
                      {filter.replace('_', ' ')}
                      <span className="remove-filter" onClick={() => removeFilter(filter)}>x</span>
                    </div>
                  ))
                ) : (
                  <p>No filters selected.</p>
                )}
              </div>
            </div>

            {renderResponse()}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
