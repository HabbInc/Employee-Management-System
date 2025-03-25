import ProjectModel from "../models/projectModel.js";

export const createProject = async (req, res) => {
  try {
    const {
      projectTitle,
      department,
      projectPriority,
      clientName,
      price,
      startDate,
      deadline,
      assignedEmployees,
      workStatus,
      progress,
      description,
    } = req.body;

    // Convert assignedEmployees into an array of objects
    let employeesArray = [];
    if (assignedEmployees) {
      try {
        employeesArray = JSON.parse(assignedEmployees).map((emp) => ({
          employeeId: emp,
        }));
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid assignedEmployees format",
        });
      }
    }

    // Handle image upload
    const image = req.file ? req.file.path : null;

    // Validate required fields
    if (
      !projectTitle ||
      !department ||
      !projectPriority ||
      !clientName ||
      !price ||
      !startDate ||
      !deadline
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const project = new ProjectModel({
      projectTitle,
      department,
      projectPriority,
      clientName,
      price,
      startDate,
      deadline,
      assignedEmployees: employeesArray,
      workStatus,
      progress,
      description,
      image,
    });

    await project.save();
    res.status(201).json({
      success: true,
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//admin get all projects
export const getAllProjects = async (req, res) => {
  try {
    // Fetch projects and populate the assignedEmployees with employee names
    const projects = await ProjectModel.find()
      .populate('assignedEmployees.employeeId', 'name') // Populate employeeId with the 'name' field
      .exec();

    if (!projects || projects.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No projects found" });
    }

    // Optionally, format the projects data to include employeeName
    const formattedProjects = projects.map(project => {
      const assignedEmployees = project.assignedEmployees.map(employee => ({
        ...employee._doc, // Retaining the original employee data
        employeeName: employee.employeeId ? employee.employeeId.name : 'N/A', // Add employee name
      }));

      return {
        ...project._doc, // Project details
        assignedEmployees, // Updated assigned employees with name
      };
    });

    res.status(200).json({ success: true, projects: formattedProjects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//admin update project
export const updateProject = async (req, res) => {
    try {
      console.log("Updating project with ID:", req.params.id);
      console.log("Update request body:", req.body);
  
      const {
        projectTitle,
        department,
        projectPriority,
        clientName,
        price,
        startDate,
        deadline,
        assignedEmployees,
        workStatus,
        progress,
        description,
      } = req.body;
  
      let employeesArray = [];
      if (assignedEmployees) {
        try {
          employeesArray = Array.isArray(assignedEmployees)
            ? assignedEmployees
            : JSON.parse(assignedEmployees).map((emp) => ({
                employeeId: emp,
              }));
        } catch (error) {
          return res
            .status(400)
            .json({ success: false, message: "Invalid assignedEmployees format" });
        }
      }
  
      const updateData = {
        ...(projectTitle && { projectTitle }),
        ...(department && { department }),
        ...(projectPriority && { projectPriority }),
        ...(clientName && { clientName }),
        ...(price && { price }),
        ...(startDate && { startDate }),
        ...(deadline && { deadline }),
        ...(assignedEmployees && { assignedEmployees: employeesArray }),
        ...(workStatus && { workStatus }),
        ...(progress && { progress }),
        ...(description && { description }),
        ...(req.file && { image: req.file.path }),
      };
  
      const project = await ProjectModel.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );
  
      if (!project) {
        return res.status(404).json({ success: false, message: "Project not found" });
      }
  
      res.status(200).json({ success: true, message: "Project updated successfully", project });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  //admin delete project
  export const deleteProject = async (req, res) => {
    try {
        const project = await ProjectModel.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    res.status(200).json({ success: true, message: "Project deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
  }
  


  //employee view all projects
  export const viewAssignedProjects = async (req, res) => {
    try {
        const employeeId = req.userId;
        const projects = await ProjectModel.find({ "assignedEmployees.employeeId": employeeId });  // Add `await` here

        res.status(200).json({ success: true, projects });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateProjectProgress = async (req, res) => {
    try {
        const { id } = req.params;
        const { progress } = req.body;

        if (progress < 0 || progress > 100) {
            return res.status(400).json({ success: false, message: "Progress must be between 0 and 100" });
        }

        const project = await ProjectModel.findById(id);
        if (!project) return res.status(404).json({ success: false, message: "Project not found" });

        project.progress = progress;
        project.workStatus = progress === 100 ? "Completed" : "In Progress";
        await project.save();

        res.status(200).json({ success: true, message: "Project progress updated successfully", project });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};