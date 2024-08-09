import React, { useState, useEffect, useRef } from "react";
import { db, storage } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  query,
  where,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";



const ManageProjects = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [filterType, setFilterType] = useState("");
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    images: [],
    videos: [],
    type: "",
    date: "",
  });
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState([""]);
  const [videoFiles, setVideoFiles] = useState([]);
  const [videoUrls, setVideoUrls] = useState([""]);
  const projectTypes = [
    "การประกวดแข่งขัน",
    "งานวิจัยและการตีพิมพ์",
    "วิทยาการและผู้ทรงคุณวุฒิ",
    "รางวัลเชิดชูเกียรติ",
    "การพัฒนาตนเอง",
  ];

  

  const videoRef = useRef(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (filterType) {
      setFilteredProjects(
        projects.filter((project) => project.type === filterType)
      );
    } else {
      setFilteredProjects(projects);
    }
  }, [filterType, projects]);

  const fetchProjects = async () => {
    try {
      const projectsCollection = await getDocs(collection(db, "projects"));
      setProjects(
        projectsCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleImageUpload = async (files) => {
    const uploadedImageUrls = await Promise.all(
      files.map(async (file) => {
        const storageRef = ref(storage, `project-images/${file.name}`);
        await uploadBytes(storageRef, file);
        return await getDownloadURL(storageRef);
      })
    );
    return uploadedImageUrls;
  };

  const handleVideoUpload = async (files) => {
    const uploadedVideoUrls = await Promise.all(
      files.map(async (file) => {
        const storageRef = ref(storage, `project-videos/${file.name}`);
        await uploadBytes(storageRef, file);
        return await getDownloadURL(storageRef);
      })
    );
    return uploadedVideoUrls;
  };
  

  const extractThumbnailFromVideo = async (videoUrl) => {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.src = videoUrl;
      video.crossOrigin = "anonymous";
      video.onloadeddata = () => {
        video.currentTime = 2;
      };
      video.onseeked = () => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          resolve(url);
        });
      };
    });
  };

  const handleAddOrUpdateProject = async (e) => {
    e.preventDefault();
    try {
      let uploadedImageUrls = [];
      let allVideos = [];

      if (imageFiles.length > 0) {
        uploadedImageUrls = await handleImageUpload(imageFiles);
      }

      if (videoFiles.length > 0) {
        const uploadedVideoUrls = await handleVideoUpload(videoFiles);
        allVideos = uploadedVideoUrls;
        const thumbnail = await extractThumbnailFromVideo(uploadedVideoUrls[0]);
        uploadedImageUrls.push(thumbnail); // Use thumbnail as image if no image uploaded
      }

      const allImages = [
        ...uploadedImageUrls,
        ...imageUrls.filter((url) => url.trim()),
      ];
      allVideos = [...allVideos, ...videoUrls.filter((url) => url.trim())];

      if (editingProjectId) {
        const projectDoc = doc(db, "projects", editingProjectId);
        const projectSnapshot = await getDoc(projectDoc);

        if (projectSnapshot.exists()) {
          await updateDoc(projectDoc, {
            ...newProject,
            images: allImages,
            videos: allVideos,
          });
          console.log("Updated project:", editingProjectId);
        } else {
          console.error("No document to update:", editingProjectId);
        }
      } else {
        await addDoc(collection(db, "projects"), {
          ...newProject,
          images: allImages,
          videos: allVideos,
        });
        console.log("Added new project");
      }

      setNewProject({
        title: "",
        description: "",
        images: [],
        videos: [],
        type: "",
        date: "",
      });
      setImageFiles([]);
      setImageUrls([""]);
      setVideoFiles([]);
      setVideoUrls([""]);
      setEditingProjectId(null);
      fetchProjects();
    } catch (error) {
      console.error("Error adding/updating project:", error);
    }
  };

  const handleEditProject = (project) => {
    setNewProject({
      title: project.title,
      description: project.description,
      images: project.images,
      videos: project.videos,
      type: project.type,
      date: project.date,
    });
    setEditingProjectId(project.id);
    setImageUrls(project.images || [""]);
    setVideoUrls(project.videos || [""]);
  };

  const handleDeleteProject = async (id) => {
    try {
      const projectDoc = doc(db, "projects", id);
      const projectSnapshot = await getDoc(projectDoc);

      if (projectSnapshot.exists()) {
        await deleteDoc(projectDoc);
        console.log("Successfully deleted project:", id);
        fetchProjects(); // Refresh the list of projects after deletion
      } else {
        console.error("No project found with ID:", id);
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const handleDeleteProjectByField = async (fieldValue) => {
    try {
      console.log(
        "Attempting to delete project with custom field value:",
        fieldValue
      );

      const q = query(
        collection(db, "projects"),
        where("customFieldName", "==", fieldValue)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        querySnapshot.forEach(async (docSnapshot) => {
          await deleteDoc(docSnapshot.ref);
          console.log(
            "Successfully deleted project with custom field value:",
            fieldValue
          );
        });
        fetchProjects(); // Refresh the list of projects after deletion
      } else {
        console.error("No project found with custom field value:", fieldValue);
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const handleAddImageUrlField = () => {
    setImageUrls([...imageUrls, ""]); // Add a new empty URL field
  };

  const handleImageUrlChange = (index, value) => {
    const newImageUrls = [...imageUrls];
    newImageUrls[index] = value;
    setImageUrls(newImageUrls);
  };

  const handleAddVideoUrlField = () => {
    setVideoUrls([...videoUrls, ""]); // Add a new empty URL field for video
  };

  const handleVideoUrlChange = (index, value) => {
    const newVideoUrls = [...videoUrls];
    newVideoUrls[index] = value;
    setVideoUrls(newVideoUrls);
  };

  const ProjectImageSlider = ({ images }) => {
    if (images.length === 1) {
      return (
        <div className="relative">
          <img
            src={images[0]}
            alt={`Slide`}
            className="w-full h-40 sm:h-48 lg:h-56 object-cover rounded-lg mb-4 shadow-inner"
          />
        </div>
      );
    } else if (images.length > 1) {
      const settings = {
        
        infinite: true,
        speed: 100,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
      };
  
      return (
        <Slider {...settings} className="rounded-lg shadow-lg mb-4">
          {images.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={image}
                alt={`Slide ${index}`}
                className="w-full h-40 sm:h-48 lg:h-56 object-cover rounded-l "
              />
            </div>
          ))}
        </Slider>
      );
    } else {
      return null; // ไม่มีรูปภาพไม่ต้องแสดงอะไร
    }
  };
  


  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
        Manage Projects
      </h1>
      <Link to="/dashboard">
        <button className="btn btn-primary mb-6">Back to Dashboard</button>
      </Link>

      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">
          {editingProjectId ? "Edit Project" : "Add New Project"}
        </h2>
        <form onSubmit={handleAddOrUpdateProject} className="space-y-4">
          <input
            type="text"
            value={newProject.title}
            onChange={(e) =>
              setNewProject({ ...newProject, title: e.target.value })
            }
            placeholder="Title"
            className="input input-bordered w-full"
            required
          />
          <textarea
            value={newProject.description}
            onChange={(e) =>
              setNewProject({ ...newProject, description: e.target.value })
            }
            placeholder="Description"
            className="textarea textarea-bordered w-full"
            required
          />
          <input
            type="file"
            multiple
            onChange={(e) => setImageFiles(Array.from(e.target.files))}
            className="input input-bordered w-full"
          />
          {imageUrls.map((url, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={url}
                onChange={(e) => handleImageUrlChange(index, e.target.value)}
                placeholder="Image URL"
                className="input input-bordered w-full"
              />
              {index === imageUrls.length - 1 && (
                <button
                  type="button"
                  onClick={handleAddImageUrlField}
                  className="btn btn-secondary"
                >
                  Add URL
                </button>
              )}
            </div>
          ))}
          <input
            type="file"
            multiple
            onChange={(e) => setVideoFiles(Array.from(e.target.files))}
            className="input input-bordered w-full"
            accept="video/*"
          />
          {videoUrls.map((url, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={url}
                onChange={(e) => handleVideoUrlChange(index, e.target.value)}
                placeholder="Video URL"
                className="input input-bordered w-full"
              />
              {index === videoUrls.length - 1 && (
                <button
                  type="button"
                  onClick={handleAddVideoUrlField}
                  className="btn btn-secondary"
                >
                  Add Video URL
                </button>
              )}
            </div>
          ))}
          <select
            value={newProject.type}
            onChange={(e) =>
              setNewProject({ ...newProject, type: e.target.value })
            }
            className="input input-bordered w-full"
            required
          >
            <option value="" disabled>
              Select Type
            </option>
            {projectTypes.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={newProject.date}
            onChange={(e) =>
              setNewProject({ ...newProject, date: e.target.value })
            }
            className="input input-bordered w-full"
            required
          />
          <button type="submit" className="btn btn-primary w-full">
            {editingProjectId ? "Update Project" : "Add Project"}
          </button>
        </form>
      </div>
      {/* Filter Section */}
      <div className="mb-6">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="input input-bordered w-full"
        >
          <option value="">All Types</option>
          {projectTypes.map((type, index) => (
            <option key={index} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-4 sm:p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:scale-105"
          >
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 truncate">
              {project.title}
            </h3>
            <p className="text-gray-700 mb-4 line-clamp-2">
              {project.description}
            </p>

            <ProjectImageSlider images={project.images} />

            {project.videos &&
              project.videos.map((video, index) => (
                <video
                  key={`${project.id}-${index}`}
                  controls
                  className="w-full h-40 sm:h-48 lg:h-56 rounded-lg mb-4"
                >
                  <source src={video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ))}

            <div className="flex justify-between items-center mt-auto border-t pt-4">
              <div>
                <p className="text-xs sm:text-sm font-medium text-primary mb-1">
                  {project.type}
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  {project.date}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditProject(project)}
                  className="btn btn-secondary px-4 py-2 text-xs sm:text-sm rounded-md transition duration-300 ease-in-out hover:bg-secondary-dark hover:shadow-md"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteProject(project.id)}
                  className="btn btn-danger px-4 py-2 text-xs sm:text-sm rounded-md transition duration-300 ease-in-out hover:bg-red-600 hover:shadow-md"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ManageProjects;
