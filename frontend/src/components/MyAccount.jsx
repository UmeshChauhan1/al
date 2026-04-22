import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaPlus, FaStar, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { apiUrl, baseUrl, skillsUrl, studentUrl } from '../utils/globalurl';
import { useAuth } from '../AuthContext';
const MyAccount = () => {
    const { isAlumnus, isStudent } = useAuth();
    const [acc, setAcc] = useState({
        name: '',
        connected_to: "",
        course_id: "",
        email: "",
        gender: "",
        password: "",
        batch: "",
        enrollment_year: "",
        current_year: "",
        roll_number: "",
    });
    const [file, setFile] = useState(null);
    const [courses, setCourses] = useState([]);
    const [skills, setSkills] = useState([]);
    const [newSkill, setNewSkill] = useState('');
    const [skillEndorsements, setSkillEndorsements] = useState({});
    const [loadingSkills, setLoadingSkills] = useState(false);

    useEffect(() => {
        const userId = localStorage.getItem("user_id") || localStorage.getItem("alumnus_id");
        const fetchData = async () => {
            try {
                const coursePromise = axios.get(`${apiUrl}/api/courses`);
                const profilePromise = isStudent
                    ? axios.get(`${studentUrl}/profile`, { withCredentials: true })
                    : axios.get(`${baseUrl}/alumni/${userId}`, { withCredentials: true });

                const [profileRes, coursesRes] = await Promise.all([profilePromise, coursePromise]);

                const data = profileRes.data;
                if (data) {
                    if (isStudent) {
                        setAcc({
                            name: data.name || '',
                            email: data.email || '',
                            gender: data.student_bio?.gender || '',
                            enrollment_year: data.student_bio?.enrollment_year || '',
                            current_year: data.student_bio?.current_year || '',
                            course_id: data.student_bio?.course?._id || data.student_bio?.course || '',
                            roll_number: data.student_bio?.roll_number || '',
                            connected_to: '',
                            batch: '',
                            password: ''
                        });
                        setSkills([]);
                    } else {
                        setAcc({
                            name: data.name || '',
                            email: data.email || '',
                            gender: data.alumnus_bio?.gender || '',
                            batch: data.alumnus_bio?.batch || '',
                            course_id: data.alumnus_bio?.course?._id || data.alumnus_bio?.course || '',
                            connected_to: data.alumnus_bio?.connected_to || '',
                            enrollment_year: '',
                            current_year: '',
                            roll_number: '',
                            password: ''
                        });
                        setSkills(data.alumnus_bio?.skills || []);
                    }
                }

                const courseList = Array.isArray(coursesRes.data)
                    ? coursesRes.data
                    : (coursesRes.data?.data || []);
                setCourses(courseList);

            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error("Failed to load account data");
            }
};
        fetchData();
    }, [isStudent]);

    // Fetch skill endorsements when skills change
    useEffect(() => {
        const fetchEndorsements = async () => {
            const alumnus_id = localStorage.getItem("alumnus_id");
            if (!alumnus_id || skills.length === 0) return;
            
            try {
                setLoadingSkills(true);
                const response = await axios.get(`${skillsUrl}/endorsements/${alumnus_id}`, { withCredentials: true });
                const endorsementMap = {};
                response.data.forEach(item => {
                    endorsementMap[item.skill.toLowerCase()] = item;
                });
                setSkillEndorsements(endorsementMap);
            } catch (error) {
                console.error('Error fetching endorsements:', error);
            } finally {
                setLoadingSkills(false);
            }
        };
        
        fetchEndorsements();
    }, [skills]);

    const handleChange = (e) => {
        setAcc({ ...acc, [e.target.name]: e.target.value });
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const alumnus_id = localStorage.getItem("alumnus_id");
        const user_id = localStorage.getItem("user_id");
        const pswrd = (acc.password || '').trim();

        try {
            let response;

            if (isStudent) {
                const formData = new FormData();
                if (file) formData.append('avatar', file);
                formData.append('name', acc.name);
                formData.append('email', acc.email);
                if (pswrd) {
                    formData.append('password', pswrd);
                }
                formData.append('student_bio', JSON.stringify({
                    gender: acc.gender,
                    enrollment_year: Number(acc.enrollment_year),
                    current_year: Number(acc.current_year),
                    course: acc.course_id,
                    roll_number: acc.roll_number
                }));

                response = await axios.put(`${studentUrl}/profile`, formData, { withCredentials: true });
            } else {
                const formData = new FormData();
                if (file) formData.append('avatar', file);
                formData.append('name', acc.name);
                formData.append('connected_to', acc.connected_to);
                formData.append('course_id', acc.course_id);
                formData.append('email', acc.email);
                formData.append('gender', acc.gender);
                if (pswrd) {
                    formData.append('password', pswrd);
                }
                formData.append('batch', acc.batch);
                formData.append('alumnus_id', alumnus_id);
                formData.append('user_id', user_id);

                response = await axios.put(`${baseUrl}/alumni/account`, formData, { withCredentials: true });
            }

            toast.success(response.data?.message || 'Account updated successfully');
            setFile(null);
            setAcc((prev) => ({ ...prev, password: '' }));
} catch (error) {
            toast.error('An error occurred while updating account');
            console.error('Error:', error);
        }
    };

    const handleAddSkill = async (e) => {
        e.preventDefault();
        if (!newSkill.trim()) return;
        
        try {
            const response = await axios.post(`${skillsUrl}/user`, 
                { skill: newSkill.trim() },
                { withCredentials: true }
            );
            setSkills([...skills, newSkill.trim()]);
            setNewSkill('');
            toast.success(response.data.message);
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to add skill');
            console.error('Error adding skill:', error);
        }
    };

    const handleRemoveSkill = async (skillToRemove) => {
        try {
            const response = await axios.delete(`${skillsUrl}/user`, 
                { 
                    data: { skill: skillToRemove },
                    withCredentials: true 
                }
            );
            setSkills(skills.filter(s => s.toLowerCase() !== skillToRemove.toLowerCase()));
            toast.success(response.data.message);
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to remove skill');
            console.error('Error removing skill:', error);
        }
    };

    return (
        <>
<header className="masthead">
                <div className="container-fluid h-100">
                    <div className="row h-100 align-items-center justify-content-center text-center">
                        <div className="col-lg-8 align-self-end mb-4 page-title">
                            <h3 className="text-white">Manage Account</h3>
                            <FaStar className='text-white ' />
                            <hr className="divider my-4" />
                        </div>
                    </div>
                </div>
            </header>
            <section className="page-section bg-dark text-white mb-0" id="about">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <form onSubmit={handleSubmit} className="form-horizontal">
                                <div className="form-group row">
                                    <label className="col-sm-2 col-form-label">Name</label>
                                    <div className="col-sm-10">
                                        <input 
                                            type="text"
                                            className="form-control"
                                            name="name"
                                            placeholder="Enter your name"
                                            required
                                            value={acc?.name || ''}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <label className="col-sm-2 col-form-label">Gender</label>
                                    <div className="col-sm-4">
                                        <select
                                            className="form-control"
                                            name="gender"
                                            required
                                            value={acc?.gender || ''}
                                            onChange={handleChange}
                                        >
                                            <option disabled value="">Select gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                        </select>
                                    </div>

                    <label className="col-sm-2 col-form-label">{isStudent ? 'Enrollment Year' : 'Batch'}</label>
                    <div className="col-sm-4">
                        <input
                            type="number"
                            className="form-control"
                            name={isStudent ? 'enrollment_year' : 'batch'}
                            required
                            value={isStudent ? (acc?.enrollment_year || '') : (acc?.batch || '')}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                                {isStudent && (
                                    <div className="form-group row">
                                        <label className="col-sm-2 col-form-label">Current Year</label>
                                        <div className="col-sm-10">
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="current_year"
                                                min="1"
                                                max="6"
                                                required
                                                value={acc?.current_year || ''}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="form-group row">
                                    <label className="col-sm-2 col-form-label">{isStudent ? 'Course' : 'Course Graduated'}</label>
                                    <div className="col-sm-10">
                                        <select
                                            className="form-control select2"
                                            name="course_id"
                                            required
                                            value={acc?.course_id || ''}
                                            onChange={handleChange}
                                        >
                                            <option disabled value="">Select course</option>
                                            {courses.map(c => (
                                                <option key={c._id || c.id} value={c._id || c.id}>{c.title || c.course}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {isStudent && (
                                    <div className="form-group row">
                                        <label className="col-sm-2 col-form-label">Roll Number</label>
                                        <div className="col-sm-10">
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="roll_number"
                                                placeholder="Enter your roll number"
                                                value={acc?.roll_number || ''}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                )}

                                {isAlumnus && <div className="form-group row">
                                    <label className="col-sm-2 col-form-label">Currently Connected To</label>
                                    <div className="col-sm-10">
                                        <textarea
                                            name="connected_to"
                                            className="form-control"
                                            rows="3"
                                            placeholder="Enter your current connection"
                                            value={acc?.connected_to || ''}
                                            onChange={handleChange}
                                        ></textarea>
                                    </div>
                                </div>}

                                { isAlumnus && <div className="form-group row">
                                    <label htmlFor="avatar" className="col-sm-2 col-form-label">Image</label>
                                    <div className="col-sm-10">
                                        <input
                                            type="file"
                                            className="form-control-file"
                                            name="avatar"
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                </div>}

                                <div className="form-group row">
                                    <label className="col-sm-2 col-form-label">Email</label>
                                    <div className="col-sm-10">
                                        <input
                                            type="email"
                                            className="form-control"
                                            name="email"
                                            required
                                            value={acc?.email || ''}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <label className="col-sm-2 col-form-label">Password</label>
                                    <div className="col-sm-10">
                                        <input
                                            id="pswrd"
                                            type="password"
                                            className="form-control"
                                            name="password"
                                            placeholder="Enter your password"
                                            value={acc?.password || ''}
                                            onChange={handleChange}
                                        />
                                        <small className="form-text text-info fst-italic">
                                            Leave blank if you don't want to change your password
                                        </small>
                                    </div>
                                </div>

<div className="form-group row">
                                    <div className="col-sm-12 text-center">
                                        <button type="submit" className="btn btn-secondary">Update Account</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Skills Section */}
            {isAlumnus && (
                <section className="page-section bg-light text-dark mb-0">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-lg-8">
                                <h3 className="text-center mb-4">Skills & Endorsements</h3>
                                
                                {/* Add New Skill Form */}
                                <form onSubmit={handleAddSkill} className="mb-4">
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Add a new skill..."
                                            value={newSkill}
                                            onChange={(e) => setNewSkill(e.target.value)}
                                        />
                                        <button type="submit" className="btn btn-primary">
                                            <FaPlus className="mr-1" /> Add Skill
                                        </button>
                                    </div>
                                </form>

                                {/* Skills List */}
                                {loadingSkills ? (
                                    <div className="text-center py-3">
                                        <span className="spinner-border spinner-border-sm mr-2"></span> Loading endorsements...
                                    </div>
                                ) : (
                                    <div className="skills-list">
                                        {skills.length > 0 ? (
                                            skills.map((skill, index) => {
                                                const endorsement = skillEndorsements[skill.toLowerCase()] || {};
                                                return (
                                                    <div key={index} className="card mb-2 skill-card">
                                                        <div className="card-body d-flex justify-content-between align-items-center">
                                                            <div>
                                                                <h6 className="mb-1">{skill}</h6>
                                                                <small className="text-muted">
                                                                    {endorsement.count || 0} endorsement{endorsement.count !== 1 ? 's' : ''}
                                                                </small>
                                                                {endorsement.count > 0 && endorsement.endorsers && (
                                                                    <div className="mt-1">
                                                                        <small className="text-info">
                                                                            Endorsed by: {endorsement.endorsers.slice(0, 3).map(e => e.name).join(', ')}
                                                                            {endorsement.count > 3 && ` +${endorsement.count - 3} more`}
                                                                        </small>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={() => handleRemoveSkill(skill)}
                                                            >
                                                                <FaTimes />
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="text-center py-4 text-muted">
                                                <p>No skills added yet. Add your skills above to get endorsed by other alumni!</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}

export default MyAccount;

