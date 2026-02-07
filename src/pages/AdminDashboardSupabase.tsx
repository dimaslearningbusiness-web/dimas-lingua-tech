import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Course = {
  id: string;
  title: string;
  description: string | null;
  start_time: string | null;
  meeting_url: string | null;
  total_lessons: number;
};

type EnrollmentRequest = {
  id: string;
  status: string;
  course: { title: string } | null;
  student: { email: string } | null;
};

type LessonBooking = {
  id: string;
  date: string;
  time_slot: string;
  student: { email: string } | null;
};

export default function AdminDashboardSupabase() {
  console.log("ADMIN DASHBOARD SUPABASE CARREGADO");

  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollmentRequests, setEnrollmentRequests] = useState<EnrollmentRequest[]>([]);
  const [lessonRequests, setLessonRequests] = useState<LessonBooking[]>([]);

  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    start_time: "",
    meeting_url: "",
    total_lessons: 1,
  });

  useEffect(() => {
    fetchCourses();
    fetchEnrollmentRequests();
    fetchLessonRequests();
  }, []);

  async function fetchCourses() {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar courses:", error);
      return;
    }

    setCourses(data ?? []);
  }

  async function createCourse() {
    if (!newCourse.title) return;

    const { error } = await supabase.from("courses").insert({
      ...newCourse,
      start_time: newCourse.start_time || null,
    });

    if (error) {
      console.error("Erro ao criar course:", error);
      return;
    }

    setNewCourse({
      title: "",
      description: "",
      start_time: "",
      meeting_url: "",
      total_lessons: 1,
    });

    fetchCourses();
  }

  async function fetchEnrollmentRequests() {
    const { data, error } = await supabase
      .from("enrollments")
      .select(`
        id,
        status,
        course:courses(title),
        student:profiles(email)
      `)
      .eq("status", "pending");

    if (error) {
      console.error("Erro enrollment requests:", error);
      return;
    }

    setEnrollmentRequests(data ?? []);
  }

  async function approveEnrollment(id: string) {
    const { error } = await supabase
      .from("enrollments")
      .update({ status: "approved" })
      .eq("id", id);

    if (error) {
      console.error("Erro ao aprovar enrollment:", error);
      return;
    }

    fetchEnrollmentRequests();
  }

  async function fetchLessonRequests() {
    const { data, error } = await supabase
      .from("lesson_bookings")
      .select(`
        id,
        date,
        time_slot,
        student:profiles(email)
      `)
      .eq("status", "pending");

    if (error) {
      console.error("Erro lesson requests:", error);
      return;
    }

    setLessonRequests(data ?? []);
  }

  async function updateLessonStatus(
    id: string,
    status: "approved" | "rejected"
  ) {
    const { error } = await supabase
      .from("lesson_bookings")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error("Erro atualizar lesson:", error);
      return;
    }

    fetchLessonRequests();
  }

  return (
    <div className="space-y-10">
      {/* CONFIRMAÇÃO VISUAL */}
      <div className="bg-green-600 text-white p-3 rounded">
        Admin Dashboard Supabase ATIVO
      </div>

      {/* COURSES */}
      <section>
        <h2 className="text-xl font-bold mb-2">Courses</h2>

        <div className="space-y-2 border p-4 rounded">
          <input
            className="input"
            placeholder="Title"
            value={newCourse.title}
            onChange={(e) =>
              setNewCourse({ ...newCourse, title: e.target.value })
            }
          />

          <textarea
            className="input"
            placeholder="Description"
            value={newCourse.description}
            onChange={(e) =>
              setNewCourse({ ...newCourse, description: e.target.value })
            }
          />

          <input
            type="datetime-local"
            className="input"
            value={newCourse.start_time}
            onChange={(e) =>
              setNewCourse({ ...newCourse, start_time: e.target.value })
            }
          />

          <input
            className="input"
            placeholder="Meeting URL"
            value={newCourse.meeting_url}
            onChange={(e) =>
              setNewCourse({ ...newCourse, meeting_url: e.target.value })
            }
          />

          <input
            type="number"
            min={1}
            className="input"
            value={newCourse.total_lessons}
            onChange={(e) =>
              setNewCourse({
                ...newCourse,
                total_lessons: Number(e.target.value),
              })
            }
          />

          <button className="btn" onClick={createCourse}>
            Create course
          </button>
        </div>

        <ul className="mt-4 space-y-2">
          {courses.length === 0 && <li>No courses yet</li>}

          {courses.map((c) => (
            <li key={c.id} className="border p-2 rounded">
              <strong>{c.title}</strong> — {c.total_lessons} lessons
            </li>
          ))}
        </ul>
      </section>

      {/* ENROLLMENT REQUESTS */}
      <section>
        <h2 className="text-xl font-bold mb-2">
          Course enrollment requests
        </h2>

        {enrollmentRequests.length === 0 && (
          <p>No pending enrollment requests</p>
        )}

        {enrollmentRequests.map((r) => (
          <div
            key={r.id}
            className="border p-2 rounded flex justify-between"
          >
            <span>
              {r.student?.email} → {r.course?.title}
            </span>
            <button
              className="btn"
              onClick={() => approveEnrollment(r.id)}
            >
              Approve
            </button>
          </div>
        ))}
      </section>

      {/* LESSON BOOKINGS */}
      <section>
        <h2 className="text-xl font-bold mb-2">
          Lesson book
