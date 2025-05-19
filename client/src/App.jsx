import { useState } from "react";
import Select from "react-select";
import "./App.css";

const SUBJECT_OPTIONS = [
  { value: "AASP", label: "African American Studies" },
  { value: "AGNR", label: "Agricultural and Resource Economics" },
  { value: "AMST", label: "American Studies" },
  { value: "ANSC", label: "Animal and Avian Sciences" },
  { value: "ANTH", label: "Anthropology" },
  { value: "ARAB", label: "Arabic Studies" },
  { value: "ARCH", label: "Architecture" },
  { value: "ARHU", label: "Arts and Humanities" },
  { value: "ARTH", label: "Art History" },
  { value: "ARTT", label: "Art Studio" },
  { value: "ASTR", label: "Astronomy" },
  { value: "AOSC", label: "Atmospheric and Oceanic Science" },
  { value: "BCHM", label: "Biochemistry" },
  { value: "BIOE", label: "Bioengineering" },
  { value: "BSCI", label: "Biological Sciences" },
  { value: "BMGT", label: "Business and Management" },
  { value: "CHEM", label: "Chemistry" },
  { value: "CHIN", label: "Chinese" },
  { value: "CLAS", label: "Classical Languages and Literatures" },
  { value: "COMM", label: "Communication" },
  { value: "CMSC", label: "Computer Science" },
  { value: "CRIM", label: "Criminology and Criminal Justice" },
  { value: "DANC", label: "Dance" },
  { value: "ECON", label: "Economics" },
  { value: "EDSP", label: "Education, Special" },
  { value: "EDHD", label: "Education, Human Development" },
  { value: "ENGL", label: "English Language and Literature" },
  { value: "ENSP", label: "Environmental Science and Policy" },
  { value: "ENST", label: "Environmental Science and Technology" },
  { value: "FMSC", label: "Family Science" },
  { value: "FREN", label: "French Language and Literature" },
  { value: "GEOG", label: "Geographical Sciences" },
  { value: "GEOL", label: "Geology" },
  { value: "GERM", label: "German Studies" },
  { value: "GVPT", label: "Government and Politics" },
  { value: "HESP", label: "Hearing and Speech Sciences" },
  { value: "HIST", label: "History" },
  { value: "IMDM", label: "Immersive Media Design" },
  { value: "INAG", label: "Institute of Applied Agriculture" },
  { value: "INFM", label: "Information Management" },
  { value: "INST", label: "Information Science" },
  { value: "ITAL", label: "Italian Studies" },
  { value: "JAPN", label: "Japanese" },
  { value: "JWST", label: "Jewish Studies" },
  { value: "KNES", label: "Kinesiology" },
  { value: "LARC", label: "Landscape Architecture" },
  { value: "LING", label: "Linguistics" },
  { value: "MATH", label: "Mathematics" },
  { value: "MEES", label: "Marine-Estuarine-Environmental Sciences" },
  { value: "MUSC", label: "Music" },
  { value: "NEUR", label: "Neuroscience" },
  { value: "NFSC", label: "Nutrition and Food Science" },
  { value: "PHIL", label: "Philosophy" },
  { value: "PHYS", label: "Physics" },
  { value: "PLSC", label: "Plant Sciences" },
  { value: "PSYC", label: "Psychology" },
  { value: "PUAF", label: "Public Policy" },
  { value: "RUSS", label: "Russian Language and Literature" },
  { value: "SOCY", label: "Sociology" },
  { value: "SPAN", label: "Spanish Language, Literatures, and Cultures" },
  { value: "STAT", label: "Statistics" },
  { value: "THET", label: "Theatre" },
  { value: "WMST", label: "Women's Studies" }
];

function App() {
  const [formData, setFormData] = useState({
    username: "",
    subjects: [],
    minGPA: 3.0,
    minCredits: 2,
    maxCredits: 4,
  });

  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes("Credits") || name === "minGPA" ? parseFloat(value) : value,
    }));
  };

  const handleSubjectChange = (selected) => {
    setFormData((prev) => ({
      ...prev,
      subjects: selected.map((s) => s.value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setRecommendations(data.message ? [] : data);
    } catch (err) {
      console.error("Submission failed:", err);
    }
    setLoading(false);
  };

  const handleLoadPreferences = async () => {
    if (!formData.username) return alert("Enter a username first.");
    try {
      const res = await fetch(`/api/preferences/${formData.username}`);
      const data = await res.json();
      if (data.message) {
        alert("No preferences found for this user.");
        return;
      }
      setFormData({
        username: data.username,
        subjects: data.subjects,
        minGPA: data.minGPA,
        minCredits: data.minCredits,
        maxCredits: data.maxCredits,
      });
    } catch (err) {
      console.error("Error loading preferences:", err);
      alert("Failed to load preferences.");
    }
  };

  return (
    <div className="App">
      <h1>UMD Class Recommender</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
            <button type="button" onClick={handleLoadPreferences}>
              Load Preferences
            </button>
          </div>
        </label>

        <label>
          Subjects:
          <Select
            isMulti
            options={SUBJECT_OPTIONS}
            value={SUBJECT_OPTIONS.filter((opt) =>
              formData.subjects.includes(opt.value)
            )}
            onChange={handleSubjectChange}
          />
        </label>

        <label>
          Min GPA:
          <input
            type="number"
            step="0.1"
            name="minGPA"
            value={formData.minGPA}
            onChange={handleChange}
          />
        </label>

        <label>
          Min Credits:
          <input
            type="number"
            name="minCredits"
            value={formData.minCredits}
            onChange={handleChange}
          />
        </label>

        <label>
          Max Credits:
          <input
            type="number"
            name="maxCredits"
            value={formData.maxCredits}
            onChange={handleChange}
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Get Recommendations"}
        </button>
      </form>

      <h2>Top Class Recommendations:</h2>
      <ul>
       
        {recommendations.length > 0 ? (
          recommendations.map((course) => (
            <div className="courseWrapper">
              <p className="courseRec" key={course.department + course.course_number}>{
                course.department} {course.course_number}: {course.title} 
              </p>
              <li>
                GPA:{" "} {Math.round(course.average_gpa * 100)/100}
              </li>
              <li>
                Credits: {course.credits} 
              </li>
              <li>
                Professors: {[...new Set(course.professors)] + " "}
              </li>  
            </div>   
          ))
        ) : (
          <p>No matching courses found.</p>
        )}
      </ul>
    </div>
  );
}

export default App;
