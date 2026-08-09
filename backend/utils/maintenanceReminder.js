import cron from "node-cron";
import Maintenance from "../Models/Maintenance.js";
import { sendEmail } from "./sendEmail.js";

const ADMIN_EMAIL = "Hamzabashir2001@hotmail.com";

export const startMaintenanceReminder = () => {
  cron.schedule("0 */6 * * *", async () => {
    console.log("⏰ Running maintenance reminder job...");

    try {
      const fiveMinutesAgo = new Date(Date.now() - 6 * 60 * 60 * 1000); // 6 hours ago

      const tasks = await Maintenance.find({
        status: { $ne: "Completed" },
        $or: [
          { lastReminderSent: null },
          { lastReminderSent: { $lt: fiveMinutesAgo } }
        ]
      });

      if (tasks.length === 0) {
        console.log("✅ No pending reminders");
        return;
      }

      for (const m of tasks) {

        const html = `
        <div style="font-family:Arial;background:#f5f5f5;padding:30px">

          <div style="max-width:750px;margin:auto;background:#fff;border-radius:10px;overflow:hidden">

            <div style="background:#dc2626;color:#fff;padding:15px;text-align:center">
              <h2>🚨 Maintenance Reminder</h2>
              <p>This task is still pending — please fix ASAP</p>
            </div>

            <div style="padding:25px;color:#333">

              <h3 style="color:#dc2626">🛠️ Issue Details</h3>
              <p><strong>Status:</strong> ${m.status}</p>
              <p><strong>Category:</strong> ${m.category}</p>
              <p><strong>Priority:</strong> ${m.priority}</p>
              <p><strong>Description:</strong> ${m.description}</p>
              <p><strong>Issue Started:</strong> ${
                m.issueStarted
                  ? new Date(m.issueStarted).toLocaleDateString()
                  : "-"
              }</p>

              <hr/>

              <h3>👤 Tenant Details</h3>
              <p><strong>Name:</strong> ${m.firstName} ${m.lastName}</p>
              <p><strong>Email:</strong> ${m.email}</p>
              <p><strong>Phone:</strong> ${m.phone}</p>
              <p><strong>Address:</strong> ${m.address}</p>

              <hr/>

              <h3>📅 Timeline</h3>
              <p><strong>Created:</strong> ${new Date(m.createdAt).toLocaleString()}</p>

              <hr/>

              <h3>📷 Photos</h3>
              ${
                m.photos?.length
                  ? m.photos
                      .map(
                        (p) =>
                          `<p><a href="${p}" target="_blank">View Photo</a></p>`
                      )
                      .join("")
                  : "<p>No photos</p>"
              }

              <hr/>

              <p style="color:#dc2626;font-weight:bold">
                ⚠️ This maintenance request is still pending. Please take action immediately.
              </p>

            </div>
          </div>
        </div>
        `;

        await sendEmail(
          ADMIN_EMAIL,
          `🚨 Pending Maintenance - ${m.category}`,
          html
        );

        // ✅ UPDATE LAST REMINDER TIME
        m.lastReminderSent = new Date();
        await m.save();
      }

      console.log(`📨 Sent ${tasks.length} reminders`);

    } catch (err) {
      console.error("❌ Reminder error:", err.message);
    }
  });
};