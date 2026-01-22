// import Project from "../models/Project.js";
// import cloudinary from "../config/cloudinary.js";

// /**
//  * Convert base64 data URI to Buffer
//  */
// const base64ToBuffer = (base64) => {
//   const matches = base64.match(/^data:(.+);base64,(.+)$/);
//   if (!matches) return null;
//   return Buffer.from(matches[2], "base64");
// };

// /**
//  * =====================================================
//  * CREATE PROJECT (ADMIN)
//  * POST /api/projects
//  * =====================================================
//  */
// export const addProject = async (req, res) => {
//   try {
//     const {
//       title,
//       category,
//       year,
//       location,
//       description,
//       images,
//     } = req.body;

//     /* ---------- VALIDATION ---------- */
//     if (
//       !title ||
//       !category ||
//       !year ||
//       !location ||
//       !description ||
//       !Array.isArray(images)
//     ) {
//       return res.status(400).json({
//         message: "All fields are required",
//       });
//     }

//     if (images.length < 1 || images.length > 5) {
//       return res.status(400).json({
//         message: "Minimum 1 and maximum 5 images allowed",
//       });
//     }

//     /* ---------- IMAGE UPLOAD ---------- */
//     const uploadedImages = [];

//     for (const img of images) {
//       if (!img.base64) {
//         return res.status(400).json({
//           message: "Invalid image format",
//         });
//       }

//       const buffer = base64ToBuffer(img.base64);
//       if (!buffer) {
//         return res.status(400).json({
//           message: "Invalid base64 image",
//         });
//       }

//       const uploadResult = await new Promise((resolve, reject) => {
//         const stream = cloudinary.uploader.upload_stream(
//           {
//             folder: "architecture_projects",
//             resource_type: "image",
//           },
//           (error, result) => {
//             if (error) reject(error);
//             else resolve(result);
//           }
//         );

//         stream.end(buffer);
//       });

//       uploadedImages.push({
//         url: uploadResult.secure_url,
//         caption: img.caption || "",
//       });
//     }

//     /* ---------- SAVE PROJECT ---------- */
//     const project = await Project.create({
//       title,
//       category,
//       year,
//       location,
//       description, // ✅ THIS WAS THE MISSING PART EARLIER
//       images: uploadedImages,
//       status: true,
//     });

//     return res.status(201).json({
//       message: "Project created successfully",
//       project,
//     });
//   } catch (error) {
//     console.error("ADD PROJECT ERROR 👉", error);
//     return res.status(500).json({
//       message: "Internal Server Error",
//     });
//   }
// };

// /**
//  * =====================================================
//  * GET ALL PROJECTS (ADMIN / CLIENT)
//  * GET /api/projects
//  * =====================================================
//  */
// export const getProjects = async (req, res) => {
//   try {
//     const projects = await Project.find({ status: true })
//       .sort({ createdAt: -1 });

//     // ❗ IMPORTANT: full project return (description included)
//     return res.status(200).json(projects);
//   } catch (error) {
//     console.error("GET PROJECTS ERROR 👉", error);
//     return res.status(500).json({
//       message: "Internal Server Error",
//     });
//   }
// };

// /**
//  * =====================================================
//  * GET SINGLE PROJECT
//  * GET /api/projects/:id
//  * =====================================================
//  */
// export const getProjectById = async (req, res) => {
//   try {
//     const project = await Project.findById(req.params.id);

//     if (!project) {
//       return res.status(404).json({
//         message: "Project not found",
//       });
//     }

//     return res.status(200).json(project);
//   } catch (error) {
//     console.error("GET PROJECT BY ID ERROR 👉", error);
//     return res.status(500).json({
//       message: "Internal Server Error",
//     });
//   }
// };

// /**
//  * =====================================================
//  * UPDATE PROJECT (ADMIN)
//  * PUT /api/projects/:id
//  * =====================================================
//  */
// export const updateProject = async (req, res) => {
//   try {
//     const { title, category, year, location, description } = req.body;

//     const project = await Project.findById(req.params.id);
//     if (!project) {
//       return res.status(404).json({
//         message: "Project not found",
//       });
//     }

//     project.title = title ?? project.title;
//     project.category = category ?? project.category;
//     project.year = year ?? project.year;
//     project.location = location ?? project.location;
//     project.description = description ?? project.description;

//     await project.save();

