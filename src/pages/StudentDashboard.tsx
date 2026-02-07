import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuthProfile } from "@/hooks/useAuthProfile";

type Course = {
  id: string;
  title: string;
  description: string | null;
};

type LessonBooking = {
  id: string;
  date: string;
  time_slot: string;
  status: string;
};

export default function StudentDashboard() {
  const { profile } = useAuthProfile();

  const [courses, setCourses] = useState<Course[]>([]);
  const [myLessons, setMyLessons] = useState<LessonBooking[]>([]);

  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("18-19");

  useEffect(() => {
    if (!profile) return;
    fetchCourses();
    fetchMyLessons();
  }, [profile]);

  async function fetchCourses() {
    const { data } = await supabase.from("courses").select("id, title, description");
    setCourses(data ?? []);
  }

  async function requestEnrollment(courseId: string) {
    if (!profile) return;

    await supabase.from("enrollments").insert({
      student_id: profile.id,
      course_id: courseId,
      status: "pending",
    });
  }

  async function fetchMyLessons() {
    if (!profile) return;

    const { data } = await supabase
      .from("lesson_bookings")
      .select("*")
      .eq("student_id", profile.id)
      .order("created_at", { ascending: false });

    setMyLessons(data ?? []);
  }

  async function requestLesson() {
    if (!profile || !date) return;

    await supabase.from("lesson_bookings").insert({
      student_id: profile.id,
      date,
      time_slot: slot,
      status: "pending",
    });

    setDate("");
    fetchMyLessons();
  }

  if (!profile) return null;

  return (
    <div className="space-y-10">
      {/* COURSES */}
      <section>
        <h2 className="text-xl font-bold mb-2">Available courses</h2>

        {courses.map((c) => (
          <div key={c.id} className="border p-2 rounded flex justify-between">
            <span>{c.title}</span>
            <button className="btn" onClick={() => requestEnrollment(c.id)}>
              Request enrollment
            </button>
          </div>
        ))}
      </section>

      {/* BOOK LESSON */}
      <section>
        <h2 className="text-xl font-bold mb-2">Book a 1:1 lesson</h2>

        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <select value={slot} onChange={(e) => setSlot(e.target.value)}>
          <option value="18-19">18–19</option>
          <option value="19-20">19–20</option>
          <option value="20-21">20–21</option>
        </select>

        <button className="btn" onClick={requestLesson}>
          Request lesson
        </button>

        <ul className="mt-4">
          {myLessons.map((l) => (
            <li key={l.id}>
              {l.date} — {l.time_slot} ({l.status})
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
