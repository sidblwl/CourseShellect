const express = require("express");
const router = express.Router();
const Preference = require("../models/preference");

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

router.post("/", async (req, res) => {
  try {
    const { username, subjects, minGPA, minCredits, maxCredits } = req.body;

    console.log(`📩 Received preferences from ${username}`);
    console.log(`🔍 GPA >= ${minGPA}, Credits: ${minCredits}–${maxCredits}, Subjects: ${subjects.join(", ")}`);

    // 🔁 Find and update if exists, otherwise create new (upsert)
    await Preference.findOneAndUpdate(
      { username },
      { subjects, minGPA, minCredits, maxCredits, createdAt: new Date() },
      { upsert: true, new: true }
    );

    let matchingCourses = [];

    for (const dept of subjects) {
      const apiRes = await fetch(`https://planetterp.com/api/v1/courses?department=${dept}`);
      const courses = await apiRes.json();

      console.log(`📚 Fetched ${courses.length} courses from ${dept}`);

      const filtered = courses.filter(
        (course) =>
          typeof course.average_gpa === "number" &&
          typeof course.credits === "number" &&
          course.average_gpa >= minGPA &&
          course.credits >= minCredits &&
          course.credits <= maxCredits 
      );

      matchingCourses = matchingCourses.concat(filtered);
    }

    matchingCourses.sort((a, b) => b.average_gpa - a.average_gpa);

    if (matchingCourses.length === 0) {
      console.log("❌ No matching courses found.");
      return res.json({
        message: "No courses matched your filters. Try broadening your GPA or credit range.",
      });
    }
    
    console.log(`✅ Returning ${Math.min(10, matchingCourses.length)} top results`);
    res.json(matchingCourses.slice(0, 10));
  } catch (err) {
    console.error("❌ Error in /api/preferences:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:username", async (req, res) => {
  try {
    const { username } = req.params;

    const pref = await Preference.findOne({ username });

    if (!pref) {
      return res.status(404).json({ message: "No preferences found for this user." });
    }

    res.json(pref);
  } catch (err) {
    console.error("❌ Error fetching preferences:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = router;
