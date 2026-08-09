import User from "../Models/User.js";


// ================= GET ALL USERS =================
export const getAllUsers = async (req, res) => {
  try {

    const users = await User.find().select("-password").lean();

    res.json({
      success: true,
      count: users.length,
      users
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ================= GET USER BY ID =================
export const getUserById = async (req, res) => {
  try {

    const user = await User.findById(req.params.id)
      .select("-password")
      .lean();

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json({
      success: true,
      user
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ================= UPDATE USER =================
export const updateUser = async (req, res) => {
  try {

    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json({
      success: true,
      user
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ================= DELETE USER =================
export const deleteUser = async (req, res) => {
  try {

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json({
      success: true,
      message: "User deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const updateProfile = async (req, res) => {
  try {

    const user = await User.findByIdAndUpdate(
      req.body._id,   // get id from body
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json({
      success: true,
      user
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= USER UPLOAD DOCUMENT =================
export const uploadUserDocument = async (req, res) => {
  try {
    const { userId, type, fileUrl } = req.body;

    // allowed types
    const allowedTypes = [
      "idDocument",
      "jobReference",
      "bankStatement",
      "nextOfKin",
      "landlordReference",
      "niNumber"
    ];

    if (!allowedTypes.includes(type)) {
      return res.status(400).json({
        message: "Invalid document type"
      });
    }

    const user = await User.findById(userId).select("documents");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const doc = user.documents[type];

    // ❌ block if already approved
    if (doc.status === "approved") {
      return res.status(400).json({
        message: "Document already approved, cannot re-upload"
      });
    }

    // ✅ upload / re-upload
    user.documents[type].fileUrl = fileUrl;
    user.documents[type].status = "pending";

    await user.save();

    res.json({
      success: true,
      message: "Document uploaded successfully",
      documents: user.documents
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= ADMIN: UPDATE DOCUMENT STATUS =================
export const updateDocumentStatus = async (req, res) => {
  try {
    const { userId, type, status } = req.body;

    const allowedTypes = [
      "idDocument",
      "jobReference",
      "bankStatement",
      "nextOfKin",
      "landlordReference",
      "niNumber"
    ];

    const allowedStatus = ["approved", "rejected", "pending"];

    // ❌ Validate type
    if (!allowedTypes.includes(type)) {
      return res.status(400).json({
        message: "Invalid document type"
      });
    }

    // ❌ Validate status
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid status"
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // ❌ No file uploaded
    if (!user.documents[type].fileUrl) {
      return res.status(400).json({
        message: "No document uploaded"
      });
    }

    // ✅ Update status
    user.documents[type].status = status;

    await user.save();

    res.json({
      success: true,
      message: `Document ${status} successfully`,
      documents: user.documents
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};