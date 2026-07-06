import { describe, it, expect, beforeEach } from "vitest";
import { subscribeNewsletter, confirmSubscription, getSubscriberStatus, unsubscribeFromNewsletter } from "@/lib/newsletter";

describe("lib/newsletter - Opt-In Flow & State Lifecycle", () => {
  beforeEach(() => {
    if (typeof window !== "undefined") {
      window.localStorage.clear();
    }
  });

  it("should subscribe a new email in PENDING state", async () => {
    const result = await subscribeNewsletter("new@example.com", "homepage");
    expect(result.success).toBe(true);
    expect((result as any).message).toContain("confirmation link just landed");

    const status = getSubscriberStatus("new@example.com");
    expect(status).not.toBeNull();
    expect(status?.status).toBe("PENDING");
    expect(status?.source).toBe("homepage");
    expect(status?.confirmationToken).toBeTruthy();
  });

  it("should reject invalid email formats", async () => {
    const result = await subscribeNewsletter("invalidemail", "homepage");
    expect(result.success).toBe(false);
    expect((result as any).error).toContain("doesn't look right");
  });

  it("should confirm a pending subscriber using verification token", async () => {
    await subscribeNewsletter("confirm@example.com", "homepage");
    const sub = getSubscriberStatus("confirm@example.com");
    const token = sub?.confirmationToken || "";

    const confirmResult = confirmSubscription(token);
    expect(confirmResult.success).toBe(true);

    const updatedSub = getSubscriberStatus("confirm@example.com");
    expect(updatedSub?.status).toBe("CONFIRMED");
    expect(updatedSub?.confirmedAt).toBeTruthy();
  });

  it("should transition unsubscribed members back to pending on resubscription", async () => {
    await subscribeNewsletter("resub@example.com", "homepage");
    const sub = getSubscriberStatus("resub@example.com");
    confirmSubscription(sub?.confirmationToken || "");

    // Unsubscribe
    unsubscribeFromNewsletter("resub@example.com");
    const unsubbed = getSubscriberStatus("resub@example.com");
    expect(unsubbed?.status).toBe("UNSUBSCRIBED");

    // Resubscribe
    const resubResult = await subscribeNewsletter("resub@example.com", "homepage");
    expect(resubResult.success).toBe(true);
    expect((resubResult as any).message).toContain("confirmation link just landed");

    const rePending = getSubscriberStatus("resub@example.com");
    expect(rePending?.status).toBe("PENDING");
  });
});
