import RegistrationWizard from "@/components/RegistrationWizard";
import { dbConnect } from "@/lib/mongodb";
import Settings from "@/models/Settings";

// Mark as dynamically rendered or revalidate it, but since it relies on DB it might need dynamic
export const dynamic = "force-dynamic";

export default async function HomePage() {
  await dbConnect();
  let settings = await Settings.findOne({});
  const maxOffStageSelections = settings?.maxOffStageSelections ?? 2;
  const maxStageSelections = settings?.maxStageSelections ?? 1;
  const registrationDeadline = settings?.registrationDeadline ? settings.registrationDeadline.toISOString() : null;

  return (
    <main>
      <RegistrationWizard 
        maxOffStageSelections={maxOffStageSelections} 
        maxStageSelections={maxStageSelections} 
        registrationDeadline={registrationDeadline}
      />
    </main>
  );
}