//     return res.status(200).json({
//       message: "Project updated successfully",
//       project,
//     });
//   } catch (error) {
//     console.error("UPDATE PROJECT ERROR 👉", error);
//     return res.status(500).json({
//       message: "Internal Server Error",
//     });
//   }
// };

// /**
//  * =====================================================
//  * DELETE PROJECT (ADMIN)
//  * DELETE /api/projects/:id
//  * =====================================================
//  */
// export const deleteProject = async (req, res) => {
//   try {
//     const project = await Project.findById(req.params.id);

//     if (!project) {
//       return res.status(404).json({
//         message: "Project not found",
//       });
//     }

//     /* ---------- DELETE CLOUDINARY IMAGES ---------- */
//     for (const img of project.images) {
//       const publicId = img.url.split("/").pop().split(".")[0];
//       await cloudinary.uploader.destroy(
//         `architecture_projects/${publicId}`
//       );
//     }

//     await project.deleteOne();

//     return res.status(200).json({
//       message: "Project deleted successfully",
//     });
//   } catch (error) {
//     console.error("DELETE PROJECT ERROR 👉", error);
//     return res.status(500).json({
//       message: "Internal Server Error",
//     });
//   }
// };













import Project from "../models/Project.js";
import cloudinary from "../config/cloudinary.js";

/* ================= HELPER ================= */
const base64ToBuffer = (base64) => {
  if (!base64) return null;

  const matches = base64.match(/^data:(.+);base64,(.+)$/);
  if (!matches) return null;

  return Buffer.from(matches[2], "base64");
};

/* =====================================================
   GET ALL PROJECTS
===================================================== */
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ status: true }).sort({
      createdAt: -1,
    });
    res.json(projects);
  } catch (error) {
    console.error("GET PROJECTS ERROR 👉", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =====================================================
   GET PROJECT BY ID
===================================================== */
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(project);
  } catch (error) {
    res.status(400).json({ message: "Invalid project ID" });
  }
};

/* =====================================================
   CREATE PROJECT
===================================================== */
export const addProject = async (req, res) => {
  try {
    const { title, category, year, location, description, images } =
      req.body;

    if (!title || !category || !year || !location || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ message: "At least one image required" });
    }

    const uploadedImages = [];

    for (const img of images) {
      const buffer = base64ToBuffer(img.base64);
      if (!buffer) continue;

      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "architecture_projects" },
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
        stream.end(buffer);
      });

      uploadedImages.push({
        url: uploadResult.secure_url,
        caption: img.caption || "",
      });
    }

    if (uploadedImages.length === 0) {
      return res.status(400).json({ message: "Image upload failed" });
    }

    const project = await Project.create({
      title,
      category,
      year,
      location,
      description,
      images: uploadedImages,
      status: true,
    });

    res.status(201).json(project);
  } catch (error) {
    console.error("ADD PROJECT ERROR 👉", error);
    res.status(500).json({ message: "Create project failed" });
  }
};

/* =====================================================
   UPDATE PROJECT (TEXT + IMAGES)
===================================================== */
export const updateProject = async (req, res) => {
  try {
    const { title, category, year, location, description, images } =
      req.body;

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    project.title = title ?? project.title;
    project.category = category ?? project.category;
    project.year = year ?? project.year;
    project.location = location ?? project.location;
    project.description = description ?? project.description;

    let updatedImages = [...project.images];

    if (Array.isArray(images)) {
      updatedImages = [];

      for (const img of images) {
        // keep existing image
        if (img.url) {
          updatedImages.push(img);
          continue;
        }

        // upload new image
        if (img.base64) {
          const buffer = base64ToBuffer(img.base64);
          if (!buffer) continue;

          const uploadResult = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { folder: "architecture_projects" },
              (err, result) => {
                if (err) reject(err);
                else resolve(result);
              }
            );
            stream.end(buffer);
          });

          updatedImages.push({
            url: uploadResult.secure_url,
            caption: img.caption || "",
          });
        }
      }
    }

    project.images = updatedImages;
    await project.save();

    res.json({ message: "Project updated successfully", project });
  } catch (error) {
    console.error("UPDATE PROJECT ERROR 👉", error);
    res.status(500).json({ message: "Update project failed" });
  }
};

/* =====================================================
   DELETE PROJECT
===================================================== */
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    for (const img of project.images) {
      if (!img.url) continue;

      const publicId = img.url.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(
        `architecture_projects/${publicId}`
      );
    }

    await project.deleteOne();

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("DELETE PROJECT ERROR 👉", error);
    res.status(500).json({ message: "Delete project failed" });
  }
};
