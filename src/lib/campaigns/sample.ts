import { createCampaign, submitForApproval } from "./ledger";
import type { EventDb } from "@/lib/events/track";

/**
 * A labelled sample so people can try approval before the Writer exists.
 * Addresses use example.com, which can never receive mail.
 */
export async function createSampleCampaign(db: EventDb, workspaceId: string) {
  const people = [
    { firstName: "Dana", lastName: "Ruiz", company: "Kestrel Supply", title: "Head of Operations", hook: "you're hiring two ops coordinators" },
    { firstName: "Sam", lastName: "Okafor", company: "Northwind Freight", title: "COO", hook: "Northwind opened a second warehouse in March" },
    { firstName: "Lea", lastName: "Brandt", company: "Fjord Analytics", title: "VP Finance", hook: "your team posted about closing the books in Excel" },
  ];
  const c = await createCampaign(db, {
    workspaceId,
    name: "Sample: teams outgrowing spreadsheets",
    leads: people.map((p) => ({
      email: `${p.firstName.toLowerCase()}@${p.company.toLowerCase().replace(/\s+/g, "")}.example.com`,
      firstName: p.firstName,
      lastName: p.lastName,
      company: p.company,
      title: p.title,
      emails: [
        {
          sequenceStep: 1,
          subject: `${p.company} and spreadsheets`,
          body: `Hi ${p.firstName},\n\nSaw ${p.hook}. Teams at that stage often find shared spreadsheets start slowing planning down.\n\nWould it help to see how two similar teams moved off them?\n\nThis is sample text written for the demo.`,
        },
        {
          sequenceStep: 2,
          subject: `Re: ${p.company} and spreadsheets`,
          body: `Hi ${p.firstName},\n\nFollowing up once. Happy to send a 2-minute walkthrough instead of a call if that's easier.\n\nThis is sample text written for the demo.`,
        },
      ],
    })),
  });
  await submitForApproval(db, { workspaceId, campaignId: c.id });
  return c;
}
