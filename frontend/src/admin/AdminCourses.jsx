import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { baseUrl } from '../utils/globalurl';

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [name, setName] = useState({
    course: '',
    id: ''
  });

  const normalizeCourses = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    return [];
  };

  useEffect(() => {
    axios.get(`${baseUrl}/courses`, { withCredentials: true })
      .then((res) => {
        setCourses(normalizeCourses(res.data));
      })
      .catch((err) => console.log(err));
  }, []);

  // const handleSave = (e) => {
  //   e.preventDefault();
  //   axios.post("http://localhost:3000/auth/courses/", name)
  //     .then((res) => {
  //       const newCourse = { id: res.data, course: name.course };
  //       setCourses([...courses, newCourse]);
  //       toast.success("Course saved successfully");
  //       setName({ course: '' }); // Clear the input field
  //     })
  //     .catch((err) => console.log(err));
  // }

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${baseUrl}/courses/${id}`, { withCredentials: true });
      toast.warning(response.data.message);
      setCourses((prevCourses) => prevCourses.filter(c => (c._id || c.id) !== id));
    } catch (error) {
      console.error('Error:', error);
      toast.error("An error occurred");
    }
  }
  // const handleInput = (cname, cid) => {
  //   setName({
  //     course: cname, id: cid
  //   })
  //   // document.getElementsByName("course").values = cname;
  // }
  const handleInput = (cname, cid) => {
    setName({
      course: cname,
      id: cid
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(name);
    try {
      if (name.id) {
        // If id exists, it's an update operation
        const res = await axios.put(`${baseUrl}/courses/${name.id}`, { title: name.course }, { withCredentials: true });
        toast.success("Course updated successfully");
        setCourses(prevCourses => {
          const updatedCourses = prevCourses.map(course => {
            if ((course._id || course.id) === name.id) {
              return { ...course, title: name.course };
            }
            return course;
          });
          return updatedCourses;
        });
      } else {
        const res = await axios.post(`${baseUrl}/courses`, { title: name.course }, { withCredentials: true });
        toast.success("Course saved successfully");
        // Backend returns either the created course object or a wrapped payload.
        const createdCourse = res.data?.data || res.data;
        setCourses((prevCourses) => [...prevCourses, createdCourse]);
      }
      setName({ course: '', id: '' }); // Reset the input fields
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred');
    }
  };
 

  return (
    <div className="container-fluid">
<div className="col-lg-12">
        <div className="row">
          <div className="col-md-4">
            <form onSubmit={handleSubmit}>
              <div className="card">
                <div className="card-header">
                  Course Form
                </div>
                <div className="card-body">
                  <input type="hidden" name="id" />
                  <div className="form-group">
                    <label className="control-label">Course</label>
                    <input
                      type="text"
                      className="form-control"
                      name="course"
                      value={name.course} // Value should come from state
                      // onChange={(e) => setName({ course: e.target.value })}
                      onChange={(e) => setName({ ...name, course: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="card-footer">
                  <div className="row">
                    <div className="col-md-6">
                      <button
                        className="btn btn-sm btn-primary btn-block"
                        type="submit"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="col-md-8">
            <div className="card">
              <div className="card-header">
                <b>Course List</b>
              </div>
              <div className="card-body">
                <table className="table table-bordered table-hover">
                  <thead>
                    <tr>
                      <th className="text-center">#</th>
                      <th className="text-center">Course</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((c, index) => (
                      <tr  key={index}>
                        <td className="text-center">{index + 1}</td>
                        <td>{c.title || c.course || 'Untitled Course'}</td>
                        <td className="text-center">
                          <button
                            className="btn btn-sm btn-primary mr-2 edit_gallery"
                            type="button"
                            onClick={() => handleInput(c.title || c.course || '', c._id || c.id)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-danger delete_gallery"
                            type="button"
                            onClick={() => handleDelete(c._id || c.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminCourses;

