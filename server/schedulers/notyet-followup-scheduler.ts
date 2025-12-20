/**
 * NotYet followup email scheduler (runs daily to send 30-day reminder emails)
 */

import { getNotyetResponsesNeedingFollowup, insertNotyetFollowup } from "../db";
import { sendNotYetFollowupEmail } from "../lib/email/sendNotYetFollowupEmail";

/**
 * Send NotYet followup emails to users who received "notyet" result 30 days ago
 * This function should be called by a cron job or scheduler (e.g., daily at 10:00 AM)
 */
export async function sendNotyetFollowupEmails() {
  console.log("[NotYet Followup Scheduler] Starting daily followup email check...");

  try {
    const responsesNeedingFollowup = await getNotyetResponsesNeedingFollowup();

    if (responsesNeedingFollowup.length === 0) {
      console.log("[NotYet Followup Scheduler] No followup emails to send today.");
      return { sent: 0, failed: 0 };
    }

    console.log(`[NotYet Followup Scheduler] Found ${responsesNeedingFollowup.length} users needing followup emails.`);

    let sentCount = 0;
    let failedCount = 0;

    for (const response of responsesNeedingFollowup) {
      if (!response.email) {
        console.log(`[NotYet Followup Scheduler] Skipping response ${response.id} (no email)`);
        continue;
      }

      try {
        console.log(`[NotYet Followup Scheduler] Sending followup email to ${response.email}`);

        // Send email via SendGrid
        await sendNotYetFollowupEmail({
          email: response.email,
          firstName: null, // TODO: Extract firstName from fitGateResponses if available
          fitGateCreatedAt: response.createdAt,
          fitGateResultId: response.id.toString(),
        });

        // Record that we sent the followup email
        await insertNotyetFollowup({
          email: response.email,
          fitGateResponseId: response.id,
        });

        sentCount++;
        console.log(`[NotYet Followup Scheduler] ✅ Sent followup email to ${response.email}`);
      } catch (error) {
        console.error(`[NotYet Followup Scheduler] ❌ Failed to send followup email to ${response.email}:`, error);
        failedCount++;
      }
    }

    console.log(`[NotYet Followup Scheduler] Completed: ${sentCount} sent, ${failedCount} failed`);
    return { sent: sentCount, failed: failedCount };
  } catch (error) {
    console.error("[NotYet Followup Scheduler] Error in daily followup email check:", error);
    throw error;
  }
}

/**
 * Initialize the NotYet followup email scheduler
 * This function sets up a daily cron job to send followup emails
 */
export function initNotyetFollowupScheduler() {
  // Run daily at 10:00 AM JST (01:00 AM UTC)
  const cronExpression = "0 1 * * *"; // Every day at 01:00 AM UTC (10:00 AM JST)

  console.log(`[NotYet Followup Scheduler] Scheduler initialized with cron expression: ${cronExpression}`);
  console.log("[NotYet Followup Scheduler] Daily followup emails will be sent at 10:00 AM JST");

  // TODO: Integrate with actual cron scheduler (e.g., node-cron, cron-job, or Manus scheduler)
  // Example:
  // import cron from "node-cron";
  // cron.schedule(cronExpression, async () => {
  //   await sendNotyetFollowupEmails();
  // });

  // For now, just log that the scheduler is initialized
  console.log("[NotYet Followup Scheduler] Note: Actual cron scheduling is not yet implemented. Please integrate with a cron library or Manus scheduler.");
}
