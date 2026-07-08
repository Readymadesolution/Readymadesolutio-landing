import SettingsView from "@/components/portal/SettingsView";
import { getGoals } from "@/app/portal/goals-actions";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const goals = await getGoals();
  return (
    <SettingsView
      goals={goals}
      calEventId={process.env.CAL_EVENT_TYPE_ID ?? null}
      calUser={process.env.CAL_USERNAME ?? null}
    />
  );
}
