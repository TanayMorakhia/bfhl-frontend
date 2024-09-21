import React, { useState } from "react";
import axios from "axios";

function App() {
  const [inputData, setInputData] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  
  // Handle Input Change
  const handleInputChange = (e) => {
    setInputData(e.target.value);
  };

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const jsonData = JSON.parse(inputData);
      const response = await axios.post("http://localhost:5000/bfhl", { data: jsonData.data });
      setResponseData(response.data);
      setError(null);
    } catch (err) {
      setError("Invalid JSON or Server Error");
      setResponseData(null);
    }
  };

  // Handle Dropdown Selection
  const handleOptionChange = (e) => {
    const options = Array.from(e.target.selectedOptions, (option) => option.value);
    setSelectedOptions(options);
  };

  // Render Response based on Dropdown Selection
  const renderResponse = () => {
    if (!responseData) return null;

    const result = {};
    if (selectedOptions.includes("alphabets")) result["Alphabets"] = responseData.alphabets;
    if (selectedOptions.includes("numbers")) result["Numbers"] = responseData.numbers;
    if (selectedOptions.includes("highest_alphabet")) result["Highest Alphabet"] = responseData.highest_alphabet;

    return (
      <div>
        <h3>Response:</h3>
        {Object.keys(result).map((key) => (
          <div key={key}>
            <strong>{key}:</strong> {result[key].join(", ")}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="App">
      <h1>BFHL Challenge</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Enter JSON:</label>
          <input type="text" value={inputData} onChange={handleInputChange} placeholder='{"data": ["A", "B", "1", "2"]}' />
        </div>
        <button type="submit">Submit</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {responseData && (
        <>
          <div>
            <label>Filter by:</label>
            <select multiple={true} onChange={handleOptionChange}>
              <option value="alphabets">Alphabets</option>
              <option value="numbers">Numbers</option>
              <option value="highest_alphabet">Highest Alphabet</option>
            </select>
          </div>
          {renderResponse()}
        </>
      )}
    </div>
  );
}

export default App;
