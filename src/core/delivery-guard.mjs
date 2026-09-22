import { mkdir, open, readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { join } from "node:path";

export const digest = (text) =>
  createHash("sha256").update(text, "utf8").digest("hex");

// Local single-host reference. A shared database transaction is needed across hosts.
// A claim intentionally stays held after a crash or uncertain provider response.
export async function claimDelivery(
  directory,
  { key, subject, body, recipients },
) {
  if (
    typeof key !== "string" ||
    !key ||
    typeof subject !== "string" ||
    !subject ||
    typeof body !== "string" ||
    !body.trim() ||
    !Array.isArray(recipients) ||
    !recipients.length ||
    recipients.some((x) => typeof x !== "string" || !x.includes("@"))
  )
    throw new Error("Freeze a valid key, subject, body, and recipients first.");
  await mkdir(directory, { recursive: true, mode: 0o700 });
  const path = join(directory, `${digest(key)}.claim.json`);
  const record = {
    key,
    subject,
    bodyHash: digest(body),
    recipients: [...recipients],
    state: "attempt_reserved",
    createdAt: new Date().toISOString(),
  };
  let handle;
  try {
    handle = await open(path, "wx", 0o600);
  } catch (error) {
    if (error.code === "EEXIST")
      return {
        permitted: false,
        reason: "Existing attempt: reconcile; do not resend.",
        path,
      };
    throw error;
  }
  try {
    await handle.writeFile(JSON.stringify(record, null, 2));
    await handle.sync();
  } finally {
    await handle.close();
  }
  return { permitted: true, path, record };
}

export async function readClaim(path) {
  const record = JSON.parse(await readFile(path, "utf8"));
  if (record.state !== "attempt_reserved" || typeof record.key !== "string")
    throw new Error("Invalid claim; do not send.");
  return record;
}

export function verifySent(frozen, sent) {
  if (!sent || sent.subject !== frozen.subject || sent.body !== frozen.body)
    return false;
  return (
    JSON.stringify([...(sent.recipients ?? [])].sort()) ===
    JSON.stringify([...frozen.recipients].sort())
  );
}
