import Maintenance from "../Models/Maintenance.js";
import Staff from "../Models/Staff.js";
import { sendEmail } from "../utils/sendEmail.js";
// import { sendWhatsApp } from "../utils/sendWhatsApp.js";

const STAFF_CC = [
  "londonroomsrent2@gmail.com",
  // "Saima@roomflog.co.uk",
  // "Saba@roomflog.co.uk",
  // "Imran.shafique7861978@gmail.com"
];


// ================= CREATE MAINTENANCE =================
export const createMaintenance = async (req, res) => {
  try {
    // ✅ FIX: ensure photos are strings (avoid mongoose error)
    const cleanedPhotos = (req.body.photos || []).map((p) =>
      typeof p === "string" ? p : p.url
    );

    const payload = {
      ...req.body,
      photos: cleanedPhotos,
    };

    // ✅ Save to DB
    const maintenance = await Maintenance.create(payload);

    // ✅ SEND RESPONSE IMMEDIATELY (FAST ⚡)
    res.status(201).json({
      success: true,
      message: "Maintenance request submitted",
      maintenance,
    });

    // ✅ BACKGROUND EMAIL (NON-BLOCKING)
    setImmediate(async () => {
      try {
        const html = `
    <div style="font-family:Arial;background:#f5f5f5;padding:40px">

      <div style="max-width:800px;margin:auto;background:white;border-radius:10px;overflow:hidden">

        <div style="background:#F47C3C;padding:5px;text-align:center;color:white">
          <h1>Maintenance Request Received</h1>
        </div>

        <div style="padding:30px">

          <p>Hello ${maintenance.firstName || "Tenant"},</p>

          <p>Your maintenance request has been successfully received. Below are the full details:</p>

          <hr/>

          <h3 style="color:#F47C3C">🛠️ Issue Details</h3>
          <p><strong>Category:</strong> ${maintenance.category || "-"}</p>
          <p><strong>Priority:</strong> ${maintenance.priority}</p>
          <p><strong>Description:</strong> ${maintenance.description || "-"}</p>
          <p><strong>Issue Started:</strong> ${
            maintenance.issueStarted
              ? new Date(maintenance.issueStarted).toLocaleDateString()
              : "-"
          }</p>
          <p><strong>Status:</strong> ${maintenance.status}</p>

          <hr/>

          <h3 style="color:#F47C3C">👤 Tenant Information</h3>
          <p><strong>Name:</strong> ${maintenance.firstName || "-"} ${maintenance.lastName || ""}</p>
          <p><strong>Email:</strong> ${maintenance.email || "-"}</p>
          <p><strong>Phone:</strong> ${maintenance.phone || "-"}</p>
          <p><strong>Address:</strong> ${maintenance.address || "-"}</p>

          <hr/>

          <h3 style="color:#F47C3C">📅 Access & Availability</h3>
          <p><strong>Preferred Contact Time:</strong> ${maintenance.contactTime || "-"}</p>
          <p><strong>Access Instructions:</strong> ${maintenance.access || "-"}</p>

          <hr/>

          <h3 style="color:#F47C3C">📷 Attachments</h3>
          ${
            maintenance.photos && maintenance.photos.length > 0
              ? maintenance.photos
                  .map(
                    (photo) =>
                      `<p><a href="${photo}" target="_blank">View Photo</a></p>`
                  )
                  .join("")
              : "<p>No photos provided</p>"
          }

          <hr/>

          <p>Our maintenance team will review your request and contact you shortly.</p>

          <p style="margin-top:30px">
            Regards,<br/>
            <strong>LONDONROOMSRENT</strong>
          </p>

        </div>

      </div>

    </div>
    `;

        if (maintenance.email) {
          await sendEmail(
            maintenance.email,
            "Maintenance Request Received",
            html,
            STAFF_CC
          );
        }

      } catch (err) {
        console.error("❌ Email failed:", err.message);
      }
    });

  } catch (error) {
    console.error("❌ Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};



// ================= GET ALL =================
export const getAllMaintenance = async (req, res) => {
  try {

    const maintenance = await Maintenance
      .find()
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      maintenance
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ================= GET SINGLE =================
export const getMaintenanceById = async (req, res) => {
  try {

    const maintenance = await Maintenance.findById(req.params.id);

    if (!maintenance) {
      return res.status(404).json({
        message: "Maintenance request not found"
      });
    }

    res.json({
      success: true,
      maintenance
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ================= UPDATE =================
// Function to generate HTML email dynamically
const createMaintenanceEmailHtml = (maintenance, recipient = "tenant") => {
  const isTenant = recipient === "tenant";
  const headerBg = isTenant ? "#4CAF50" : "#FF9800";
  const headerTitle = isTenant ? "Issue Resolved" : "Maintenance Task Completed";
  const headerSubtitle = isTenant
    ? "Your maintenance request has been completed successfully"
    : "A maintenance task has been completed by staff";

  return `
    <div style="font-family:Arial;padding:10px">
      <div style="max-width:800px;margin:auto;background:white;border-radius:12px;overflow:hidden">
        <!-- HEADER -->
        <div style="background:${headerBg};padding:25px;text-align:center;color:white">
          <h1 style="margin:0;">${headerTitle}</h1>
          <p style="margin:5px 0 0;font-size:14px;">${headerSubtitle}</p>
        </div>

        <div style="padding:30px;color:#333">
          <h2>Hello ${isTenant ? maintenance.firstName || "Tenant" : "Admin"},</h2>

          <p>
            We’re pleased to inform you that the maintenance issue has now been 
            <strong>fully resolved</strong> by our team.
          </p>

          <p>Below are the full details of the request:</p>
          <hr/>

          <!-- ISSUE DETAILS -->
          <h3 style="color:#4CAF50">🛠️ Issue Summary</h3>
          <p><strong>Category:</strong> ${maintenance.category || "-"}</p>
          <p><strong>Priority:</strong> ${maintenance.priority}</p>
          <p><strong>Description:</strong> ${maintenance.description || "-"}</p>
          <p><strong>Issue Started:</strong> ${
            maintenance.issueStarted
              ? new Date(maintenance.issueStarted).toLocaleDateString()
              : "-"
          }</p>
          <p><strong>Status:</strong> ${maintenance.status}</p>

          <hr/>

          <!-- TIMELINE -->
          <h3 style="color:#4CAF50">📅 Timeline</h3>
          <p><strong>Request Created:</strong> ${
            maintenance.createdAt
              ? new Date(maintenance.createdAt).toLocaleDateString()
              : "-"
          }</p>
          <p><strong>Completed On:</strong> ${new Date().toLocaleDateString()}</p>

          <hr/>

          <!-- TENANT INFO -->
          <h3 style="color:#4CAF50">👤 Tenant Information</h3>
          <p><strong>Name:</strong> ${maintenance.firstName || "-"} ${maintenance.lastName || ""}</p>
          <p><strong>Email:</strong> ${maintenance.email || "-"}</p>
          <p><strong>Phone:</strong> ${maintenance.phone || "-"}</p>
          <p><strong>Address:</strong> ${maintenance.address || "-"}</p>

          <hr/>

          <!-- ACCESS -->
          <h3 style="color:#4CAF50">🔑 Access & Availability</h3>
          <p><strong>Preferred Contact Time:</strong> ${maintenance.contactTime || "-"}</p>
          <p><strong>Access Instructions:</strong> ${maintenance.access || "-"}</p>

          <hr/>

          <!-- PHOTOS -->
          <h3 style="color:#4CAF50">📷 Attachments</h3>
          ${
            maintenance.photos && maintenance.photos.length > 0
              ? maintenance.photos
                  .map(
                    (photo) =>
                      `<p><a href="${photo}" target="_blank" style="color:#4CAF50;">View Photo</a></p>`
                  )
                  .join("")
              : "<p>No photos provided</p>"
          }

          <hr/>

          <!-- FOOTER MESSAGE -->
          <p>If you are still experiencing any issues or need further assistance, please contact our support team.</p>

          <p style="margin-top:25px">Thank you for your patience and cooperation.</p>
          <p style="margin-top:20px">Regards,<br/><strong>LONDONROOMSRENT Team</strong></p>
        </div>
      </div>
    </div>
  `;
};

export const updateMaintenance = async (req, res) => {
  try {
    const maintenance = await Maintenance.findById(req.params.id);

    if (!maintenance) {
      return res.status(404).json({ message: "Maintenance request not found" });
    }

    const previousStatus = maintenance.status;

    // Update maintenance fields
    Object.assign(maintenance, req.body);
    await maintenance.save();

    // If status changed to Completed, send emails
    if (previousStatus !== "Completed" && maintenance.status === "Completed") {
      const emailPromises = [];

      // Tenant email
      if (maintenance.email) {
        emailPromises.push(
          sendEmail(
            maintenance.email,
            "Maintenance Issue Resolved",
            createMaintenanceEmailHtml(maintenance, "tenant")
          )
        );
      }

      // Admin emails
      STAFF_CC.forEach((adminEmail) => {
        emailPromises.push(
          sendEmail(
            adminEmail,
            "Maintenance Task Completed",
            createMaintenanceEmailHtml(maintenance, "admin")
          )
        );
      });

      // Send all emails in parallel (fast)
      await Promise.all(emailPromises);
    }

    res.json({
      success: true,
      message: "Maintenance updated",
      maintenance,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};



// ================= DELETE =================
export const deleteMaintenance = async (req, res) => {
  try {

    const maintenance = await Maintenance.findByIdAndDelete(req.params.id);

    if (!maintenance) {
      return res.status(404).json({
        message: "Maintenance request not found"
      });
    }

    res.json({
      success: true,
      message: "Maintenance request deleted"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= ASSIGN MAINTENANCE TO STAFF =================
export const assignMaintenanceToStaff = async (req, res) => {
  try {
    const { id } = req.params; // maintenance ID
    const { staffId, deadline } = req.body; // staff ID + optional deadline

    if (!staffId) {
      return res.status(400).json({ message: "staffId is required" });
    }

    const maintenance = await Maintenance.findById(id);

    if (!maintenance) {
      return res.status(404).json({ message: "Maintenance request not found" });
    }

    // Assign staff & deadline
    maintenance.assignedStaff = staffId;
    maintenance.status = "Assigned";
    if (deadline) maintenance.deadline = new Date(deadline);

    await maintenance.save();

    // ✅ Send detailed email to assigned staff in background
    setImmediate(async () => {
      try {
        const staff = await Staff.findById(staffId);
        if (!staff?.email) return; // no email, skip

        const html = `
          <div style="font-family:Arial;background:#f5f5f5;padding:30px">
            <div style="max-width:800px;margin:auto;background:white;border-radius:12px;overflow:hidden">

              <div style="background:#4CAF50;padding:20px;text-align:center;color:white">
                <h1 style="margin:0;">New Maintenance Assigned</h1>
              </div>

              <div style="padding:25px;color:#333">
                <p>Hi <strong>${staff.name}</strong>,</p>

                <p>A new maintenance request has been assigned to you. Details below:</p>

                <hr/>

                <h3 style="color:#4CAF50">🛠️ Issue Details</h3>
                <p><strong>Category:</strong> ${maintenance.category || "-"}</p>
                <p><strong>Priority:</strong> ${maintenance.priority}</p>
                <p><strong>Description:</strong> ${maintenance.description || "-"}</p>
                <p><strong>Issue Started:</strong> ${
                  maintenance.issueStarted
                    ? new Date(maintenance.issueStarted).toLocaleDateString()
                    : "-"
                }</p>
                <p><strong>Status:</strong> ${maintenance.status}</p>
                <p><strong>Deadline:</strong> ${
                  maintenance.deadline
                    ? new Date(maintenance.deadline).toLocaleDateString()
                    : "Not set"
                }</p>

                <hr/>

                <h3 style="color:#4CAF50">👤 Tenant Info</h3>
                <p><strong>Name:</strong> ${maintenance.firstName || "-"} ${maintenance.lastName || ""}</p>
                <p><strong>Email:</strong> ${maintenance.email || "-"}</p>
                <p><strong>Phone:</strong> ${maintenance.phone || "-"}</p>
                <p><strong>Address:</strong> ${maintenance.address || "-"}</p>

                <hr/>

                <h3 style="color:#4CAF50">🔑 Access & Availability</h3>
                <p><strong>Preferred Contact Time:</strong> ${maintenance.contactTime || "-"}</p>
                <p><strong>Access Instructions:</strong> ${maintenance.access || "-"}</p>

                <hr/>

                <h3 style="color:#4CAF50">📷 Attachments</h3>
                ${
                  maintenance.photos && maintenance.photos.length > 0
                    ? maintenance.photos
                        .map(
                          (photo) =>
                            `<p><a href="${photo}" target="_blank" style="color:#4CAF50;">View Photo</a></p>`
                        )
                        .join("")
                    : "<p>No photos provided</p>"
                }

                <hr/>

                <p>Please attend to this maintenance request before the deadline.</p>

                <p style="margin-top:25px">
                  Regards,<br/>
                  <strong>LONDONROOMSRENT Team</strong>
                </p>
              </div>
            </div>
          </div>
        `;

        await sendEmail(staff.email, "New Maintenance Assigned", html);
      } catch (err) {
        console.error("❌ Email failed:", err.message);
      }
    });

    res.json({
      success: true,
      message: "Maintenance assigned to staff successfully and email sent",
      maintenance,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};